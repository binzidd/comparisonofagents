"""
Claude Agent SDK policy checker.

Runs a five-stage policy review inside one ClaudeSDKClient session:
intake -> specialists -> reviewer -> synthesis -> verdict.
"""

import asyncio
import os

from claude_agent_sdk import (
    AgentDefinition,
    AssistantMessage,
    ClaudeAgentOptions,
    ClaudeSDKClient,
    ResultMessage,
    TextBlock,
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
        agents={
            "compliance": AgentDefinition(
                description="Use for regulatory and policy-obligation findings.",
                prompt="Return concise compliance findings with clause ids.",
            ),
            "security": AgentDefinition(
                description="Use for data-protection and access-control findings.",
                prompt="Return concise security findings with clause ids.",
            ),
            "legal": AgentDefinition(
                description="Use for legal caveats and jurisdictional limits.",
                prompt="Preserve exact conditions and cite clause ids.",
            ),
            "reviewer": AgentDefinition(
                description="Use before the final answer.",
                prompt="Reject unsupported claims and missing caveats.",
            ),
        },
    )


async def _ask(client: ClaudeSDKClient, prompt: str) -> str:
    await client.query(prompt)
    parts: list[str] = []
    async for message in client.receive_response():
        text = _message_text(message)
        if text:
            parts.append(text)
    return "\n".join(parts).strip()


async def _run_pipeline_async(question: str) -> dict:
    outputs: dict[str, str] = {}
    async with ClaudeSDKClient(options=_options()) as client:
        outputs["intake"] = await _ask(
            client,
            f"Question: {question}\n\nPolicy:\n{POLICY_CORPUS}\n\n"
            "Identify relevant clauses and assign specialist review tasks.",
        )
        outputs["specialists"] = await _ask(
            client,
            f"Question: {question}\n\nIntake:\n{outputs['intake']}\n\n"
            "Run compliance, security, legal, and data operations reviews. "
            "Return one finding per specialist with clause ids.",
        )
        outputs["reviewer"] = await _ask(
            client,
            f"Question: {question}\n\nFindings:\n{outputs['specialists']}\n\n"
            "Reviewer: challenge unsupported claims and missing caveats.",
        )
        outputs["synthesis"] = await _ask(
            client,
            f"Question: {question}\n\nFindings:\n{outputs['specialists']}\n\n"
            f"Reviewer notes:\n{outputs['reviewer']}\n\n"
            "Draft the grounded answer.",
        )
        outputs["verdict"] = await _ask(
            client,
            f"Question: {question}\n\nDraft:\n{outputs['synthesis']}\n\n"
            "Return the final answer with cited clause ids and confidence.",
        )
    return {"question": question, **outputs}


def run_pipeline(question: str) -> dict:
    return asyncio.run(_run_pipeline_async(question))
