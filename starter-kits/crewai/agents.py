"""
CrewAI — Multi-Agent Policy Checker
Four-stage pipeline: intake → specialists (parallel) → reviewer+synthesis (parallel) → verdict

Each stage is a separate Crew.kickoff_async() call.

Optimisations applied (within CrewAI — no framework change):
  1. Specialist crews run concurrently via asyncio.gather, replacing four
     sequential task executions with one parallel fan-out.
  2. Reviewer and preliminary synthesis crews also run concurrently, removing
     one sequential round-trip from the critical path.
  3. Module-level LLM instance reused across all agents to avoid reconnection
     overhead per crew kickoff.
"""

import asyncio
import os
from dotenv import load_dotenv

from crewai import Agent, Task, Crew, LLM

load_dotenv()

# ---------------------------------------------------------------------------
# LLM — one instance shared across all crews
# ---------------------------------------------------------------------------
_llm = LLM(
    model="gpt-4o-mini",
    api_key=os.environ["OPENAI_API_KEY"],
    temperature=0.2,
)

# ---------------------------------------------------------------------------
# Agents — defined once at module level
# ---------------------------------------------------------------------------

intake_agent = Agent(
    role="Intake Specialist",
    goal="Parse corporate policy questions and categorise risk domains",
    backstory=(
        "You are an intake agent for a corporate policy review system. You restate "
        "submitted policy questions clearly, identify key entities, and flag the primary "
        "risk domains: compliance, legal, security, and data operations."
    ),
    llm=_llm,
    verbose=False,
    allow_delegation=False,
)

compliance_agent = Agent(
    role="Compliance Specialist",
    goal="Assess policy questions from a regulatory and compliance perspective",
    backstory=(
        "You are a Compliance specialist. You review policy questions considering GDPR, "
        "CCPA, SOX, and internal policy frameworks."
    ),
    llm=_llm,
    verbose=False,
    allow_delegation=False,
)

legal_agent = Agent(
    role="Legal Specialist",
    goal="Assess policy questions from a legal liability perspective",
    backstory=(
        "You are a Legal specialist. You review policy questions considering employment "
        "law, IP ownership, contract obligations, and litigation risk."
    ),
    llm=_llm,
    verbose=False,
    allow_delegation=False,
)

security_agent = Agent(
    role="Security Specialist",
    goal="Assess policy questions from an information security standpoint",
    backstory=(
        "You are a Security specialist. You review policy questions considering data "
        "classification, access controls, breach risk, and security best practices."
    ),
    llm=_llm,
    verbose=False,
    allow_delegation=False,
)

data_ops_agent = Agent(
    role="Data Operations Specialist",
    goal="Assess policy questions from a data management perspective",
    backstory=(
        "You are a Data Operations specialist. You review policy questions considering "
        "data lifecycle, retention policies, storage hygiene, and operational risk."
    ),
    llm=_llm,
    verbose=False,
    allow_delegation=False,
)

reviewer_agent = Agent(
    role="Critical Reviewer",
    goal="Challenge specialist assessments and identify contradictions or gaps",
    backstory=(
        "You are a critical reviewer. You challenge specialist assessments, identify "
        "contradictions, gaps, or overly conservative/lenient stances."
    ),
    llm=_llm,
    verbose=False,
    allow_delegation=False,
)

synthesis_agent = Agent(
    role="Senior Policy Analyst",
    goal="Synthesise specialist assessments into a preliminary policy recommendation",
    backstory=(
        "You are a senior policy analyst. You produce clear preliminary policy "
        "recommendations based on specialist assessments. Your draft will be refined "
        "by the verdict agent using reviewer challenges."
    ),
    llm=_llm,
    verbose=False,
    allow_delegation=False,
)

verdict_agent = Agent(
    role="Final Decision Agent",
    goal="Issue the final policy verdict addressing all reviewer concerns",
    backstory=(
        "You are the final decision agent. You receive a preliminary synthesis and "
        "reviewer challenges and issue a verdict of COMPLIANT, NON-COMPLIANT, or "
        "CONDITIONAL with a one-sentence rationale."
    ),
    llm=_llm,
    verbose=False,
    allow_delegation=False,
)


# ---------------------------------------------------------------------------
# Helper: run a single agent task asynchronously
# ---------------------------------------------------------------------------

async def _run_single_async(agent: Agent, description: str) -> str:
    """Kickoff a single-task crew asynchronously and return the raw output."""
    task = Task(
        description=description,
        expected_output="A concise, structured response.",
        agent=agent,
    )
    crew = Crew(agents=[agent], tasks=[task], verbose=False)
    result = await crew.kickoff_async()
    return result.raw or ""


# ---------------------------------------------------------------------------
# Async pipeline
# ---------------------------------------------------------------------------

async def _run_pipeline_async(question: str) -> dict:
    # Stage 1: Intake
    intake_text = await _run_single_async(
        intake_agent,
        f"Policy question: {question}\n\n"
        "Restate the question clearly, identify key entities, and flag primary risk "
        "domains (compliance, legal, security, data operations). Keep under 150 words.",
    )

    # Stage 2: Specialists in parallel — four separate crews run concurrently.
    specialist_prompt = (
        f"Policy question: {question}\n\n"
        f"Intake summary: {intake_text}\n\n"
        "Provide your domain assessment in 3–5 bullet points, then state a brief "
        "recommendation (ALLOW / DENY / CONDITIONAL)."
    )

    compliance_out, legal_out, security_out, data_ops_out = await asyncio.gather(
        _run_single_async(compliance_agent, specialist_prompt),
        _run_single_async(legal_agent, specialist_prompt),
        _run_single_async(security_agent, specialist_prompt),
        _run_single_async(data_ops_agent, specialist_prompt),
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
        _run_single_async(
            reviewer_agent,
            f"Policy question: {question}\n\n"
            f"Specialist assessments:\n{specialists_text}\n\n"
            "Challenge the assessments in 4–6 bullet points. Identify contradictions, "
            "gaps, or unsupported claims.",
        ),
        _run_single_async(
            synthesis_agent,
            f"Policy question: {question}\n\n"
            f"Intake: {intake_text}\n\n"
            f"Specialist assessments:\n{specialists_text}\n\n"
            "Draft a preliminary policy recommendation (150–250 words).",
        ),
    )

    # Stage 4: Verdict reconciles the synthesis draft with reviewer challenges.
    verdict_text = await _run_single_async(
        verdict_agent,
        f"Policy question: {question}\n\n"
        f"Preliminary synthesis:\n{synthesis_text}\n\n"
        f"Reviewer challenges:\n{challenge_text}\n\n"
        "Issue a final verdict starting with COMPLIANT, NON-COMPLIANT, or CONDITIONAL, "
        "followed by one sentence addressing the reviewer's main concerns (max 40 words).",
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
