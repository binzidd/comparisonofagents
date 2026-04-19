"""
LangGraph — Multi-Agent Policy Checker
Four-stage pipeline: intake → specialists (parallel) → reviewer+synthesis (parallel) → verdict

Optimisations applied (within LangGraph — no framework change):
  1. All node functions are async; llm.ainvoke() replaces llm.invoke() so calls
     are non-blocking.
  2. reviewer_node and synthesis_node are merged into reviewer_synthesis_node
     which runs both LLM calls concurrently via asyncio.gather, removing one
     sequential round-trip from the critical path.
"""

import asyncio
import os
from typing import TypedDict, Annotated
from dotenv import load_dotenv

from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage, HumanMessage
from langgraph.graph import StateGraph, END
from langgraph.types import Send

load_dotenv()

# ---------------------------------------------------------------------------
# LLM — single module-level instance reused across all nodes
# ---------------------------------------------------------------------------
llm = ChatOpenAI(
    model="gpt-4o-mini",
    api_key=os.environ["OPENAI_API_KEY"],
    temperature=0.2,
)

# ---------------------------------------------------------------------------
# State
# ---------------------------------------------------------------------------
class PolicyState(TypedDict):
    question: str
    intake_result: str
    specialist_results: Annotated[dict, lambda a, b: {**a, **b}]
    challenge_result: str
    synthesis: str
    verdict: str


# ---------------------------------------------------------------------------
# System prompts
# ---------------------------------------------------------------------------
SPECIALIST_PROMPTS = {
    "compliance": (
        "You are a Compliance specialist. Review the policy question from a regulatory "
        "and compliance perspective. Consider GDPR, CCPA, SOX, and internal policy "
        "frameworks. Be concise and structured."
    ),
    "legal": (
        "You are a Legal specialist. Review the policy question from a legal liability "
        "perspective. Consider employment law, IP ownership, contract obligations, and "
        "litigation risk. Be concise and structured."
    ),
    "security": (
        "You are a Security specialist. Review the policy question from an information "
        "security standpoint. Consider data classification, access controls, breach risk, "
        "and security best practices. Be concise and structured."
    ),
    "data_ops": (
        "You are a Data Operations specialist. Review the policy question from a data "
        "management perspective. Consider data lifecycle, retention policies, storage "
        "hygiene, and operational risk. Be concise and structured."
    ),
}

# ---------------------------------------------------------------------------
# Nodes — all async so LangGraph can schedule them without blocking the loop
# ---------------------------------------------------------------------------

async def intake_node(state: PolicyState) -> dict:
    """Parse and restate the policy question clearly."""
    response = await llm.ainvoke([
        SystemMessage(content=(
            "You are an intake agent for a corporate policy review system. "
            "Your job is to restate the submitted policy question clearly, "
            "identify the key entities involved, and flag the primary risk domains "
            "(compliance, legal, security, data operations). Keep it under 150 words."
        )),
        HumanMessage(content=f"Policy question: {state['question']}"),
    ])
    return {"intake_result": response.content}


async def _get_specialist_result(domain: str, question: str, intake_result: str) -> str:
    prompt = SPECIALIST_PROMPTS[domain]
    response = await llm.ainvoke([
        SystemMessage(content=prompt),
        HumanMessage(content=(
            f"Policy question: {question}\n\n"
            f"Intake summary: {intake_result}\n\n"
            "Provide your domain assessment in 3–5 bullet points, then state "
            "a brief recommendation (ALLOW / DENY / CONDITIONAL)."
        )),
    ])
    return response.content


def route_to_specialists(state: PolicyState):
    """Fan-out: send one Send() per specialist domain."""
    return [
        Send("specialist_node", {**state, "_domain": domain})
        for domain in ["compliance", "legal", "security", "data_ops"]
    ]


async def specialist_node(state: dict) -> dict:
    """Run a single specialist and merge result into shared dict."""
    domain = state["_domain"]
    result = await _get_specialist_result(domain, state["question"], state["intake_result"])
    return {"specialist_results": {domain: result}}


async def reviewer_synthesis_node(state: PolicyState) -> dict:
    """Run reviewer challenge and preliminary synthesis in parallel.

    Both depend only on specialist outputs, so neither needs to wait for the
    other.  asyncio.gather schedules both LLM calls concurrently, removing one
    sequential round-trip vs a split reviewer → synthesis chain.
    """
    specialists_text = "\n\n".join(
        f"[{domain.upper()}]\n{result}"
        for domain, result in state["specialist_results"].items()
    )
    base = f"Policy question: {state['question']}\n\nSpecialist assessments:\n{specialists_text}\n\n"

    review_response, synthesis_response = await asyncio.gather(
        llm.ainvoke([
            SystemMessage(content=(
                "You are a critical reviewer agent. Your job is to challenge the specialist "
                "assessments, identify contradictions, gaps, or overly conservative/lenient "
                "stances. Ask probing questions and highlight any areas where specialists "
                "disagree or where more nuance is needed. Be direct."
            )),
            HumanMessage(content=base + "Provide your critical challenge in 4–6 bullet points."),
        ]),
        llm.ainvoke([
            SystemMessage(content=(
                "You are a senior policy analyst. Produce a clear preliminary policy "
                "recommendation based on specialist assessments. Address the key tensions "
                "and acknowledge uncertainty where appropriate (150–250 words)."
            )),
            HumanMessage(content=(
                f"Policy question: {state['question']}\n\n"
                f"Intake: {state['intake_result']}\n\n"
                f"Specialist assessments:\n{specialists_text}\n\n"
                "Draft your preliminary recommendation."
            )),
        ]),
    )
    return {
        "challenge_result": review_response.content,
        "synthesis": synthesis_response.content,
    }


async def verdict_node(state: PolicyState) -> dict:
    """Produce the final answer, reconciling the synthesis with reviewer challenges."""
    response = await llm.ainvoke([
        SystemMessage(content=(
            "You are the final decision agent. You will receive a preliminary synthesis "
            "and a set of reviewer challenges. Your response MUST start with exactly one "
            "of: COMPLIANT, NON-COMPLIANT, or CONDITIONAL. Then provide a single sentence "
            "that addresses the reviewer's main concerns (max 40 words)."
        )),
        HumanMessage(content=(
            f"Policy question: {state['question']}\n\n"
            f"Preliminary synthesis:\n{state['synthesis']}\n\n"
            f"Reviewer challenges:\n{state['challenge_result']}"
        )),
    ])
    return {"verdict": response.content}


# ---------------------------------------------------------------------------
# Graph — compiled once at module level
# ---------------------------------------------------------------------------

def build_graph() -> StateGraph:
    g = StateGraph(PolicyState)

    g.add_node("intake_node", intake_node)
    g.add_node("specialist_node", specialist_node)
    g.add_node("reviewer_synthesis_node", reviewer_synthesis_node)
    g.add_node("verdict_node", verdict_node)

    g.set_entry_point("intake_node")
    g.add_conditional_edges("intake_node", route_to_specialists, ["specialist_node"])
    g.add_edge("specialist_node", "reviewer_synthesis_node")
    g.add_edge("reviewer_synthesis_node", "verdict_node")
    g.add_edge("verdict_node", END)

    return g.compile()


_graph = build_graph()


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------

def run_pipeline(question: str) -> dict:
    """Run the full policy pipeline and return a dict of all stage results."""
    initial_state: PolicyState = {
        "question": question,
        "intake_result": "",
        "specialist_results": {},
        "challenge_result": "",
        "synthesis": "",
        "verdict": "",
    }
    final_state = asyncio.run(_graph.ainvoke(initial_state))
    return {
        "question": final_state["question"],
        "intake": final_state["intake_result"],
        "specialists": final_state["specialist_results"],
        "reviewer": final_state["challenge_result"],
        "synthesis": final_state["synthesis"],
        "verdict": final_state["verdict"],
    }
