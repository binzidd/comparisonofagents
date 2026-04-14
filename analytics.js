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
    } catch (_) {
      return { count: 0, liked: false };
    }
  },
  write(next) {
    window.localStorage.setItem(this.storageKey, JSON.stringify(next));
  }
};

// ── Data: products ────────────────────────────────────────────────────────

const products = [
  {
    id: "sf360",
    name: "Simple Fund 360",
    short: "SF360",
    domain: "Fund administration and compliance",
    color: "#4b8dff",
    skillTrigger: "Questions about fund compliance, investment performance, member contributions, contribution caps, or regulatory reporting obligations",
    tables: [
      { name: "mart.compliance_tracking",   desc: "Per-fund compliance status with obligation tracking and breach history" },
      { name: "mart.investment_performance", desc: "Holdings, returns, and benchmark comparisons by account and asset class" },
      { name: "mart.member_contributions",   desc: "Contribution amounts, caps, catch-up contributions, and historical trends" },
      { name: "mart.fund_status",            desc: "Active/inactive fund registry with administrator assignment and audit trail" }
    ],
    complexScenarios: [
      "Multi-year compliance trends: join compliance_tracking with fund_status using fund_id to track cohort status transitions over time",
      "Contribution cap breach detection: aggregate member_contributions by financial_year and member_id, then compare against cap thresholds from mart.contribution_caps"
    ]
  },
  {
    id: "cas360",
    name: "CAS 360",
    short: "CAS360",
    domain: "Company and trust management",
    color: "#7fb1ff",
    skillTrigger: "Questions about company structures, trust deeds, filing status, shareholder records, client feedback, or advisor performance",
    tables: [
      { name: "mart.aggregated_customer_feedback", desc: "Sentiment-scored feedback aggregated per product and quarter with NPS and category breakdown" },
      { name: "mart.advisor_performance",          desc: "AUM, retention rate, filing accuracy, and client satisfaction score per advisor" },
      { name: "mart.entity_filings",               desc: "Lodgement status, due dates, overdue count, and penalty risk by entity" },
      { name: "mart.client_retention_quarterly",   desc: "Quarterly cohort retention with churn attribution and reactivation tracking" }
    ],
    complexScenarios: [
      "Advisor risk scoring: combine entity_filings (late lodgement rate) with advisor_performance (client churn rate) using advisor_id to produce a composite risk indicator",
      "Feedback-to-churn correlation: join aggregated_customer_feedback with client_retention_quarterly on product_id and quarter to find which sentiment drops predict churn spikes"
    ]
  },
  {
    id: "smartdocs360",
    name: "SmartDocs 360",
    short: "SmartDocs",
    domain: "Document intelligence and workflow automation",
    color: "#18cdc5",
    skillTrigger: "Questions about document processing volumes, workflow stage completions, extraction accuracy, template performance, or processing time bottlenecks",
    tables: [
      { name: "mart.document_processing",  desc: "Volume, accuracy, and end-to-end processing time per document type and extraction model" },
      { name: "mart.workflow_completions", desc: "Stage-level completion rates with drop-off attribution and SLA tracking" },
      { name: "mart.extraction_quality",   desc: "Field-level extraction confidence scores, error rates, and model version comparisons" },
      { name: "mart.template_usage",       desc: "Template adoption counts, version history, and per-template success and failure rates" }
    ],
    complexScenarios: [
      "Bottleneck detection: join workflow_completions with document_processing on workflow_id to find stage transitions with the highest average processing time",
      "Accuracy trend: 30-day rolling average of extraction_quality.confidence grouped by document_type and extraction_model_version to detect model drift"
    ]
  }
];

// ── Data: queries (one product id per query) ──────────────────────────────

const businessQueries = [
  {
    id: "investment",
    productId: "sf360",
    label: "Investment Trends",
    question: "Show me investment trends for high-net-worth accounts.",
    domain: "Investment Analytics",
    tables: ["mart.investment_performance", "mart.account_tiers"],
    sql: [
      "SELECT",
      "  asset_class,",
      "  SUM(holding_value)          AS total_value,",
      "  AVG(return_pct)             AS avg_return,",
      "  COUNT(DISTINCT account_id)  AS account_count",
      "FROM mart.investment_performance",
      "WHERE account_tier = 'high_net_worth'",
      "  AND period_month >= DATE_TRUNC('month',",
      "        CURRENT_DATE - INTERVAL '12' MONTH)",
      "GROUP BY asset_class",
      "ORDER BY total_value DESC"
    ].join("\n"),
    resultShape: "8 rows · 4 columns",
    visualization: "Stacked area chart: holding value by asset class over 12 months",
    insight: "Equities grew 18% YoY for high-net-worth accounts; property trusts saw a 6% decline in average return."
  },
  {
    id: "compliance",
    productId: "sf360",
    label: "Fund Compliance",
    question: "What is the compliance rate across all active funds?",
    domain: "Compliance Analytics",
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
    id: "feedback",
    productId: "cas360",
    label: "Product Feedback",
    question: "Which products had the most negative feedback last quarter?",
    domain: "Customer Analytics",
    tables: ["mart.aggregated_customer_feedback"],
    sql: [
      "SELECT",
      "  product_name,",
      "  COUNT(*)                      AS negative_reviews,",
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
    insight: "The billing module drove 2.3× more negative feedback than any other area in the last quarter."
  },
  {
    id: "retention",
    productId: "cas360",
    label: "Advisor Retention",
    question: "Which advisors have the highest client retention in Q4?",
    domain: "Advisor Analytics",
    tables: ["mart.advisor_performance", "mart.client_retention_quarterly"],
    sql: [
      "SELECT",
      "  advisor_name,",
      "  COUNT(DISTINCT client_id)      AS active_clients,",
      "  ROUND(retention_rate * 100, 1) AS retention_pct,",
      "  SUM(assets_under_management)   AS total_aum",
      "FROM mart.advisor_performance",
      "WHERE quarter_label = 'Q4'",
      "  AND employment_status = 'active'",
      "ORDER BY retention_rate DESC",
      "LIMIT 10"
    ].join("\n"),
    resultShape: "10 rows · 4 columns",
    visualization: "Ranked table with sparklines: top 10 advisors by retention rate",
    insight: "Top 3 advisors averaged 97.4% retention and 2.8× the median AUM per client."
  },
  {
    id: "processing",
    productId: "smartdocs360",
    label: "Processing Bottleneck",
    question: "What is the processing time bottleneck across document types?",
    domain: "Operational Analytics",
    tables: ["mart.document_processing", "mart.workflow_completions"],
    sql: [
      "SELECT",
      "  document_type,",
      "  AVG(processing_time_sec)   AS avg_sec,",
      "  MAX(processing_time_sec)   AS max_sec,",
      "  COUNT(*)                   AS total_docs,",
      "  SUM(CASE WHEN processing_time_sec > sla_threshold_sec",
      "      THEN 1 ELSE 0 END)     AS sla_breaches",
      "FROM mart.document_processing",
      "WHERE processed_date >= CURRENT_DATE - INTERVAL '30' DAY",
      "GROUP BY document_type",
      "ORDER BY avg_sec DESC",
      "LIMIT 10"
    ].join("\n"),
    resultShape: "10 rows · 5 columns",
    visualization: "Bar chart: average vs max processing time with SLA breach overlay",
    insight: "Tax return documents average 4.2× longer processing than invoices; 18% of that volume breaches SLA."
  },
  {
    id: "accuracy",
    productId: "smartdocs360",
    label: "Extraction Accuracy",
    question: "Which templates have the lowest extraction accuracy this month?",
    domain: "Quality Analytics",
    tables: ["mart.extraction_quality", "mart.template_usage"],
    sql: [
      "SELECT",
      "  template_name,",
      "  AVG(confidence_score)    AS avg_confidence,",
      "  COUNT(*)                 AS total_extractions,",
      "  ROUND(100.0 *",
      "    SUM(CASE WHEN is_correct THEN 1 ELSE 0 END)",
      "    / COUNT(*), 1)         AS accuracy_pct",
      "FROM mart.extraction_quality",
      "WHERE extraction_date >= DATE_TRUNC('month', CURRENT_DATE)",
      "GROUP BY template_name",
      "ORDER BY accuracy_pct ASC",
      "LIMIT 10"
    ].join("\n"),
    resultShape: "10 rows · 4 columns",
    visualization: "Heatmap: accuracy by template and extraction field",
    insight: "Legacy EOFY template accuracy dropped to 71% this month — well below the 90% threshold."
  }
];

// ── Data: architecture layers ─────────────────────────────────────────────

const architectureLayers = [
  {
    title: "Data Foundation Layer",
    badge: "Amazon S3 + Athena",
    badgeColor: "#1f5f5b",
    description: "Data is stored in S3 as partitioned Parquet files and queried via Athena external tables. Business logic — aggregations, KPI definitions, compliance rules — is encoded here before the agent ever sees the data.",
    responsibilities: [
      {
        label: "Structured S3 Storage",
        detail: "Analytic tables live in S3 as typed, partitioned Parquet files. Athena external table definitions map SQL names to S3 paths — giving the agent a clean relational interface over object storage."
      },
      {
        label: "Business Rules in Views",
        detail: "Compliance thresholds, metric calculations, and KPI definitions are encoded in Athena views and CTAS jobs — not in agent prompts. Rules cannot drift because they are not part of the language model."
      },
      {
        label: "Schema Enforcement",
        detail: "Column types and partition schemas are enforced via the Glue Data Catalog. The agent always reads typed, validated data — malformed rows are filtered at the storage layer."
      },
      {
        label: "Single Source of Truth",
        detail: "BI tools, scheduled reports, and the AI agent all query the same S3-backed Athena tables. A schema change propagates everywhere without touching any agent configuration."
      }
    ]
  },
  {
    title: "Agent Layer",
    badge: "Claude Agent SDK",
    badgeColor: "#4b8dff",
    description: "The agent handles language and orchestration only — not data transformation. It interprets questions, loads the right skill, writes basic SELECT statements, and executes Python to turn results into insights.",
    responsibilities: [
      {
        label: "Language Understanding",
        detail: "Translates natural language questions into structured data requests and identifies the right product skill to activate."
      },
      {
        label: "Skill Orchestration",
        detail: "Reads the matching SKILL.md to gain domain-specific table knowledge and complex-query guidance before writing any SQL."
      },
      {
        label: "SELECT Query Generation",
        detail: "Writes basic SELECT queries against well-structured Athena tables. Joins and aggregations are pre-encoded in the data layer — not reproduced in agent SQL."
      },
      {
        label: "Code Execution",
        detail: "Writes and runs sandboxed Python to process downloaded CSVs and generate charts — without loading any raw data into the context window."
      }
    ]
  }
];

// ── Data: AgentCore features ──────────────────────────────────────────────

const agentcoreFeatures = [
  {
    title: "Stateful Session Execution",
    badge: "Persistence",
    description: "Each conversation runs inside a persistent AgentCore session. The agent retains state across tool calls — downloaded CSVs, generated charts, prior query results, and conversation context all remain accessible throughout the session.",
    impact: "A user can ask 'now break that down by quarter' and the agent refers to the same downloaded file without re-querying Athena."
  },
  {
    title: "Session Isolation",
    badge: "Security",
    description: "Each user gets a fully isolated execution environment. No shared file system, no shared memory, and no cross-session data leakage — meeting strict data separation requirements.",
    impact: "A user querying one account's data cannot accidentally access or affect another user's session, even under concurrent load."
  },
  {
    title: "Identity-Based Access Control",
    badge: "Compliance",
    description: "AgentCore integrates with existing identity providers. The agent inherits the calling user's permissions so data access aligns with your existing IAM policies — no separate permission layer to build.",
    impact: "A read-only analyst's session can only query the Athena tables they are authorized to see, enforced at the session level."
  },
  {
    title: "Sandboxed Code Execution",
    badge: "Safety",
    description: "Python scripts the agent writes run inside a sandboxed environment. File system writes land in a defined output path. No uncontrolled network access. No persistent side effects outside the session boundary.",
    impact: "The agent can iterate on chart styles and data transformations without any risk of touching production systems or leaking results."
  }
];

// ── Layer metadata ────────────────────────────────────────────────────────

// Maps index → arch-layer-card order (must match architectureLayers array)
const LAYERS = [
  { index: 0, name: "Data Foundation Layer", label: "Amazon S3 + Athena", color: "#1f8f8a" },
  { index: 1, name: "Agent Layer",           label: "Claude Agent SDK",   color: "#4b8dff" }
];

// ── Knowledge excerpts per step ───────────────────────────────────────────

// CLAUDE.md accent = teal, SKILL.md accent = product color
const CLAUDE_COLOR = "#18cdc5";

function getKnowledgeExcerpt(stepIndex, product, query) {
  const queryTables = product.tables.filter((t) => query.tables.includes(t.name));
  const tableBlock = queryTables.length
    ? queryTables.map((t) => `${t.name}\n  → ${t.desc}`).join("\n\n")
    : product.tables.slice(0, 2).map((t) => `${t.name}\n  → ${t.desc}`).join("\n\n");

  switch (stepIndex) {
    case 0:
      return {
        active: false,
        fileType: null,
        fileColor: null,
        sectionLabel: null,
        filePath: null,
        note: "No knowledge files loaded yet. The agent identifies this as a data analytics request and determines the relevant product domain before loading any file.",
        code: null
      };

    case 1:
      return {
        active: true,
        fileType: "skill",
        fileColor: product.color,
        sectionLabel: "When to trigger · Analytic tables",
        filePath: `skills/${product.id}/SKILL.md`,
        note: "Agent reads the trigger conditions to confirm this skill matches the question, then scans the full table list to understand available data.",
        code: [
          `# ${product.name} Data Analyst`,
          ``,
          `## When to trigger`,
          product.skillTrigger,
          ``,
          `## Analytic tables`,
          ...product.tables.map((t) => `${t.name}\n  → ${t.desc}`)
        ].join("\n")
      };

    case 2:
      return {
        active: true,
        fileType: "skill",
        fileColor: product.color,
        sectionLabel: "Analytic tables (query-relevant)",
        filePath: `skills/${product.id}/SKILL.md`,
        note: "Skill narrows to the tables that answer this specific question. Agent reads schema.md and sample_data.csv for each before writing any SQL.",
        code: [
          `## Analytic tables (relevant to this query)`,
          ``,
          tableBlock,
          ``,
          `# Also references: CLAUDE.md`,
          ``,
          `## SQL execution`,
          `- Run SELECT queries via run_athena_query`,
          `- Results → s3://results-bucket/queries/`,
          `- Download CSV to /results/raw/ before analysis`
        ].join("\n")
      };

    case 3:
      return {
        active: true,
        fileType: "claude",
        fileColor: CLAUDE_COLOR,
        sectionLabel: "Security",
        filePath: "CLAUDE.md",
        note: "The SELECT-only rule is defined globally in CLAUDE.md. The validation layer enforces it against every generated query before it reaches Athena.",
        code: [
          `## Security`,
          ``,
          `Only SELECT queries are permitted.`,
          `The validation layer rejects any query`,
          `containing write operations:`,
          ``,
          `  Blocked: DELETE · UPDATE · INSERT`,
          `           DROP   · ALTER  · TRUNCATE`,
          ``,
          `If a write keyword is detected, the query`,
          `is rejected and the agent must revise.`
        ].join("\n")
      };

    case 4:
      return {
        active: true,
        fileType: "claude",
        fileColor: CLAUDE_COLOR,
        sectionLabel: "SQL execution · Environments",
        filePath: "CLAUDE.md",
        note: "CLAUDE.md tells the agent where Athena results land in S3 and where to download the CSV — keeping large result sets entirely off the context window.",
        code: [
          `## SQL execution`,
          `- Use run_athena_query for all SELECT queries`,
          `- Athena writes results to:`,
          `    s3://results-bucket/queries/{query_id}.csv`,
          `- Download CSV to /results/raw/ for analysis`,
          `- Save final outputs to /results/output/`,
          ``,
          `## Environments`,
          `- TEST: s3://analytics-test/mart/`,
          `- PROD: s3://analytics-prod/mart/`,
          ``,
          `## Data folder structure`,
          `data/mart/[table_name]/`,
          `  schema.md        ← column defs`,
          `  sample_data.csv  ← 20-row sample`,
          `  statistics.md    ← distributions`
        ].join("\n")
      };

    case 5:
      return {
        active: true,
        fileType: "claude",
        fileColor: CLAUDE_COLOR,
        sectionLabel: "Output conventions · Python execution",
        filePath: "CLAUDE.md",
        note: "Agent reads the output path from CLAUDE.md to know where to save the chart and summary so the session can return them to the user.",
        code: [
          `## Output conventions`,
          ``,
          `Charts  → /results/output/chart.png`,
          `Tables  → /results/output/summary.csv`,
          `Reports → /results/output/report.md`,
          ``,
          `## Python execution`,
          `- Write scripts to /tmp/analysis.py`,
          `- Read from /results/raw/query_result.csv`,
          `- Sandboxed: no network access outside`,
          `  allowed Athena and S3 endpoints`,
          `- No persistent side effects outside /results/`
        ].join("\n")
      };

    case 6:
      return {
        active: true,
        fileType: "skill",
        fileColor: product.color,
        sectionLabel: "Complex scenario guidance",
        filePath: `skills/${product.id}/SKILL.md`,
        note: "Session stays open for follow-ups. The skill's multi-step guidance applies if the user continues the conversation with a harder question.",
        code: [
          `## Complex scenario guidance`,
          ``,
          ...product.complexScenarios.map((s, i) => `${i + 1}. ${s}`)
        ].join("\n")
      };

    default:
      return { active: false, fileType: null, fileColor: null, sectionLabel: null, filePath: null, note: "", code: null };
  }
}

// ── State ─────────────────────────────────────────────────────────────────

let selectedProductId = "sf360";
let selectedQueryId = "investment";
let currentStep = 0;
let footerLikeBtn;
let footerLikeCount;

// ── Helpers ───────────────────────────────────────────────────────────────

function queriesForProduct(productId) {
  return businessQueries.filter((q) => q.productId === productId);
}

function getSelectedProduct() {
  return products.find((p) => p.id === selectedProductId) || products[0];
}

function getSelectedQuery() {
  const available = queriesForProduct(selectedProductId);
  return available.find((q) => q.id === selectedQueryId) || available[0];
}

function getFlowSteps(query) {
  const product = getSelectedProduct();
  return [
    {
      number: "01",
      label: "User Request",
      who: "User → AgentCore",
      layer: 1,
      title: "Natural language question received",
      description: `"${query.question}"`,
      agentOutput: "AgentCore opens an isolated session with identity-based access controls. Agent identifies this as a data analytics request and begins reasoning about the relevant product domain.",
      sql: null
    },
    {
      number: "02",
      label: "Schema Discovery",
      who: "Agent → Skills",
      layer: 1,
      title: `${product.name} skill triggered`,
      description: `Agent reads the question and triggers the ${product.name} skill to gain domain-specific table expertise.`,
      agentOutput: [
        `Skill loaded: skills/${product.id}/SKILL.md`,
        ``,
        `Tables identified:`,
        ...query.tables.map((t) => `  · ${t}`),
        ``,
        `Reading schema.md and sample_data.csv for each table`,
        `via CLAUDE.md data folder structure.`
      ].join("\n"),
      sql: null
    },
    {
      number: "03",
      label: "SQL Generation",
      who: "Agent → Athena",
      layer: 1,
      title: "SELECT query written against analytic tables",
      description: "Agent writes a SQL SELECT query targeting pre-aggregated Athena tables. Joins, aggregations, and business rules are already encoded in the table — the agent only writes basic SELECT statements.",
      agentOutput: null,
      sql: query.sql
    },
    {
      number: "04",
      label: "Security Validation",
      who: "Security Layer",
      layer: 1,
      title: "Query inspected before reaching Athena",
      description: "A validation layer scans the generated SQL. Any query containing a write keyword is rejected before it reaches Athena.",
      agentOutput: [
        `Validation passed.`,
        ``,
        `Allowed:  SELECT`,
        `Blocked:  DELETE · UPDATE · INSERT · DROP · ALTER · TRUNCATE`,
        ``,
        `Query cleared for execution.`
      ].join("\n"),
      sql: null
    },
    {
      number: "05",
      label: "Query Execution",
      who: "Athena → S3",
      layer: 0,
      title: "Athena runs the query; result written to S3",
      description: "Athena executes the validated query against tables stored in S3 as Parquet. Results are written back to S3 as CSV. The agent downloads the file to its local file system — bypassing the context window entirely.",
      agentOutput: [
        `Query result: ${query.resultShape}`,
        ``,
        `Athena result → s3://results-bucket/queries/result.csv`,
        `Downloaded   → /results/raw/query_result.csv`,
        ``,
        `Context window tokens used for data: 0`,
        `(file system bypass — no token limit risk)`
      ].join("\n"),
      sql: null
    },
    {
      number: "06",
      label: "Analysis",
      who: "Agent → Python",
      layer: 1,
      title: "Python processes the CSV and generates a chart",
      description: "Agent writes and executes a sandboxed Python script to analyze the result set. The script reads the CSV from the file system, applies transformations, and produces the requested visualization.",
      agentOutput: [
        `Chart produced: ${query.visualization}`,
        ``,
        `Saved to: /results/output/chart.png`,
        ``,
        `Python executed in sandboxed AgentCore environment.`,
        `No production system access. No cross-session state.`
      ].join("\n"),
      sql: null
    },
    {
      number: "07",
      label: "Response",
      who: "AgentCore → User",
      layer: 1,
      title: "Insight and chart delivered to the user",
      description: "The chart, summary, and supporting data are formatted and returned to the user. The session stays open for follow-up questions — the agent retains all downloaded files and prior context.",
      agentOutput: [
        `Insight: ${query.insight}`,
        ``,
        `Session preserved — user can ask follow-up questions`,
        `without re-querying Athena.`
      ].join("\n"),
      sql: null
    }
  ];
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

// ── Render: product selector ──────────────────────────────────────────────

function renderProductSelector() {
  const row = document.getElementById("product-chip-row");
  if (!row) return;
  row.innerHTML = products
    .map(
      (p) => `
    <button class="chip decision-chip ${p.id === selectedProductId ? "active" : ""}" type="button" data-id="${p.id}">
      ${p.short}
    </button>`
    )
    .join("");
  row.querySelectorAll("[data-id]").forEach((btn) => {
    btn.addEventListener("click", () => {
      selectedProductId = btn.dataset.id;
      // Reset to first query of new product
      const available = queriesForProduct(selectedProductId);
      selectedQueryId = available[0]?.id || selectedQueryId;
      currentStep = 0;
      renderProductSelector();
      renderQuerySelector();
      renderFlowSection();
    });
  });
}

// ── Render: query selector ────────────────────────────────────────────────

function renderQuerySelector() {
  const row = document.getElementById("query-chip-row");
  if (!row) return;
  const available = queriesForProduct(selectedProductId);
  row.innerHTML = available
    .map(
      (q) => `
    <button class="chip decision-chip ${q.id === selectedQueryId ? "active" : ""}" type="button" data-id="${q.id}">
      ${q.label}
    </button>`
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

// ── Layer highlight (ties Separation of Concerns to the active step) ──────

function updateLayerHighlight(layerIndex) {
  document.querySelectorAll(".arch-layer-card").forEach((card, i) => {
    card.classList.toggle("arch-active", i === layerIndex);
    card.classList.toggle("arch-dim", i !== layerIndex);
  });
  const callout = document.getElementById("layer-live-callout");
  if (callout) {
    const meta = LAYERS[layerIndex];
    callout.innerHTML = `Active now: <strong>${meta.name}</strong> &mdash; ${meta.label}`;
    callout.style.setProperty("--callout-c", meta.color);
    callout.removeAttribute("hidden");
  }
}

// ── Render: flow section (step + knowledge panel) ─────────────────────────

function renderFlowSection() {
  const query = getSelectedQuery();
  const product = getSelectedProduct();
  const steps = getFlowSteps(query);
  const step = steps[currentStep];

  // Pre-compute all excerpts so each pip gets its file-hint color
  const allExcerpts = steps.map((_, i) => getKnowledgeExcerpt(i, product, query));
  const excerpt = allExcerpts[currentStep];

  // ── Question card ──
  const questionEl = document.getElementById("flow-question");
  if (questionEl) {
    questionEl.innerHTML = `
      <p class="eyebrow">${query.domain} · ${product.name}</p>
      <blockquote class="flow-question-text">"${query.question}"</blockquote>
      <div class="flow-meta-row">
        <span class="capability-pattern" style="border-color:color-mix(in srgb,${product.color} 30%,var(--line));color:${product.color}">
          Skill: ${product.name}
        </span>
        <span class="capability-pattern">${query.tables.length} analytic tables</span>
      </div>`;
  }

  // ── Timeline pips ──
  const progress = document.getElementById("flow-progress");
  if (progress) {
    const items = [];
    steps.forEach((s, i) => {
      const cls = i === currentStep ? "active" : i < currentStep ? "done" : "";
      const hint = allExcerpts[i].fileColor || "";
      const hintStyle = hint ? `background:${hint};opacity:1` : "";
      items.push(`
        <button class="flow-pip ${cls}" type="button" data-step="${i}">
          <span class="flow-pip-dot">${cls === "done" ? "✓" : s.number}</span>
          <span class="flow-pip-label">${s.label}</span>
          <span class="flow-pip-file-hint" style="${hintStyle}" title="${allExcerpts[i].fileType === "claude" ? "CLAUDE.md" : allExcerpts[i].fileType === "skill" ? "SKILL.md" : "No file"}"></span>
        </button>`);
      if (i < steps.length - 1) {
        items.push(`<div class="flow-connector ${i < currentStep ? "done" : ""}"></div>`);
      }
    });
    progress.innerHTML = items.join("");
    progress.querySelectorAll("[data-step]").forEach((btn) => {
      btn.addEventListener("click", () => {
        currentStep = parseInt(btn.dataset.step, 10);
        renderFlowSection();
      });
    });
  }

  // ── Step detail card ──
  const detail = document.getElementById("flow-detail");
  if (detail) {
    const layerMeta = LAYERS[step.layer];
    detail.innerHTML = `
      <div class="flow-step-card">
        <div class="flow-step-head">
          <div class="flow-step-num-badge">${step.number}</div>
          <div class="flow-step-meta">
            <p class="eyebrow" style="margin-bottom:4px">${step.label}</p>
            <h3>${step.title}</h3>
            <p class="flow-step-who">${step.who}</p>
          </div>
          <span class="flow-step-layer-tag" style="--layer-tag-c:${layerMeta.color}" title="Handled by ${layerMeta.name}">${layerMeta.label}</span>
        </div>
        <p class="flow-step-description">${step.description}</p>
        ${step.sql ? `
          <div class="flow-step-block">
            <span class="flow-step-block-label">Generated SQL</span>
            <pre class="skill-stage-snippet"><code>${step.sql}</code></pre>
          </div>` : ""}
        ${step.agentOutput ? `
          <div class="flow-step-block">
            <span class="flow-step-block-label">Agent output</span>
            <pre class="flow-agent-output">${step.agentOutput}</pre>
          </div>` : ""}
      </div>`;
  }

  // ── Knowledge panel ──
  const knowledge = document.getElementById("flow-knowledge");
  if (knowledge) {
    const accent = excerpt.fileColor || "rgba(126,155,196,0.25)";
    knowledge.style.setProperty("--knowledge-accent", accent);

    if (!excerpt.active) {
      knowledge.innerHTML = `
        <div class="flow-knowledge-inactive">
          <span class="flow-knowledge-file-name" style="color:var(--muted)">No knowledge file</span>
          <p class="flow-knowledge-note">${excerpt.note}</p>
        </div>`;
    } else {
      const fileLabel = excerpt.fileType === "claude" ? "CLAUDE.md" : "SKILL.md";
      knowledge.innerHTML = `
        <div class="flow-knowledge-header">
          <div class="flow-knowledge-file-top">
            <span class="flow-knowledge-file-name">${fileLabel}</span>
            <span class="flow-knowledge-section-name">§ ${excerpt.sectionLabel}</span>
          </div>
          <code class="flow-knowledge-file-path">${excerpt.filePath}</code>
        </div>
        <div class="flow-knowledge-body">
          <p class="flow-knowledge-note">${excerpt.note}</p>
          ${excerpt.code ? `<pre class="skill-stage-snippet" style="font-size:0.76rem;line-height:1.62"><code>${excerpt.code}</code></pre>` : ""}
        </div>`;
    }
  }

  // ── Nav state ──
  const prevBtn = document.getElementById("flow-prev-btn");
  const nextBtn = document.getElementById("flow-next-btn");
  const counter = document.getElementById("flow-step-counter");
  if (prevBtn) prevBtn.disabled = currentStep === 0;
  if (nextBtn) nextBtn.disabled = currentStep === steps.length - 1;
  if (counter) counter.textContent = `Step ${currentStep + 1} of ${steps.length}`;

  // ── Sync arch-layer highlight ──
  updateLayerHighlight(step.layer);
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
          </li>`
          )
          .join("")}
      </ul>
    </article>`
    )
    .join("");
}

// ── Render: AgentCore features ────────────────────────────────────────────

function renderAgentcoreFeatures() {
  const board = document.getElementById("agentcore-features-board");
  if (!board) return;
  board.innerHTML = agentcoreFeatures
    .map(
      (f) => `
    <article class="agentcore-feature-card">
      <div class="agentcore-feature-head">
        <h4>${f.title}</h4>
        <span class="capability-pattern">${f.badge}</span>
      </div>
      <p>${f.description}</p>
      <div class="agentcore-callout">
        <span>In practice</span>
        <strong>${f.impact}</strong>
      </div>
    </article>`
    )
    .join("");
}

// ── Data: best practices ──────────────────────────────────────────────────

const bestPractices = [
  {
    title: "Encode business logic in the data layer",
    principle: "Rules in Athena views, not agent prompts",
    detail: "Compliance thresholds, KPI definitions, and metric formulas belong in Athena views and CTAS jobs. Rules encoded in the data layer are version-controlled, testable, and single-sourced across every consumer.",
    example: "compliance_rate_pct is pre-calculated in mart.compliance_tracking — the agent SELECTs it, not computes it."
  },
  {
    title: "Bypass the context window for result sets",
    principle: "File system, not token budget",
    detail: "Route Athena results to S3, then download to the AgentCore file system. Never paste raw query output into the prompt — large result sets cause context limit errors and make responses non-deterministic.",
    example: "s3://results/query.csv → /results/raw/ (0 context tokens consumed for data)."
  },
  {
    title: "Scope each skill to one product domain",
    principle: "Narrow context, precise answers",
    detail: "Keep SKILL.md files scoped to a single product line. Skills that span multiple domains force the agent to sift through irrelevant table definitions and resolve naming conflicts inconsistently.",
    example: "skills/sf360/SKILL.md covers only fund administration — no CAS360 or SmartDocs tables."
  },
  {
    title: "Gate every query through a security layer",
    principle: "Hard block, not agent self-restriction",
    detail: "Intercept every generated query at a dedicated validation middleware before it reaches Athena. Block write keywords unconditionally — never rely on the agent to self-restrict its SQL output.",
    example: "Validation rejects any query containing DELETE, UPDATE, INSERT, DROP, ALTER, or TRUNCATE."
  },
  {
    title: "Ground schema knowledge in static files",
    principle: "schema.md + sample_data.csv, not live introspection",
    detail: "Provide schema.md and sample_data.csv per table via CLAUDE.md. Avoid live DESCRIBE TABLE calls at query time — they add latency, burn Athena query budget, and create a dependency on catalog availability.",
    example: "data/mart/compliance_tracking/schema.md is read at schema discovery, not queried live per request."
  },
  {
    title: "Keep sessions open for multi-turn queries",
    principle: "AgentCore session persistence",
    detail: "Use AgentCore's stateful sessions to preserve downloaded files, generated charts, and conversation context across turns. Re-querying Athena on every follow-up wastes cost and latency.",
    example: "User asks 'break that down by quarter' — agent reuses the already-downloaded CSV, no new Athena query."
  }
];

// ── Data: anti-patterns ───────────────────────────────────────────────────

const antiPatterns = [
  {
    title: "Loading result data into the context window",
    signal: "Prompt contains raw CSV rows or query output",
    detail: "Pasting Athena results directly into the prompt burns token budget, risks hitting context limits on large tables, and makes the model's answer dependent on how much data fits — not what the question needs.",
    fix: "Download results to the AgentCore file system. Use Python to process the file without touching the context window."
  },
  {
    title: "Agent writing complex joins and aggregations",
    signal: "Agent SQL contains multi-table JOINs with inline GROUP BY logic",
    detail: "When the agent builds joins from scratch, it duplicates business logic that belongs in the data layer. That logic drifts across sessions, cannot be audited, and is untestable outside the agent.",
    fix: "Pre-encode joins and aggregations in Athena views. The agent writes basic SELECT statements against pre-built mart tables."
  },
  {
    title: "Business rules hardcoded in prompts",
    signal: "System prompt or skill file contains threshold values or formula definitions",
    detail: "Encoding 'a compliance rate below 90% is a breach' in a prompt means the rule drifts from the data layer definition, lives outside version control, and must be updated manually per environment.",
    fix: "Define the rule once in an Athena view. The agent reads the pre-calculated result — it does not recompute the threshold."
  },
  {
    title: "One generic skill covering all products",
    signal: "Single SKILL.md lists tables from multiple product lines",
    detail: "A catch-all skill forces the agent to load irrelevant table definitions and resolve overlapping terminology across product domains. Answers become less precise and harder to debug.",
    fix: "One SKILL.md per product domain, each triggered exclusively by question intent matching that product."
  },
  {
    title: "No query validation before Athena execution",
    signal: "Generated SQL reaches Athena without interception",
    detail: "Trusting the agent to produce safe SQL is not a security posture. Model outputs are probabilistic — unexpected syntax, hallucinated table names, or write keywords can appear under edge conditions.",
    fix: "Intercept every query at a dedicated middleware layer. Reject on any write keyword, log every rejection."
  },
  {
    title: "Live schema introspection at query time",
    signal: "Agent runs DESCRIBE TABLE or queries information_schema per request",
    detail: "Running schema introspection on every request adds Athena query cost, increases p99 latency, and creates a hard dependency on catalog availability. Schema drift discovered at query time produces runtime failures.",
    fix: "Pre-cache schema.md and sample_data.csv per table. Refresh those files on schema change events, not on user requests."
  }
];

// ── Render: best practices + anti-patterns ────────────────────────────────

function renderBestPractices() {
  const layout = document.getElementById("practices-layout");
  if (!layout) return;
  layout.innerHTML = `
    <div class="practices-col">
      <div class="practices-col-head practices-do-head">
        <span class="practices-col-icon">✓</span>
        <div>
          <p class="practices-col-title">Best Practices</p>
          <p class="practices-col-sub">What the pattern gets right</p>
        </div>
      </div>
      ${bestPractices.map((p) => `
        <article class="practice-card">
          <div class="practice-card-head">
            <strong class="practice-card-title">${p.title}</strong>
            <span class="practice-principle">${p.principle}</span>
          </div>
          <p class="practice-detail">${p.detail}</p>
          <div class="practice-example">
            <span class="practice-example-label">Example</span>
            <span>${p.example}</span>
          </div>
        </article>`).join("")}
    </div>
    <div class="practices-col">
      <div class="practices-col-head practices-avoid-head">
        <span class="practices-col-icon">✗</span>
        <div>
          <p class="practices-col-title">Anti-Patterns</p>
          <p class="practices-col-sub">What to avoid</p>
        </div>
      </div>
      ${antiPatterns.map((a) => `
        <article class="antipattern-card">
          <div class="practice-card-head">
            <strong class="practice-card-title">${a.title}</strong>
            <span class="antipattern-signal">${a.signal}</span>
          </div>
          <p class="practice-detail">${a.detail}</p>
          <div class="antipattern-fix">
            <span class="practice-example-label">Fix</span>
            <span>${a.fix}</span>
          </div>
        </article>`).join("")}
    </div>`;
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
      .then((data) => { likeStore.write({ liked: true, count: data.total }); renderFooterLike(); })
      .catch(() => {});
  }
}

// ── Render: all ───────────────────────────────────────────────────────────

function render() {
  renderProductSelector();
  renderQuerySelector();
  renderFlowSection();
  renderArchitectureLayers();
  renderBestPractices();
  renderAgentcoreFeatures();
}

// ── Init ──────────────────────────────────────────────────────────────────

function initApp() {
  footerLikeBtn = document.getElementById("footer-like-btn");
  footerLikeCount = document.getElementById("footer-like-count");

  // Wire flow nav once — not inside renderFlowSection
  const prevBtn = document.getElementById("flow-prev-btn");
  const nextBtn = document.getElementById("flow-next-btn");
  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      if (currentStep > 0) { currentStep--; renderFlowSection(); }
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      const steps = getFlowSteps(getSelectedQuery());
      if (currentStep < steps.length - 1) { currentStep++; renderFlowSection(); }
    });
  }

  if (footerLikeBtn) footerLikeBtn.addEventListener("click", toggleFooterLike);

  initTheme();
  renderFooterLike();
  fetch("/api/like")
    .then((r) => r.json())
    .then((data) => { const s = likeStore.read(); likeStore.write({ liked: s.liked, count: data.total }); renderFooterLike(); })
    .catch(() => {});

  render();
}

initApp();
