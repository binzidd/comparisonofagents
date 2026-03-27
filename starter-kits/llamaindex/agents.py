"""
LlamaIndex Workflows — Multi-Agent Policy Checker
Five-stage pipeline: intake → specialists (concurrent) → review → synthesis → verdict

Uses llama_index.core.workflow with typed events and async steps.
"""

import os
import asyncio
from typing import Optional
from dotenv import load_dotenv

from llama_index.core.workflow import (
    Workflow,
    step,
    StartEvent,
    StopEvent,
    Event,
)
from llama_index.llms.openai import OpenAI

load_dotenv()

# ---------------------------------------------------------------------------
# LLM
# ---------------------------------------------------------------------------
llm = OpenAI(
    model="gpt-4o-mini",
    api_key=os.environ["OPENAI_API_KEY"],
    temperature=0.2,
)

# ---------------------------------------------------------------------------
# Custom Events
# ---------------------------------------------------------------------------

class IntakeEvent(Event):
    question: str
    intake_result: str


class SpecialistResultEvent(Event):
    domain: str
    result: str


class AllSpecialistsEvent(Event):
    question: str
    intake_result: str
    specialist_results: dict


class ReviewEvent(Event):
    question: str
    intake_result: str
    specialist_results: dict
    challenge_result: str


class SynthesisEvent(Event):
    question: str
    intake_result: str
    specialist_results: dict
    challenge_result: str
    synthesis: str


# ---------------------------------------------------------------------------
# Specialist system prompts
# ---------------------------------------------------------------------------
SPECIALIST_PROMPTS = {
    "compliance": (
        "You are a Compliance specialist. Review the policy question from a regulatory "
        "and compliance perspective. Consider GDPR, CCPA, SOX, and internal policy "
        "frameworks. Provide your assessment in 3–5 bullet points, then state a brief "
        "recommendation: ALLOW, DENY, or CONDITIONAL."
    ),
    "legal": (
        "You are a Legal specialist. Review the policy question from a legal liability "
        "perspective. Consider employment law, IP ownership, contract obligations, and "
        "litigation risk. Provide your assessment in 3–5 bullet points, then state a "
        "brief recommendation: ALLOW, DENY, or CONDITIONAL."
    ),
    "security": (
        "You are a Security specialist. Review the policy question from an information "
        "security standpoint. Consider data classification, access controls, breach risk, "
        "and security best practices. Provide your assessment in 3–5 bullet points, then "
        "state a brief recommendation: ALLOW, DENY, or CONDITIONAL."
    ),
    "data_ops": (
        "You are a Data Operations specialist. Review the policy question from a data "
        "management perspective. Consider data lifecycle, retention policies, storage "
        "hygiene, and operational risk. Provide your assessment in 3–5 bullet points, "
        "then state a brief recommendation: ALLOW, DENY, or CONDITIONAL."
    ),
}


# ---------------------------------------------------------------------------
# Workflow
# ---------------------------------------------------------------------------

class PolicyWorkflow(Workflow):

    @step
    async def intake_step(self, ev: StartEvent) -> IntakeEvent:
        question: str = ev.get("question", "")
        response = await llm.acomplete(
            "System: You are an intake agent for a corporate policy review system. "
            "Restate the submitted policy question clearly, identify the key entities "
            "involved, and flag the primary risk domains (compliance, legal, security, "
            "data operations). Keep your response under 150 words.\n\n"
            f"User: Policy question: {question}"
        )
        return IntakeEvent(question=question, intake_result=str(response))

    @step(num_workers=4)
    async def specialist_step(self, ev: IntakeEvent) -> AllSpecialistsEvent:
        """
        Run all four specialists concurrently by launching async tasks.
        Returns a single AllSpecialistsEvent once all are done.
        """
        question = ev.question
        intake_result = ev.intake_result

        async def call_specialist(domain: str) -> tuple[str, str]:
            system_prompt = SPECIALIST_PROMPTS[domain]
            response = await llm.acomplete(
                f"System: {system_prompt}\n\n"
                f"User: Policy question: {question}\n\n"
                f"Intake summary: {intake_result}\n\n"
                "Provide your domain assessment."
            )
            return domain, str(response)

        tasks = [call_specialist(d) for d in ["compliance", "legal", "security", "data_ops"]]
        pairs = await asyncio.gather(*tasks)
        specialist_results = {domain: result for domain, result in pairs}

        return AllSpecialistsEvent(
            question=question,
            intake_result=intake_result,
            specialist_results=specialist_results,
        )

    @step
    async def review_step(self, ev: AllSpecialistsEvent) -> ReviewEvent:
        specialists_text = "\n\n".join(
            f"[{domain.upper()}]\n{result}"
            for domain, result in ev.specialist_results.items()
        )
        response = await llm.acomplete(
            "System: You are a critical reviewer agent. Challenge the specialist "
            "assessments, identify contradictions, gaps, or overly conservative/lenient "
            "stances. Ask probing questions and highlight areas where specialists disagree "
            "or where more nuance is needed. Provide your challenge in 4–6 bullet points.\n\n"
            f"User: Policy question: {ev.question}\n\n"
            f"Specialist assessments:\n{specialists_text}\n\n"
            "Provide your critical challenge."
        )
        return ReviewEvent(
            question=ev.question,
            intake_result=ev.intake_result,
            specialist_results=ev.specialist_results,
            challenge_result=str(response),
        )

    @step
    async def synthesis_step(self, ev: ReviewEvent) -> SynthesisEvent:
        specialists_text = "\n\n".join(
            f"[{domain.upper()}]\n{result}"
            for domain, result in ev.specialist_results.items()
        )
        response = await llm.acomplete(
            "System: You are a senior policy analyst. Synthesise the specialist "
            "assessments and the reviewer's challenge into a coherent policy recommendation. "
            "Address key tensions, acknowledge uncertainty where appropriate, and produce "
            "a clear, balanced summary (150–250 words).\n\n"
            f"User: Policy question: {ev.question}\n\n"
            f"Intake: {ev.intake_result}\n\n"
            f"Specialist assessments:\n{specialists_text}\n\n"
            f"Reviewer challenge:\n{ev.challenge_result}"
        )
        return SynthesisEvent(
            question=ev.question,
            intake_result=ev.intake_result,
            specialist_results=ev.specialist_results,
            challenge_result=ev.challenge_result,
            synthesis=str(response),
        )

    @step
    async def verdict_step(self, ev: SynthesisEvent) -> StopEvent:
        response = await llm.acomplete(
            "System: You are the final decision agent. Based on the synthesis provided, "
            "issue a final verdict. Your response MUST start with exactly one of: "
            "COMPLIANT, NON-COMPLIANT, or CONDITIONAL. Follow with a single sentence "
            "explaining the decision (max 40 words).\n\n"
            f"User: Policy question: {ev.question}\n\n"
            f"Synthesis:\n{ev.synthesis}"
        )
        result = {
            "question": ev.question,
            "intake": ev.intake_result,
            "specialists": ev.specialist_results,
            "reviewer": ev.challenge_result,
            "synthesis": ev.synthesis,
            "verdict": str(response),
        }
        return StopEvent(result=result)


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------

def run_pipeline(question: str) -> dict:
    """Run the full policy workflow synchronously and return all stage results."""
    workflow = PolicyWorkflow(timeout=120, verbose=False)
    result = asyncio.run(workflow.run(question=question))
    return result
