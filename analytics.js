// ── Like store ────────────────────────────────────────────────────────────

const likeStore = {
  storageKey: "analytics_lab_like_state",
  read() {
    try {
      const raw = window.localStorage.getItem(this.storageKey);
      if (!raw) return { count: 0, liked: false };
      const parsed = JSON.parse(raw);
      return {
        count: Number.isFinite(Number(parsed.count)) ? Number(parsed.count) : 0,
        liked: parsed.liked === true
      };
    } catch (_error) {
      return { count: 0, liked: false };
    }
  },
  write(next) {
    window.localStorage.setItem(this.storageKey, JSON.stringify(next));
  }
};

// ── Data ──────────────────────────────────────────────────────────────────

const businessQueries = [
  {
    id: "feedback",
    label: "Product Feedback",
    question: "Which products had the most negative feedback last quarter?",
    domain: "Customer Analytics",
    skill: "cas360",
    skillName: "CAS 360 Data Analyst",
    tables: ["mart.aggregated_customer_feedback", "mart.product_reviews_summary"],
    sql: [
      "SELECT",
      "  product_name,",
      "  COUNT(*)                     AS negative_reviews,",
      "  ROUND(AVG(sentiment_score), 2) AS avg_sentiment",
      "FROM mart.aggregated_customer_feedback",
      "WHERE sentiment_label = 'negative'",
      "  AND review_quarter = DATE_TRUNC('quarter',",
      "        CURRENT_DATE - INTERVAL '3' MONTH)",
      "GROUP BY product_name",
      "ORDER BY negative_reviews DESC",
      "LIMIT 10"
    ].join("\n"),
    resultShape: "10 rows · 3 columns",
    visualization: "Horizontal bar chart: negative review count per product",
    insight: "CAS 360 had 2.3× more negative feedback than average, concentrated in the billing module over the last quarter."
  },
  {
    id: "investment",
    label: "Investment Trends",
    question: "Show me investment trends for high-net-worth accounts.",
    domain: "Investment Analytics",
    skill: "sf360",
    skillName: "Simple Fund 360 Data Analyst",
    tables: ["mart.investment_performance", "mart.account_tiers"],
    sql: [
      "SELECT",
      "  asset_class,",
      "  SUM(holding_value)          AS total_value_aud,",
      "  AVG(return_pct)             AS avg_return,",
      "  COUNT(DISTINCT account_id)  AS account_count",
      "FROM mart.investment_performance",
      "WHERE account_tier = 'high_net_worth'",
      "  AND period_month >= DATE_TRUNC('month',",
      "        CURRENT_DATE - INTERVAL '12' MONTH)",
      "GROUP BY asset_class",
      "ORDER BY total_value_aud DESC"
    ].join("\n"),
    resultShape: "8 rows · 4 columns",
    visualization: "Stacked area chart: holding value by asset class over 12 months",
    insight: "Australian equities grew 18% YoY for HNW accounts; property trusts saw a 6% decline in average return."
  },
  {
    id: "compliance",
    label: "SMSF Compliance",
    question: "What is the compliance rate across all active SMSF funds?",
    domain: "Compliance Analytics",
    skill: "sf360",
    skillName: "Simple Fund 360 Data Analyst",
    tables: ["mart.compliance_tracking", "mart.fund_status"],
    sql: [
      "SELECT",
      "  fund_type,",
      "  COUNT(*)                                        AS total_funds,",
      "  SUM(CASE WHEN is_compliant THEN 1 ELSE 0 END)  AS compliant_funds,",
      "  ROUND(",
      "    100.0 * SUM(CASE WHEN is_compliant THEN 1 ELSE 0 END)",
      "    / COUNT(*), 2",
      "  )                                               AS compliance_rate_pct",
      "FROM mart.compliance_tracking",
      "WHERE fund_status = 'active'",
      "GROUP BY fund_type",
      "ORDER BY compliance_rate_pct ASC"
    ].join("\n"),
    resultShape: "4 rows · 4 columns",
    visualization: "Gauge chart: overall rate with per-fund-type breakdown",
    insight: "Overall compliance rate is 94.2%. Self-managed accumulation funds lag at 89.1%, flagged for follow-up."
  },
  {
    id: "retention",
    label: "Advisor Retention",
    question: "Which advisors have the highest client retention in Q4?",
    domain: "Advisor Analytics",
    skill: "cas360",
    skillName: "CAS 360 Data Analyst",
    tables: ["mart.advisor_performance", "mart.client_retention_quarterly"],
    sql: [
      "SELECT",
      "  advisor_name,",
      "  COUNT(DISTINCT client_id)     AS active_clients,",
      "  ROUND(retention_rate * 100, 1) AS retention_pct,",
      "  SUM(assets_under_management)  AS total_aum",
      "FROM mart.advisor_performance",
      "WHERE quarter_label = 'Q4'",
      "  AND employment_status = 'active'",
      "ORDER BY retention_rate DESC",
      "LIMIT 10"
    ].join("\n"),
    resultShape: "10 rows · 4 columns",
    visualization: "Ranked table with sparklines: top 10 advisors by retention rate",
    insight: "Top 3 advisors averaged 97.4% retention and 2.8× the median AUM per client."
  }
];

function getFlowSteps(query) {
  return [
    {
      number: "01",
      label: "User Request",
      who: "User → AgentCore",
      title: "Natural language question received",
      description: `"${query.question}"`,
      agentOutput: "AgentCore opens an isolated session with identity-based access controls. Agent identifies this as a data analytics request and begins reasoning about the domain.",
      sql: null
    },
    {
      number: "02",
      label: "Schema Discovery",
      who: "Agent → Skills",
      title: `${query.skillName} skill triggered`,
      description: `Agent reads the question and triggers the ${query.skillName} skill to gain domain-specific table expertise.`,
      agentOutput: `Skill loaded: skills/${query.skill}/SKILL.md\n\nTables identified:\n${query.tables.map(t => `  · ${t}`).join("\n")}\n\nSchema and sample data explored via CLAUDE.md data folder structure.`,
      sql: null
    },
    {
      number: "03",
      label: "SQL Generation",
      who: "Agent → Athena",
      title: "SELECT query written against analytic tables",
      description: "Agent writes a SQL SELECT query targeting pre-aggregated mart tables. Business logic (joins, aggregations, KPI rules) is already encoded in the table — the agent only writes basic SELECT statements.",
      agentOutput: null,
      sql: query.sql
    },
    {
      number: "04",
      label: "Security Validation",
      who: "Security Layer",
      title: "Query inspected before reaching Athena",
      description: "A validation layer scans the generated SQL before execution. This prevents unintended data modification and satisfies financial services compliance requirements.",
      agentOutput: "Validation passed.\n\nAllowed:   SELECT\nBlocked:   DELETE · UPDATE · INSERT · DROP · ALTER · TRUNCATE\n\nQuery cleared for execution.",
      sql: null
    },
    {
      number: "05",
      label: "Query Execution",
      who: "Athena → S3",
      title: "Athena runs the query; CSV result stored in S3",
      description: "Amazon Athena executes the validated query against analytic tables. Results are written to S3 as CSV. The agent downloads the file directly to the AgentCore file system — bypassing the context window entirely to handle large result sets without hitting token limits.",
      agentOutput: `Query result: ${query.resultShape}\n\nCSV downloaded to: /results/raw/query_result.csv\n\nContext window used for data: 0 tokens (file system bypass)`,
      sql: null
    },
    {
      number: "06",
      label: "Analysis",
      who: "Agent → Python",
      title: "Python processes the CSV and generates a visualization",
      description: "Agent writes and executes a sandboxed Python script to analyze the result set. The script reads the CSV from the file system, performs any needed transformations, and produces the requested chart.",
      agentOutput: `Chart produced: ${query.visualization}\n\nSaved to: /results/output/chart.png\n\nPython executed in sandboxed AgentCore environment. No production system access.`,
      sql: null
    },
    {
      number: "07",
      label: "Response",
      who: "AgentCore → Slack",
      title: "Insight and chart delivered to the user",
      description: "The chart, summary, and supporting data are formatted and returned to the user in Slack. The session stays open for follow-up questions.",
      agentOutput: `Insight: ${query.insight}\n\nSession preserved — user can ask follow-up questions without re-querying.`,
      sql: null
    }
  ];
}

const architectureLayers = [
  {
    id: "foundation",
    title: "Data Foundation Layer",
    badge: "dbt + Amazon Athena",
    badgeColor: "#1f5f5b",
    description: "Complex business logic lives here — handled deterministically before the agent sees any data.",
    responsibilities: [
      {
        label: "Joins & Aggregations",
        detail: "dbt models define exactly how raw tables join and aggregate — validated by the data team against known business rules."
      },
      {
        label: "Business Rules & KPIs",
        detail: "Compliance thresholds, return calculations, and metric definitions live in dbt, not in agent prompts — so they cannot drift."
      },
      {
        label: "Data Quality",
        detail: "Schema tests run on every dbt build. The agent always reads clean, tested data. Bad rows never reach the agent."
      },
      {
        label: "Single Source of Truth",
        detail: "BI dashboards, reports, and the AI agent all read the same analytic tables. One rule change in dbt propagates everywhere."
      }
    ]
  },
  {
    id: "agent",
    title: "Agent Layer",
    badge: "Claude Agent SDK",
    badgeColor: "#4b8dff",
    description: "The agent handles language and orchestration — not data transformation. It interprets questions, selects skills, and writes simple SELECT queries.",
    responsibilities: [
      {
        label: "Language Understanding",
        detail: "Translates natural language questions into structured data requests. Identifies the right domain and skill to activate."
      },
      {
        label: "Skill Orchestration",
        detail: "Loads the matching SKILL.md to gain domain-specific table knowledge before generating any SQL."
      },
      {
        label: "SELECT Query Generation",
        detail: "Writes basic SELECT queries against well-structured analytic tables. No complex joins or business logic in the SQL."
      },
      {
        label: "Code Execution",
        detail: "Writes and runs sandboxed Python scripts to process CSVs and generate charts — without loading data into the context window."
      }
    ]
  }
];

const products = [
  {
    id: "sf360",
    name: "Simple Fund 360",
    short: "SF360",
    domain: "SMSF administration and compliance",
    color: "#4b8dff",
    skillTrigger: "Questions about SMSF compliance, fund performance, member contributions, contribution caps, or regulatory reporting obligations",
    tables: [
      { name: "mart.compliance_tracking", desc: "Per-fund compliance status with ATO obligation tracking and breach history" },
      { name: "mart.investment_performance", desc: "Holdings, returns, and benchmark comparisons by account and asset class" },
      { name: "mart.member_contributions", desc: "Contribution amounts, caps, catch-up contributions, and historical trends" },
      { name: "mart.fund_status", desc: "Active/inactive fund registry with administrator assignment and audit trail" }
    ],
    complexScenarios: [
      "Multi-year compliance trends: join compliance_tracking with fund_status using fund_id to track cohort status transitions over time",
      "Contribution cap breach detection: aggregate member_contributions by financial_year and member_id, then compare against ATO cap thresholds from mart.ato_caps"
    ]
  },
  {
    id: "cas360",
    name: "CAS 360",
    short: "CAS360",
    domain: "Company and trust management with ASIC compliance",
    color: "#7fb1ff",
    skillTrigger: "Questions about company structures, trust deeds, ASIC filing status, shareholder records, client feedback, or advisor performance metrics",
    tables: [
      { name: "mart.aggregated_customer_feedback", desc: "Sentiment-scored feedback aggregated per product and quarter with NPS and category breakdown" },
      { name: "mart.advisor_performance", desc: "AUM, retention rate, filing accuracy, and client satisfaction score per advisor" },
      { name: "mart.asic_filings", desc: "Lodgement status, due dates, overdue count, and penalty risk by entity" },
      { name: "mart.client_retention_quarterly", desc: "Quarterly cohort retention with churn attribution and reactivation tracking" }
    ],
    complexScenarios: [
      "Advisor risk scoring: combine asic_filings (late lodgement rate) with advisor_performance (client churn rate) using advisor_id to produce a composite risk indicator",
      "Feedback-to-churn correlation: join aggregated_customer_feedback with client_retention_quarterly on product_id and quarter to identify which sentiment drops predict churn spikes"
    ]
  },
  {
    id: "smartdocs360",
    name: "SmartDocs 360",
    short: "SmartDocs",
    domain: "Document intelligence and workflow automation",
    color: "#18cdc5",
    skillTrigger: "Questions about document processing volumes, workflow stage completion, extraction accuracy, template performance, or processing time bottlenecks",
    tables: [
      { name: "mart.document_processing", desc: "Volume, accuracy, and end-to-end processing time per document type and extraction model" },
      { name: "mart.workflow_completions", desc: "Stage-level completion rates with drop-off attribution and SLA tracking" },
      { name: "mart.extraction_quality", desc: "Field-level extraction confidence scores, error rates, and model version comparisons" },
      { name: "mart.template_usage", desc: "Template adoption counts, version history, and per-template success and failure rates" }
    ],
    complexScenarios: [
      "Bottleneck detection: join workflow_completions with document_processing on workflow_id to find which stage-to-stage transitions have the highest average processing time",
      "Accuracy trend analysis: 30-day rolling average of extraction_quality.confidence grouped by document_type and extraction_model_version to track model drift"
    ]
  }
];

const agentcoreFeatures = [
  {
    title: "Stateful Session Execution",
    badge: "Persistence",
    description: "Each conversation runs inside a persistent AgentCore session. The agent retains state across tool calls — downloaded CSVs, generated charts, prior query results, and conversation context all remain accessible throughout the session.",
    impact: "A user can ask 'now break that down by quarter' and the agent refers back to the same data without re-querying Athena."
  },
  {
    title: "Session Isolation",
    badge: "Security",
    description: "Each user gets a fully isolated execution environment. No shared file system, no shared memory, and no cross-session data leakage — meeting the strict data separation requirements of financial services regulations.",
    impact: "An advisor querying one client's fund data cannot accidentally access or affect another client's session, even under concurrent load."
  },
  {
    title: "Identity-Based Access Control",
    badge: "Compliance",
    description: "AgentCore integrates with existing identity providers. The agent inherits the calling user's permissions so data access aligns with your existing IAM policies — no separate permission layer to build or maintain.",
    impact: "A junior analyst's session can only query the analytic tables they are authorized to see, enforced at the session level, not just at the UI."
  },
  {
    title: "Sandboxed Code Execution",
    badge: "Safety",
    description: "Python scripts the agent writes run inside a sandboxed environment on AgentCore. File system writes land in a defined output path. No uncontrolled network access. No persistent side effects outside the session boundary.",
    impact: "The agent can experiment with data transformations and chart styles without any risk of touching production systems or leaking data across requests."
  }
];

// ── State ─────────────────────────────────────────────────────────────────

let selectedQueryId = "feedback";
let currentStep = 0;
let selectedProductId = "sf360";

let footerLikeBtn;
let footerLikeCount;

// ── Helpers ───────────────────────────────────────────────────────────────

function getSelectedQuery() {
  return businessQueries.find((q) => q.id === selectedQueryId) || businessQueries[0];
}

function getSelectedProduct() {
  return products.find((p) => p.id === selectedProductId) || products[0];
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  const icon = document.getElementById("theme-toggle-icon");
  if (icon) icon.textContent = theme === "light" ? "☀" : "☾";
}

function initTheme() {
  const saved = localStorage.getItem("theme") || "dark";
  applyTheme(saved);
  const btn = document.getElementById("theme-toggle");
  if (btn) {
    btn.addEventListener("click", () => {
      const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
      localStorage.setItem("theme", next);
      applyTheme(next);
    });
  }
}

// ── Render: query selector ────────────────────────────────────────────────

function renderQuerySelector() {
  const row = document.getElementById("query-chip-row");
  if (!row) return;
  row.innerHTML = businessQueries
    .map(
      (q) => `
    <button
      class="chip decision-chip ${q.id === selectedQueryId ? "active" : ""}"
      type="button"
      data-id="${q.id}"
    >${q.label}</button>
  `
    )
    .join("");
  row.querySelectorAll("[data-id]").forEach((btn) => {
    btn.addEventListener("click", () => {
      selectedQueryId = btn.dataset.id;
      currentStep = 0;
      renderQuerySelector();
      renderFlowSection();
    });
  });
}

// ── Render: flow section ──────────────────────────────────────────────────

function renderFlowSection() {
  const query = getSelectedQuery();
  const steps = getFlowSteps(query);
  const step = steps[currentStep];

  const questionEl = document.getElementById("flow-question");
  if (questionEl) {
    questionEl.innerHTML = `
      <p class="eyebrow">${query.domain}</p>
      <blockquote class="flow-question-text">"${query.question}"</blockquote>
      <div class="flow-meta-row">
        <span class="capability-pattern">Skill: ${query.skillName}</span>
        <span class="capability-pattern">${query.tables.length} analytic tables</span>
      </div>
    `;
  }

  const progress = document.getElementById("flow-progress");
  if (progress) {
    progress.innerHTML = steps
      .map(
        (s, i) => `
      <button
        class="flow-pip ${i === currentStep ? "active" : i < currentStep ? "done" : ""}"
        type="button"
        data-step="${i}"
        title="${s.label}"
      >
        <span class="flow-pip-num">${s.number}</span>
        <span class="flow-pip-label">${s.label}</span>
      </button>
    `
      )
      .join("");
    progress.querySelectorAll("[data-step]").forEach((btn) => {
      btn.addEventListener("click", () => {
        currentStep = parseInt(btn.dataset.step, 10);
        renderFlowSection();
      });
    });
  }

  const detail = document.getElementById("flow-detail");
  if (detail) {
    detail.innerHTML = `
      <div class="flow-step-card">
        <div class="flow-step-head">
          <div class="flow-step-num-badge">${step.number}</div>
          <div class="flow-step-meta">
            <p class="eyebrow" style="margin-bottom:4px">${step.label}</p>
            <h3>${step.title}</h3>
            <p class="flow-step-who">${step.who}</p>
          </div>
        </div>
        <p class="flow-step-description">${step.description}</p>
        ${
          step.sql
            ? `
          <div class="flow-step-block">
            <span class="flow-step-block-label">Generated SQL</span>
            <pre class="skill-stage-snippet"><code>${step.sql}</code></pre>
          </div>
        `
            : ""
        }
        ${
          step.agentOutput
            ? `
          <div class="flow-step-block">
            <span class="flow-step-block-label">Agent output</span>
            <pre class="flow-agent-output">${step.agentOutput}</pre>
          </div>
        `
            : ""
        }
      </div>
    `;
  }

  const prevBtn = document.getElementById("flow-prev-btn");
  const nextBtn = document.getElementById("flow-next-btn");
  const counter = document.getElementById("flow-step-counter");

  if (prevBtn) prevBtn.disabled = currentStep === 0;
  if (nextBtn) nextBtn.disabled = currentStep === steps.length - 1;
  if (counter) counter.textContent = `Step ${currentStep + 1} of ${steps.length}`;
}

// ── Render: architecture layers ───────────────────────────────────────────

function renderArchitectureLayers() {
  const board = document.getElementById("arch-layers-board");
  if (!board) return;

  board.innerHTML = architectureLayers
    .map(
      (layer) => `
    <article class="arch-layer-card" style="--layer-color:${layer.badgeColor}">
      <div class="arch-layer-head">
        <h3>${layer.title}</h3>
        <span class="capability-pattern arch-layer-badge" style="--badge-c:${layer.badgeColor}">${layer.badge}</span>
      </div>
      <p>${layer.description}</p>
      <ul class="arch-layer-list">
        ${layer.responsibilities
          .map(
            (r) => `
          <li class="arch-layer-item">
            <strong>${r.label}</strong>
            <p>${r.detail}</p>
          </li>
        `
          )
          .join("")}
      </ul>
    </article>
  `
    )
    .join("");
}

// ── Render: modular knowledge ─────────────────────────────────────────────

function renderKnowledge() {
  const tabRow = document.getElementById("knowledge-product-row");
  const panel = document.getElementById("knowledge-panel");
  if (!tabRow || !panel) return;

  const product = getSelectedProduct();

  tabRow.innerHTML = products
    .map(
      (p) => `
    <button
      class="chip decision-chip ${p.id === selectedProductId ? "active" : ""}"
      type="button"
      data-id="${p.id}"
    >${p.short}</button>
  `
    )
    .join("");

  tabRow.querySelectorAll("[data-id]").forEach((btn) => {
    btn.addEventListener("click", () => {
      selectedProductId = btn.dataset.id;
      renderKnowledge();
    });
  });

  panel.innerHTML = `
    <div class="knowledge-grid">
      <article class="knowledge-card">
        <div class="knowledge-card-head">
          <span class="eyebrow">Global Context</span>
          <span class="capability-pattern">CLAUDE.md</span>
        </div>
        <p>Project-wide instructions shared by all skills. Defines the data folder structure, environment config, and how to run Athena queries.</p>
        <pre class="skill-stage-snippet"><code># Analytics Agent — BGL Data Platform

## Project context
AI agent for querying analytic mart tables built on
Amazon Athena and dbt. Tables are pre-aggregated and
business-logic-complete under the \`mart.\` schema.

## SQL execution
- Use the run_athena_query tool for all SELECT queries
- Results arrive as CSV at /results/raw/
- Final outputs (charts, summaries) go to /results/output/

## Environments
- TEST:  athena-test.bgl.internal
- PROD:  athena-prod.bgl.internal

## Data folder structure
data/
  mart/
    [table_name]/
      schema.md        ← column definitions + data dict
      sample_data.csv  ← 20-row representative sample
      statistics.md    ← row counts, nulls, distributions

## Security
Only SELECT queries are permitted. The validation layer
will reject any query containing write operations.</code></pre>
      </article>

      <article class="knowledge-card knowledge-card-accent" style="--product-color:${product.color}">
        <div class="knowledge-card-head">
          <span class="eyebrow">Domain Expertise · ${product.name}</span>
          <span class="capability-pattern" style="border-color:color-mix(in srgb, ${product.color} 30%, var(--line));color:${product.color}">skills/${product.id}/SKILL.md</span>
        </div>
        <p>${product.name} — ${product.domain}</p>
        <pre class="skill-stage-snippet"><code># ${product.name} Data Analyst

## When to trigger
${product.skillTrigger}

## Analytic tables
${product.tables.map((t) => `${t.name}\n  → ${t.desc}`).join("\n\n")}

## Complex scenario guidance
${product.complexScenarios.map((s, i) => `${i + 1}. ${s}`).join("\n\n")}</code></pre>
        <div class="knowledge-tables-grid">
          ${product.tables
            .map(
              (t) => `
            <div class="knowledge-table-row">
              <strong>${t.name}</strong>
              <p>${t.desc}</p>
            </div>
          `
            )
            .join("")}
        </div>
      </article>
    </div>
  `;
}

// ── Render: AgentCore features ────────────────────────────────────────────

function renderAgentcoreFeatures() {
  const board = document.getElementById("agentcore-features-board");
  if (!board) return;

  board.innerHTML = agentcoreFeatures
    .map(
      (feature) => `
    <article class="agentcore-feature-card">
      <div class="agentcore-feature-head">
        <h4>${feature.title}</h4>
        <span class="capability-pattern">${feature.badge}</span>
      </div>
      <p>${feature.description}</p>
      <div class="agentcore-callout">
        <span>In practice</span>
        <strong>${feature.impact}</strong>
      </div>
    </article>
  `
    )
    .join("");
}

// ── Render: footer like ───────────────────────────────────────────────────

function renderFooterLike() {
  const state = likeStore.read();
  if (footerLikeCount) footerLikeCount.textContent = state.count;
  if (footerLikeBtn) {
    footerLikeBtn.classList.toggle("liked", state.liked);
    const icon = footerLikeBtn.querySelector(".like-icon");
    if (icon) icon.textContent = state.liked ? "♥" : "♡";
  }
}

function toggleFooterLike() {
  const state = likeStore.read();
  const next = { liked: !state.liked, count: state.liked ? Math.max(0, state.count - 1) : state.count + 1 };
  likeStore.write(next);
  renderFooterLike();

  if (next.liked) {
    fetch("/api/like", { method: "POST" })
      .then((r) => r.json())
      .then((data) => {
        likeStore.write({ liked: true, count: data.total });
        renderFooterLike();
      })
      .catch(() => {});
  }
}

// ── Render: all ───────────────────────────────────────────────────────────

function render() {
  renderQuerySelector();
  renderFlowSection();
  renderArchitectureLayers();
  renderKnowledge();
  renderAgentcoreFeatures();
}

// ── Init ──────────────────────────────────────────────────────────────────

function initApp() {
  footerLikeBtn = document.getElementById("footer-like-btn");
  footerLikeCount = document.getElementById("footer-like-count");

  // Flow nav buttons wired once
  const prevBtn = document.getElementById("flow-prev-btn");
  const nextBtn = document.getElementById("flow-next-btn");
  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      if (currentStep > 0) {
        currentStep--;
        renderFlowSection();
      }
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      const steps = getFlowSteps(getSelectedQuery());
      if (currentStep < steps.length - 1) {
        currentStep++;
        renderFlowSection();
      }
    });
  }

  if (footerLikeBtn) footerLikeBtn.addEventListener("click", toggleFooterLike);

  initTheme();
  renderFooterLike();

  fetch("/api/like")
    .then((r) => r.json())
    .then((data) => {
      const state = likeStore.read();
      likeStore.write({ liked: state.liked, count: data.total });
      renderFooterLike();
    })
    .catch(() => {});

  render();
}

initApp();
