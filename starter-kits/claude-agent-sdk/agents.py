"""
Claude Agent SDK policy checker.

Runs a five-stage policy review with Claude Agent SDK calls:
intake -> parallel specialists -> reviewer -> synthesis -> verdict.
"""

import asyncio
import os

from claude_agent_sdk import (
    AssistantMessage,
    ClaudeAgentOptions,
    ResultMessage,
    TextBlock,
    query,
)
from dotenv import load_dotenv

load_dotenv()

MODEL = os.getenv("CLAUDE_AGENT_MODEL", "sonnet")

POLICY_CORPUS = """\
RETENTION CLAUSE: GitHub retains personal information as long as necessary for
the stated purposes or as required by law. After account closure GitHub may
keep data where needed for contracts, legal obligations, dispute resolution, or
agreement enforcement.

SHARING CLAUSE: GitHub may share personal data with affiliates, organization
account administrators, competent authorities, anti-abuse and fraud-prevention
entities, and third-party applications when the user explicitly directs sharing.

RIGHTS CLAUSE: Users in the EEA, UK, and certain US states may have rights to
access, correct, delete or erase in some cases, object, withdraw consent,
receive portable data, and use state-specific appeal pathways.
"""


def _message_text(message: object) -> str:
    if isinstance(message, AssistantMessage):
        return "\n".join(
            block.text for block in message.content
            if isinstance(block, TextBlock)
        )
    if isinstance(message, ResultMessage):
        return message.result or ""
    return ""


def _options() -> ClaudeAgentOptions:
    return ClaudeAgentOptions(
        allowed_tools=[],
        permission_mode="dontAsk",
        max_turns=1,
        model=MODEL,
        system_prompt=(
            "You are the principal orchestration agent for a policy compliance "
            "analysis. Keep answers concise, grounded, and citation-led."
        ),
    )


async def _ask(prompt: str) -> str:
    parts: list[str] = []
    async for message in query(prompt=prompt, options=_options()):
        text = _message_text(message)
        if text:
            parts.append(text)
    return "\n".join(parts).strip()


async def _run_pipeline_async(question: str) -> dict:
    outputs: dict[str, str] = {}
    outputs["intake"] = await _ask(
        f"Question: {question}\n\nPolicy:\n{POLICY_CORPUS}\n\n"
        "Identify relevant clauses and assign specialist review tasks.",
    )

    specialist_roles = {
        "compliance": "Review regulatory and policy obligations.",
        "security": "Review data-protection controls and access safeguards.",
        "legal": "Review legal caveats, conditions, and jurisdictional limits.",
        "data_ops": "Review data lifecycle, retention, and operational risk.",
    }
    specialist_outputs = await asyncio.gather(
        *[
            _ask(
                f"{instructions}\n\nQuestion: {question}\n\nPolicy:\n{POLICY_CORPUS}\n\n"
                f"Intake:\n{outputs['intake']}\n\n"
                "Return one compact finding with clause ids and a confidence note."
            )
            for instructions in specialist_roles.values()
        ]
    )
    outputs["specialists"] = "\n\n".join(
        f"{role}: {text}" for role, text in zip(specialist_roles, specialist_outputs)
    )
    outputs["reviewer"] = await _ask(
        f"Question: {question}\n\nFindings:\n{outputs['specialists']}\n\n"
        "Reviewer: challenge unsupported claims and missing caveats.",
    )
    outputs["synthesis"] = await _ask(
        f"Question: {question}\n\nFindings:\n{outputs['specialists']}\n\n"
        f"Reviewer notes:\n{outputs['reviewer']}\n\n"
        "Draft the grounded answer.",
    )
    outputs["verdict"] = await _ask(
        f"Question: {question}\n\nDraft:\n{outputs['synthesis']}\n\n"
        "Return the final answer with cited clause ids and confidence.",
    )
    return {"question": question, **outputs}


def run_pipeline(question: str) -> dict:
    return asyncio.run(_run_pipeline_async(question))
