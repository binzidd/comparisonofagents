"""
OpenAI Agents SDK — Multi-Agent Policy Checker
Four-stage pipeline: intake → specialists → reviewer+synthesis (parallel) → verdict

Uses the `openai-agents` package (pip install openai-agents).
Each stage is a discrete Agent run; results are threaded through as context.

Optimisation: reviewer and preliminary synthesis both depend only on specialist
outputs.  Running them with asyncio.gather removes one sequential round-trip vs
the original five-stage linear chain.  The verdict stage reconciles both.
"""

import os
import asyncio
from dotenv import load_dotenv

from agents import Agent, Runner

load_dotenv()

# ---------------------------------------------------------------------------
# Model
# ---------------------------------------------------------------------------
MODEL = "gpt-4o-mini"

# ---------------------------------------------------------------------------
# Agent definitions — created once at module level
# ---------------------------------------------------------------------------

intake_agent = Agent(
    name="IntakeAgent",
    model=MODEL,
    instructions=(
        "You are an intake agent for a corporate policy review system. "
        "Restate the submitted policy question clearly, identify the key entities "
        "involved, and flag the primary risk domains (compliance, legal, security, "
        "data operations). Keep your response under 150 words."
    ),
)

compliance_agent = Agent(
    name="ComplianceAgent",
    model=MODEL,
    instructions=(
        "You are a Compliance specialist. Review the policy question from a regulatory "
        "and compliance perspective. Consider GDPR, CCPA, SOX, and internal policy "
        "frameworks. Provide your assessment in 3–5 bullet points, then state a brief "
        "recommendation: ALLOW, DENY, or CONDITIONAL."
    ),
)

legal_agent = Agent(
    name="LegalAgent",
    model=MODEL,
    instructions=(
        "You are a Legal specialist. Review the policy question from a legal liability "
        "perspective. Consider employment law, IP ownership, contract obligations, and "
        "litigation risk. Provide your assessment in 3–5 bullet points, then state a "
        "brief recommendation: ALLOW, DENY, or CONDITIONAL."
    ),
)

security_agent = Agent(
    name="SecurityAgent",
    model=MODEL,
    instructions=(
        "You are a Security specialist. Review the policy question from an information "
        "security standpoint. Consider data classification, access controls, breach risk, "
        "and security best practices. Provide your assessment in 3–5 bullet points, then "
        "state a brief recommendation: ALLOW, DENY, or CONDITIONAL."
    ),
)

data_ops_agent = Agent(
    name="DataOpsAgent",
    model=MODEL,
    instructions=(
        "You are a Data Operations specialist. Review the policy question from a data "
        "management perspective. Consider data lifecycle, retention policies, storage "
        "hygiene, and operational risk. Provide your assessment in 3–5 bullet points, "
        "then state a brief recommendation: ALLOW, DENY, or CONDITIONAL."
    ),
)

reviewer_agent = Agent(
    name="ReviewerAgent",
    model=MODEL,
    instructions=(
        "You are a critical reviewer agent. Your job is to challenge the specialist "
        "assessments, identify contradictions, gaps, or overly conservative/lenient "
        "stances. Ask probing questions and highlight any areas where specialists "
        "disagree or where more nuance is needed. Provide your challenge in 4–6 bullet points."
    ),
)

synthesis_agent = Agent(
    name="SynthesisAgent",
    model=MODEL,
    instructions=(
        "You are a senior policy analyst. Produce a clear preliminary policy "
        "recommendation based on specialist assessments. Address key tensions and "
        "acknowledge uncertainty where appropriate (150–250 words). This draft will "
        "be refined by the verdict agent using reviewer challenges."
    ),
)

verdict_agent = Agent(
    name="VerdictAgent",
    model=MODEL,
    instructions=(
        "You are the final decision agent. You will receive a preliminary synthesis "
        "and reviewer challenges. Your response MUST start with exactly one of: "
        "COMPLIANT, NON-COMPLIANT, or CONDITIONAL. Follow with a single sentence "
        "that addresses the reviewer's main concerns (max 40 words)."
    ),
)


# ---------------------------------------------------------------------------
# Async pipeline
# ---------------------------------------------------------------------------

async def _run_pipeline_async(question: str) -> dict:
    # Stage 1: Intake
    intake_result = await Runner.run(
        intake_agent,
        input=f"Policy question: {question}",
    )
    intake_text = intake_result.final_output

    # Stage 2: Specialists (run concurrently)
    specialist_prompt = (
        f"Policy question: {question}\n\n"
        f"Intake summary: {intake_text}\n\n"
        "Provide your domain assessment."
    )
    compliance_task = Runner.run(compliance_agent, input=specialist_prompt)
    legal_task = Runner.run(legal_agent, input=specialist_prompt)
    security_task = Runner.run(security_agent, input=specialist_prompt)
    data_ops_task = Runner.run(data_ops_agent, input=specialist_prompt)

    compliance_res, legal_res, security_res, data_ops_res = await asyncio.gather(
        compliance_task, legal_task, security_task, data_ops_task
    )

    specialist_results = {
        "compliance": compliance_res.final_output,
        "legal": legal_res.final_output,
        "security": security_res.final_output,
        "data_ops": data_ops_res.final_output,
    }

    specialists_text = "\n\n".join(
        f"[{domain.upper()}]\n{result}"
        for domain, result in specialist_results.items()
    )

    # Stage 3: Reviewer and preliminary synthesis run in parallel.
    # Both depend only on specialist outputs, so neither needs to wait for the
    # other.  asyncio.gather removes one sequential round-trip.
    reviewer_result, synthesis_result = await asyncio.gather(
        Runner.run(
            reviewer_agent,
            input=(
                f"Policy question: {question}\n\n"
                f"Specialist assessments:\n{specialists_text}\n\n"
                "Provide your critical challenge."
            ),
        ),
        Runner.run(
            synthesis_agent,
            input=(
                f"Policy question: {question}\n\n"
                f"Intake: {intake_text}\n\n"
                f"Specialist assessments:\n{specialists_text}\n\n"
                "Draft your preliminary recommendation."
            ),
        ),
    )
    challenge_text = reviewer_result.final_output
    synthesis_text = synthesis_result.final_output

    # Stage 4: Verdict reconciles the synthesis draft with reviewer challenges.
    verdict_result = await Runner.run(
        verdict_agent,
        input=(
            f"Policy question: {question}\n\n"
            f"Preliminary synthesis:\n{synthesis_text}\n\n"
            f"Reviewer challenges:\n{challenge_text}"
        ),
    )
    verdict_text = verdict_result.final_output

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
