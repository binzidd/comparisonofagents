"""
LangGraph — Multi-Agent Policy Checker
Five-stage pipeline: intake → specialists (parallel) → reviewer → synthesis → verdict
"""

import os
from typing import TypedDict, Annotated
from dotenv import load_dotenv

from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage, HumanMessage
from langgraph.graph import StateGraph, END
from langgraph.types import Send

load_dotenv()

# ---------------------------------------------------------------------------
# LLM
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
# Nodes
# ---------------------------------------------------------------------------

def intake_node(state: PolicyState) -> dict:
    """Parse and restate the policy question clearly."""
    response = llm.invoke([
        SystemMessage(content=(
            "You are an intake agent for a corporate policy review system. "
            "Your job is to restate the submitted policy question clearly, "
            "identify the key entities involved, and flag the primary risk domains "
            "(compliance, legal, security, data operations). Keep it under 150 words."
        )),
        HumanMessage(content=f"Policy question: {state['question']}"),
    ])
    return {"intake_result": response.content}


def _get_specialist_result(domain: str, question: str, intake_result: str) -> str:
    prompt = SPECIALIST_PROMPTS[domain]
    response = llm.invoke([
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


def specialist_node(state: dict) -> dict:
    """Run a single specialist and merge result into shared dict."""
    domain = state["_domain"]
    result = _get_specialist_result(domain, state["question"], state["intake_result"])
    return {"specialist_results": {domain: result}}


def reviewer_node(state: PolicyState) -> dict:
    """Challenge and stress-test the specialist findings."""
    specialists_text = "\n\n".join(
        f"[{domain.upper()}]\n{result}"
        for domain, result in state["specialist_results"].items()
    )
    response = llm.invoke([
        SystemMessage(content=(
            "You are a critical reviewer agent. Your job is to challenge the specialist "
            "assessments, identify contradictions, gaps, or overly conservative/lenient "
            "stances. Ask probing questions and highlight any areas where specialists "
            "disagree or where more nuance is needed. Be direct."
        )),
        HumanMessage(content=(
            f"Policy question: {state['question']}\n\n"
            f"Specialist assessments:\n{specialists_text}\n\n"
            "Provide your critical challenge in 4–6 bullet points."
        )),
    ])
    return {"challenge_result": response.content}


def synthesis_node(state: PolicyState) -> dict:
    """Synthesise all findings into a coherent narrative."""
    specialists_text = "\n\n".join(
        f"[{domain.upper()}]\n{result}"
        for domain, result in state["specialist_results"].items()
    )
    response = llm.invoke([
        SystemMessage(content=(
            "You are a senior policy analyst. Synthesise the specialist assessments "
            "and the reviewer's challenge into a coherent policy recommendation. "
            "Address the key tensions, acknowledge uncertainty where appropriate, "
            "and produce a clear, balanced summary (150–250 words)."
        )),
        HumanMessage(content=(
            f"Policy question: {state['question']}\n\n"
            f"Intake: {state['intake_result']}\n\n"
            f"Specialist assessments:\n{specialists_text}\n\n"
            f"Reviewer challenge:\n{state['challenge_result']}"
        )),
    ])
    return {"synthesis": response.content}


def verdict_node(state: PolicyState) -> dict:
    """Produce the final one-line verdict."""
    response = llm.invoke([
        SystemMessage(content=(
            "You are the final decision agent. Based on the synthesis provided, "
            "issue a final verdict. Your response MUST start with exactly one of: "
            "COMPLIANT, NON-COMPLIANT, or CONDITIONAL. Follow with a single sentence "
            "explaining the decision (max 40 words)."
        )),
        HumanMessage(content=(
            f"Policy question: {state['question']}\n\n"
            f"Synthesis:\n{state['synthesis']}"
        )),
    ])
    return {"verdict": response.content}


# ---------------------------------------------------------------------------
# Graph
# ---------------------------------------------------------------------------

def build_graph() -> StateGraph:
    g = StateGraph(PolicyState)

    g.add_node("intake_node", intake_node)
    g.add_node("specialist_node", specialist_node)
    g.add_node("reviewer_node", reviewer_node)
    g.add_node("synthesis_node", synthesis_node)
    g.add_node("verdict_node", verdict_node)

    g.set_entry_point("intake_node")
    g.add_conditional_edges("intake_node", route_to_specialists, ["specialist_node"])
    g.add_edge("specialist_node", "reviewer_node")
    g.add_edge("reviewer_node", "synthesis_node")
    g.add_edge("synthesis_node", "verdict_node")
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
    final_state = _graph.invoke(initial_state)
    return {
        "question": final_state["question"],
        "intake": final_state["intake_result"],
        "specialists": final_state["specialist_results"],
        "reviewer": final_state["challenge_result"],
        "synthesis": final_state["synthesis"],
        "verdict": final_state["verdict"],
    }
