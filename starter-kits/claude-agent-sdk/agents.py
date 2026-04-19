"""
Claude API policy checker.

Runs a five-stage policy review with direct Anthropic SDK calls:
intake -> parallel specialists -> reviewer -> synthesis -> verdict.

Key performance improvements over the subprocess-based transport:
- Single AsyncAnthropic client reused across all calls (HTTP connection pooling)
- prompt caching on the stable system + policy prefix
- Bounded max_tokens per stage to avoid over-generation
"""

import asyncio
import os

import anthropic
from dotenv import load_dotenv

load_dotenv()

MODEL = os.getenv("CLAUDE_AGENT_MODEL", "claude-sonnet-4-6")

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

_SYSTEM = (
    "You are the principal orchestration agent for a policy compliance "
    "analysis. Keep answers concise, grounded, and citation-led."
)


async def _ask(client: anthropic.AsyncAnthropic, prompt: str, max_tokens: int = 250) -> str:
    """Single API call with cached system + policy prefix."""
    response = await client.messages.create(
        model=MODEL,
        max_tokens=max_tokens,
        system=[
            {
                "type": "text",
                "text": _SYSTEM,
                "cache_control": {"type": "ephemeral"},
            }
        ],
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": f"Policy:\n{POLICY_CORPUS}",
                        "cache_control": {"type": "ephemeral"},
                    },
                    {"type": "text", "text": prompt},
                ],
            }
        ],
    )
    return response.content[0].text.strip() if response.content else ""


async def _run_pipeline_async(question: str) -> dict:
    client = anthropic.AsyncAnthropic()
    outputs: dict[str, str] = {}

    outputs["intake"] = await _ask(
        client,
        f"Question: {question}\n\n"
        "Identify relevant clauses and assign specialist review tasks.",
        max_tokens=150,
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
                client,
                f"{instructions}\n\nQuestion: {question}\n\n"
                f"Intake:\n{outputs['intake']}\n\n"
                "Return one compact finding with clause ids and a confidence note.",
                max_tokens=150,
            )
            for instructions in specialist_roles.values()
        ]
    )
    outputs["specialists"] = "\n\n".join(
        f"{role}: {text}" for role, text in zip(specialist_roles, specialist_outputs)
    )
    outputs["reviewer"] = await _ask(
        client,
        f"Question: {question}\n\nFindings:\n{outputs['specialists']}\n\n"
        "Reviewer: challenge unsupported claims and missing caveats.",
        max_tokens=200,
    )
    outputs["synthesis"] = await _ask(
        client,
        f"Question: {question}\n\nFindings:\n{outputs['specialists']}\n\n"
        f"Reviewer notes:\n{outputs['reviewer']}\n\n"
        "Draft the grounded answer.",
        max_tokens=250,
    )
    outputs["verdict"] = await _ask(
        client,
        f"Question: {question}\n\nDraft:\n{outputs['synthesis']}\n\n"
        "Return the final answer with cited clause ids and confidence.",
        max_tokens=200,
    )
    return {"question": question, **outputs}


def run_pipeline(question: str) -> dict:
    return asyncio.run(_run_pipeline_async(question))
