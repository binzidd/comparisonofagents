const catalogItems = [
  {
    id: "langgraph",
    name: "LangGraph",
    kind: "framework",
    color: "#1f5f5b",
    tagline: "Stateful branching and review loops",
    summary: "Explicit graph control with strong state visibility and reviewer edges.",
    pattern: "graph-branches",
    pros: [
      "Excellent for controlled branching",
      "Strong observability and checkpoints",
      "Good fit for review-heavy agent systems"
    ],
    cons: [
      "Heavier workflow design upfront",
      "Less natural for free-form debate",
      "Interop is not the main abstraction"
    ],
    source: "https://docs.langchain.com/oss/python/langchain/multi-agent"
  },
  {
    id: "openai-agents",
    name: "OpenAI Agents SDK",
    kind: "framework",
    color: "#6b4bc2",
    tagline: "Handoffs, tools, and traces",
    summary: "Clear specialist handoffs inside one runtime with tool calls and guardrails.",
    pattern: "sequential-handoffs",
    pros: [
      "Very clear handoff model",
      "Strong tool runtime for one app team",
      "Good traceability"
    ],
    cons: [
      "Not a federation protocol",
      "Cross-system interop needs extra work",
      "Complex long workflows may need more orchestration"
    ],
    source: "https://developers.openai.com/api/docs/guides/agents-sdk"
  },
  {
    id: "ag2",
    name: "AG2",
    kind: "framework",
    color: "#cf8f2e",
    tagline: "Debate-heavy specialist teams",
    summary: "Conversation-first multi-agent coordination with direct specialist challenge.",
    pattern: "conversation-mesh",
    pros: [
      "Natural for specialist challenge",
      "Flexible team topologies",
      "Good for exploratory comparisons"
    ],
    cons: [
      "Needs hard stopping rules",
      "Can sprawl without governance",
      "More tuning for production controls"
    ],
    source: "https://docs.ag2.ai/latest/docs/home/quickstart/"
  },
  {
    id: "crewai",
    name: "CrewAI",
    kind: "framework",
    color: "#445fbb",
    tagline: "Manager and crew process",
    summary: "Role-based orchestration that reads like a managed business workflow.",
    pattern: "manager-review",
    pros: [
      "Readable manager-plus-specialists model",
      "Good business-process framing",
      "Structured review checkpoints"
    ],
    cons: [
      "Less natural for open debate meshes",
      "Not focused on protocol interop",
      "Complex state still needs design"
    ],
    source: "https://docs.crewai.com/en/introduction"
  },
  {
    id: "semantic-kernel",
    name: "Semantic Kernel Agent Framework",
    kind: "framework",
    color: "#9b4c3d",
    tagline: "Enterprise governed flow",
    summary: "Enterprise-oriented specialist workflow with platform-level controls.",
    pattern: "enterprise-gated",
    pros: [
      "Enterprise-ready framing",
      "Fits Microsoft-aligned stacks",
      "Strong governed review pattern"
    ],
    cons: [
      "Broader ecosystem to learn",
      "Can feel heavy for a focused app",
      "Not primarily a neutral A2A protocol"
    ],
    source: "https://learn.microsoft.com/en-us/semantic-kernel/frameworks/agent/"
  },
  {
    id: "llamaindex",
    name: "LlamaIndex Workflows",
    kind: "framework",
    color: "#3f6b2a",
    tagline: "Event-driven evidence pipeline",
    summary: "Workflow and event model for structured evidence gathering and synthesis.",
    pattern: "event-pipeline",
    pros: [
      "Strong evidence pipeline model",
      "Good for retrieval-heavy systems",
      "Clear event-driven execution"
    ],
    cons: [
      "Less centered on direct agent debate",
      "Needs workflow thinking",
      "Requires UX work for stakeholder clarity"
    ],
    source: "https://developers.llamaindex.ai/python/llamaagents/workflows/"
  },
  {
    id: "mastra",
    name: "Mastra",
    kind: "framework",
    color: "#0f6d90",
    tagline: "App-friendly workflows and agents",
    summary: "TypeScript-first combination of workflows, agents, and traces.",
    pattern: "app-workflow",
    pros: [
      "Good TypeScript developer experience",
      "Combines workflows and agents cleanly",
      "Practical product-team fit"
    ],
    cons: [
      "Framework rather than neutral protocol",
      "Governance is on the implementer",
      "Cross-vendor A2A is not the focus"
    ],
    source: "https://mastra.ai/workflows"
  },
  {
    id: "pydanticai",
    name: "PydanticAI",
    kind: "framework",
    color: "#b34747",
    tagline: "Typed agent workflows",
    summary: "Strong when structured outputs, validation, and typed tool-driven agents matter.",
    pattern: "typed-review",
    pros: [
      "Excellent typed outputs and validation",
      "Good for reliability-first agent systems",
      "Strong fit when schemas matter"
    ],
    cons: [
      "Less opinionated on large multi-agent topologies",
      "Requires you to design the orchestration pattern",
      "Interop is not the core value"
    ],
    source: "https://ai.pydantic.dev/"
  },
  {
    id: "a2a",
    name: "Google A2A",
    kind: "protocol",
    color: "#aa3b2a",
    tagline: "Remote agent interoperability",
    summary: "Protocol for task exchange across independently running agent services.",
    source: "https://google.github.io/adk-docs/a2a/intro/"
  },
  {
    id: "mcp",
    name: "MCP",
    kind: "adjacent",
    color: "#7a5a12",
    tagline: "Shared tool and context layer",
    summary: "Tool and context protocol that complements frameworks but does not replace orchestration.",
    source: "https://modelcontextprotocol.io/docs/getting-started/intro"
  }
];

const demoFrameworks = catalogItems.filter((item) => item.kind === "framework");

const audiences = [
  {
    id: "business",
    label: "Business View",
    helper: "Shows who owns the decision and where the review gate lives."
  },
  {
    id: "technical",
    label: "Technical View",
    helper: "Shows state movement, tool access, and orchestration style."
  }
];

const stages = [
  {
    id: "intake",
    label: "Intake",
    captionBusiness: "The principal agent opens the policy case and defines the approval bar.",
    captionTechnical: "Supervisor initializes the case state and policy document.",
    activeAgents: ["principal"],
    activeTools: ["policy_doc"]
  },
  {
    id: "review",
    label: "Review",
    captionBusiness: "Specialists review the policy in parallel with their own tools.",
    captionTechnical: "Compliance, security, legal, and finance perform scoped tool calls.",
    activeAgents: ["principal", "compliance", "security", "legal", "finance"],
    activeTools: ["policy_db", "risk_scan", "contract_diff", "cost_model"]
  },
  {
    id: "challenge",
    label: "Challenge",
    captionBusiness: "A reviewer forces rebuttals before a leadership-ready answer exists.",
    captionTechnical: "Reviewer agent challenges contradictory findings and requests follow-ups.",
    activeAgents: ["compliance", "security", "legal", "finance", "reviewer"],
    activeTools: ["risk_rubric", "evidence_board"]
  },
  {
    id: "synthesis",
    label: "Synthesis",
    captionBusiness: "The principal agent weighs the tradeoffs and narrows toward a verdict.",
    captionTechnical: "Supervisor merges findings, reviewer flags, and tool outputs into one decision state.",
    activeAgents: ["principal", "reviewer", "security", "legal"],
    activeTools: ["decision_score", "evidence_board"]
  },
  {
    id: "verdict",
    label: "Verdict",
    captionBusiness: "The principal agent returns approve, reject, or revise-with-conditions.",
    captionTechnical: "Supervisor emits the final structured verdict and remediation items.",
    activeAgents: ["principal", "reviewer", "decision"],
    activeTools: ["decision_score"]
  }
];

const agentRoster = [
  { id: "principal", label: "Principal Agent", sublabel: "Decision owner", column: 1, row: 1 },
  { id: "compliance", label: "Compliance", sublabel: "Regulatory fit", column: 2, row: 1 },
  { id: "security", label: "Security", sublabel: "Risk and abuse", column: 2, row: 2 },
  { id: "legal", label: "Legal", sublabel: "Terms and contracts", column: 3, row: 1 },
  { id: "finance", label: "Finance", sublabel: "Cost and liability", column: 3, row: 2 },
  { id: "reviewer", label: "Challenge Agent", sublabel: "Rebuttal gate", column: 4, row: 1 },
  { id: "decision", label: "Decision Output", sublabel: "Approve or revise", column: 5, row: 1 }
];

const toolCatalog = {
  policy_doc: "Policy draft",
  policy_db: "Policy DB",
  risk_scan: "Risk scan",
  contract_diff: "Contract diff",
  cost_model: "Cost model",
  risk_rubric: "Risk rubric",
  evidence_board: "Evidence board",
  decision_score: "Decision score"
};

const linkIds = [
  "principal-compliance",
  "principal-security",
  "principal-legal",
  "principal-finance",
  "compliance-reviewer",
  "security-reviewer",
  "legal-reviewer",
  "finance-reviewer",
  "reviewer-principal",
  "reviewer-decision",
  "principal-decision",
  "compliance-security",
  "security-legal",
  "legal-finance",
  "finance-compliance",
  "reviewer-compliance",
  "reviewer-security",
  "reviewer-legal",
  "reviewer-finance",
  "security-principal",
  "legal-principal",
  "finance-principal"
];

const graphNodes = {
  principal: { x: 50, y: 10, label: "Principal", labelX: 50, labelY: 20 },
  compliance: { x: 18, y: 32, label: "Compliance", labelX: 18, labelY: 43 },
  legal: { x: 50, y: 32, label: "Legal", labelX: 50, labelY: 43 },
  finance: { x: 82, y: 32, label: "Finance", labelX: 82, labelY: 43 },
  security: { x: 30, y: 60, label: "Security", labelX: 30, labelY: 71 },
  reviewer: { x: 70, y: 60, label: "Reviewer", labelX: 70, labelY: 71 },
  decision: { x: 50, y: 92, label: "Output", labelX: 50, labelY: 99 }
};

const graphLabelOffsets = {
  "principal-compliance": { dx: -8, dy: -4 },
  "principal-security": { dx: 7, dy: -1 },
  "principal-legal": { dx: 0, dy: -5 },
  "principal-finance": { dx: 8, dy: -4 },
  "compliance-reviewer": { dx: -4, dy: 3 },
  "security-reviewer": { dx: 0, dy: 5 },
  "legal-reviewer": { dx: 0, dy: -4 },
  "finance-reviewer": { dx: 4, dy: 4 },
  "reviewer-principal": { dx: 8, dy: -2 },
  "reviewer-decision": { dx: 7, dy: 4 },
  "principal-decision": { dx: 9, dy: 0 },
  "compliance-security": { dx: -8, dy: 0 },
  "security-legal": { dx: -4, dy: 3 },
  "legal-finance": { dx: 0, dy: -4 },
  "finance-compliance": { dx: 0, dy: -3 },
  "reviewer-compliance": { dx: -10, dy: -2 },
  "reviewer-security": { dx: -6, dy: 4 },
  "reviewer-legal": { dx: -1, dy: -4 },
  "reviewer-finance": { dx: 6, dy: 2 },
  "security-principal": { dx: -8, dy: 0 },
  "legal-principal": { dx: -2, dy: -5 },
  "finance-principal": { dx: 10, dy: -2 }
};

const linkEndpoints = {
  "principal-compliance": ["principal", "compliance"],
  "principal-security": ["principal", "security"],
  "principal-legal": ["principal", "legal"],
  "principal-finance": ["principal", "finance"],
  "compliance-reviewer": ["compliance", "reviewer"],
  "security-reviewer": ["security", "reviewer"],
  "legal-reviewer": ["legal", "reviewer"],
  "finance-reviewer": ["finance", "reviewer"],
  "reviewer-principal": ["reviewer", "principal"],
  "reviewer-decision": ["reviewer", "decision"],
  "principal-decision": ["principal", "decision"],
  "compliance-security": ["compliance", "security"],
  "security-legal": ["security", "legal"],
  "legal-finance": ["legal", "finance"],
  "finance-compliance": ["finance", "compliance"],
  "reviewer-compliance": ["reviewer", "compliance"],
  "reviewer-security": ["reviewer", "security"],
  "reviewer-legal": ["reviewer", "legal"],
  "reviewer-finance": ["reviewer", "finance"],
  "security-principal": ["security", "principal"],
  "legal-principal": ["legal", "principal"],
  "finance-principal": ["finance", "principal"]
};

const frameworkPatterns = {
  "graph-branches": {
    intake: {
      links: ["principal-compliance", "principal-security"],
      messages: ["Graph starts at the supervisor node."],
      business: "Controlled workflow from the first step.",
      technical: "Graph state is initialized before branching."
    },
    review: {
      links: ["principal-compliance", "principal-security", "principal-legal", "principal-finance"],
      messages: ["Parallel branches collect evidence.", "Shared graph state accumulates findings."],
      business: "All specialist checks are visible as parallel branches.",
      technical: "Branch nodes enrich the same state object."
    },
    challenge: {
      links: ["compliance-reviewer", "security-reviewer", "legal-reviewer", "finance-reviewer"],
      messages: ["Review edge fires because contradictions were found."],
      business: "Review is a deliberate gate, not an afterthought.",
      technical: "Reviewer edge activates on risk or contradiction conditions."
    },
    synthesis: {
      links: ["reviewer-principal"],
      messages: ["Branches reconverge for synthesis."],
      business: "The principal agent regains control once review clears.",
      technical: "Reviewer output feeds back into the supervisor node."
    },
    verdict: {
      links: ["principal-decision"],
      messages: ["Finish node emits the verdict."],
      business: "The verdict exits a controlled path.",
      technical: "Final node emits the structured result."
    }
  },
  "sequential-handoffs": {
    intake: {
      links: ["principal-compliance"],
      messages: ["Principal starts the run and selects the first specialist."],
      business: "The flow feels like a clean baton pass.",
      technical: "The run begins with the first specialist handoff."
    },
    review: {
      links: ["principal-compliance", "compliance-security", "security-legal", "legal-finance"],
      messages: ["State is handed forward specialist by specialist."],
      business: "Each expert owns a turn in sequence.",
      technical: "Structured state moves through handoffs."
    },
    challenge: {
      links: ["finance-reviewer", "legal-reviewer"],
      messages: ["Reviewer handoff blocks early completion."],
      business: "The reviewer is a clear gate before shipping.",
      technical: "Reviewer handoff inspects intermediate output."
    },
    synthesis: {
      links: ["reviewer-principal"],
      messages: ["Reviewed state returns to the principal agent."],
      business: "The decision owner gets one consolidated view back.",
      technical: "Supervisor resumes with reviewed specialist output."
    },
    verdict: {
      links: ["principal-decision"],
      messages: ["Final guarded verdict is returned."],
      business: "Guardrails stay close to the runtime.",
      technical: "Run terminates with a bounded final response."
    }
  },
  "conversation-mesh": {
    intake: {
      links: ["principal-compliance", "principal-security"],
      messages: ["Policy council convened."],
      business: "The specialists are brought into one discussion.",
      technical: "A shared multi-agent conversation starts."
    },
    review: {
      links: ["compliance-security", "security-legal", "legal-finance", "finance-compliance"],
      messages: ["Specialists challenge each other directly."],
      business: "You can actually see the debate.",
      technical: "Specialists exchange conversational turns across the mesh."
    },
    challenge: {
      links: ["reviewer-compliance", "reviewer-security", "reviewer-legal", "reviewer-finance"],
      messages: ["Reviewer injects rebuttal prompts into the mesh."],
      business: "The reviewer sharpens the debate instead of waiting at the end.",
      technical: "Challenge prompts fan out across the conversation."
    },
    synthesis: {
      links: ["security-principal", "legal-principal", "finance-principal"],
      messages: ["Principal agent steers the group toward convergence."],
      business: "The principal agent narrows the debate toward one answer.",
      technical: "Supervisor aggregates turns into a synthesis step."
    },
    verdict: {
      links: ["principal-decision", "reviewer-decision"],
      messages: ["Closing turn publishes the recommendation."],
      business: "The verdict closes a shared discussion.",
      technical: "The final answer is emitted from the closing turn."
    }
  },
  "manager-review": {
    intake: {
      links: ["principal-compliance", "principal-legal"],
      messages: ["Manager assigns specialist tasks."],
      business: "The process reads like a managed workflow from the start.",
      technical: "Role-scoped tasks are created for specialists."
    },
    review: {
      links: ["principal-compliance", "principal-security", "principal-legal", "principal-finance"],
      messages: ["Crew members execute role-specific work."],
      business: "Each specialist has clear ownership.",
      technical: "Specialists run their tasks with scoped tools and memory."
    },
    challenge: {
      links: ["compliance-reviewer", "security-reviewer", "legal-reviewer", "finance-reviewer"],
      messages: ["Review checkpoint stops progress for challenge."],
      business: "A visible checkpoint prevents premature approval.",
      technical: "A review step blocks progression until concerns are handled."
    },
    synthesis: {
      links: ["reviewer-principal"],
      messages: ["Manager resumes after review clearance."],
      business: "The decision owner regains control after the checkpoint.",
      technical: "Manager process resumes with accepted findings."
    },
    verdict: {
      links: ["principal-decision"],
      messages: ["Crew outputs a managed recommendation."],
      business: "The output feels operational and accountable.",
      technical: "Workflow completes with a structured recommendation."
    }
  },
  "enterprise-gated": {
    intake: {
      links: ["principal-compliance", "principal-security"],
      messages: ["Governed review opens in the enterprise runtime."],
      business: "The case starts inside a governed platform.",
      technical: "Supervisor creates a governed review context."
    },
    review: {
      links: ["principal-compliance", "principal-security", "principal-legal", "principal-finance"],
      messages: ["Specialists evaluate with enterprise controls."],
      business: "Specialists work in a consistent enterprise stack.",
      technical: "Shared plugins and controls drive specialist checks."
    },
    challenge: {
      links: ["reviewer-security", "reviewer-legal"],
      messages: ["Formal review gate requests more proof."],
      business: "The review gate is formal and explicit.",
      technical: "Governed validation blocks completion."
    },
    synthesis: {
      links: ["reviewer-principal"],
      messages: ["Principal assembles the approved decision packet."],
      business: "The final packet is built for governance.",
      technical: "Supervisor merges reviewed evidence inside platform state."
    },
    verdict: {
      links: ["principal-decision"],
      messages: ["Governed verdict published."],
      business: "The outcome fits enterprise approval flows.",
      technical: "Platform-aligned result emitted."
    }
  },
  "event-pipeline": {
    intake: {
      links: ["principal-compliance"],
      messages: ["Initial policy event emitted."],
      business: "The process starts like an evidence pipeline.",
      technical: "Supervisor emits the intake event."
    },
    review: {
      links: ["principal-compliance", "principal-security", "principal-legal", "principal-finance"],
      messages: ["Specialist steps publish evidence events."],
      business: "Each specialist enriches the case with evidence.",
      technical: "Intermediate events carry specialist payloads."
    },
    challenge: {
      links: ["legal-reviewer", "security-reviewer"],
      messages: ["Review event requests follow-up evidence."],
      business: "Challenge is another pipeline step, not a side conversation.",
      technical: "Reviewer step emits follow-up events."
    },
    synthesis: {
      links: ["reviewer-principal"],
      messages: ["Aggregator composes one decision payload."],
      business: "The principal agent receives a single evidence-backed packet.",
      technical: "Aggregation composes the decision payload."
    },
    verdict: {
      links: ["principal-decision"],
      messages: ["Terminal step publishes verdict."],
      business: "The output feels disciplined and pipeline-driven.",
      technical: "Terminal event emits the final verdict."
    }
  },
  "app-workflow": {
    intake: {
      links: ["principal-compliance", "principal-security"],
      messages: ["Workflow starts from application state."],
      business: "The flow feels product-friendly from day one.",
      technical: "Supervisor opens workflow state in one app runtime."
    },
    review: {
      links: ["principal-compliance", "principal-security", "principal-legal", "principal-finance"],
      messages: ["Specialist workflow steps gather evidence."],
      business: "Specialist work stays visible inside the product flow.",
      technical: "Agents and steps update app-facing state."
    },
    challenge: {
      links: ["reviewer-security", "reviewer-legal", "reviewer-finance"],
      messages: ["Review branch opens as a guardrail."],
      business: "Risk review is a branch, not a hidden extra.",
      technical: "Guardrail branch pauses the main flow."
    },
    synthesis: {
      links: ["reviewer-principal"],
      messages: ["Principal resumes with reviewed evidence."],
      business: "The decision owner comes back in with enough context to decide.",
      technical: "Supervisor resumes from the branch with reviewed state."
    },
    verdict: {
      links: ["principal-decision"],
      messages: ["App publishes final verdict with traces."],
      business: "The final answer is ready for product UX.",
      technical: "Workflow outputs a traced final decision."
    }
  },
  "typed-review": {
    intake: {
      links: ["principal-compliance"],
      messages: ["Typed policy case initialized."],
      business: "The case opens with a structured schema, not a loose prompt.",
      technical: "Supervisor initializes validated case types and inputs."
    },
    review: {
      links: ["principal-compliance", "principal-security", "principal-legal", "principal-finance"],
      messages: ["Specialists return validated findings."],
      business: "Every specialist output is constrained and reliable.",
      technical: "Tool calls and outputs are validated against schemas."
    },
    challenge: {
      links: ["compliance-reviewer", "legal-reviewer", "security-reviewer"],
      messages: ["Reviewer forces typed rebuttals on conflicting claims."],
      business: "The challenge loop stays structured instead of fuzzy.",
      technical: "Reviewer checks contradictions across validated outputs."
    },
    synthesis: {
      links: ["reviewer-principal"],
      messages: ["Principal merges typed findings into one decision model."],
      business: "The final packet is easier to trust because it is structured.",
      technical: "Supervisor composes a validated decision object."
    },
    verdict: {
      links: ["principal-decision"],
      messages: ["Typed verdict emitted."],
      business: "Reliable outputs are the main strength here.",
      technical: "Final result is emitted with strict schema guarantees."
    }
  }
};

let audienceId = "business";
let currentStage = 0;
let autoplay = null;
let compareIds = ["langgraph", "openai-agents"];

let frameworkCatalogCards;
let protocolCatalogCards;
let adjacentCatalogCards;
let audienceChipRow;
let stageChipRow;
let playDemoBtn;
let stepDemoBtn;
let frameworkSummary;
let appStatus;
let skeletonCaption;
let skeletonBoard;
let scenarioHeadline;
let scenarioSupport;
let comparisonLanes;

function getAudience() {
  return audiences.find((item) => item.id === audienceId);
}

function getStage() {
  return stages[currentStage];
}

function getFramework(id) {
  return demoFrameworks.find((item) => item.id === id);
}

function cardMarkup(item) {
  return `
    <article class="catalog-card ${item.kind}">
      <span class="catalog-badge ${item.kind}">${item.kind === "framework" ? "Framework" : item.kind === "protocol" ? "Protocol" : "Adjacent"}</span>
      <h4>${item.name}</h4>
      <p class="catalog-tagline">${item.tagline}</p>
      <p>${item.summary}</p>
      <a href="${item.source}" target="_blank" rel="noreferrer">Official docs</a>
    </article>
  `;
}

function renderCatalog() {
  frameworkCatalogCards.innerHTML = catalogItems.filter((item) => item.kind === "framework").map(cardMarkup).join("");
  protocolCatalogCards.innerHTML = catalogItems.filter((item) => item.kind === "protocol").map(cardMarkup).join("");
  adjacentCatalogCards.innerHTML = catalogItems.filter((item) => item.kind === "adjacent").map(cardMarkup).join("");
}

function renderAudienceChips() {
  audienceChipRow.innerHTML = audiences
    .map(
      (audience) => `
        <button class="chip ${audience.id === audienceId ? "active" : ""}" data-audience="${audience.id}">
          ${audience.label}
        </button>
      `
    )
    .join("");

  audienceChipRow.querySelectorAll("[data-audience]").forEach((button) => {
    button.addEventListener("click", () => {
      audienceId = button.dataset.audience;
      render();
    });
  });
}

function renderStageChips() {
  stageChipRow.innerHTML = stages
    .map(
      (stage, index) => `
        <button class="chip ${index === currentStage ? "active" : ""}" data-stage="${index}">
          ${stage.label}
        </button>
      `
    )
    .join("");

  stageChipRow.querySelectorAll("[data-stage]").forEach((button) => {
    button.addEventListener("click", () => {
      currentStage = Number(button.dataset.stage);
      render();
    });
  });
}

function renderSummary() {
  const audience = getAudience();
  const stage = getStage();

  scenarioHeadline.textContent = "Reference skeleton plus framework-specific demos";
  scenarioSupport.textContent = audience.helper;
  frameworkSummary.innerHTML = `
    <div class="summary-pill">Structure: principal + 4 specialists + reviewer + decision output</div>
    <div class="summary-pill">Stage: ${stage.label}</div>
  `;
  appStatus.textContent = `${stage.label} active. ${audience.id === "business" ? stage.captionBusiness : stage.captionTechnical}`;
  skeletonCaption.textContent = audience.id === "business" ? stage.captionBusiness : stage.captionTechnical;
}

function getAgentRole(agentId) {
  if (agentId === "principal") {
    return "principal";
  }

  if (["compliance", "security", "legal", "finance"].includes(agentId)) {
    return "specialist";
  }

  if (agentId === "reviewer") {
    return "reviewer";
  }

  return "decision";
}

function getStageOrder(stageId) {
  const orderByStage = {
    intake: {
      principal: 1
    },
    review: {
      principal: 1,
      compliance: 2,
      security: 2,
      legal: 2,
      finance: 2
    },
    challenge: {
      reviewer: 1,
      compliance: 2,
      security: 2,
      legal: 2,
      finance: 2
    },
    synthesis: {
      reviewer: 1,
      principal: 2,
      security: 3,
      legal: 3
    },
    verdict: {
      principal: 1,
      reviewer: 2,
      decision: 3
    }
  };

  return orderByStage[stageId];
}

function renderStepTrail() {
  return `
    <div class="step-trail" aria-label="Policy evaluation steps">
      ${stages
        .map((stage, index) => {
          const activeClass = index === currentStage ? "active" : index < currentStage ? "complete" : "";
          return `
            <div class="step-item ${activeClass}">
              <span class="step-number">${index + 1}</span>
              <span class="step-name">${stage.label}</span>
            </div>
            ${index < stages.length - 1 ? '<span class="step-arrow">→</span>' : ""}
          `;
        })
        .join("")}
    </div>
  `;
}

function flowHighlights(pattern, stageId) {
  return frameworkPatterns[pattern][stageId];
}

function frameworkTechProfile(framework) {
  const profiles = {
    "graph-branches": {
      topology: "Supervisor graph with parallel branches",
      state: "Shared graph state",
      tools: "Node-level tool calls",
      review: "Conditional review edge",
      arrowA: "branch",
      arrowB: "gate",
      arrowC: "merge",
      code: `graph.start("principal")
.parallel(["compliance", "security", "legal", "finance"])
.when("risk_flag", "reviewer")
.then("principal")
.finish("decision")`
    },
    "sequential-handoffs": {
      topology: "Linear handoff chain",
      state: "Run context passed forward",
      tools: "Agent-local tools in one runtime",
      review: "Reviewer handoff",
      arrowA: "handoff",
      arrowB: "review",
      arrowC: "return",
      code: `principal
  -> compliance
  -> security
  -> legal
  -> reviewer
  -> principal
  -> decision`
    },
    "conversation-mesh": {
      topology: "Conversation mesh",
      state: "Shared transcript and turns",
      tools: "Tools inside agent turns",
      review: "Reviewer injects rebuttals",
      arrowA: "debate",
      arrowB: "challenge",
      arrowC: "converge",
      code: `group_chat([
  principal,
  compliance,
  security,
  legal,
  finance,
  reviewer
])`
    },
    "manager-review": {
      topology: "Manager plus role tasks",
      state: "Task outputs and checkpoints",
      tools: "Role-scoped tools",
      review: "Checkpoint gate",
      arrowA: "assign",
      arrowB: "checkpoint",
      arrowC: "approve",
      code: `manager.assign(tasks)
crew.execute()
review_checkpoint()
manager.finalize()`
    },
    "enterprise-gated": {
      topology: "Governed enterprise workflow",
      state: "Platform-governed runtime state",
      tools: "Enterprise plugins",
      review: "Formal governance gate",
      arrowA: "route",
      arrowB: "govern",
      arrowC: "publish",
      code: `policy_case
  |> enterprise_agents
  |> governance_review
  |> final_packet`
    },
    "event-pipeline": {
      topology: "Event pipeline",
      state: "Event payload aggregation",
      tools: "Step-level evidence calls",
      review: "Review event",
      arrowA: "emit",
      arrowB: "recheck",
      arrowC: "aggregate",
      code: `emit("policy_intake")
on("specialist_result")
on("review_required")
emit("final_verdict")`
    },
    "app-workflow": {
      topology: "App-native workflow",
      state: "Workflow state in app runtime",
      tools: "Workflow step tools",
      review: "Guardrail branch",
      arrowA: "step",
      arrowB: "branch",
      arrowC: "resume",
      code: `workflow.step("principal")
.parallel("specialists")
.branch("review")
.resume("principal")
.complete("decision")`
    },
    "typed-review": {
      topology: "Typed orchestration pipeline",
      state: "Validated models and outputs",
      tools: "Schema-validated tools",
      review: "Typed contradiction checks",
      arrowA: "validate",
      arrowB: "rebut",
      arrowC: "compose",
      code: `case = PolicyCase.model_validate(input)
findings = specialists.run(case)
review = reviewer.check(findings)
decision = compose(case, findings, review)`
    }
  };

  return framework ? profiles[framework.pattern] : {
    topology: "Reference skeleton",
    state: "Shared decision stages",
    tools: "Shared demo tools",
    review: "Explicit reviewer stage",
    arrowA: "route",
    arrowB: "review",
    arrowC: "decide",
    code: `principal -> specialists -> reviewer -> decision`
  };
}

function frameworkBaseLinks(framework) {
  const baseLinks = {
    "graph-branches": [
      "principal-compliance",
      "principal-security",
      "principal-legal",
      "principal-finance",
      "compliance-reviewer",
      "security-reviewer",
      "legal-reviewer",
      "finance-reviewer",
      "reviewer-principal",
      "principal-decision"
    ],
    "sequential-handoffs": [
      "principal-compliance",
      "compliance-security",
      "security-legal",
      "legal-finance",
      "finance-reviewer",
      "reviewer-principal",
      "principal-decision"
    ],
    "conversation-mesh": [
      "principal-compliance",
      "principal-security",
      "compliance-security",
      "security-legal",
      "legal-finance",
      "finance-compliance",
      "reviewer-compliance",
      "reviewer-security",
      "reviewer-legal",
      "reviewer-finance",
      "principal-decision"
    ],
    "manager-review": [
      "principal-compliance",
      "principal-security",
      "principal-legal",
      "principal-finance",
      "compliance-reviewer",
      "security-reviewer",
      "legal-reviewer",
      "finance-reviewer",
      "reviewer-principal",
      "principal-decision"
    ],
    "enterprise-gated": [
      "principal-compliance",
      "principal-security",
      "principal-legal",
      "principal-finance",
      "reviewer-security",
      "reviewer-legal",
      "reviewer-principal",
      "principal-decision"
    ],
    "event-pipeline": [
      "principal-compliance",
      "principal-security",
      "principal-legal",
      "principal-finance",
      "security-reviewer",
      "legal-reviewer",
      "reviewer-principal",
      "principal-decision"
    ],
    "app-workflow": [
      "principal-compliance",
      "principal-security",
      "principal-legal",
      "principal-finance",
      "reviewer-security",
      "reviewer-legal",
      "reviewer-finance",
      "reviewer-principal",
      "principal-decision"
    ],
    "typed-review": [
      "principal-compliance",
      "principal-security",
      "principal-legal",
      "principal-finance",
      "compliance-reviewer",
      "security-reviewer",
      "legal-reviewer",
      "reviewer-principal",
      "principal-decision"
    ]
  };

  return framework ? baseLinks[framework.pattern] : [
    "principal-compliance",
    "principal-security",
    "principal-legal",
    "principal-finance",
    "compliance-reviewer",
    "security-reviewer",
    "legal-reviewer",
    "finance-reviewer",
    "reviewer-principal",
    "principal-decision"
  ];
}

function stageImplementationCode(framework, stageId) {
  const codeMap = {
    "graph-branches": {
      intake: `state = init_case(policy_doc)\nroute("principal")`,
      review: `parallel(["compliance", "security", "legal", "finance"])\nupdate(state.findings)`,
      challenge: `if contradictions(state):\n  goto("reviewer")`,
      synthesis: `merge(state.findings, state.review)\nroute("principal")`,
      verdict: `emit_verdict(state)`
    },
    "sequential-handoffs": {
      intake: `ctx = start_run(policy_doc)\nhandoff(principal, compliance)`,
      review: `handoff(compliance, security)\nhandoff(security, legal)\nhandoff(legal, finance)`,
      challenge: `handoff(finance, reviewer)`,
      synthesis: `handoff(reviewer, principal)\nprincipal.compose(ctx)`,
      verdict: `return principal.final(ctx)`
    },
    "conversation-mesh": {
      intake: `chat.start(principal, topic="policy_case")`,
      review: `chat.broadcast([compliance, security, legal, finance])`,
      challenge: `reviewer.challenge(chat.transcript)`,
      synthesis: `principal.summarize(chat.transcript)`,
      verdict: `chat.close(with_result=True)`
    },
    "manager-review": {
      intake: `manager.create_tasks(policy_case)`,
      review: `crew.run(role_tasks)`,
      challenge: `review_checkpoint(crew_outputs)`,
      synthesis: `manager.combine(approved_outputs)`,
      verdict: `manager.publish_verdict()`
    },
    "enterprise-gated": {
      intake: `case = governed_case(policy_doc)`,
      review: `run_enterprise_agents(case)`,
      challenge: `governance_gate(case.findings)`,
      synthesis: `principal.build_decision_packet(case)`,
      verdict: `publish(case.packet)`
    },
    "event-pipeline": {
      intake: `emit("policy_intake", policy_doc)`,
      review: `emit("specialist_review")`,
      challenge: `emit("review_required")`,
      synthesis: `aggregate("reviewed_findings")`,
      verdict: `emit("final_verdict")`
    },
    "app-workflow": {
      intake: `workflow.step("principal_intake")`,
      review: `workflow.parallel("specialists")`,
      challenge: `workflow.branch("review_guardrail")`,
      synthesis: `workflow.resume("principal_synthesis")`,
      verdict: `workflow.complete("decision")`
    },
    "typed-review": {
      intake: `case = PolicyCase.model_validate(input)`,
      review: `findings = specialists.run(case)`,
      challenge: `review = reviewer.check(findings)`,
      synthesis: `decision = compose(case, findings, review)`,
      verdict: `return Decision.model_validate(decision)`
    },
    reference: {
      intake: `principal opens policy case`,
      review: `specialists evaluate with tools`,
      challenge: `reviewer requests rebuttals`,
      synthesis: `principal merges findings`,
      verdict: `decision output published`
    }
  };

  return framework ? codeMap[framework.pattern][stageId] : codeMap.reference[stageId];
}

function graphMessageMap(framework, stageId) {
  const byPattern = {
    "graph-branches": {
      intake: {
        "principal-compliance": "open case",
        "principal-security": "risk scope"
      },
      review: {
        "principal-compliance": "policy task",
        "principal-security": "scan task",
        "principal-legal": "legal task",
        "principal-finance": "cost task"
      },
      challenge: {
        "compliance-reviewer": "control gap",
        "security-reviewer": "risk finding",
        "legal-reviewer": "contract issue",
        "finance-reviewer": "cost concern"
      },
      synthesis: {
        "reviewer-principal": "review packet"
      },
      verdict: {
        "principal-decision": "final verdict"
      }
    },
    "sequential-handoffs": {
      intake: {
        "principal-compliance": "handoff case"
      },
      review: {
        "principal-compliance": "policy task",
        "compliance-security": "controls",
        "security-legal": "risk notes",
        "legal-finance": "cost flags"
      },
      challenge: {
        "finance-reviewer": "concerns",
        "legal-reviewer": "exceptions"
      },
      synthesis: {
        "reviewer-principal": "reviewed run"
      },
      verdict: {
        "principal-decision": "final output"
      }
    },
    "conversation-mesh": {
      intake: {
        "principal-compliance": "open thread",
        "principal-security": "invite"
      },
      review: {
        "compliance-security": "challenge",
        "security-legal": "rebuttal",
        "legal-finance": "tradeoff",
        "finance-compliance": "counterpoint"
      },
      challenge: {
        "reviewer-compliance": "prove it",
        "reviewer-security": "show evidence",
        "reviewer-legal": "justify risk",
        "reviewer-finance": "quantify cost"
      },
      synthesis: {
        "security-principal": "risk stance",
        "legal-principal": "legal stance",
        "finance-principal": "cost stance"
      },
      verdict: {
        "principal-decision": "recommendation",
        "reviewer-decision": "challenge notes"
      }
    },
    "manager-review": {
      intake: {
        "principal-compliance": "assign",
        "principal-legal": "assign"
      },
      review: {
        "principal-compliance": "policy task",
        "principal-security": "risk task",
        "principal-legal": "legal task",
        "principal-finance": "cost task"
      },
      challenge: {
        "compliance-reviewer": "output",
        "security-reviewer": "output",
        "legal-reviewer": "output",
        "finance-reviewer": "output"
      },
      synthesis: {
        "reviewer-principal": "approved set"
      },
      verdict: {
        "principal-decision": "managed verdict"
      }
    },
    "enterprise-gated": {
      intake: {
        "principal-compliance": "case start",
        "principal-security": "case start"
      },
      review: {
        "principal-compliance": "policy task",
        "principal-security": "security task",
        "principal-legal": "legal task",
        "principal-finance": "finance task"
      },
      challenge: {
        "reviewer-security": "gate fail",
        "reviewer-legal": "gate fail"
      },
      synthesis: {
        "reviewer-principal": "governed packet"
      },
      verdict: {
        "principal-decision": "approved packet"
      }
    },
    "event-pipeline": {
      intake: {
        "principal-compliance": "emit intake"
      },
      review: {
        "principal-compliance": "event",
        "principal-security": "event",
        "principal-legal": "event",
        "principal-finance": "event"
      },
      challenge: {
        "legal-reviewer": "review event",
        "security-reviewer": "review event"
      },
      synthesis: {
        "reviewer-principal": "aggregate"
      },
      verdict: {
        "principal-decision": "emit verdict"
      }
    },
    "app-workflow": {
      intake: {
        "principal-compliance": "start step",
        "principal-security": "start step"
      },
      review: {
        "principal-compliance": "step",
        "principal-security": "step",
        "principal-legal": "step",
        "principal-finance": "step"
      },
      challenge: {
        "reviewer-security": "guardrail",
        "reviewer-legal": "guardrail",
        "reviewer-finance": "guardrail"
      },
      synthesis: {
        "reviewer-principal": "resume state"
      },
      verdict: {
        "principal-decision": "complete flow"
      }
    },
    "typed-review": {
      intake: {
        "principal-compliance": "validated case"
      },
      review: {
        "principal-compliance": "typed task",
        "principal-security": "typed task",
        "principal-legal": "typed task",
        "principal-finance": "typed task"
      },
      challenge: {
        "compliance-reviewer": "schema gap",
        "security-reviewer": "risk proof",
        "legal-reviewer": "typed issue"
      },
      synthesis: {
        "reviewer-principal": "validated review"
      },
      verdict: {
        "principal-decision": "typed output"
      }
    },
    reference: {
      intake: {
        "principal-compliance": "open case",
        "principal-security": "scope"
      },
      review: {
        "principal-compliance": "task",
        "principal-security": "task",
        "principal-legal": "task",
        "principal-finance": "task"
      },
      challenge: {
        "compliance-reviewer": "finding",
        "security-reviewer": "finding",
        "legal-reviewer": "finding",
        "finance-reviewer": "finding"
      },
      synthesis: {
        "reviewer-principal": "review notes"
      },
      verdict: {
        "principal-decision": "decision"
      }
    }
  };

  const key = framework ? framework.pattern : "reference";
  return byPattern[key][stageId] || {};
}

function renderFrameworkTechStrip(framework) {
  const profile = frameworkTechProfile(framework);
  return `
    <div class="tech-strip">
      <article>
        <span>Topology</span>
        <strong>${profile.topology}</strong>
      </article>
      <article>
        <span>State</span>
        <strong>${profile.state}</strong>
      </article>
      <article>
        <span>Tools</span>
        <strong>${profile.tools}</strong>
      </article>
      <article>
        <span>Review</span>
        <strong>${profile.review}</strong>
      </article>
    </div>
  `;
}

function renderCodeHint(framework, stageId) {
  const profile = frameworkTechProfile(framework);
  const stageCode = stageImplementationCode(framework, stageId);
  return `
    <section class="code-hint">
      <div class="code-hint-grid">
        <div class="code-panel">
          <div class="code-hint-head">
            <strong>Current step code</strong>
            <span>${stageId}</span>
          </div>
          <pre><code>${stageCode}</code></pre>
        </div>
        <div class="code-panel">
          <div class="code-hint-head">
            <strong>Flow pattern</strong>
            <span>${profile.topology}</span>
          </div>
          <pre><code>${profile.code}</code></pre>
        </div>
      </div>
    </section>
  `;
}

function renderMessageList(framework, stageId) {
  const messages = Object.entries(graphMessageMap(framework, stageId));
  return `
    <div class="message-list">
      ${messages
        .map(([linkId, message]) => {
          const [fromId, toId] = linkEndpoints[linkId];
          return `
            <article class="message-row">
              <strong>${graphNodes[fromId].label} → ${graphNodes[toId].label}</strong>
              <span>${message}</span>
            </article>
          `;
        })
        .join("")}
    </div>
  `;
}

function renderGraphMap({ framework, activeAgents, stageId, color, neutral = false }) {
  const stageHighlights = framework ? flowHighlights(framework.pattern, stageId) : {
    links: frameworkBaseLinks(null),
    messages: []
  };
  const baseLinks = frameworkBaseLinks(framework);
  const activeLinkSet = new Set(stageHighlights.links);
  const activeAgentSet = new Set(activeAgents);

  const lineMarkup = baseLinks
    .map((linkId) => {
      const [fromId, toId] = linkEndpoints[linkId];
      const from = graphNodes[fromId];
      const to = graphNodes[toId];
      return `
        <line
          class="graph-edge ${activeLinkSet.has(linkId) ? "active" : ""}"
          x1="${from.x}"
          y1="${from.y}"
          x2="${to.x}"
          y2="${to.y}"
          marker-end="url(#arrowhead-${neutral ? "neutral" : "live"})"
        />
      `;
    })
    .join("");

  const nodeMarkup = Object.entries(graphNodes)
    .map(([nodeId, node]) => `
      <g class="graph-node ${activeAgentSet.has(nodeId) ? "active" : ""} role-${getAgentRole(nodeId)}">
        <circle cx="${node.x}" cy="${node.y}" r="7" />
        <text x="${node.labelX}" y="${node.labelY}" text-anchor="middle">${node.label}</text>
      </g>
    `)
    .join("");

  return `
    <div class="graph-map ${neutral ? "neutral" : ""}" style="--framework-color:${color}">
      <svg viewBox="0 0 100 100" role="img" aria-label="Framework topology graph">
        <defs>
          <marker id="arrowhead-live" markerWidth="3" markerHeight="3" refX="2.6" refY="1.5" orient="auto">
            <path d="M0,0 L3,1.5 L0,3 z" fill="currentColor"></path>
          </marker>
          <marker id="arrowhead-neutral" markerWidth="3" markerHeight="3" refX="2.6" refY="1.5" orient="auto">
            <path d="M0,0 L3,1.5 L0,3 z" fill="currentColor"></path>
          </marker>
        </defs>
        ${lineMarkup}
        ${nodeMarkup}
      </svg>
    </div>
  `;
}

function renderBoard({ framework, color, activeAgents, activeTools, messages, stageId, neutral = false }) {
  const stageOrder = getStageOrder(stageId);
  const profile = frameworkTechProfile(framework);
  return `
    <div class="flow-board ${neutral ? "neutral" : ""}" style="--framework-color:${color}">
      <div class="tool-ribbon tool-ribbon-top">
        ${Object.entries(toolCatalog)
          .map(
            ([toolId, label]) => `
              <span class="tool-chip ${activeTools.has(toolId) ? "active" : ""}">${label}</span>
            `
          )
          .join("")}
      </div>

      <section class="flow-section ${activeAgents.has("principal") ? "active" : ""}">
        <div class="flow-section-head">
          <span class="flow-section-label">Principal</span>
          ${stageOrder.principal ? `<span class="flow-stage-chip">${stageOrder.principal}</span>` : ""}
        </div>
        ${agentRoster
          .filter((agent) => agent.id === "principal")
          .map(
            (agent) => `
              <article class="flow-agent role-${getAgentRole(agent.id)} ${activeAgents.has(agent.id) ? "active" : ""}">
                ${activeAgents.has(agent.id) && stageOrder[agent.id] ? `<span class="agent-progress-badge">${stageOrder[agent.id]}</span>` : ""}
                <span>${agent.sublabel}</span>
                <strong>${agent.label}</strong>
              </article>
            `
          )
          .join("")}
      </section>

      <div class="flow-arrow-wrap">
        <div class="flow-arrow">↓</div>
        <span class="flow-arrow-label">${profile.arrowA}</span>
      </div>

      <section class="flow-section ${["compliance", "security", "legal", "finance"].some((id) => activeAgents.has(id)) ? "active" : ""}">
        <div class="flow-section-head">
          <span class="flow-section-label">Specialists</span>
          ${["compliance", "security", "legal", "finance"].some((id) => stageOrder[id]) ? `<span class="flow-stage-chip">${stageOrder.compliance || stageOrder.security || stageOrder.legal || stageOrder.finance}</span>` : ""}
        </div>
        <div class="specialist-grid">
          ${agentRoster
            .filter((agent) => ["compliance", "security", "legal", "finance"].includes(agent.id))
            .map(
              (agent) => `
                <article class="flow-agent role-${getAgentRole(agent.id)} ${activeAgents.has(agent.id) ? "active" : ""}">
                  ${activeAgents.has(agent.id) && stageOrder[agent.id] ? `<span class="agent-progress-badge">${stageOrder[agent.id]}</span>` : ""}
                  <span>${agent.sublabel}</span>
                  <strong>${agent.label}</strong>
                </article>
              `
          )
          .join("")}
        </div>
      </section>

      <div class="flow-arrow-wrap">
        <div class="flow-arrow">↓</div>
        <span class="flow-arrow-label">${profile.arrowB}</span>
      </div>

      <section class="flow-section ${activeAgents.has("reviewer") ? "active" : ""}">
        <div class="flow-section-head">
          <span class="flow-section-label">Review</span>
          ${stageOrder.reviewer ? `<span class="flow-stage-chip">${stageOrder.reviewer}</span>` : ""}
        </div>
        ${agentRoster
          .filter((agent) => agent.id === "reviewer")
          .map(
            (agent) => `
              <article class="flow-agent role-${getAgentRole(agent.id)} ${activeAgents.has(agent.id) ? "active" : ""}">
                ${activeAgents.has(agent.id) && stageOrder[agent.id] ? `<span class="agent-progress-badge">${stageOrder[agent.id]}</span>` : ""}
                <span>${agent.sublabel}</span>
                <strong>${agent.label}</strong>
              </article>
            `
          )
          .join("")}
      </section>

      <div class="flow-arrow-wrap">
        <div class="flow-arrow">↓</div>
        <span class="flow-arrow-label">${profile.arrowC}</span>
      </div>

      <section class="flow-section ${activeAgents.has("decision") ? "active" : ""}">
        <div class="flow-section-head">
          <span class="flow-section-label">Output</span>
          ${stageOrder.decision ? `<span class="flow-stage-chip">${stageOrder.decision}</span>` : ""}
        </div>
        ${agentRoster
          .filter((agent) => agent.id === "decision")
          .map(
            (agent) => `
              <article class="flow-agent role-${getAgentRole(agent.id)} ${activeAgents.has(agent.id) ? "active" : ""}">
                ${activeAgents.has(agent.id) && stageOrder[agent.id] ? `<span class="agent-progress-badge">${stageOrder[agent.id]}</span>` : ""}
                <span>${agent.sublabel}</span>
                <strong>${agent.label}</strong>
              </article>
            `
          )
          .join("")}
      </section>

      <div class="message-stack">
        ${messages
          .map((message, index) => `<div class="message-bubble" style="animation-delay:${index * 120}ms">${message}</div>`)
          .join("")}
      </div>
    </div>
  `;
}

function renderSkeleton() {
  const stage = getStage();
  skeletonBoard.innerHTML = `
    ${renderStepTrail()}
    ${renderFrameworkTechStrip(null)}
    <div class="lane-role-box lane-role-box-top">
      <strong>${stage.label}</strong>
      <p>${stage.captionTechnical}</p>
    </div>
    ${renderBoard({
      framework: null,
      color: "#7d6f62",
      activeAgents: new Set(stage.activeAgents),
      activeTools: new Set(stage.activeTools),
      messages: ["Reference structure only: principal delegates, specialists evaluate, reviewer challenges, output concludes."],
      stageId: stage.id,
      neutral: true
    })}
    ${renderCodeHint(null, stage.id)}
  `;
}

function laneMarkup(frameworkId, laneIndex) {
  const framework = getFramework(frameworkId);
  const audience = getAudience();
  const stage = getStage();
  const highlights = flowHighlights(framework.pattern, stage.id);

  return `
    <article class="compare-lane">
      <div class="lane-top">
        <div>
          <p class="eyebrow">Demo ${laneIndex + 1}</p>
          <h3>${framework.name}</h3>
        </div>
        <select class="lane-select" data-lane="${laneIndex}">
          ${demoFrameworks
            .map(
              (option) => `
                <option value="${option.id}" ${option.id === framework.id ? "selected" : ""}>${option.name}</option>
              `
            )
            .join("")}
        </select>
      </div>

      <p class="lane-summary">${framework.summary}</p>
      ${renderFrameworkTechStrip(framework)}

      ${renderStepTrail()}

      <div class="lane-role-box lane-role-box-top">
        <strong>${stage.label}</strong>
        <p>${audience.id === "business" ? highlights.business : highlights.technical}</p>
      </div>

      ${renderGraphMap({
        framework,
        activeAgents: stage.activeAgents,
        stageId: stage.id,
        color: framework.color
      })}

      ${renderMessageList(framework, stage.id)}

      ${renderCodeHint(framework, stage.id)}

      <div class="lane-bottom">
        <article>
          <h4>Pros</h4>
          <ul>${framework.pros.map((item) => `<li>${item}</li>`).join("")}</ul>
        </article>
        <article>
          <h4>Cons</h4>
          <ul>${framework.cons.map((item) => `<li>${item}</li>`).join("")}</ul>
        </article>
      </div>
    </article>
  `;
}

function renderComparison() {
  comparisonLanes.innerHTML = compareIds.map((id, index) => laneMarkup(id, index)).join("");
  comparisonLanes.querySelectorAll(".lane-select").forEach((select) => {
    select.addEventListener("change", (event) => {
      const laneIndex = Number(event.target.dataset.lane);
      compareIds[laneIndex] = event.target.value;
      renderComparison();
    });
  });
}

function nextStage() {
  currentStage = (currentStage + 1) % stages.length;
  render();
}

function toggleAutoplay() {
  if (autoplay) {
    window.clearInterval(autoplay);
    autoplay = null;
    playDemoBtn.textContent = "Play Both Demos";
    return;
  }

  playDemoBtn.textContent = "Pause Demos";
  autoplay = window.setInterval(nextStage, 4200);
}

function render() {
  renderCatalog();
  renderAudienceChips();
  renderStageChips();
  renderSummary();
  renderSkeleton();
  renderComparison();
}

function initApp() {
  frameworkCatalogCards = document.getElementById("framework-catalog-cards");
  protocolCatalogCards = document.getElementById("protocol-catalog-cards");
  adjacentCatalogCards = document.getElementById("adjacent-catalog-cards");
  audienceChipRow = document.getElementById("audience-chip-row");
  stageChipRow = document.getElementById("stage-chip-row");
  playDemoBtn = document.getElementById("play-demo-btn");
  stepDemoBtn = document.getElementById("step-demo-btn");
  frameworkSummary = document.getElementById("framework-summary");
  appStatus = document.getElementById("app-status");
  skeletonCaption = document.getElementById("skeleton-caption");
  skeletonBoard = document.getElementById("skeleton-board");
  scenarioHeadline = document.getElementById("scenario-headline");
  scenarioSupport = document.getElementById("scenario-support");
  comparisonLanes = document.getElementById("comparison-lanes");

  const requiredElements = [
    ["framework-catalog-cards", frameworkCatalogCards],
    ["protocol-catalog-cards", protocolCatalogCards],
    ["adjacent-catalog-cards", adjacentCatalogCards],
    ["audience-chip-row", audienceChipRow],
    ["stage-chip-row", stageChipRow],
    ["play-demo-btn", playDemoBtn],
    ["step-demo-btn", stepDemoBtn],
    ["framework-summary", frameworkSummary],
    ["app-status", appStatus],
    ["skeleton-caption", skeletonCaption],
    ["skeleton-board", skeletonBoard],
    ["scenario-headline", scenarioHeadline],
    ["scenario-support", scenarioSupport],
    ["comparison-lanes", comparisonLanes]
  ];

  const missingIds = requiredElements.filter(([, element]) => !element).map(([id]) => id);
  if (missingIds.length > 0) {
    throw new Error(`Missing DOM nodes: ${missingIds.join(", ")}`);
  }

  playDemoBtn.addEventListener("click", toggleAutoplay);
  stepDemoBtn.addEventListener("click", nextStage);
  render();
}

initApp();
