#!/usr/bin/env python3
from __future__ import annotations

import json
from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent
TRACE_DIR = ROOT / "traces"
TRACE_PATH = TRACE_DIR / "framework_traces.json"
REAL_METRICS_PATH = TRACE_DIR / "real_metrics.json"
MASTRA_METRICS_PATH = TRACE_DIR / "mastra_metrics.json"

# Load real metrics if available (produced by scripts/run_real_harnesses.py)
_real: dict = {}
if REAL_METRICS_PATH.exists():
    _real = json.loads(REAL_METRICS_PATH.read_text(encoding="utf-8"))

# Merge Mastra metrics (produced by scripts/run_mastra_harness.mjs)
if MASTRA_METRICS_PATH.exists():
    _mastra = json.loads(MASTRA_METRICS_PATH.read_text(encoding="utf-8"))
    for q_id, fw_data in _mastra.get("questions", {}).items():
        _real.setdefault("questions", {}).setdefault(q_id, {}).setdefault("frameworks", {})["mastra"] = fw_data


QUESTIONS = {
    "retention": {
        "prompt": "Can GitHub retain personal data after an account is closed, and under what conditions?",
        "answer": "Yes. The policy says retention can continue where needed for contracts, legal requirements, disputes, or enforcing agreements, and the duration depends on purpose.",
        "clauses": ["retention", "rights"],
    },
    "sharing": {
        "prompt": "When may GitHub share personal data with third parties, affiliates, or public authorities?",
        "answer": "The policy allows sharing with affiliates, organization accounts, competent authorities, abuse and fraud prevention entities, and third-party applications when instructed by the user.",
        "clauses": ["sharing", "transfers", "private_repos"],
    },
    "rights": {
        "prompt": "What rights do users in the EEA, UK, and some US states have over their personal data under this policy?",
        "answer": "The policy lists access, correction, deletion or erasure in some cases, objection, consent withdrawal, portability, and state-specific rights such as deletion and appeal pathways.",
        "clauses": ["rights", "retention", "sharing"],
    },
}

QUESTION_METRIC_FACTORS = {
    "retention": {"time_ms": 1.00, "tokens_in": 1.00, "tokens_out": 1.00},
    "sharing": {"time_ms": 1.12, "tokens_in": 1.06, "tokens_out": 1.08},
    "rights": {"time_ms": 1.24, "tokens_in": 1.14, "tokens_out": 1.12},
}

STAGE_TIME_VARIANCE = {
    "intake": 0.94,
    "review": 1.08,
    "challenge": 1.03,
    "synthesis": 0.90,
    "verdict": 0.96,
}


FRAMEWORKS = {
    "langgraph": {
        "runtime": "python-harness:graph",
        "state_container": "shared_graph_state",
        "links": {
            "intake": ["principal-compliance", "principal-security"],
            "review": ["principal-compliance", "principal-security", "principal-legal", "principal-finance"],
            "challenge": ["compliance-reviewer", "security-reviewer", "legal-reviewer", "finance-reviewer"],
            "synthesis": ["reviewer-principal"],
            "verdict": ["principal-decision"],
        },
        "metrics": {
            "time_ms": {"intake": 3900, "review": 3500, "challenge": 4300, "synthesis": 2200, "verdict": 3200},
            "tokens_in": {"intake": 430, "review": 1320, "challenge": 880, "synthesis": 640, "verdict": 320},
            "tokens_out": {"intake": 65, "review": 240, "challenge": 170, "synthesis": 210, "verdict": 170},
        },
        "confidence": 0.89,
        "cost_multiplier": 0.0000034,
    },
    "openai-agents": {
        "runtime": "python-harness:handoff",
        "state_container": "run_context",
        "links": {
            "intake": ["principal-compliance"],
            "review": ["principal-compliance", "principal-security", "principal-legal", "principal-finance"],
            "challenge": ["compliance-reviewer", "security-reviewer", "legal-reviewer", "finance-reviewer"],
            "synthesis": ["reviewer-principal"],
            "verdict": ["principal-decision"],
        },
        "metrics": {
            "time_ms": {"intake": 9600, "review": 34500, "challenge": 17000, "synthesis": 4200, "verdict": 4700},
            "tokens_in": {"intake": 390, "review": 1410, "challenge": 610, "synthesis": 540, "verdict": 290},
            "tokens_out": {"intake": 60, "review": 230, "challenge": 135, "synthesis": 190, "verdict": 150},
        },
        "confidence": 0.81,
        "cost_multiplier": 0.0000032,
    },
    "claude-agent-sdk": {
        "runtime": "python-harness:parallel-claude-calls",
        "state_container": "parallel_claude_calls",
        "links": {
            "intake": ["principal-compliance", "principal-security"],
            "review": ["principal-compliance", "principal-security", "principal-legal", "principal-finance"],
            "challenge": ["compliance-reviewer", "security-reviewer", "legal-reviewer", "finance-reviewer"],
            "synthesis": ["reviewer-principal"],
            "verdict": ["principal-decision"],
        },
        "metrics": {
            "time_ms": {"intake": 7800, "review": 19500, "challenge": 9300, "synthesis": 4800, "verdict": 5200},
            "tokens_in": {"intake": 470, "review": 1480, "challenge": 760, "synthesis": 620, "verdict": 340},
            "tokens_out": {"intake": 70, "review": 260, "challenge": 155, "synthesis": 205, "verdict": 168},
        },
        "confidence": 0.87,
        "cost_multiplier": 0.0000036,
    },
    "ag2": {
        "runtime": "python-harness:conversation",
        "state_container": "chat_transcript",
        "links": {
            "intake": ["principal-compliance", "principal-security"],
            "review": ["compliance-security", "security-legal", "legal-finance", "finance-compliance"],
            "challenge": ["reviewer-compliance", "reviewer-security", "reviewer-legal", "reviewer-finance"],
            "synthesis": ["security-principal", "legal-principal", "finance-principal"],
            "verdict": ["principal-decision", "reviewer-decision"],
        },
        "metrics": {
            "time_ms": {"intake": 4100, "review": 9900, "challenge": 11200, "synthesis": 3200, "verdict": 3900},
            "tokens_in": {"intake": 520, "review": 1920, "challenge": 1180, "synthesis": 830, "verdict": 360},
            "tokens_out": {"intake": 75, "review": 310, "challenge": 240, "synthesis": 260, "verdict": 190},
        },
        "confidence": 0.73,
        "cost_multiplier": 0.0000041,
    },
    "crewai": {
        "runtime": "python-harness:crew",
        "state_container": "task_outputs",
        "links": {
            "intake": ["principal-compliance", "principal-legal"],
            "review": ["principal-compliance", "principal-security", "principal-legal", "principal-finance"],
            "challenge": ["compliance-reviewer", "security-reviewer", "legal-reviewer", "finance-reviewer"],
            "synthesis": ["reviewer-principal"],
            "verdict": ["principal-decision"],
        },
        "metrics": {
            "time_ms": {"intake": 5200, "review": 22000, "challenge": 9800, "synthesis": 4800, "verdict": 3900},
            "tokens_in": {"intake": 410, "review": 1240, "challenge": 780, "synthesis": 560, "verdict": 310},
            "tokens_out": {"intake": 58, "review": 210, "challenge": 150, "synthesis": 185, "verdict": 160},
        },
        "confidence": 0.8,
        "cost_multiplier": 0.0000031,
    },
    "semantic-kernel": {
        "runtime": "python-harness:governed",
        "state_container": "governed_case",
        "links": {
            "intake": ["principal-compliance", "principal-security"],
            "review": ["principal-compliance", "principal-security", "principal-legal", "principal-finance"],
            "challenge": ["reviewer-security", "reviewer-legal"],
            "synthesis": ["reviewer-principal"],
            "verdict": ["principal-decision"],
        },
        "metrics": {
            "time_ms": {"intake": 4800, "review": 12500, "challenge": 6800, "synthesis": 4300, "verdict": 3600},
            "tokens_in": {"intake": 430, "review": 1280, "challenge": 640, "synthesis": 590, "verdict": 300},
            "tokens_out": {"intake": 62, "review": 220, "challenge": 140, "synthesis": 180, "verdict": 155},
        },
        "confidence": 0.86,
        "cost_multiplier": 0.0000035,
    },
    "llamaindex": {
        "runtime": "python-harness:event-workflow",
        "state_container": "event_payload",
        "links": {
            "intake": ["principal-compliance"],
            "review": ["principal-compliance", "principal-security", "principal-legal", "principal-finance"],
            "challenge": ["legal-reviewer", "security-reviewer"],
            "synthesis": ["reviewer-principal"],
            "verdict": ["principal-decision"],
        },
        "metrics": {
            "time_ms": {"intake": 4200, "review": 3000, "challenge": 5000, "synthesis": 2700, "verdict": 3300},
            "tokens_in": {"intake": 350, "review": 1090, "challenge": 550, "synthesis": 510, "verdict": 260},
            "tokens_out": {"intake": 56, "review": 185, "challenge": 125, "synthesis": 175, "verdict": 145},
        },
        "confidence": 0.84,
        "cost_multiplier": 0.0000029,
    },
    "mastra": {
        "runtime": "python-harness:workflow-client",
        "state_container": "workflow_context",
        "links": {
            "intake": ["principal-compliance", "principal-security"],
            "review": ["principal-compliance", "principal-security", "principal-legal", "principal-finance"],
            "challenge": ["reviewer-security", "reviewer-legal", "reviewer-finance"],
            "synthesis": ["reviewer-principal"],
            "verdict": ["principal-decision"],
        },
        "metrics": {
            "time_ms": {"intake": 5800, "review": 6400, "challenge": 7800, "synthesis": 4200, "verdict": 5100},
            "tokens_in": {"intake": 430, "review": 1420, "challenge": 680, "synthesis": 490, "verdict": 315},
            "tokens_out": {"intake": 195, "review": 420, "challenge": 295, "synthesis": 210, "verdict": 180},
        },
        "confidence": 0.79,
        "cost_multiplier": 0.0000030,
    },
    "pydanticai": {
        "runtime": "python-harness:typed-agents",
        "state_container": "typed_models",
        "links": {
            "intake": ["principal-compliance"],
            "review": ["principal-compliance", "principal-security", "principal-legal", "principal-finance"],
            "challenge": ["compliance-reviewer", "security-reviewer", "legal-reviewer"],
            "synthesis": ["reviewer-principal"],
            "verdict": ["principal-decision"],
        },
        "metrics": {
            "time_ms": {"intake": 9500, "review": 33000, "challenge": 10000, "synthesis": 4300, "verdict": 5400},
            "tokens_in": {"intake": 360, "review": 1010, "challenge": 530, "synthesis": 500, "verdict": 250},
            "tokens_out": {"intake": 54, "review": 175, "challenge": 118, "synthesis": 168, "verdict": 142},
        },
        "confidence": 0.9,
        "cost_multiplier": 0.0000028,
    },
}


STAGE_AGENTS = {
    "intake": ["principal"],
    "review": ["principal", "compliance", "security", "legal", "finance"],
    "challenge": ["compliance", "security", "legal", "finance", "reviewer"],
    "synthesis": ["principal", "reviewer", "security", "legal"],
    "verdict": ["principal", "reviewer", "decision"],
}


STAGE_MESSAGE_TEMPLATES = {
    "langgraph": {
        "intake": "graph state seeded",
        "review": "branch writes evidence",
        "challenge": "review edge opened",
        "synthesis": "merge node collecting",
        "verdict": "terminal node emits answer",
    },
    "openai-agents": {
        "intake": "run context opened",
        "review": "parallel specialists return findings",
        "challenge": "reviewer blocks unsupported claims",
        "synthesis": "reviewed context returns",
        "verdict": "final agent responds",
    },
    "claude-agent-sdk": {
        "intake": "Claude case opened",
        "review": "parallel Claude specialists return findings",
        "challenge": "reviewer turn checks evidence",
        "synthesis": "principal turn compacts context",
        "verdict": "ResultMessage closes run",
    },
    "ag2": {
        "intake": "conversation starts",
        "review": "specialists debate",
        "challenge": "reviewer injects rebuttal",
        "synthesis": "council converges",
        "verdict": "closing turn publishes",
    },
    "crewai": {
        "intake": "manager assigns",
        "review": "crew task completes",
        "challenge": "checkpoint requests revision",
        "synthesis": "manager merges outputs",
        "verdict": "crew result returned",
    },
    "semantic-kernel": {
        "intake": "governed case opened",
        "review": "plugin-backed review runs",
        "challenge": "governance gate challenges",
        "synthesis": "approved packet assembled",
        "verdict": "governed result published",
    },
    "llamaindex": {
        "intake": "intake event emitted",
        "review": "evidence events written",
        "challenge": "follow-up event requested",
        "synthesis": "aggregator combines evidence",
        "verdict": "terminal event emitted",
    },
    "mastra": {
        "intake": "workflow opened",
        "review": "workflow step records finding",
        "challenge": "guardrail branch fires",
        "synthesis": "workflow resumes",
        "verdict": "app workflow returns",
    },
    "pydanticai": {
        "intake": "typed case initialized",
        "review": "validated finding returned",
        "challenge": "typed rebuttal requested",
        "synthesis": "validated result composed",
        "verdict": "typed output emitted",
    },
}


def _real_stage(framework_id: str, question_id: str, stage_id: str) -> dict | None:
    """Return real per-stage metrics if a run captured them, else None."""
    try:
        return (
            _real["questions"][question_id]["frameworks"][framework_id][stage_id]
        )
    except (KeyError, TypeError):
        return None


def _framework_has_complete_real_run(framework_id: str) -> bool:
    """True only when every displayed question/stage has captured SDK metrics."""
    return all(
        _real_stage(framework_id, question_id, stage_id)
        for question_id in QUESTIONS
        for stage_id in FRAMEWORKS[framework_id]["links"]
    )


def stable_jitter(*parts: str, spread: int = 17) -> float:
    seed = sum((index + 1) * ord(char) for index, char in enumerate(":".join(parts)))
    return 1 + ((seed % spread) - (spread // 2)) / 100


def simulated_metric_value(framework_id: str, question_id: str, stage_id: str, metric_name: str) -> int:
    meta = FRAMEWORKS[framework_id]
    base = meta["metrics"][metric_name][stage_id]
    question_factor = QUESTION_METRIC_FACTORS[question_id][metric_name]
    stage_factor = STAGE_TIME_VARIANCE[stage_id] if metric_name == "time_ms" else 1
    jitter = stable_jitter(framework_id, question_id, stage_id, metric_name)
    return max(1, round(base * question_factor * stage_factor * jitter))


def framework_metrics(framework_id: str, stage_id: str, question_id: str = "retention") -> dict:
    real = _real_stage(framework_id, question_id, stage_id)
    if real:
        ti = real.get("tokens_in", 0)
        to = real.get("tokens_out", 0)
        return {
            "time_ms": real.get("time_ms", 0),
            "token_input_estimate": ti,
            "token_output_estimate": to,
            "token_total_estimate": ti + to,
            "usd_cost_estimate": round(real.get("usd", (ti + to) * FRAMEWORKS[framework_id]["cost_multiplier"]), 5),
        }
    # Fallback to deterministic, question-aware estimates.
    meta = FRAMEWORKS[framework_id]
    tokens_in = simulated_metric_value(framework_id, question_id, stage_id, "tokens_in")
    tokens_out = simulated_metric_value(framework_id, question_id, stage_id, "tokens_out")
    total_tokens = tokens_in + tokens_out
    return {
        "time_ms": simulated_metric_value(framework_id, question_id, stage_id, "time_ms"),
        "token_input_estimate": tokens_in,
        "token_output_estimate": tokens_out,
        "token_total_estimate": total_tokens,
        "usd_cost_estimate": round(total_tokens * meta["cost_multiplier"], 5),
    }


def stage_state(question: dict, framework_id: str, stage_id: str, container: str) -> dict:
    base = {
        "state_container": container,
        "question": question["prompt"],
        "clauses": question["clauses"],
        "stage": stage_id,
        "framework": framework_id,
    }
    if stage_id == "intake":
        return {
            **base,
            "loaded": {"policy_text": True, "question_bank": True},
            "principal_packet": {"question_id": question["prompt"][:24], "needs_review": True},
        }
    if stage_id == "review":
        return {
            **base,
            "findings": {
                "compliance": f"{question['clauses'][0]} clause extracted",
                "security": "exception path checked",
                "legal": "wording and caveats extracted",
                "data_ops": "retention lifecycle implications added",
            },
        }
    if stage_id == "challenge":
        return {
            **base,
            "reviewer_notes": ["remove overclaim", "preserve conditional wording"],
            "open_questions": ["how long retained", "which exceptions apply"],
        }
    if stage_id == "synthesis":
        return {
            **base,
            "draft_answer": verdict_answer(question, framework_id),
            "reviewer_notes": reviewer_notes(framework_id, question["clauses"][0]),
        }
    return {
        **base,
        "final_answer": verdict_answer(question, framework_id),
        "confidence": FRAMEWORKS[framework_id]["confidence"],
        "citations": verdict_citations(question, framework_id),
    }


def reviewer_notes(framework_id: str, lead_clause: str) -> list[str]:
    by_framework = {
        "langgraph": [f"cite {lead_clause} clause explicitly", "retain conditional wording"],
        "openai-agents": [f"carry {lead_clause} citation through parallel reviews", "do not drop reviewer caveat"],
        "claude-agent-sdk": [f"keep {lead_clause} visible across parallel specialist calls", "final ResultMessage must preserve reviewer caveat"],
        "ag2": [f"trim unsupported debate around {lead_clause}", "pin the final claim to policy text"],
        "crewai": [f"manager must keep {lead_clause} evidence attached", "check task summaries for drift"],
        "semantic-kernel": [f"governance gate requires {lead_clause}", "record explicit ambiguity note"],
        "llamaindex": [f"aggregate {lead_clause} events only", "discard unsupported event payloads"],
        "mastra": [f"guardrail branch must preserve {lead_clause}", "resume with reviewer warnings attached"],
        "pydanticai": [f"validate {lead_clause} field presence", "reject answer model if caveat missing"],
    }
    return by_framework[framework_id]


def verdict_citations(question: dict, framework_id: str) -> list[str]:
    clause_ids = list(question["clauses"])
    if framework_id in {"langgraph", "claude-agent-sdk", "semantic-kernel", "pydanticai"} and "rights" not in clause_ids:
        clause_ids.append("rights")
    if framework_id == "ag2" and len(clause_ids) > 2:
        return clause_ids[:2]
    return clause_ids


def verdict_answer(question: dict, framework_id: str) -> str:
    answers = {
        "retention": {
            "langgraph": "Yes, but only under the retention exceptions the graph gathered: GitHub can keep personal data for contracts, legal duties, disputes, and agreement enforcement, and the period depends on purpose.",
            "openai-agents": "Yes. The parallel specialist run preserves the same bottom line: GitHub may continue retention after closure where contractual, legal, dispute, or enforcement needs apply.",
            "claude-agent-sdk": "Yes. The parallel Claude specialist run preserves the caveat that retention after closure is allowed only for contract, legal, dispute, or enforcement needs, and duration stays purpose-bound.",
            "ag2": "The debate converged on a cautious yes: retention can continue after account closure when contractual, legal, or dispute needs still apply, but the policy does not promise a fixed deletion date.",
            "crewai": "Yes. The manager summary says data retention may continue where contracts, legal obligations, disputes, or agreement enforcement require it, with duration tied to purpose.",
            "semantic-kernel": "Yes, subject to the governed caveat that retention remains purpose-bound: GitHub may keep data for contracts, legal duties, disputes, and agreement enforcement.",
            "llamaindex": "Yes. The aggregated evidence points to continued retention for contracts, legal obligations, disputes, and agreement enforcement, with no single universal retention period.",
            "mastra": "Yes, with a workflow-style caveat: GitHub can retain data after closure when contract, legal, dispute, or enforcement conditions still exist.",
            "pydanticai": "Yes. The validated answer model keeps the condition explicit: retention may continue for contracts, legal obligations, disputes, or agreement enforcement, and duration depends on purpose.",
        },
        "sharing": {
            "langgraph": "GitHub may share personal data with affiliates, organization accounts, competent authorities, fraud-prevention parties, and third-party apps when the user directs that sharing.",
            "openai-agents": "The run concludes that sharing is allowed in several buckets: affiliates, organization accounts, lawful authorities, abuse-prevention actors, and user-authorized third-party apps.",
            "claude-agent-sdk": "The Claude agent loop keeps sharing scoped to affiliates, organization accounts, lawful authorities, abuse-prevention entities, and user-directed third-party applications.",
            "ag2": "The debate outcome is that sharing is conditional rather than open-ended: GitHub may share with affiliates, organization accounts, authorities, fraud-prevention entities, and third-party apps under user instruction.",
            "crewai": "Yes, but under scoped pathways. Crew outputs point to affiliates, organization accounts, authorities, abuse-prevention actors, and instructed third-party applications.",
            "semantic-kernel": "The governed answer distinguishes user-directed sharing from authority-driven disclosure, and includes affiliates, organization accounts, and anti-abuse disclosures.",
            "llamaindex": "The evidence pipeline supports sharing with affiliates, organization accounts, competent authorities, anti-abuse actors, and third-party apps when instructed by the user.",
            "mastra": "Workflow output says sharing can happen with affiliates, organization accounts, public authorities, abuse-prevention entities, and user-directed third-party apps.",
            "pydanticai": "The validated answer separates lawful disclosure from user-directed sharing, covering affiliates, organization accounts, authorities, anti-abuse parties, and third-party apps.",
        },
        "rights": {
            "langgraph": "Users may have access, correction, erasure in some cases, objection, consent-withdrawal, portability, and region-specific rights; the graph also preserves that some rights depend on applicable law.",
            "openai-agents": "The parallel specialist result keeps the answer conditional: users may have access, correction, deletion or erasure in some cases, portability, objection, and appeal-style rights depending on region and law.",
            "claude-agent-sdk": "The streamed verdict keeps the jurisdiction caveat: users may have access, correction, deletion or erasure in some cases, objection, consent withdrawal, portability, and region-specific rights.",
            "ag2": "The team converged on a qualified rights answer: access, correction, deletion in some cases, objection, consent withdrawal, portability, and some state-specific rights exist, but they depend on jurisdiction.",
            "crewai": "Crew outputs identify access, correction, deletion or erasure in some cases, objection, consent withdrawal, portability, and region-specific rights that vary with applicable law.",
            "semantic-kernel": "The governed answer distinguishes baseline privacy rights from region-specific rights, including access, correction, deletion in some cases, objection, consent withdrawal, portability, and appeal pathways.",
            "llamaindex": "Aggregated evidence points to access, correction, deletion or erasure in some contexts, objection, consent withdrawal, portability, and jurisdiction-dependent rights in the EEA, UK, and some US states.",
            "mastra": "Workflow output says users may have access, correction, deletion in some cases, objection, portability, consent withdrawal, and region-specific rights depending on law.",
            "pydanticai": "The validated answer model preserves both the core rights and the qualifier: access, correction, deletion in some cases, objection, consent withdrawal, portability, and region-specific rights depend on applicable law.",
        },
    }
    return answers[question_key(question)][framework_id]


def question_key(question: dict) -> str:
    for key, candidate in QUESTIONS.items():
        if candidate["prompt"] == question["prompt"]:
            return key
    raise KeyError("Unknown question")


def stage_output(question: dict, framework_id: str, stage_id: str) -> dict:
    real = _real_stage(framework_id, question_key(question), stage_id)
    if real and "output" in real:
        return {"sdk_output": real["output"]}
    if stage_id == "verdict":
        return {
            "answer": verdict_answer(question, framework_id),
            "citations": verdict_citations(question, framework_id),
            "confidence": FRAMEWORKS[framework_id]["confidence"],
        }
    if stage_id == "synthesis":
        return {
            "draft_answer": verdict_answer(question, framework_id),
            "status": "ready_for_verdict",
            "merge_style": FRAMEWORKS[framework_id]["runtime"].split(":")[1],
        }
    if stage_id == "challenge":
        by_framework = {
            "langgraph": {"reviewer_action": "branch_to_revision", "notes": ["missing conditional caveat", "add explicit clause citation"]},
            "openai-agents": {"reviewer_action": "reject_parallel_review", "notes": ["legal caveat needs source wording", "rehydrate retention limits"]},
            "claude-agent-sdk": {"reviewer_action": "review_merged_parallel_findings", "notes": ["final response needs clause ids", "preserve narrow policy wording"]},
            "ag2": {"reviewer_action": "stop_debate_and_ground", "notes": ["debate drift detected", "anchor final answer to source clause"]},
            "crewai": {"reviewer_action": "return_task_bundle", "notes": ["manager summary needs source wording", "task outputs disagree on scope"]},
            "semantic-kernel": {"reviewer_action": "fail_governance_gate", "notes": ["audit note missing", "ambiguity statement required"]},
            "llamaindex": {"reviewer_action": "emit_followup_event", "notes": ["evidence payload incomplete", "re-run clause coverage event"]},
            "mastra": {"reviewer_action": "branch_guardrail_review", "notes": ["branch triggered by unsupported statement", "resume only after reviewer clear"]},
            "pydanticai": {"reviewer_action": "model_validation_reject", "notes": ["citation field missing", "answer schema needs conditional qualifier"]},
        }
        return by_framework[framework_id]
    if stage_id == "review":
        return {
            "specialist_findings": len(question["clauses"]) + (2 if framework_id in {"langgraph", "crewai", "claude-agent-sdk"} else 1),
            "status": "review_complete",
            "review_shape": FRAMEWORKS[framework_id]["state_container"],
        }
    return {"status": "case_opened", "runtime": FRAMEWORKS[framework_id]["runtime"]}


def stage_messages(question: dict, framework_id: str, links: list[str], stage_id: str) -> list[dict]:
    lead_clause = question["clauses"][0]
    template = STAGE_MESSAGE_TEMPLATES[framework_id][stage_id]
    return [
        {
            "link_id": link_id,
            "message": f"{template} · {lead_clause}",
        }
        for link_id in links
    ]


def build_trace_store() -> dict:
    real_frameworks = sorted({
        framework_id
        for framework_id in FRAMEWORKS
        if _framework_has_complete_real_run(framework_id)
    })
    fallback_frameworks = sorted(set(FRAMEWORKS) - set(real_frameworks))
    models = _real.get("models") or {"openai": _real.get("model", "gpt-4o-mini")}
    model_note = ", ".join(f"{name}: {model}" for name, model in models.items())
    if not fallback_frameworks:
        note = f"All displayed framework metrics are from complete real SDK runs (models: {model_note})."
    elif real_frameworks:
        note = (
            f"Metrics for {real_frameworks} are from complete real SDK runs (models: {model_note}). "
            f"Fallback estimates remain for {fallback_frameworks}."
        )
    else:
        note = "These traces are deterministic, question-aware Python framework-shaped estimates, not official framework SDK runs."
    payload = {
        "generated_by": "scripts/generate_traces.py",
        "execution_mode": "real-sdk-calls" if not fallback_frameworks else ("mixed" if real_frameworks else "python-harness"),
        "real_frameworks": real_frameworks,
        "fallback_frameworks": fallback_frameworks,
        "note": note,
        "questions": {},
    }
    for question_id, question in QUESTIONS.items():
        payload["questions"][question_id] = {"frameworks": {}}
        for framework_id, meta in FRAMEWORKS.items():
            stages = {}
            for stage_id, links in meta["links"].items():
                real = _real_stage(framework_id, question_id, stage_id)
                stage_entry: dict = {
                    "runtime": meta["runtime"],
                    "execution_mode": "python-harness",
                    "active_agents": STAGE_AGENTS[stage_id],
                    "active_links": links,
                    "messages": stage_messages(question, framework_id, links, stage_id),
                    "state": stage_state(question, framework_id, stage_id, meta["state_container"]),
                    "metrics": framework_metrics(framework_id, stage_id, question_id),
                    "output": stage_output(question, framework_id, stage_id),
                }
                if real:
                    stage_entry["execution_mode"] = "real-sdk-calls"
                    stage_entry["runtime"] = meta["runtime"].replace("python-harness:", "")
                stages[stage_id] = stage_entry
            payload["questions"][question_id]["frameworks"][framework_id] = {"stages": stages}
    return payload


def main() -> None:
    TRACE_DIR.mkdir(exist_ok=True)
    TRACE_PATH.write_text(json.dumps(build_trace_store(), indent=2) + "\n", encoding="utf-8")
    print(f"Wrote {TRACE_PATH}")


if __name__ == "__main__":
    main()
