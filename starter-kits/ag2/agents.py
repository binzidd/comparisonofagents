"""
AG2 (AutoGen v2) — Multi-Agent Policy Checker
Five-stage pipeline: intake → specialists → reviewer → synthesis → verdict

Uses autogen AssistantAgent + UserProxyAgent + GroupChat.
Each stage is run as a separate, focused chat to keep outputs clean.
"""

import os
import re
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
    # Initiate chat; proxy sends the message, assistant replies once
    proxy.initiate_chat(
        assistant,
        message=user_message,
        silent=True,
        max_turns=1,
    )
    # The last message in the conversation is the assistant's reply
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

    # Extract each specialist's reply from the group chat messages
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
            # Strip TERMINATE marker
            content = content.replace("TERMINATE", "").strip()
            results[domain_key] = content

    return results


# ---------------------------------------------------------------------------
# Pipeline stages
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


def _run_synthesis(
    question: str,
    intake_text: str,
    specialist_results: dict,
    challenge_text: str,
) -> str:
    specialists_text = "\n\n".join(
        f"[{domain.upper()}]\n{result}"
        for domain, result in specialist_results.items()
    )
    return _single_turn(
        system_prompt=(
            "You are a senior policy analyst. Synthesise the specialist assessments "
            "and the reviewer's challenge into a coherent policy recommendation. "
            "Address key tensions, acknowledge uncertainty where appropriate, and "
            "produce a clear, balanced summary (150–250 words)."
        ),
        user_message=(
            f"Policy question: {question}\n\n"
            f"Intake: {intake_text}\n\n"
            f"Specialist assessments:\n{specialists_text}\n\n"
            f"Reviewer challenge:\n{challenge_text}"
        ),
    )


def _run_verdict(question: str, synthesis_text: str) -> str:
    return _single_turn(
        system_prompt=(
            "You are the final decision agent. Based on the synthesis provided, "
            "issue a final verdict. Your response MUST start with exactly one of: "
            "COMPLIANT, NON-COMPLIANT, or CONDITIONAL. Follow with a single sentence "
            "explaining the decision (max 40 words)."
        ),
        user_message=(
            f"Policy question: {question}\n\n"
            f"Synthesis:\n{synthesis_text}"
        ),
    )


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------

def run_pipeline(question: str) -> dict:
    """Run the full policy pipeline and return all stage results."""
    intake_text = _run_intake(question)
    specialist_results = _run_specialists_groupchat(question, intake_text)
    challenge_text = _run_reviewer(question, intake_text, specialist_results)
    synthesis_text = _run_synthesis(question, intake_text, specialist_results, challenge_text)
    verdict_text = _run_verdict(question, synthesis_text)

    return {
        "question": question,
        "intake": intake_text,
        "specialists": specialist_results,
        "reviewer": challenge_text,
        "synthesis": synthesis_text,
        "verdict": verdict_text,
    }
