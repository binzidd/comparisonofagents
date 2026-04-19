"""
PydanticAI — Multi-Agent Policy Checker
Four-stage pipeline: intake → specialists (concurrent) → reviewer+synthesis (parallel) → verdict

Each stage has a dedicated Agent with a typed Pydantic result_type.
Specialists run concurrently via asyncio.gather (stage 2).
Reviewer and preliminary synthesis also run concurrently via asyncio.gather (stage 3),
removing one sequential round-trip vs the original five-stage chain.
"""

import os
import asyncio
from typing import Literal
from dotenv import load_dotenv

from pydantic import BaseModel, Field
from pydantic_ai import Agent

load_dotenv()

# ---------------------------------------------------------------------------
# Model string
# ---------------------------------------------------------------------------
MODEL = "openai:gpt-4o-mini"

# ---------------------------------------------------------------------------
# Pydantic result models
# ---------------------------------------------------------------------------

class IntakeResult(BaseModel):
    summary: str = Field(description="Clear restatement of the policy question")
    entities: list[str] = Field(description="Key entities involved")
    risk_domains: list[str] = Field(description="Primary risk domains flagged")


class SpecialistResult(BaseModel):
    domain: str = Field(description="Specialist domain name")
    assessment_points: list[str] = Field(description="3–5 assessment bullet points")
    recommendation: Literal["ALLOW", "DENY", "CONDITIONAL"] = Field(
        description="Domain recommendation"
    )


class ReviewResult(BaseModel):
    challenges: list[str] = Field(description="4–6 challenge bullet points")
    contradictions_found: bool = Field(
        description="Whether contradictions were found between specialists"
    )


class SynthesisResult(BaseModel):
    narrative: str = Field(description="150–250 word preliminary policy recommendation")
    key_tensions: list[str] = Field(description="Key tensions identified")
    overall_lean: Literal["ALLOW", "DENY", "CONDITIONAL"] = Field(
        description="Overall lean before final verdict"
    )


class VerdictResult(BaseModel):
    verdict: Literal["COMPLIANT", "NON-COMPLIANT", "CONDITIONAL"] = Field(
        description="Final verdict"
    )
    rationale: str = Field(description="One-sentence rationale addressing reviewer concerns (max 40 words)")


# ---------------------------------------------------------------------------
# Agents — defined once at module level
# ---------------------------------------------------------------------------

intake_agent: Agent[None, IntakeResult] = Agent(
    MODEL,
    result_type=IntakeResult,
    system_prompt=(
        "You are an intake agent for a corporate policy review system. "
        "Restate the submitted policy question clearly, identify the key entities "
        "involved, and flag the primary risk domains (compliance, legal, security, "
        "data operations)."
    ),
)

compliance_agent: Agent[None, SpecialistResult] = Agent(
    MODEL,
    result_type=SpecialistResult,
    system_prompt=(
        "You are a Compliance specialist. Review the policy question from a regulatory "
        "and compliance perspective. Consider GDPR, CCPA, SOX, and internal policy "
        "frameworks. Set domain='compliance' in your result."
    ),
)

legal_agent: Agent[None, SpecialistResult] = Agent(
    MODEL,
    result_type=SpecialistResult,
    system_prompt=(
        "You are a Legal specialist. Review the policy question from a legal liability "
        "perspective. Consider employment law, IP ownership, contract obligations, and "
        "litigation risk. Set domain='legal' in your result."
    ),
)

security_agent: Agent[None, SpecialistResult] = Agent(
    MODEL,
    result_type=SpecialistResult,
    system_prompt=(
        "You are a Security specialist. Review the policy question from an information "
        "security standpoint. Consider data classification, access controls, breach risk, "
        "and security best practices. Set domain='security' in your result."
    ),
)

data_ops_agent: Agent[None, SpecialistResult] = Agent(
    MODEL,
    result_type=SpecialistResult,
    system_prompt=(
        "You are a Data Operations specialist. Review the policy question from a data "
        "management perspective. Consider data lifecycle, retention policies, storage "
        "hygiene, and operational risk. Set domain='data_ops' in your result."
    ),
)

reviewer_agent: Agent[None, ReviewResult] = Agent(
    MODEL,
    result_type=ReviewResult,
    system_prompt=(
        "You are a critical reviewer agent. Challenge the specialist assessments, "
        "identify contradictions, gaps, or overly conservative/lenient stances. "
        "Ask probing questions and highlight areas of disagreement or missing nuance."
    ),
)

synthesis_agent: Agent[None, SynthesisResult] = Agent(
    MODEL,
    result_type=SynthesisResult,
    system_prompt=(
        "You are a senior policy analyst. Produce a clear preliminary policy "
        "recommendation based on specialist assessments. Address key tensions and "
        "acknowledge uncertainty where appropriate. This draft will be refined by "
        "the verdict agent using reviewer challenges."
    ),
)

verdict_agent: Agent[None, VerdictResult] = Agent(
    MODEL,
    result_type=VerdictResult,
    system_prompt=(
        "You are the final decision agent. You will receive a preliminary synthesis "
        "and reviewer challenges. Issue a final verdict of COMPLIANT, NON-COMPLIANT, "
        "or CONDITIONAL with a one-sentence rationale that addresses reviewer concerns."
    ),
)


# ---------------------------------------------------------------------------
# Helper: format SpecialistResult for downstream prompts
# ---------------------------------------------------------------------------

def _format_specialist(sr: SpecialistResult) -> str:
    points = "\n".join(f"  • {p}" for p in sr.assessment_points)
    return f"Domain: {sr.domain.upper()}\n{points}\nRecommendation: {sr.recommendation}"


def _format_review(rr: ReviewResult) -> str:
    points = "\n".join(f"  • {c}" for c in rr.challenges)
    return f"Challenges:\n{points}\nContradictions found: {rr.contradictions_found}"


# ---------------------------------------------------------------------------
# Async pipeline
# ---------------------------------------------------------------------------

async def _run_pipeline_async(question: str) -> dict:
    # Stage 1: Intake
    intake_run = await intake_agent.run(f"Policy question: {question}")
    intake: IntakeResult = intake_run.data

    intake_text = (
        f"{intake.summary}\n\n"
        f"Entities: {', '.join(intake.entities)}\n"
        f"Risk domains: {', '.join(intake.risk_domains)}"
    )

    # Stage 2: Specialists (concurrent)
    specialist_prompt = (
        f"Policy question: {question}\n\n"
        f"Intake summary: {intake_text}\n\n"
        "Provide your domain assessment."
    )

    compliance_run, legal_run, security_run, data_ops_run = await asyncio.gather(
        compliance_agent.run(specialist_prompt),
        legal_agent.run(specialist_prompt),
        security_agent.run(specialist_prompt),
        data_ops_agent.run(specialist_prompt),
    )

    specialist_objects: dict[str, SpecialistResult] = {
        "compliance": compliance_run.data,
        "legal": legal_run.data,
        "security": security_run.data,
        "data_ops": data_ops_run.data,
    }

    specialists_text = "\n\n".join(
        f"[{domain.upper()}]\n{_format_specialist(sr)}"
        for domain, sr in specialist_objects.items()
    )

    # Stage 3: Reviewer and preliminary synthesis run in parallel.
    # Both depend only on specialist outputs, so neither needs to wait for the other.
    reviewer_run, synthesis_run = await asyncio.gather(
        reviewer_agent.run(
            f"Policy question: {question}\n\n"
            f"Specialist assessments:\n{specialists_text}\n\n"
            "Provide your critical challenge."
        ),
        synthesis_agent.run(
            f"Policy question: {question}\n\n"
            f"Intake: {intake_text}\n\n"
            f"Specialist assessments:\n{specialists_text}\n\n"
            "Draft your preliminary recommendation."
        ),
    )
    review: ReviewResult = reviewer_run.data
    synthesis: SynthesisResult = synthesis_run.data

    challenge_text = _format_review(review)
    synthesis_text = (
        f"{synthesis.narrative}\n\n"
        f"Key tensions: {', '.join(synthesis.key_tensions)}\n"
        f"Overall lean: {synthesis.overall_lean}"
    )

    # Stage 4: Verdict reconciles the synthesis draft with reviewer challenges.
    verdict_run = await verdict_agent.run(
        f"Policy question: {question}\n\n"
        f"Preliminary synthesis:\n{synthesis_text}\n\n"
        f"Reviewer challenges:\n{challenge_text}"
    )
    verdict: VerdictResult = verdict_run.data
    verdict_text = f"{verdict.verdict} — {verdict.rationale}"

    specialist_display = {
        domain: _format_specialist(sr)
        for domain, sr in specialist_objects.items()
    }

    return {
        "question": question,
        "intake": intake_text,
        "specialists": specialist_display,
        "reviewer": challenge_text,
        "synthesis": synthesis_text,
        "verdict": verdict_text,
        "_typed": {
            "intake": intake,
            "specialists": specialist_objects,
            "review": review,
            "synthesis": synthesis,
            "verdict": verdict,
        },
    }


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------

def run_pipeline(question: str) -> dict:
    """Run the full policy pipeline synchronously and return all stage results."""
    return asyncio.run(_run_pipeline_async(question))
