"""
LlamaIndex Workflows — Multi-Agent Policy Checker
Four-stage pipeline: intake → specialists (concurrent) → review+synthesis (parallel) → verdict

Uses llama_index.core.workflow with typed events and async steps.

Optimisation: review_step and synthesis_step are merged into review_synthesis_step
which dispatches both LLM calls via asyncio.gather, removing one sequential
round-trip from the critical path.  verdict_step reconciles both outputs.
"""

import os
import asyncio
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
# LLM — single module-level instance
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


class ReviewSynthesisEvent(Event):
    """Carries both the reviewer challenge and the preliminary synthesis draft."""
    question: str
    intake_result: str
    specialist_results: dict
    challenge_result: str
    synthesis_draft: str


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
        """Run all four specialists concurrently."""
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
    async def review_synthesis_step(self, ev: AllSpecialistsEvent) -> ReviewSynthesisEvent:
        """Run reviewer challenge and preliminary synthesis in parallel.

        Both depend only on specialist outputs, so neither needs to wait for the
        other.  asyncio.gather removes one sequential round-trip vs a split
        review → synthesis chain.
        """
        specialists_text = "\n\n".join(
            f"[{domain.upper()}]\n{result}"
            for domain, result in ev.specialist_results.items()
        )

        review_coro = llm.acomplete(
            "System: You are a critical reviewer agent. Challenge the specialist "
            "assessments, identify contradictions, gaps, or overly conservative/lenient "
            "stances. Ask probing questions and highlight areas where specialists disagree "
            "or where more nuance is needed. Provide your challenge in 4–6 bullet points.\n\n"
            f"User: Policy question: {ev.question}\n\n"
            f"Specialist assessments:\n{specialists_text}\n\n"
            "Provide your critical challenge."
        )
        synthesis_coro = llm.acomplete(
            "System: You are a senior policy analyst. Produce a clear preliminary policy "
            "recommendation based on specialist assessments. Address key tensions and "
            "acknowledge uncertainty where appropriate (150–250 words). This draft will "
            "be refined by the verdict step.\n\n"
            f"User: Policy question: {ev.question}\n\n"
            f"Intake: {ev.intake_result}\n\n"
            f"Specialist assessments:\n{specialists_text}\n\n"
            "Draft your preliminary recommendation."
        )

        review_response, synthesis_response = await asyncio.gather(review_coro, synthesis_coro)

        return ReviewSynthesisEvent(
            question=ev.question,
            intake_result=ev.intake_result,
            specialist_results=ev.specialist_results,
            challenge_result=str(review_response),
            synthesis_draft=str(synthesis_response),
        )

    @step
    async def verdict_step(self, ev: ReviewSynthesisEvent) -> StopEvent:
        """Reconcile preliminary synthesis with reviewer challenges."""
        response = await llm.acomplete(
            "System: You are the final decision agent. You will receive a preliminary "
            "synthesis and reviewer challenges. Your response MUST start with exactly "
            "one of: COMPLIANT, NON-COMPLIANT, or CONDITIONAL. Follow with a single "
            "sentence that addresses the reviewer's main concerns (max 40 words).\n\n"
            f"User: Policy question: {ev.question}\n\n"
            f"Preliminary synthesis:\n{ev.synthesis_draft}\n\n"
            f"Reviewer challenges:\n{ev.challenge_result}"
        )
        result = {
            "question": ev.question,
            "intake": ev.intake_result,
            "specialists": ev.specialist_results,
            "reviewer": ev.challenge_result,
            "synthesis": ev.synthesis_draft,
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
