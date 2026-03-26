/**
 * Mastra real harness — runs all 3 policy questions through a Mastra
 * Agent-based 5-stage pipeline and writes per-stage metrics to stdout
 * as JSON (consumed by run_real_harnesses.py).
 *
 * Uses @mastra/core Agent + @ai-sdk/openai for LLM calls.
 */
import { Agent } from "@mastra/core/agent";
import { openai } from "@ai-sdk/openai";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

// ── Load env ──────────────────────────────────────────────────────────────────
const envPath = path.join(ROOT, ".env");
try {
  const env = readFileSync(envPath, "utf8");
  for (const line of env.split("\n")) {
    const m = line.match(/^([A-Z_]+)=['"]?(.+?)['"]?$/);
    if (m) process.env[m[1]] = m[2];
  }
} catch {}

const MODEL = "gpt-4o-mini";
const IN_RATE  = 0.15 / 1_000_000;
const OUT_RATE = 0.60 / 1_000_000;

const POLICY_CORPUS = `
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
`.trim();

const QUESTIONS = {
  retention: "Can GitHub retain personal data after an account is closed, and under what conditions?",
  sharing:   "When may GitHub share personal data with third parties, affiliates, or public authorities?",
  rights:    "What rights do users in the EEA, UK, and some US states have over their personal data?",
};

const SPECIALIST_ROLES = {
  compliance: "You are a compliance specialist agent. Focus on regulatory adherence, documentation requirements, and policy obligations.",
  security:   "You are a security specialist agent. Focus on technical data-protection controls, risk mitigation, and access safeguards.",
  legal:      "You are a legal specialist agent. Focus on legal language, qualifying conditions, obligations, and jurisdictional caveats.",
  finance:    "You are a financial analyst agent. Focus on operational cost implications, business risk, and resource impact.",
};

/** Create a Mastra Agent with the given system instructions. */
function makeAgent(name, instructions) {
  return new Agent({
    name,
    instructions,
    model: openai(MODEL),
  });
}

/** Call an agent and return { text, tokensIn, tokensOut }. */
async function agentCall(agent, prompt, maxTokens = 200) {
  const result = await agent.generate(prompt, {
    maxTokens,
  });
  return {
    text: result.text,
    tokensIn:  result.usage?.inputTokens  ?? 0,
    tokensOut: result.usage?.outputTokens ?? 0,
  };
}

/** Run the 5-stage pipeline for one question and return per-stage metrics. */
async function runQuestion(question) {
  const metrics = {};

  // ── Stage 1: Intake ──────────────────────────────────────────────────────
  const principal = makeAgent(
    "principal",
    "You are the principal orchestration agent for a policy compliance analysis. Be concise and evidence-based.",
  );
  let t = Date.now();
  const intakeRes = await agentCall(
    principal,
    `Question: ${question}\n\nPolicy:\n${POLICY_CORPUS}\n\n` +
    "Identify relevant clauses and outline guardrail steps for each specialist.",
  );
  metrics.intake = {
    time_ms: Date.now() - t,
    tokens_in: intakeRes.tokensIn,
    tokens_out: intakeRes.tokensOut,
  };

  // ── Stage 2: Review (workflow steps for each specialist) ─────────────────
  t = Date.now();
  let tiTotal = 0, toTotal = 0;
  const reviewParts = {};
  for (const [role, sysMsg] of Object.entries(SPECIALIST_ROLES)) {
    const agent = makeAgent(role, sysMsg);
    const res = await agentCall(
      agent,
      `Workflow step context: ${intakeRes.text.slice(0, 300)}\n\n` +
      `Question: ${question}\n\nRecord your specialist finding (2-3 sentences).`,
      150,
    );
    reviewParts[role] = res.text;
    tiTotal += res.tokensIn;
    toTotal += res.tokensOut;
  }
  metrics.review = { time_ms: Date.now() - t, tokens_in: tiTotal, tokens_out: toTotal };

  // ── Stage 3: Challenge (guardrail branch) ────────────────────────────────
  const reviewer = makeAgent(
    "reviewer",
    "You are a reviewer agent. Challenge and validate specialist findings. Identify unsupported claims or missing qualifiers.",
  );
  const findingsText = Object.entries(reviewParts).map(([k, v]) => `${k}: ${v}`).join("\n");
  t = Date.now();
  const challengeRes = await agentCall(
    reviewer,
    `Guardrail branch for question: ${question}\n\nFindings:\n${findingsText}\n\n` +
    "List any unsupported claims or missing policy citations.",
  );
  metrics.challenge = {
    time_ms: Date.now() - t,
    tokens_in: challengeRes.tokensIn,
    tokens_out: challengeRes.tokensOut,
  };

  // ── Stage 4: Synthesis (workflow resumes) ────────────────────────────────
  t = Date.now();
  const synthRes = await agentCall(
    principal,
    `Workflow resuming after guardrail.\n` +
    `Question: ${question}\n\nFindings: ${findingsText.slice(0, 300)}\n` +
    `Reviewer warnings: ${challengeRes.text.slice(0, 200)}\n\n` +
    "Draft a concise answer.",
    250,
  );
  metrics.synthesis = {
    time_ms: Date.now() - t,
    tokens_in: synthRes.tokensIn,
    tokens_out: synthRes.tokensOut,
  };

  // ── Stage 5: Verdict (app workflow returns) ──────────────────────────────
  t = Date.now();
  const verdictRes = await agentCall(
    principal,
    `Question: ${question}\n\nDraft: ${synthRes.text.slice(0, 400)}\n\n` +
    "Return the final answer with citations from the policy.",
  );
  metrics.verdict = {
    time_ms: Date.now() - t,
    tokens_in: verdictRes.tokensIn,
    tokens_out: verdictRes.tokensOut,
  };

  return metrics;
}

// ── Main ──────────────────────────────────────────────────────────────────────
const payload = { questions: {} };

for (const [qId, question] of Object.entries(QUESTIONS)) {
  process.stderr.write(`  [mastra] ${qId} ... `);
  try {
    const m = await runQuestion(question);
    // Add usd cost to each stage
    for (const s of Object.values(m)) {
      s.usd = +(s.tokens_in * IN_RATE + s.tokens_out * OUT_RATE).toFixed(7);
    }
    payload.questions[qId] = m;
    process.stderr.write("ok\n");
  } catch (err) {
    process.stderr.write(`FAILED: ${err.message}\n`);
    payload.questions[qId] = {};
  }
}

const outPath = path.join(ROOT, "traces", "mastra_metrics.json");
mkdirSync(path.join(ROOT, "traces"), { recursive: true });
writeFileSync(outPath, JSON.stringify(payload, null, 2) + "\n");
process.stderr.write(`Wrote ${outPath}\n`);
