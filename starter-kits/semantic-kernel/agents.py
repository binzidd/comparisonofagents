"""
Semantic Kernel — Multi-Agent Policy Checker
Four-stage pipeline: intake → specialists (parallel) → reviewer+synthesis (parallel) → verdict

Uses SK ChatCompletionAgent with OpenAIChatCompletion service.

Optimisations applied (within Semantic Kernel — no framework change):
  1. Module-level agents each carry a pre-wired service; no re-creation per call.
  2. Specialist agents run concurrently via asyncio.gather.
  3. Reviewer and preliminary synthesis agents also run concurrently, removing
     one sequential round-trip from the critical path.
  4. verdict_agent reconciles both outputs — same four-stage depth as other SDKs.

Note: pybars4 fails to build on some systems due to a PyMeta3 dependency. The
stub below mocks the module so SK's handlebars template renderer doesn't prevent
import on those systems.  All other SK functionality is unaffected.
"""

import asyncio
import os
import sys
import types

# Stub pybars before SK's prompt_template module loads it.
if "pybars" not in sys.modules:
    _pb = types.ModuleType("pybars")
    _pb.Compiler = type("Compiler", (), {})
    _pb.PybarsError = Exception
    sys.modules["pybars"] = _pb

from dotenv import load_dotenv
from semantic_kernel.agents import ChatCompletionAgent
from semantic_kernel.connectors.ai.open_ai import OpenAIChatCompletion

load_dotenv()

MODEL = "gpt-4o-mini"
_API_KEY = os.environ["OPENAI_API_KEY"]


# ---------------------------------------------------------------------------
# Helper: build an agent (service + instructions)
# ---------------------------------------------------------------------------

def _make_agent(name: str, instructions: str) -> ChatCompletionAgent:
    return ChatCompletionAgent(
        service=OpenAIChatCompletion(ai_model_id=MODEL, api_key=_API_KEY),
        name=name,
        instructions=instructions,
    )


async def _ask(agent: ChatCompletionAgent, prompt: str) -> str:
    response = await agent.get_response(messages=prompt)
    return str(response.message)


# ---------------------------------------------------------------------------
# Agents — defined once at module level
# ---------------------------------------------------------------------------

intake_agent = _make_agent(
    "IntakeAgent",
    (
        "You are an intake agent for a corporate policy review system. Restate the "
        "submitted policy question clearly, identify key entities, and flag primary "
        "risk domains (compliance, legal, security, data operations). Keep under 150 words."
    ),
)

compliance_agent = _make_agent(
    "ComplianceAgent",
    (
        "You are a Compliance specialist. Review the policy question from a regulatory "
        "and compliance perspective. Consider GDPR, CCPA, SOX, and internal policy "
        "frameworks. Provide 3–5 bullet points then state ALLOW, DENY, or CONDITIONAL."
    ),
)

legal_agent = _make_agent(
    "LegalAgent",
    (
        "You are a Legal specialist. Review the policy question from a legal liability "
        "perspective. Consider employment law, IP ownership, contract obligations, and "
        "litigation risk. Provide 3–5 bullet points then state ALLOW, DENY, or CONDITIONAL."
    ),
)

security_agent = _make_agent(
    "SecurityAgent",
    (
        "You are a Security specialist. Review the policy question from an information "
        "security standpoint. Consider data classification, access controls, and breach "
        "risk. Provide 3–5 bullet points then state ALLOW, DENY, or CONDITIONAL."
    ),
)

data_ops_agent = _make_agent(
    "DataOpsAgent",
    (
        "You are a Data Operations specialist. Review the policy question from a data "
        "management perspective. Consider lifecycle, retention policies, and operational "
        "risk. Provide 3–5 bullet points then state ALLOW, DENY, or CONDITIONAL."
    ),
)

reviewer_agent = _make_agent(
    "ReviewerAgent",
    (
        "You are a critical reviewer. Challenge specialist assessments, identify "
        "contradictions, gaps, or overly lenient stances. Provide 4–6 bullet points."
    ),
)

synthesis_agent = _make_agent(
    "SynthesisAgent",
    (
        "You are a senior policy analyst. Produce a clear preliminary policy "
        "recommendation based on specialist assessments. Address key tensions and "
        "acknowledge uncertainty (150–250 words). Your draft will be refined by the "
        "verdict agent using reviewer challenges."
    ),
)

verdict_agent = _make_agent(
    "VerdictAgent",
    (
        "You are the final decision agent. You receive a preliminary synthesis and "
        "reviewer challenges. Start with COMPLIANT, NON-COMPLIANT, or CONDITIONAL, "
        "then one sentence addressing reviewer concerns (max 40 words)."
    ),
)


# ---------------------------------------------------------------------------
# Async pipeline
# ---------------------------------------------------------------------------

async def _run_pipeline_async(question: str) -> dict:
    # Stage 1: Intake
    intake_text = await _ask(
        intake_agent,
        f"Policy question: {question}",
    )

    # Stage 2: Specialists in parallel
    specialist_prompt = (
        f"Policy question: {question}\n\n"
        f"Intake summary: {intake_text}\n\n"
        "Provide your domain assessment."
    )
    compliance_out, legal_out, security_out, data_ops_out = await asyncio.gather(
        _ask(compliance_agent, specialist_prompt),
        _ask(legal_agent, specialist_prompt),
        _ask(security_agent, specialist_prompt),
        _ask(data_ops_agent, specialist_prompt),
    )

    specialist_results = {
        "compliance": compliance_out,
        "legal": legal_out,
        "security": security_out,
        "data_ops": data_ops_out,
    }
    specialists_text = "\n\n".join(
        f"[{domain.upper()}]\n{result}" for domain, result in specialist_results.items()
    )

    # Stage 3: Reviewer and preliminary synthesis run in parallel.
    # Both depend only on specialist outputs, so neither needs to wait for the other.
    challenge_text, synthesis_text = await asyncio.gather(
        _ask(
            reviewer_agent,
            f"Policy question: {question}\n\n"
            f"Specialist assessments:\n{specialists_text}\n\n"
            "Provide your critical challenge.",
        ),
        _ask(
            synthesis_agent,
            f"Policy question: {question}\n\n"
            f"Intake: {intake_text}\n\n"
            f"Specialist assessments:\n{specialists_text}\n\n"
            "Draft your preliminary recommendation.",
        ),
    )

    # Stage 4: Verdict reconciles the synthesis draft with reviewer challenges.
    verdict_text = await _ask(
        verdict_agent,
        f"Policy question: {question}\n\n"
        f"Preliminary synthesis:\n{synthesis_text}\n\n"
        f"Reviewer challenges:\n{challenge_text}",
    )

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
    """Run the full policy pipeline synchronously and return all stage results."""
    return asyncio.run(_run_pipeline_async(question))
