"""
AG2 (AutoGen v2) — Multi-Agent Policy Checker
Four-stage pipeline: intake → specialists → reviewer+synthesis (parallel) → verdict

Uses autogen AssistantAgent + UserProxyAgent + GroupChat.
Each stage is run as a separate, focused chat to keep outputs clean.

Optimisation: autogen's _single_turn() is blocking by design.  Wrapping calls
in asyncio.to_thread() lets the reviewer challenge and the preliminary synthesis
draft run concurrently — removing one sequential round-trip without touching the
autogen framework itself.  The verdict stage reconciles both outputs.
"""

import asyncio
import os
from dotenv import load_dotenv
import autogen

load_dotenv()

# ---------------------------------------------------------------------------
# LLM config
# ---------------------------------------------------------------------------
llm_config = {
    "config_list": [
        {
            "model": "gpt-4o-mini",
            "api_key": os.environ["OPENAI_API_KEY"],
        }
    ],
    "temperature": 0.2,
}

# ---------------------------------------------------------------------------
# Helper: run a single-turn AssistantAgent chat and capture reply
# ---------------------------------------------------------------------------

def _single_turn(system_prompt: str, user_message: str) -> str:
    """Run a one-shot AssistantAgent conversation and return the assistant reply."""
    assistant = autogen.AssistantAgent(
        name="Assistant",
        system_message=system_prompt,
        llm_config=llm_config,
        max_consecutive_auto_reply=1,
    )
    proxy = autogen.UserProxyAgent(
        name="User",
        human_input_mode="NEVER",
        max_consecutive_auto_reply=0,
        code_execution_config=False,
        default_auto_reply="",
    )
    proxy.initiate_chat(
        assistant,
        message=user_message,
        silent=True,
        max_turns=1,
    )
    chat_history = proxy.chat_messages[assistant]
    for msg in reversed(chat_history):
        if msg.get("role") == "assistant":
            return msg["content"]
    return ""


# ---------------------------------------------------------------------------
# Helper: run 4 specialists in a GroupChat and extract their individual replies
# ---------------------------------------------------------------------------

def _run_specialists_groupchat(question: str, intake_text: str) -> dict:
    """
    Run a GroupChat where each specialist speaks once in round-robin order.
    Extract each agent's last message and return as a dict.
    """
    specialist_configs = {
        "ComplianceAgent": (
            "You are a Compliance specialist. Review the policy question from a regulatory "
            "and compliance perspective. Consider GDPR, CCPA, SOX, and internal policy "
            "frameworks. Provide your assessment in 3–5 bullet points, then state a brief "
            "recommendation: ALLOW, DENY, or CONDITIONAL. Speak only once and end with TERMINATE."
        ),
        "LegalAgent": (
            "You are a Legal specialist. Review the policy question from a legal liability "
            "perspective. Consider employment law, IP ownership, contract obligations, and "
            "litigation risk. Provide your assessment in 3–5 bullet points, then state a "
            "brief recommendation: ALLOW, DENY, or CONDITIONAL. Speak only once and end with TERMINATE."
        ),
        "SecurityAgent": (
            "You are a Security specialist. Review the policy question from an information "
            "security standpoint. Consider data classification, access controls, breach risk, "
            "and security best practices. Provide your assessment in 3–5 bullet points, then "
            "state a brief recommendation: ALLOW, DENY, or CONDITIONAL. Speak only once and end with TERMINATE."
        ),
        "DataOpsAgent": (
            "You are a Data Operations specialist. Review the policy question from a data "
            "management perspective. Consider data lifecycle, retention policies, storage "
            "hygiene, and operational risk. Provide your assessment in 3–5 bullet points, "
            "then state a brief recommendation: ALLOW, DENY, or CONDITIONAL. Speak only once and end with TERMINATE."
        ),
    }

    agents = []
    for name, system_msg in specialist_configs.items():
        agent = autogen.AssistantAgent(
            name=name,
            system_message=system_msg,
            llm_config=llm_config,
            max_consecutive_auto_reply=1,
        )
        agents.append(agent)

    proxy = autogen.UserProxyAgent(
        name="PolicyCoordinator",
        human_input_mode="NEVER",
        max_consecutive_auto_reply=0,
        code_execution_config=False,
        is_termination_msg=lambda msg: "TERMINATE" in msg.get("content", ""),
        default_auto_reply="",
    )

    group_chat = autogen.GroupChat(
        agents=[proxy] + agents,
        messages=[],
        max_round=len(agents) + 1,
        speaker_selection_method="round_robin",
    )
    manager = autogen.GroupChatManager(
        groupchat=group_chat,
        llm_config=llm_config,
        silent=True,
    )

    init_message = (
        f"Policy question: {question}\n\n"
        f"Intake summary: {intake_text}\n\n"
        "Each specialist should now provide their domain assessment."
    )
    proxy.initiate_chat(manager, message=init_message, silent=True)

    results = {}
    domain_map = {
        "ComplianceAgent": "compliance",
        "LegalAgent": "legal",
        "SecurityAgent": "security",
        "DataOpsAgent": "data_ops",
    }
    for msg in group_chat.messages:
        agent_name = msg.get("name", "")
        if agent_name in domain_map:
            domain_key = domain_map[agent_name]
            content = msg.get("content", "")
            content = content.replace("TERMINATE", "").strip()
            results[domain_key] = content

    return results


# ---------------------------------------------------------------------------
# Pipeline stage helpers — sync (autogen requirement)
# ---------------------------------------------------------------------------

def _run_intake(question: str) -> str:
    return _single_turn(
        system_prompt=(
            "You are an intake agent for a corporate policy review system. "
            "Restate the submitted policy question clearly, identify the key entities "
            "involved, and flag the primary risk domains (compliance, legal, security, "
            "data operations). Keep your response under 150 words."
        ),
        user_message=f"Policy question: {question}",
    )


def _run_reviewer(question: str, intake_text: str, specialist_results: dict) -> str:
    specialists_text = "\n\n".join(
        f"[{domain.upper()}]\n{result}"
        for domain, result in specialist_results.items()
    )
    return _single_turn(
        system_prompt=(
            "You are a critical reviewer agent. Challenge the specialist assessments, "
            "identify contradictions, gaps, or overly conservative/lenient stances. "
            "Ask probing questions and highlight areas where specialists disagree or "
            "where more nuance is needed. Provide your challenge in 4–6 bullet points."
        ),
        user_message=(
            f"Policy question: {question}\n\n"
            f"Specialist assessments:\n{specialists_text}\n\n"
            "Provide your critical challenge."
        ),
    )


def _run_synthesis_draft(question: str, intake_text: str, specialist_results: dict) -> str:
    """Preliminary synthesis based on specialists only (runs parallel to reviewer)."""
    specialists_text = "\n\n".join(
        f"[{domain.upper()}]\n{result}"
        for domain, result in specialist_results.items()
    )
    return _single_turn(
        system_prompt=(
            "You are a senior policy analyst. Produce a clear preliminary policy "
            "recommendation based on specialist assessments. Address key tensions and "
            "acknowledge uncertainty where appropriate (150–250 words). This draft will "
            "be refined by the verdict agent using reviewer challenges."
        ),
        user_message=(
            f"Policy question: {question}\n\n"
            f"Intake: {intake_text}\n\n"
            f"Specialist assessments:\n{specialists_text}\n\n"
            "Draft your preliminary recommendation."
        ),
    )


def _run_verdict(question: str, synthesis_text: str, challenge_text: str) -> str:
    return _single_turn(
        system_prompt=(
            "You are the final decision agent. You will receive a preliminary synthesis "
            "and reviewer challenges. Your response MUST start with exactly one of: "
            "COMPLIANT, NON-COMPLIANT, or CONDITIONAL. Follow with a single sentence "
            "that addresses the reviewer's main concerns (max 40 words)."
        ),
        user_message=(
            f"Policy question: {question}\n\n"
            f"Preliminary synthesis:\n{synthesis_text}\n\n"
            f"Reviewer challenges:\n{challenge_text}"
        ),
    )


# ---------------------------------------------------------------------------
# Async pipeline — wraps blocking autogen calls in threads
# ---------------------------------------------------------------------------

async def _run_pipeline_async(question: str) -> dict:
    # Stage 1: intake (blocking autogen call in thread)
    intake_text = await asyncio.to_thread(_run_intake, question)

    # Stage 2: specialists via GroupChat (blocking; sequential within GroupChat by design)
    specialist_results = await asyncio.to_thread(
        _run_specialists_groupchat, question, intake_text
    )

    # Stage 3: reviewer challenge and preliminary synthesis run in parallel threads.
    # Both depend only on specialist outputs, so neither needs to wait for the other.
    challenge_text, synthesis_text = await asyncio.gather(
        asyncio.to_thread(_run_reviewer, question, intake_text, specialist_results),
        asyncio.to_thread(_run_synthesis_draft, question, intake_text, specialist_results),
    )

    # Stage 4: verdict reconciles the synthesis draft with reviewer challenges.
    verdict_text = await asyncio.to_thread(_run_verdict, question, synthesis_text, challenge_text)

    return {
        "question": question,
        "intake": intake_text,
        "specialists": specialist_results,
        "reviewer": challenge_text,
        "synthesis": synthesis_text,
        "verdict": verdict_text,
    }


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------

def run_pipeline(question: str) -> dict:
    """Run the full policy pipeline and return all stage results."""
    return asyncio.run(_run_pipeline_async(question))
