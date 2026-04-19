#!/usr/bin/env python3
"""
Run real multi-agent policy compliance harnesses for installed frameworks.
Captures actual timing + token metrics per stage.

Real runs  : langgraph, openai-agents, claude-agent-sdk, ag2, crewai,
             semantic-kernel, llamaindex, pydanticai
External   : mastra (TypeScript harness writes traces/mastra_metrics.json)

Output: traces/real_metrics.json
"""

import asyncio
import json
import os
import shutil
import subprocess
import time
from pathlib import Path
from openai import AsyncOpenAI
from dotenv import load_dotenv

# LlamaIndex workflow types at module level (needed for @step decorator annotation resolution)
from llama_index.core.workflow import (
    Workflow, StartEvent, StopEvent, step, Event, Context as LIContext,
)

load_dotenv()

MODEL = "gpt-4o-mini"
CLAUDE_MODEL = os.getenv("CLAUDE_AGENT_MODEL", "sonnet")
ROOT = Path(__file__).resolve().parent.parent
REAL_METRICS_PATH = ROOT / "traces" / "real_metrics.json"

# ── Policy corpus ─────────────────────────────────────────────────────────────
POLICY_CORPUS = """\
RETENTION CLAUSE: GitHub retains personal information as long as necessary for
the stated purposes or as required by law. After account closure GitHub may
keep data where needed for contracts, legal obligations, dispute resolution, or
agreement enforcement. The retention period depends on the purpose; when no
longer needed data is deleted or anonymized.

SHARING CLAUSE: GitHub may share personal data with affiliates and subsidiaries,
with organization account administrators who manage accounts on behalf of users,
with competent authorities when required by law or court order, with anti-abuse
and fraud-prevention entities to protect safety, and with third-party applications
when the user explicitly directs such sharing. GitHub does not sell personal data.

TRANSFERS CLAUSE: Personal data may be transferred to countries outside the
user's home country including the United States. GitHub relies on Standard
Contractual Clauses and other approved mechanisms for EEA and UK transfers.

RIGHTS CLAUSE: Users in the EEA, UK, and certain US states may exercise the
following rights: access to personal data, rectification of inaccurate data,
erasure or deletion in certain circumstances, objection to processing based on
legitimate interests, data portability in machine-readable format, withdrawal of
consent at any time, and lodging complaints with a supervisory authority.
US-state residents may have rights to know, delete, correct, and opt out of data
sales. GitHub responds within legally required timeframes.

PRIVATE_REPOS CLAUSE: GitHub accesses private repository content only as
necessary for support, security, or where legally required. Visibility is
controlled by the account holder.
"""

QUESTIONS = {
    "retention": (
        "Can GitHub retain personal data after an account is closed,"
        " and under what conditions?"
    ),
    "sharing": (
        "When may GitHub share personal data with third parties,"
        " affiliates, or public authorities?"
    ),
    "rights": (
        "What rights do users in the EEA, UK, and some US states have"
        " over their personal data under this policy?"
    ),
}

SPECIALIST_ROLES = {
    "compliance": (
        "You are a compliance specialist agent. Focus on regulatory adherence,"
        " documentation requirements, and policy obligations."
    ),
    "security": (
        "You are a security specialist agent. Focus on technical data-protection"
        " controls, risk mitigation, and access safeguards."
    ),
    "legal": (
        "You are a legal specialist agent. Focus on legal language, qualifying"
        " conditions, obligations, and jurisdictional caveats."
    ),
    "finance": (
        "You are a financial analyst agent. Focus on operational cost implications,"
        " business risk, and resource impact."
    ),
}

REVIEWER_SYS = (
    "You are a reviewer agent. Challenge and validate specialist findings."
    " Identify unsupported claims, missing qualifiers, or contradictions."
)

PRINCIPAL_SYS = (
    "You are the principal orchestration agent for a policy compliance analysis."
    " Be concise and evidence-based."
)

# Cost rates for gpt-4o-mini (per token)
_IN_RATE = 0.15 / 1_000_000   # $0.15 per 1M input tokens
_OUT_RATE = 0.60 / 1_000_000  # $0.60 per 1M output tokens


def usd(ti: int, to: int) -> float:
    return round(ti * _IN_RATE + to * _OUT_RATE, 7)


# ── Shared helper ─────────────────────────────────────────────────────────────
async def _call(
    client: AsyncOpenAI, system: str, user: str, max_tokens: int = 200
) -> tuple[str, int, int]:
    """Return (content, prompt_tokens, completion_tokens)."""
    r = await client.chat.completions.create(
        model=MODEL,
        messages=[
            {"role": "system", "content": system},
            {"role": "user", "content": user},
        ],
        max_tokens=max_tokens,
    )
    return r.choices[0].message.content, r.usage.prompt_tokens, r.usage.completion_tokens


def _usage_counts(usage: object) -> tuple[int, int]:
    """Extract prompt/completion tokens from SDK usage objects or dicts."""
    if usage is None:
        return 0, 0
    if isinstance(usage, dict):
        return (
            int(usage.get("prompt_tokens") or usage.get("input_tokens") or 0),
            int(usage.get("completion_tokens") or usage.get("output_tokens") or 0),
        )
    return (
        int(getattr(usage, "prompt_tokens", None) or getattr(usage, "input_tokens", None) or 0),
        int(getattr(usage, "completion_tokens", None) or getattr(usage, "output_tokens", None) or 0),
    )


def _with_outputs(metrics: dict, outputs: dict) -> dict:
    """Attach real stage outputs without changing the stage metric shape."""
    return {**metrics, "__outputs__": outputs}


# ── LANGGRAPH ─────────────────────────────────────────────────────────────────
async def run_langgraph(question: str) -> dict:
    from langgraph.graph import StateGraph, END

    client = AsyncOpenAI()
    _m: dict = {}   # stage metrics
    _s: dict = {}   # stage outputs

    async def intake(state: dict) -> dict:
        t = time.perf_counter()
        text, ti, to = await _call(
            client, PRINCIPAL_SYS,
            f"Question: {question}\n\nPolicy:\n{POLICY_CORPUS}\n\n"
            "Identify the relevant policy clauses and outline what each specialist should analyse.",
        )
        _m["intake"] = {"time_ms": int((time.perf_counter() - t) * 1000), "tokens_in": ti, "tokens_out": to}
        _s["intake"] = text
        return state

    async def review(state: dict) -> dict:
        t = time.perf_counter()
        prompt = (
            f"Question: {question}\n"
            f"Principal guidance: {_s['intake'][:300]}\n\n"
            "Give your specialist assessment in 2-3 sentences."
        )
        results = await asyncio.gather(
            *[_call(client, sys_p, prompt, 150) for sys_p in SPECIALIST_ROLES.values()]
        )
        _m["review"] = {
            "time_ms": int((time.perf_counter() - t) * 1000),
            "tokens_in": sum(r[1] for r in results),
            "tokens_out": sum(r[2] for r in results),
        }
        _s["review"] = {k: r[0] for k, r in zip(SPECIALIST_ROLES, results)}
        return state

    async def challenge(state: dict) -> dict:
        t = time.perf_counter()
        findings_text = "\n".join(f"{k}: {v}" for k, v in _s["review"].items())
        text, ti, to = await _call(
            client, REVIEWER_SYS,
            f"Question: {question}\n\nSpecialist findings:\n{findings_text}\n\n"
            "List any unsupported claims or missing qualifiers.",
        )
        _m["challenge"] = {"time_ms": int((time.perf_counter() - t) * 1000), "tokens_in": ti, "tokens_out": to}
        _s["challenge"] = text
        return state

    async def synthesis(state: dict) -> dict:
        t = time.perf_counter()
        text, ti, to = await _call(
            client, PRINCIPAL_SYS,
            f"Question: {question}\n\n"
            f"Findings: {json.dumps(_s['review'])[:400]}\n"
            f"Reviewer notes: {_s['challenge'][:200]}\n\n"
            "Draft a concise answer incorporating all evidence.",
            250,
        )
        _m["synthesis"] = {"time_ms": int((time.perf_counter() - t) * 1000), "tokens_in": ti, "tokens_out": to}
        _s["synthesis"] = text
        return state

    async def verdict(state: dict) -> dict:
        t = time.perf_counter()
        text, ti, to = await _call(
            client, PRINCIPAL_SYS,
            f"Question: {question}\n\nDraft answer: {_s['synthesis'][:400]}\n\n"
            "Produce the final answer. Be precise, cite specific policy clauses.",
            200,
        )
        _m["verdict"] = {"time_ms": int((time.perf_counter() - t) * 1000), "tokens_in": ti, "tokens_out": to}
        _s["verdict"] = text
        return state

    g = StateGraph(dict)
    for name, fn in [("intake", intake), ("review", review), ("challenge", challenge),
                     ("synthesis", synthesis), ("verdict", verdict)]:
        g.add_node(name, fn)
    g.set_entry_point("intake")
    g.add_edge("intake", "review")
    g.add_edge("review", "challenge")
    g.add_edge("challenge", "synthesis")
    g.add_edge("synthesis", "verdict")
    g.add_edge("verdict", END)
    await g.compile().ainvoke({})
    return _with_outputs(_m, _s)


# ── OPENAI AGENTS ─────────────────────────────────────────────────────────────
async def run_openai_agents(question: str) -> dict:
    from agents import Agent, Runner

    _m: dict = {}
    _s: dict = {}

    async def stage(name: str, instructions: str, prompt: str, max_out: int = 200) -> str:
        agent = Agent(name=name, model=MODEL, instructions=instructions)
        t = time.perf_counter()
        result = await Runner.run(agent, input=prompt)
        elapsed = int((time.perf_counter() - t) * 1000)
        ti = sum(getattr(r.usage, "input_tokens", 0) for r in result.raw_responses)
        to = sum(getattr(r.usage, "output_tokens", 0) for r in result.raw_responses)
        _m[name] = {"time_ms": elapsed, "tokens_in": ti, "tokens_out": to}
        _s[name] = result.final_output
        return result.final_output

    intake_out = await stage(
        "intake", PRINCIPAL_SYS,
        f"Question: {question}\n\nPolicy:\n{POLICY_CORPUS}\n\n"
        "Identify relevant clauses and outline specialist tasks.",
    )

    async def specialist_review(role: str, sys_p: str) -> tuple[str, str, int, int]:
        agent = Agent(name=role, model=MODEL, instructions=sys_p)
        result = await Runner.run(
            agent,
            input=(
                f"Intake context: {intake_out[:300]}\n\n"
                f"Question: {question}\n\n"
                "Give your specialist assessment in 2-3 sentences with relevant clause ids."
            ),
        )
        ti = sum(getattr(r.usage, "input_tokens", 0) for r in result.raw_responses)
        to = sum(getattr(r.usage, "output_tokens", 0) for r in result.raw_responses)
        return role, result.final_output, ti, to

    t_review = time.perf_counter()
    specialist_results = await asyncio.gather(
        *[
            specialist_review(role, sys_p)
            for role, sys_p in SPECIALIST_ROLES.items()
        ]
    )
    review_parts = {role: text for role, text, _ti, _to in specialist_results}
    _s["review"] = review_parts
    _m["review"] = {"time_ms": int((time.perf_counter() - t_review) * 1000),
                    "tokens_in": sum(ti for _role, _text, ti, _to in specialist_results),
                    "tokens_out": sum(to for _role, _text, _ti, to in specialist_results)}

    findings_text = "\n".join(f"{k}: {v}" for k, v in review_parts.items())
    challenge_out = await stage(
        "challenge", REVIEWER_SYS,
        f"Question: {question}\n\nFindings:\n{findings_text}\n\n"
        "Challenge unsupported claims or missing qualifiers.",
    )
    synthesis_out = await stage(
        "synthesis", PRINCIPAL_SYS,
        f"Question: {question}\n\nFindings: {findings_text[:300]}\n"
        f"Reviewer notes: {challenge_out[:200]}\n\nDraft the answer.",
        250,
    )
    await stage(
        "verdict", PRINCIPAL_SYS,
        f"Question: {question}\n\nDraft: {synthesis_out[:400]}\n\nFinalise the answer with citations.",
    )
    return _with_outputs(_m, _s)


# ── CLAUDE AGENT SDK ─────────────────────────────────────────────────────────
def _claude_cli_path() -> str | None:
    cli_path = shutil.which("claude")
    if cli_path:
        return cli_path
    local_cli = ROOT / "node_modules" / ".bin" / "claude"
    if local_cli.exists():
        return str(local_cli)
    return None


def _ensure_claude_cli_ready() -> str:
    cli_path = _claude_cli_path()
    if not cli_path:
        raise RuntimeError(
            "Claude Code CLI not found. Install @anthropic-ai/claude-code before running claude-agent-sdk."
        )

    probe = subprocess.run(
        [cli_path, "-p", "Say ok", "--output-format", "json"],
        cwd=ROOT,
        capture_output=True,
        text=True,
        timeout=20,
        check=False,
    )
    combined = "\n".join(part for part in [probe.stdout, probe.stderr] if part)
    if "Not logged in" in combined:
        raise RuntimeError("Claude Code CLI is installed but not logged in; run `claude /login`.")
    if probe.returncode != 0:
        raise RuntimeError(f"Claude Code CLI preflight failed: {combined.strip() or probe.returncode}")
    return cli_path


def _claude_usage_counts(usage: object) -> tuple[int, int]:
    """Best-effort extraction from Claude SDK usage/model_usage payloads."""
    if not isinstance(usage, dict):
        return 0, 0

    tokens_in = 0
    tokens_out = 0
    for key, value in usage.items():
        if isinstance(value, dict):
            nested_in, nested_out = _claude_usage_counts(value)
            tokens_in += nested_in
            tokens_out += nested_out
            continue
        if not isinstance(value, int):
            continue
        if key in {
            "input_tokens",
            "inputTokens",
            "cache_creation_input_tokens",
            "cache_read_input_tokens",
            "cacheCreationInputTokens",
            "cacheReadInputTokens",
        }:
            tokens_in += value
        elif key in {"output_tokens", "outputTokens"}:
            tokens_out += value
    return tokens_in, tokens_out


async def run_claude_agent_sdk(question: str) -> dict:
    _m: dict = {}
    outputs: dict[str, str] = {}
    cli_path = _ensure_claude_cli_ready()

    async def claude_call(prompt: str) -> tuple[str, dict]:
        # Bounded real Claude Code call. The Claude Agent SDK uses this same CLI
        # runtime, but its streaming transport can hang on long prompts in this
        # local environment; JSON mode keeps the harness measurable and honest.
        metrics = {"time_ms": 0, "tokens_in": 0, "tokens_out": 0}
        total_usd = 0.0
        saw_usd = False

        for attempt in range(2):
            stage_prompt = prompt
            if attempt:
                stage_prompt = (
                    f"{prompt}\n\n"
                    "The previous completed SDK call returned an empty text payload. "
                    "Return a non-empty answer in concise prose."
                )
            t = time.perf_counter()
            completed = await asyncio.to_thread(
                subprocess.run,
                [
                    cli_path,
                    "-p",
                    stage_prompt,
                    "--output-format",
                    "json",
                    "--model",
                    CLAUDE_MODEL,
                    "--max-turns",
                    "1",
                    "--permission-mode",
                    "dontAsk",
                ],
                cwd=ROOT,
                capture_output=True,
                text=True,
                timeout=180,
                check=False,
            )
            if completed.returncode != 0:
                raise RuntimeError((completed.stderr or completed.stdout or str(completed.returncode)).strip())

            result = json.loads(completed.stdout)
            if result.get("is_error"):
                raise RuntimeError(result.get("result") or "Claude Code returned an error result")

            usage = result.get("usage") or result.get("modelUsage") or {}
            ti, to = _claude_usage_counts(usage)
            metrics["time_ms"] += result.get("duration_ms") or int((time.perf_counter() - t) * 1000)
            metrics["tokens_in"] += ti
            metrics["tokens_out"] += to
            if result.get("total_cost_usd") is not None:
                saw_usd = True
                total_usd += result["total_cost_usd"]

            text_out = (result.get("result") or "").strip()
            if text_out or attempt == 1:
                if saw_usd:
                    metrics["usd"] = round(total_usd, 7)
                return text_out, metrics

        return "", metrics

    async def stage(name: str, prompt: str) -> str:
        text, metrics = await claude_call(prompt)
        _m[name] = metrics
        outputs[name] = text
        return outputs[name]

    intake_out = await stage(
        "intake",
        f"Question: {question}\n\nPolicy:\n{POLICY_CORPUS}\n\n"
        "Identify the relevant clauses and assign compliance, security, legal, and finance specialist review tasks.",
    )

    async def specialist_review(role: str, instructions: str) -> tuple[str, str, dict]:
        text, metrics = await claude_call(
            f"{instructions}\n\nQuestion: {question}\n\nPolicy:\n{POLICY_CORPUS}\n\n"
            f"Intake context: {intake_out[:600]}\n\n"
            "Return one compact specialist finding with clause ids and a confidence note."
        )
        return role, text, metrics

    t_review = time.perf_counter()
    specialist_results = await asyncio.gather(
        *[
            specialist_review(role, instructions)
            for role, instructions in SPECIALIST_ROLES.items()
        ]
    )
    review_out = "\n\n".join(f"{role}: {text}" for role, text, _metrics in specialist_results)
    review_metrics = [metrics for _role, _text, metrics in specialist_results]
    _m["review"] = {
        "time_ms": int((time.perf_counter() - t_review) * 1000),
        "tokens_in": sum(metric.get("tokens_in", 0) for metric in review_metrics),
        "tokens_out": sum(metric.get("tokens_out", 0) for metric in review_metrics),
    }
    if all("usd" in metric for metric in review_metrics):
        _m["review"]["usd"] = round(sum(metric["usd"] for metric in review_metrics), 7)
    outputs["review"] = review_out

    challenge_out = await stage(
        "challenge",
        f"Question: {question}\n\nPolicy:\n{POLICY_CORPUS}\n\nSpecialist findings:\n{review_out[:1200]}\n\n"
        "Reviewer: challenge unsupported claims, missing qualifiers, or missing clause citations.",
    )

    synthesis_out = await stage(
        "synthesis",
        f"Question: {question}\n\nFindings:\n{review_out[:900]}\n\n"
        f"Reviewer notes:\n{challenge_out[:600]}\n\n"
        "Principal: draft a concise answer that preserves caveats and cites clauses.",
    )

    await stage(
        "verdict",
        f"Question: {question}\n\nDraft answer:\n{synthesis_out[:900]}\n\n"
        "Return the final answer with cited policy clauses and confidence.",
    )

    return _with_outputs(_m, outputs)


# ── AG2 (autogen-agentchat) ───────────────────────────────────────────────────
async def run_ag2(question: str) -> dict:
    from autogen_ext.models.openai import OpenAIChatCompletionClient
    from autogen_core.models import SystemMessage, UserMessage
    from autogen_core import CancellationToken

    api_key = os.getenv("OPENAI_API_KEY", "")
    _m: dict = {}
    _s: dict = {}

    model_client = OpenAIChatCompletionClient(model=MODEL, api_key=api_key)

    async def ag2_call(system: str, user: str, max_tokens: int = 200) -> tuple[str, int, int]:
        result = await model_client.create(
            messages=[
                SystemMessage(content=system, source="system"),
                UserMessage(content=user, source="user"),
            ],
            cancellation_token=CancellationToken(),
            extra_create_args={"max_tokens": max_tokens},
        )
        content = result.content if isinstance(result.content, str) else str(result.content)
        return content, result.usage.prompt_tokens, result.usage.completion_tokens

    # Intake: principal starts conversation
    t = time.perf_counter()
    intake_text, ti, to = await ag2_call(
        PRINCIPAL_SYS,
        f"Question: {question}\n\nPolicy:\n{POLICY_CORPUS}\n\n"
        "Start the compliance analysis. Identify relevant clauses.",
    )
    _m["intake"] = {"time_ms": int((time.perf_counter() - t) * 1000), "tokens_in": ti, "tokens_out": to}
    _s["intake"] = intake_text

    # Review: specialists debate in a round-robin mesh
    t = time.perf_counter()
    ti_total = to_total = 0
    review_parts: dict[str, str] = {}
    context = intake_text[:300]
    for role, sys_p in SPECIALIST_ROLES.items():
        text, ti, to = await ag2_call(
            sys_p,
            f"Debate context: {context}\n\nQuestion: {question}\n\n"
            "Contribute your specialist perspective (2-3 sentences).",
            150,
        )
        review_parts[role] = text
        ti_total += ti
        to_total += to
        context = text[:200]  # mesh: each agent builds on the last
    _m["review"] = {"time_ms": int((time.perf_counter() - t) * 1000),
                    "tokens_in": ti_total, "tokens_out": to_total}
    _s["review"] = review_parts

    # Challenge: reviewer injects rebuttal into conversation
    t = time.perf_counter()
    findings_text = "\n".join(f"{k}: {v}" for k, v in review_parts.items())
    # Reviewer challenges each specialist
    ti_total = to_total = 0
    challenge_parts: list[str] = []
    for role, finding in review_parts.items():
        text, ti, to = await ag2_call(
            REVIEWER_SYS,
            f"Challenge this {role} finding: {finding}\n\n"
            f"Question context: {question}",
            120,
        )
        challenge_parts.append(text)
        ti_total += ti
        to_total += to
    _m["challenge"] = {"time_ms": int((time.perf_counter() - t) * 1000),
                       "tokens_in": ti_total, "tokens_out": to_total}
    _s["challenge"] = challenge_parts

    # Synthesis: specialists converge to principal
    t = time.perf_counter()
    challenge_summary = " | ".join(challenge_parts)[:300]
    synthesis_text, ti, to = await ag2_call(
        PRINCIPAL_SYS,
        f"Council has converged. Merge these findings:\n{findings_text[:300]}\n"
        f"Reviewer challenges: {challenge_summary}\n\n"
        f"Question: {question}\n\nSynthesize a draft answer.",
        250,
    )
    _m["synthesis"] = {"time_ms": int((time.perf_counter() - t) * 1000), "tokens_in": ti, "tokens_out": to}
    _s["synthesis"] = synthesis_text

    # Verdict: closing turn
    t = time.perf_counter()
    verdict_text, ti, to = await ag2_call(
        PRINCIPAL_SYS,
        f"Draft answer: {synthesis_text[:400]}\n\n"
        f"Question: {question}\n\nPublish the final answer with citations.",
    )
    _m["verdict"] = {"time_ms": int((time.perf_counter() - t) * 1000), "tokens_in": ti, "tokens_out": to}
    _s["verdict"] = verdict_text

    await model_client.close()
    return _with_outputs(_m, _s)


# ── CREWAI ───────────────────────────────────────────────────────────────────
async def run_crewai(question: str) -> dict:
    from crewai import Agent, Crew, LLM, Process, Task

    os.environ.setdefault("CREWAI_TRACING_ENABLED", "false")
    _m: dict = {}
    _s: dict = {}

    async def crew_stage(
        name: str,
        role: str,
        goal: str,
        backstory: str,
        description: str,
        expected_output: str,
        max_tokens: int = 200,
    ) -> str:
        llm = LLM(
            model=f"openai/{MODEL}",
            api_key=os.getenv("OPENAI_API_KEY"),
            temperature=0,
            max_tokens=max_tokens,
        )
        agent = Agent(
            role=role,
            goal=goal,
            backstory=backstory,
            llm=llm,
            verbose=False,
            allow_delegation=False,
            max_iter=1,
        )
        task = Task(
            description=description,
            expected_output=expected_output,
            agent=agent,
        )
        crew = Crew(
            agents=[agent],
            tasks=[task],
            process=Process.sequential,
            verbose=False,
            tracing=False,
        )

        t = time.perf_counter()
        output = await asyncio.to_thread(crew.kickoff)
        elapsed = int((time.perf_counter() - t) * 1000)
        usage = (
            getattr(crew, "usage_metrics", None)
            or getattr(crew, "token_usage", None)
            or getattr(output, "token_usage", None)
        )
        ti, to = _usage_counts(usage)
        _m[name] = {"time_ms": elapsed, "tokens_in": ti, "tokens_out": to}
        text = str(output)
        _s[name] = text
        return text

    intake_out = await crew_stage(
        "intake",
        "Principal policy orchestrator",
        "Assign evidence-grounded specialist work for a policy compliance question.",
        "You manage a compact CrewAI policy review and preserve clause evidence.",
        f"Question: {question}\n\nPolicy:\n{POLICY_CORPUS}\n\n"
        "Identify relevant clauses and assign compliance, security, legal, and finance review tasks.",
        "Relevant clauses and four compact specialist task briefs.",
    )

    async def specialist_review(role: str, instructions: str) -> tuple[str, str, dict]:
        text = await crew_stage(
            f"review_{role}",
            f"{role.title()} specialist",
            "Return one evidence-grounded specialist finding.",
            instructions,
            f"Question: {question}\n\nPolicy:\n{POLICY_CORPUS}\n\n"
            f"Intake context: {intake_out[:600]}\n\n"
            "Give one compact specialist finding with clause ids and caveats.",
            "One specialist finding with clause ids.",
            150,
        )
        metrics = _m.pop(f"review_{role}")
        return role, text, metrics

    t_review = time.perf_counter()
    specialist_results = await asyncio.gather(
        *[
            specialist_review(role, instructions)
            for role, instructions in SPECIALIST_ROLES.items()
        ]
    )
    review_out = "\n\n".join(f"{role}: {text}" for role, text, _metrics in specialist_results)
    review_metrics = [metrics for _role, _text, metrics in specialist_results]
    _s["review"] = {role: text for role, text, _metrics in specialist_results}
    _m["review"] = {
        "time_ms": int((time.perf_counter() - t_review) * 1000),
        "tokens_in": sum(metric.get("tokens_in", 0) for metric in review_metrics),
        "tokens_out": sum(metric.get("tokens_out", 0) for metric in review_metrics),
    }

    challenge_out = await crew_stage(
        "challenge",
        "Reviewer checkpoint",
        "Challenge unsupported or over-broad specialist conclusions.",
        REVIEWER_SYS,
        f"Question: {question}\n\nPolicy:\n{POLICY_CORPUS}\n\nSpecialist findings:\n{review_out[:1200]}\n\n"
        "List unsupported claims, missing caveats, or missing clause citations.",
        "Reviewer notes with required fixes.",
    )

    synthesis_out = await crew_stage(
        "synthesis",
        "Crew manager",
        "Merge specialist findings and reviewer notes into a concise draft.",
        PRINCIPAL_SYS,
        f"Question: {question}\n\nFindings:\n{review_out[:900]}\n\n"
        f"Reviewer notes:\n{challenge_out[:600]}\n\nDraft a concise answer.",
        "Draft answer with caveats and citations.",
        250,
    )

    await crew_stage(
        "verdict",
        "Principal decision agent",
        "Publish the final policy answer.",
        PRINCIPAL_SYS,
        f"Question: {question}\n\nDraft answer:\n{synthesis_out[:900]}\n\n"
        "Return the final answer with cited policy clauses and confidence.",
        "Final answer with clause citations.",
    )
    return _with_outputs(_m, _s)


# ── SEMANTIC KERNEL ───────────────────────────────────────────────────────────
async def run_semantic_kernel(question: str) -> dict:
    from pydantic import PrivateAttr
    from semantic_kernel.agents import ChatCompletionAgent
    from semantic_kernel.connectors.ai.chat_completion_client_base import ChatCompletionClientBase
    from semantic_kernel.connectors.ai.prompt_execution_settings import PromptExecutionSettings
    from semantic_kernel.contents import ChatMessageContent
    from semantic_kernel.contents.utils.author_role import AuthorRole
    from semantic_kernel.functions import KernelArguments

    class OpenAIKernelChatService(ChatCompletionClientBase):
        _client: AsyncOpenAI = PrivateAttr()
        _max_tokens: int = PrivateAttr(default=200)
        _last_usage: dict = PrivateAttr(default_factory=dict)

        def __init__(self, *, max_tokens: int = 200) -> None:
            super().__init__(ai_model_id=MODEL, service_id="openai-policy")
            self._client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY", ""))
            self._max_tokens = max_tokens
            self._last_usage = {}

        @property
        def last_usage(self) -> dict:
            return self._last_usage

        async def _inner_get_chat_message_contents(
            self,
            chat_history,
            settings: PromptExecutionSettings,
        ) -> list[ChatMessageContent]:
            messages = []
            for message in chat_history.messages:
                role = getattr(message.role, "value", str(message.role)).lower()
                if role not in {"system", "user", "assistant"}:
                    continue
                content = message.content or ""
                if content:
                    messages.append({"role": role, "content": content})

            result = await self._client.chat.completions.create(
                model=self.ai_model_id,
                messages=messages,
                max_tokens=self._max_tokens,
            )
            content = result.choices[0].message.content or ""
            self._last_usage = {
                "prompt_tokens": result.usage.prompt_tokens if result.usage else 0,
                "completion_tokens": result.usage.completion_tokens if result.usage else 0,
            }
            return [
                ChatMessageContent(
                    role=AuthorRole.ASSISTANT,
                    content=content,
                    metadata={"usage": self._last_usage},
                    ai_model_id=self.ai_model_id,
                )
            ]

    _m: dict = {}
    _s: dict = {}

    async def sk_stage(name: str, instructions: str, prompt: str, max_tokens: int = 200) -> str:
        service = OpenAIKernelChatService(max_tokens=max_tokens)
        agent = ChatCompletionAgent(
            name=name.replace("-", "_"),
            instructions=instructions,
            service=service,
        )
        t = time.perf_counter()
        response = await agent.get_response(
            messages=prompt,
            arguments=KernelArguments(
                settings=PromptExecutionSettings(service_id="openai-policy")
            ),
        )
        elapsed = int((time.perf_counter() - t) * 1000)
        ti, to = _usage_counts(service.last_usage)
        _m[name] = {"time_ms": elapsed, "tokens_in": ti, "tokens_out": to}
        text = str(response.content or response)
        _s[name] = text
        return text

    intake_out = await sk_stage(
        "intake",
        PRINCIPAL_SYS,
        f"Question: {question}\n\nPolicy:\n{POLICY_CORPUS}\n\n"
        "Open a governed Semantic Kernel case and identify relevant clauses plus specialist work.",
    )

    async def specialist_review(role: str, instructions: str) -> tuple[str, str, dict]:
        text = await sk_stage(
            f"review_{role}",
            instructions,
            f"Question: {question}\n\nPolicy:\n{POLICY_CORPUS}\n\n"
            f"Governed intake context: {intake_out[:600]}\n\n"
            "Return one specialist finding with clause ids and a caveat.",
            150,
        )
        metrics = _m.pop(f"review_{role}")
        return role, text, metrics

    t_review = time.perf_counter()
    specialist_results = await asyncio.gather(
        *[
            specialist_review(role, instructions)
            for role, instructions in SPECIALIST_ROLES.items()
        ]
    )
    review_out = "\n\n".join(f"{role}: {text}" for role, text, _metrics in specialist_results)
    review_metrics = [metrics for _role, _text, metrics in specialist_results]
    _s["review"] = {role: text for role, text, _metrics in specialist_results}
    _m["review"] = {
        "time_ms": int((time.perf_counter() - t_review) * 1000),
        "tokens_in": sum(metric.get("tokens_in", 0) for metric in review_metrics),
        "tokens_out": sum(metric.get("tokens_out", 0) for metric in review_metrics),
    }

    challenge_out = await sk_stage(
        "challenge",
        REVIEWER_SYS,
        f"Question: {question}\n\nSpecialist findings:\n{review_out[:1200]}\n\n"
        "Run the governance gate: identify unsupported claims, missing caveats, or missing clause ids.",
    )

    synthesis_out = await sk_stage(
        "synthesis",
        PRINCIPAL_SYS,
        f"Question: {question}\n\nFindings:\n{review_out[:900]}\n\n"
        f"Governance notes:\n{challenge_out[:600]}\n\n"
        "Assemble an approved draft answer.",
        250,
    )

    await sk_stage(
        "verdict",
        PRINCIPAL_SYS,
        f"Question: {question}\n\nApproved draft:\n{synthesis_out[:900]}\n\n"
        "Return the final governed answer with cited policy clauses and confidence.",
    )
    return _with_outputs(_m, _s)


# ── LlamaIndex event types at module level (required for @step annotation resolution) ──
class _LIIntakeEvent(Event):
    intake: str

class _LIReviewEvent(Event):
    review: dict

class _LIChallengeEvent(Event):
    challenge: str

class _LISynthesisEvent(Event):
    synthesis: str


# ── LLAMAINDEX WORKFLOW ───────────────────────────────────────────────────────
async def run_llamaindex(question: str) -> dict:
    client = AsyncOpenAI()
    _m: dict = {}

    # Capture question/client in closures via a mutable container
    _state: dict = {"question": question, "client": client, "m": _m, "s": {}}

    class PolicyWorkflow(Workflow):
        @step
        async def intake(self, ctx: LIContext, ev: StartEvent) -> _LIIntakeEvent:
            t = time.perf_counter()
            text, ti, to = await _call(
                _state["client"], PRINCIPAL_SYS,
                f"Intake event for question: {_state['question']}\n\nPolicy:\n{POLICY_CORPUS}\n\n"
                "Emit which clauses are relevant for specialist review.",
            )
            _state["m"]["intake"] = {"time_ms": int((time.perf_counter() - t) * 1000),
                                     "tokens_in": ti, "tokens_out": to}
            _state["s"]["intake"] = text
            return _LIIntakeEvent(intake=text)

        @step
        async def review(self, ctx: LIContext, ev: _LIIntakeEvent) -> _LIReviewEvent:
            t = time.perf_counter()
            prompt = (
                f"Evidence event - Question: {_state['question']}\n"
                f"Intake context: {ev.intake[:300]}\n\n"
                "Write your specialist evidence (2-3 sentences)."
            )
            results = await asyncio.gather(
                *[_call(_state["client"], sys_p, prompt, 150) for sys_p in SPECIALIST_ROLES.values()]
            )
            _state["m"]["review"] = {
                "time_ms": int((time.perf_counter() - t) * 1000),
                "tokens_in": sum(r[1] for r in results),
                "tokens_out": sum(r[2] for r in results),
            }
            review_data = {k: r[0] for k, r in zip(SPECIALIST_ROLES, results)}
            _state["s"]["review"] = review_data
            await ctx.store.set("review_data", review_data)
            return _LIReviewEvent(review=review_data)

        @step
        async def challenge(self, ctx: LIContext, ev: _LIReviewEvent) -> _LIChallengeEvent:
            t = time.perf_counter()
            findings_text = "\n".join(f"{k}: {v}" for k, v in ev.review.items())
            text, ti, to = await _call(
                _state["client"], REVIEWER_SYS,
                f"Follow-up event for question: {_state['question']}\n\n"
                f"Evidence gathered:\n{findings_text}\n\n"
                "Emit any gaps or unsupported payloads.",
            )
            _state["m"]["challenge"] = {"time_ms": int((time.perf_counter() - t) * 1000),
                                        "tokens_in": ti, "tokens_out": to}
            _state["s"]["challenge"] = text
            return _LIChallengeEvent(challenge=text)

        @step
        async def synthesis(self, ctx: LIContext, ev: _LIChallengeEvent) -> _LISynthesisEvent:
            t = time.perf_counter()
            review_data = await ctx.store.get("review_data") or {}
            findings_text = "\n".join(f"{k}: {v}" for k, v in review_data.items())
            text, ti, to = await _call(
                _state["client"], PRINCIPAL_SYS,
                f"Aggregator event - Question: {_state['question']}\n\n"
                f"Evidence: {findings_text[:300]}\n"
                f"Reviewer gaps: {ev.challenge[:200]}\n\n"
                "Aggregate and draft the answer.",
                250,
            )
            _state["m"]["synthesis"] = {"time_ms": int((time.perf_counter() - t) * 1000),
                                        "tokens_in": ti, "tokens_out": to}
            _state["s"]["synthesis"] = text
            return _LISynthesisEvent(synthesis=text)

        @step
        async def verdict(self, ctx: LIContext, ev: _LISynthesisEvent) -> StopEvent:
            t = time.perf_counter()
            text, ti, to = await _call(
                _state["client"], PRINCIPAL_SYS,
                f"Terminal event - Question: {_state['question']}\n\n"
                f"Draft: {ev.synthesis[:400]}\n\n"
                "Emit final answer with citations.",
            )
            _state["m"]["verdict"] = {"time_ms": int((time.perf_counter() - t) * 1000),
                                      "tokens_in": ti, "tokens_out": to}
            _state["s"]["verdict"] = text
            return StopEvent(result=text)

    wf = PolicyWorkflow(timeout=120)
    await wf.run()
    return _with_outputs(_m, _state["s"])


# ── PYDANTIC AI ───────────────────────────────────────────────────────────────
async def run_pydanticai(question: str) -> dict:
    from pydantic_ai import Agent
    from pydantic_ai.models.openai import OpenAIChatModel as OpenAIModel
    from pydantic_ai.providers.openai import OpenAIProvider

    provider = OpenAIProvider(api_key=os.getenv("OPENAI_API_KEY", ""))
    _m: dict = {}
    _s: dict = {}

    async def pai_stage(name: str, system: str, prompt: str, max_out: int = 200) -> str:
        model = OpenAIModel(MODEL, provider=provider)
        agent = Agent(model=model, system_prompt=system)
        t = time.perf_counter()
        result = await agent.run(prompt)
        elapsed = int((time.perf_counter() - t) * 1000)
        usage = result.usage()
        _m[name] = {
            "time_ms": elapsed,
            "tokens_in": usage.input_tokens or 0,
            "tokens_out": usage.output_tokens or 0,
        }
        _s[name] = result.output
        return result.output

    intake_out = await pai_stage(
        "intake", PRINCIPAL_SYS,
        f"Question: {question}\n\nPolicy:\n{POLICY_CORPUS}\n\n"
        "Identify relevant clauses and outline specialist tasks.",
    )

    t = time.perf_counter()
    ti_total = to_total = 0
    review_parts: dict[str, str] = {}
    for role, sys_p in SPECIALIST_ROLES.items():
        model = OpenAIModel(MODEL, provider=provider)
        agent = Agent(model=model, system_prompt=sys_p)
        result = await agent.run(
            f"Intake context: {intake_out[:300]}\n\nQuestion: {question}\n\n"
            "Return your validated specialist finding.",
        )
        review_parts[role] = result.output
        u = result.usage()
        ti_total += u.input_tokens or 0
        to_total += u.output_tokens or 0
    _s["review"] = review_parts
    _m["review"] = {"time_ms": int((time.perf_counter() - t) * 1000),
                    "tokens_in": ti_total, "tokens_out": to_total}

    findings_text = "\n".join(f"{k}: {v}" for k, v in review_parts.items())
    challenge_out = await pai_stage(
        "challenge", REVIEWER_SYS,
        f"Question: {question}\n\nFindings:\n{findings_text}\n\n"
        "Validate findings. Reject if any caveat is missing.",
    )
    synthesis_out = await pai_stage(
        "synthesis", PRINCIPAL_SYS,
        f"Question: {question}\n\nFindings: {findings_text[:300]}\n"
        f"Reviewer notes: {challenge_out[:200]}\n\nCompose the validated draft answer.",
        250,
    )
    await pai_stage(
        "verdict", PRINCIPAL_SYS,
        f"Question: {question}\n\nDraft: {synthesis_out[:400]}\n\n"
        "Emit final typed answer with citation fields.",
    )
    return _with_outputs(_m, _s)


# ── ORCHESTRATION ─────────────────────────────────────────────────────────────
HARNESSES: dict[str, object] = {
    "langgraph": run_langgraph,
    "openai-agents": run_openai_agents,
    "claude-agent-sdk": run_claude_agent_sdk,
    "ag2": run_ag2,
    "crewai": run_crewai,
    "semantic-kernel": run_semantic_kernel,
    "llamaindex": run_llamaindex,
    "pydanticai": run_pydanticai,
}

STAGES = ["intake", "review", "challenge", "synthesis", "verdict"]


def fmt(metrics: dict) -> dict:
    """Normalise stage metrics into the generate_traces schema."""
    out: dict = {}
    outputs = metrics.get("__outputs__", {}) if isinstance(metrics, dict) else {}
    for stage in STAGES:
        if stage not in metrics:
            out[stage] = {"time_ms": 0, "tokens_in": 0, "tokens_out": 0, "usd": 0.0}
            continue
        m = metrics[stage]
        ti, to = m.get("tokens_in", 0), m.get("tokens_out", 0)
        out[stage] = {
            "time_ms": m.get("time_ms", 0),
            "tokens_in": ti,
            "tokens_out": to,
            "usd": m.get("usd", usd(ti, to)),
        }
        if stage in outputs:
            out[stage]["output"] = outputs[stage]
    return out


async def run_framework(fw_id: str, fn, question_id: str, question: str) -> dict:
    print(f"  [{fw_id}] {question_id} ... ", end="", flush=True)
    try:
        metrics = await fn(question)
        print("ok")
        return fmt(metrics)
    except Exception as exc:  # noqa: BLE001
        print(f"FAILED: {exc}")
        return {"__error__": str(exc)}


async def main(only: list[str] | None = None) -> None:
    # Load existing metrics so we can merge (preserves completed frameworks)
    existing: dict = {}
    if REAL_METRICS_PATH.exists():
        existing = json.loads(REAL_METRICS_PATH.read_text(encoding="utf-8"))

    payload: dict = {
        "execution_mode": "real-sdk-calls",
        "model": MODEL,
        "models": {"openai": MODEL, "claude-agent-sdk": CLAUDE_MODEL},
        "questions": existing.get("questions", {}),
        "failures": existing.get("failures", {}),
    }

    for q_id, question in QUESTIONS.items():
        payload["questions"].setdefault(q_id, {}).setdefault("frameworks", {})
        run_set = only if only else list(HARNESSES.keys())
        print(f"\n── Question: {q_id} ──")
        for fw_id in run_set:
            fn = HARNESSES[fw_id]
            result = await run_framework(fw_id, fn, q_id, question)
            if result and "__error__" in result:
                payload["failures"].setdefault(q_id, {})[fw_id] = result["__error__"]
            elif result:  # only overwrite on success
                payload["questions"][q_id]["frameworks"][fw_id] = result
                payload["failures"].setdefault(q_id, {}).pop(fw_id, None)

    REAL_METRICS_PATH.parent.mkdir(exist_ok=True)
    REAL_METRICS_PATH.write_text(json.dumps(payload, indent=2) + "\n", encoding="utf-8")
    print(f"\nWrote {REAL_METRICS_PATH}")


if __name__ == "__main__":
    import sys
    only_arg = sys.argv[1:] or None  # e.g. python run_real_harnesses.py llamaindex
    asyncio.run(main(only=only_arg))
