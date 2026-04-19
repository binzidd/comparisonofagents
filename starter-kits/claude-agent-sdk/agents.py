"""
Claude Agent SDK policy checker.

Runs a four-stage policy review with Claude Agent SDK calls:
intake -> parallel specialists -> parallel(reviewer, synthesis_draft) -> verdict.

The reviewer and preliminary synthesis run in parallel — both depend only on
specialist outputs — removing one sequential subprocess round-trip vs the
original five-stage version.
"""

import asyncio
import os
import shutil
from pathlib import Path

from claude_agent_sdk import (
    AssistantMessage,
    ClaudeAgentOptions,
    ResultMessage,
    TextBlock,
    ToolAnnotations,
    create_sdk_mcp_server,
    query,
    tool,
)
from dotenv import load_dotenv

load_dotenv()

MODEL = os.getenv("CLAUDE_AGENT_MODEL", "sonnet")
HERE = Path(__file__).resolve().parent
USE_READ_ONLY_HINT = os.getenv("CLAUDE_AGENT_READ_ONLY_HINT", "").lower() in {"1", "true", "yes", "on"}

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


@tool(
    "get_policy_corpus",
    "Read the shared policy corpus for this experiment.",
    {},
    annotations=ToolAnnotations(readOnlyHint=True),
)
async def get_policy_corpus(_args: dict) -> dict:
    return {
        "content": [
            {
                "type": "text",
                "text": POLICY_CORPUS,
            }
        ]
    }


_POLICY_SERVER = create_sdk_mcp_server(
    name="policy-docs",
    tools=[get_policy_corpus],
)


def _default_cli_path() -> str | None:
    cli_path = shutil.which("claude")
    if cli_path:
        return cli_path

    candidates = [
        HERE / "node_modules" / ".bin" / "claude",
        HERE.parent / "node_modules" / ".bin" / "claude",
        HERE.parent.parent / "node_modules" / ".bin" / "claude",
    ]
    for candidate in candidates:
        if candidate.exists():
            return str(candidate)
    return None


def _default_env() -> dict[str, str]:
    env = dict(os.environ)
    path_parts: list[str] = []

    node_path = shutil.which("node")
    if node_path:
        path_parts.append(str(Path(node_path).resolve().parent))
    else:
        fallback_node_dir = Path("/opt/homebrew/bin")
        if fallback_node_dir.exists():
            path_parts.append(str(fallback_node_dir))

    cli_path = _default_cli_path()
    if cli_path:
        path_parts.append(str(Path(cli_path).resolve().parent))

    current_path = env.get("PATH", "")
    merged_parts = [part for part in path_parts if part]
    if current_path:
        merged_parts.append(current_path)
    env["PATH"] = ":".join(dict.fromkeys(merged_parts))
    return env

_BASE_OPTIONS = ClaudeAgentOptions(
    allowed_tools=[],
    permission_mode="dontAsk",
    max_turns=1,
    model=MODEL,
    cli_path=_default_cli_path(),
    env=_default_env(),
    system_prompt=(
        "You are the principal orchestration agent for a policy compliance "
        "analysis. Keep answers concise, grounded, and citation-led."
    ),
)

_READ_ONLY_TOOL_OPTIONS = ClaudeAgentOptions(
    allowed_tools=["get_policy_corpus"],
    mcp_servers={"policy-docs": _POLICY_SERVER},
    permission_mode="dontAsk",
    max_turns=2,
    model=MODEL,
    cli_path=_default_cli_path(),
    env=_default_env(),
    system_prompt=(
        "You are the principal orchestration agent for a policy compliance "
        "analysis. Keep answers concise, grounded, and citation-led. "
        "Use the read-only get_policy_corpus tool when you need the source text."
    ),
)

_OPTIONS = _READ_ONLY_TOOL_OPTIONS if USE_READ_ONLY_HINT else _BASE_OPTIONS


def _policy_context_prompt() -> str:
    if USE_READ_ONLY_HINT:
        return "Use get_policy_corpus to inspect the source policy."
    return f"Policy:\n{POLICY_CORPUS}"


def _message_text(message: object) -> str:
    if isinstance(message, AssistantMessage):
        return "\n".join(
            block.text for block in message.content
            if isinstance(block, TextBlock)
        )
    if isinstance(message, ResultMessage):
        return message.result or ""
    return ""


async def _ask(prompt: str) -> str:
    parts: list[str] = []
    async for message in query(prompt=prompt, options=_OPTIONS):
        text = _message_text(message)
        if text:
            parts.append(text)
    return "\n".join(parts).strip()


async def _run_pipeline_async(question: str) -> dict:
    outputs: dict[str, str] = {}

    # Stage 1: intake
    outputs["intake"] = await _ask(
        f"Question: {question}\n\n{_policy_context_prompt()}\n\n"
        "Identify "
        "relevant clauses and assign specialist review tasks.",
    )

    # Stage 2: four specialists in parallel
    specialist_roles = {
        "compliance": "Review regulatory and policy obligations.",
        "security": "Review data-protection controls and access safeguards.",
        "legal": "Review legal caveats, conditions, and jurisdictional limits.",
        "data_ops": "Review data lifecycle, retention, and operational risk.",
    }
    specialist_outputs = await asyncio.gather(
        *[
            _ask(
                f"{instructions}\n\nQuestion: {question}\n\n{_policy_context_prompt()}\n\n"
                f"Intake:\n{outputs['intake']}\n\n"
                "Return one compact finding with clause ids and a confidence note."
            )
            for instructions in specialist_roles.values()
        ]
    )
    outputs["specialists"] = "\n\n".join(
        f"{role}: {text}" for role, text in zip(specialist_roles, specialist_outputs)
    )

    # Stage 3: reviewer and preliminary synthesis run in parallel.
    # Both depend only on specialist outputs, so neither needs to wait for the other.
    outputs["reviewer"], outputs["synthesis"] = await asyncio.gather(
        _ask(
            f"Question: {question}\n\nFindings:\n{outputs['specialists']}\n\n"
            f"{_policy_context_prompt()}\n\n"
            "Reviewer: challenge unsupported claims and missing caveats.",
        ),
        _ask(
            f"Question: {question}\n\nFindings:\n{outputs['specialists']}\n\n"
            f"{_policy_context_prompt()}\n\n"
            "Draft the grounded answer citing policy clauses.",
        ),
    )

    # Stage 4: verdict combines the draft and reviewer challenges.
    outputs["verdict"] = await _ask(
        f"Question: {question}\n\nDraft:\n{outputs['synthesis']}\n\n"
        f"Reviewer challenges:\n{outputs['reviewer']}\n\n"
        "Return the final answer addressing reviewer concerns, with cited clause ids and confidence.",
    )
    return {"question": question, **outputs}


def run_pipeline(question: str) -> dict:
    return asyncio.run(_run_pipeline_async(question))
