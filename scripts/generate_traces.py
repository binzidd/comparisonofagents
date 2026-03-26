#!/usr/bin/env python3
from __future__ import annotations

import json
from dataclasses import dataclass
from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent
TRACE_DIR = ROOT / "traces"
TRACE_PATH = TRACE_DIR / "framework_traces.json"


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


FRAMEWORKS = {
    "langgraph": {
        "runtime": "python-exec:graph",
        "state_container": "shared_graph_state",
        "links": {
            "intake": ["principal-compliance", "principal-security"],
            "review": ["principal-compliance", "principal-security", "principal-legal", "principal-finance"],
            "challenge": ["compliance-reviewer", "security-reviewer", "legal-reviewer", "finance-reviewer"],
            "synthesis": ["reviewer-principal"],
            "verdict": ["principal-decision"],
        },
    },
    "openai-agents": {
        "runtime": "python-exec:handoff",
        "state_container": "run_context",
        "links": {
            "intake": ["principal-compliance"],
            "review": ["principal-compliance", "compliance-security", "security-legal", "legal-finance"],
            "challenge": ["finance-reviewer", "legal-reviewer"],
            "synthesis": ["reviewer-principal"],
            "verdict": ["principal-decision"],
        },
    },
    "ag2": {
        "runtime": "python-exec:conversation",
        "state_container": "chat_transcript",
        "links": {
            "intake": ["principal-compliance", "principal-security"],
            "review": ["compliance-security", "security-legal", "legal-finance", "finance-compliance"],
            "challenge": ["reviewer-compliance", "reviewer-security", "reviewer-legal", "reviewer-finance"],
            "synthesis": ["security-principal", "legal-principal", "finance-principal"],
            "verdict": ["principal-decision", "reviewer-decision"],
        },
    },
    "crewai": {
        "runtime": "python-exec:crew",
        "state_container": "task_outputs",
        "links": {
            "intake": ["principal-compliance", "principal-legal"],
            "review": ["principal-compliance", "principal-security", "principal-legal", "principal-finance"],
            "challenge": ["compliance-reviewer", "security-reviewer", "legal-reviewer", "finance-reviewer"],
            "synthesis": ["reviewer-principal"],
            "verdict": ["principal-decision"],
        },
    },
    "semantic-kernel": {
        "runtime": "python-exec:governed",
        "state_container": "governed_case",
        "links": {
            "intake": ["principal-compliance", "principal-security"],
            "review": ["principal-compliance", "principal-security", "principal-legal", "principal-finance"],
            "challenge": ["reviewer-security", "reviewer-legal"],
            "synthesis": ["reviewer-principal"],
            "verdict": ["principal-decision"],
        },
    },
    "llamaindex": {
        "runtime": "python-exec:event-workflow",
        "state_container": "event_payload",
        "links": {
            "intake": ["principal-compliance"],
            "review": ["principal-compliance", "principal-security", "principal-legal", "principal-finance"],
            "challenge": ["legal-reviewer", "security-reviewer"],
            "synthesis": ["reviewer-principal"],
            "verdict": ["principal-decision"],
        },
    },
    "mastra": {
        "runtime": "python-exec:workflow-client",
        "state_container": "workflow_context",
        "links": {
            "intake": ["principal-compliance", "principal-security"],
            "review": ["principal-compliance", "principal-security", "principal-legal", "principal-finance"],
            "challenge": ["reviewer-security", "reviewer-legal", "reviewer-finance"],
            "synthesis": ["reviewer-principal"],
            "verdict": ["principal-decision"],
        },
    },
    "pydanticai": {
        "runtime": "python-exec:typed-agents",
        "state_container": "typed_models",
        "links": {
            "intake": ["principal-compliance"],
            "review": ["principal-compliance", "principal-security", "principal-legal", "principal-finance"],
            "challenge": ["compliance-reviewer", "security-reviewer", "legal-reviewer"],
            "synthesis": ["reviewer-principal"],
            "verdict": ["principal-decision"],
        },
    },
}


STAGE_AGENTS = {
    "intake": ["principal"],
    "review": ["principal", "compliance", "security", "legal", "finance"],
    "challenge": ["compliance", "security", "legal", "finance", "reviewer"],
    "synthesis": ["principal", "reviewer", "security", "legal"],
    "verdict": ["principal", "reviewer", "decision"],
}


def stage_state(question: dict, framework_id: str, stage_id: str, container: str) -> dict:
    base = {
        "state_container": container,
        "question": question["prompt"],
        "clauses": question["clauses"],
        "stage": stage_id,
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
            "draft_answer": question["answer"],
            "reviewer_notes": ["cite clauses directly", "state limits of policy text"],
        }
    return {
        **base,
        "final_answer": question["answer"],
        "confidence": 0.82,
        "citations": question["clauses"],
    }


def stage_output(question: dict, stage_id: str) -> dict:
    if stage_id == "verdict":
        return {
            "answer": question["answer"],
            "citations": question["clauses"],
            "confidence": 0.82,
        }
    if stage_id == "synthesis":
        return {"draft_answer": question["answer"], "status": "ready_for_verdict"}
    if stage_id == "challenge":
        return {"reviewer_action": "revise_claims", "notes": ["cite policy limits", "keep caveats"]}
    if stage_id == "review":
        return {"specialist_findings": 4, "status": "review_complete"}
    return {"status": "case_opened"}


def stage_messages(links: list[str], stage_id: str) -> list[dict]:
    labels = {
        "intake": "open case",
        "review": "specialist finding",
        "challenge": "review challenge",
        "synthesis": "merge answer",
        "verdict": "final answer",
    }
    return [{"link_id": link_id, "message": labels[stage_id]} for link_id in links]


def build_trace_store() -> dict:
    payload = {"generated_by": "scripts/generate_traces.py", "questions": {}}
    for question_id, question in QUESTIONS.items():
        payload["questions"][question_id] = {"frameworks": {}}
        for framework_id, meta in FRAMEWORKS.items():
            stages = {}
            for stage_id, links in meta["links"].items():
                stages[stage_id] = {
                    "runtime": meta["runtime"],
                    "active_agents": STAGE_AGENTS[stage_id],
                    "active_links": links,
                    "messages": stage_messages(links, stage_id),
                    "state": stage_state(question, framework_id, stage_id, meta["state_container"]),
                    "output": stage_output(question, stage_id),
                }
            payload["questions"][question_id]["frameworks"][framework_id] = {"stages": stages}
    return payload


def main() -> None:
    TRACE_DIR.mkdir(exist_ok=True)
    TRACE_PATH.write_text(json.dumps(build_trace_store(), indent=2) + "\n", encoding="utf-8")
    print(f"Wrote {TRACE_PATH}")


if __name__ == "__main__":
    main()
