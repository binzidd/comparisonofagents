const frameworks = [
  {
    id: "a2a",
    name: "Google A2A",
    family: "Protocol",
    color: "#aa3b2a",
    category: "Interoperability-first",
    summary:
      "A protocol for agents running in different services, teams, or vendors to exchange tasks and results.",
    business:
      "Best when your company expects multiple agent products or vendors to cooperate without locking everything into one stack.",
    technical:
      "Uses a network protocol approach for remote agents, which helps when agents are independently deployed and owned.",
    principalFit:
      "A principal agent can act as broker and assign work to specialist agents exposed as remote services.",
    strengths: [
      "Cross-team and cross-vendor interoperability",
      "Clean boundary between principal and specialist services",
      "Good fit for enterprise architecture and service ownership"
    ],
    tradeoffs: [
      "More infrastructure and protocol overhead",
      "Needs separate orchestration and memory choices",
      "Debugging spans multiple services"
    ],
    metrics: { control: 4, businessClarity: 4, interoperability: 5 },
    sources: [
      {
        label: "Google ADK A2A intro",
        url: "https://google.github.io/adk-docs/a2a/intro/"
      },
      {
        label: "Google A2A announcement",
        url: "https://developers.googleblog.com/zh-hans/a2a-a-new-era-of-agent-interoperability/"
      }
    ]
  },
  {
    id: "openai-agents",
    name: "OpenAI Agents SDK",
    family: "Runtime SDK",
    color: "#6b4bc2",
    category: "Handoffs and tools",
    summary:
      "An app runtime for agents with handoffs, tools, guardrails, and tracing in one SDK.",
    business:
      "Strong when one product team wants to ship a reliable agent experience quickly with good runtime controls.",
    technical:
      "Provides first-class agents, handoffs, tools, streaming, run limits, and tracing close to application code.",
    principalFit:
      "A principal agent can hand off to specialists like product, security, or legal and collect structured outputs.",
    strengths: [
      "Strong tool and handoff model",
      "Good for application-native traces and guardrails",
      "Fast to prototype inside one product runtime"
    ],
    tradeoffs: [
      "Not a federation protocol by itself",
      "Cross-system interoperability needs extra work",
      "Long-lived workflow logic may need a separate orchestrator"
    ],
    metrics: { control: 4, businessClarity: 4, interoperability: 3 },
    sources: [
      {
        label: "OpenAI Agents SDK guide",
        url: "https://platform.openai.com/docs/guides/agents-sdk/"
      },
      {
        label: "OpenAI Agents SDK agents",
        url: "https://openai.github.io/openai-agents-python/agents/"
      }
    ]
  },
  {
    id: "langgraph",
    name: "LangGraph",
    family: "Workflow graph",
    color: "#1f5f5b",
    category: "Stateful orchestration",
    summary:
      "A graph-based orchestrator for building controlled, stateful, and branching agent workflows.",
    business:
      "Strong when teams care about repeatability, approvals, and seeing exactly how a complex agent process moves.",
    technical:
      "Represents execution as nodes and edges with shared state, making loops, retries, and checkpoints explicit.",
    principalFit:
      "The principal agent becomes a supervisor node coordinating specialist nodes and convergence rules.",
    strengths: [
      "Excellent observability of flow state",
      "Strong for deterministic routing and retries",
      "Useful for human review and gated approvals"
    ],
    tradeoffs: [
      "Heavier setup than free-form chats",
      "Needs deliberate workflow design",
      "Less focused on vendor-neutral interop"
    ],
    metrics: { control: 5, businessClarity: 4, interoperability: 3 },
    sources: [
      {
        label: "LangChain multi-agent patterns",
        url: "https://docs.langchain.com/oss/python/langchain/multi-agent"
      }
    ]
  },
  {
    id: "ag2",
    name: "AG2",
    family: "Conversation framework",
    color: "#cf8f2e",
    category: "Multi-agent conversation",
    summary:
      "The current evolution of AutoGen for multi-agent collaboration, orchestration, and conversation patterns.",
    business:
      "Strong when you want visible specialist dialogue, review loops, and a flexible research-style team of agents.",
    technical:
      "Supports multi-agent conversation patterns like two-agent chat, group chat, nested chat, and orchestration.",
    principalFit:
      "A principal agent can moderate specialist discussions and let experts challenge each other directly.",
    strengths: [
      "Natural for debate and specialist challenge loops",
      "Flexible conversation topologies",
      "Well suited to research-heavy multi-agent behavior"
    ],
    tradeoffs: [
      "Can meander without strong stopping rules",
      "Conversation cost can climb quickly",
      "Production controls need careful design"
    ],
    metrics: { control: 3, businessClarity: 3, interoperability: 3 },
    sources: [
      {
        label: "AG2 quickstart",
        url: "https://docs.ag2.ai/latest/docs/home/quickstart/"
      },
      {
        label: "AG2 orchestration patterns",
        url: "https://docs.ag2.ai/latest/docs/user-guide/advanced-concepts/orchestrations/"
      }
    ]
  },
  {
    id: "crewai",
    name: "CrewAI",
    family: "Role orchestration",
    color: "#445fbb",
    category: "Crew and flow model",
    summary:
      "A framework that combines specialist crews with flows for structured automation and agent teamwork.",
    business:
      "Strong for business processes where a manager-like flow coordinates role-based specialists.",
    technical:
      "Blends autonomous agents with flows, tasks, processes, memory, and observability for production workflows.",
    principalFit:
      "The principal agent is often a manager or embedded in the flow that sequences specialist work.",
    strengths: [
      "Good mental model for manager plus specialists",
      "Accessible for business-process automation",
      "Mixes autonomous crews with explicit flows"
    ],
    tradeoffs: [
      "Deep debate patterns may need custom design",
      "Less focused on open agent interoperability",
      "State can become implicit if flows are underspecified"
    ],
    metrics: { control: 4, businessClarity: 5, interoperability: 2 },
    sources: [
      {
        label: "CrewAI introduction",
        url: "https://docs.crewai.com/introduction"
      },
      {
        label: "CrewAI agents concept",
        url: "https://docs.crewai.com/en/concepts/agents"
      }
    ]
  },
  {
    id: "semantic-kernel",
    name: "Semantic Kernel Agent Framework",
    family: "Enterprise framework",
    color: "#9b4c3d",
    category: "Microsoft enterprise ecosystem",
    summary:
      "An agent framework inside the Semantic Kernel ecosystem for building collaborative and goal-oriented agents.",
    business:
      "Strong for Microsoft-oriented enterprise teams that want agents integrated with broader platform components.",
    technical:
      "Provides an agent framework on top of Semantic Kernel with messaging, plugins, and enterprise components.",
    principalFit:
      "A principal agent can coordinate specialists while sharing kernel capabilities, plugins, and enterprise controls.",
    strengths: [
      "Good enterprise framing",
      "Integrates with broader Semantic Kernel ecosystem",
      "Strong for teams already invested in Microsoft stack"
    ],
    tradeoffs: [
      "Can feel broad and ecosystem-heavy",
      "Learning curve is higher if you only need one small app",
      "Not primarily a cross-vendor protocol"
    ],
    metrics: { control: 4, businessClarity: 4, interoperability: 3 },
    sources: [
      {
        label: "Semantic Kernel agent framework",
        url: "https://learn.microsoft.com/en-us/semantic-kernel/frameworks/agent/"
      }
    ]
  },
  {
    id: "llamaindex",
    name: "LlamaIndex Workflows",
    family: "Event workflow",
    color: "#3f6b2a",
    category: "Event-driven orchestration",
    summary:
      "An event and step-based workflow model that can assemble agents and multi-agent systems with observability.",
    business:
      "Strong when the team wants a structured pipeline for research, retrieval, and synthesis rather than mostly free chat.",
    technical:
      "Workflows are event-driven steps that emit events, making orchestration explicit and composable.",
    principalFit:
      "A principal agent can be a workflow step that routes work to specialist steps or agent workflows.",
    strengths: [
      "Clear event-driven control flow",
      "Good fit for retrieval-heavy systems",
      "Observability is built into workflows"
    ],
    tradeoffs: [
      "Less focused on direct agent-to-agent protocol semantics",
      "Requires workflow thinking more than chat thinking",
      "May need custom UX for business explainability"
    ],
    metrics: { control: 4, businessClarity: 3, interoperability: 3 },
    sources: [
      {
        label: "LlamaIndex workflows intro",
        url: "https://docs.llamaindex.ai/en/stable/workflows/"
      },
      {
        label: "LlamaIndex basic agent",
        url: "https://docs.llamaindex.ai/en/stable/understanding/agent/"
      }
    ]
  },
  {
    id: "mastra",
    name: "Mastra",
    family: "TypeScript framework",
    color: "#0f6d90",
    category: "Agents plus workflows",
    summary:
      "A TypeScript agent framework with agents, workflows, memory, MCP, and observability primitives.",
    business:
      "Strong for JavaScript and TypeScript product teams that want one framework for app-facing agent systems.",
    technical:
      "Offers agents, workflows, branching, suspend-resume, tracing, and MCP integration in one stack.",
    principalFit:
      "A principal agent can coordinate specialists through workflows or agent networks while sharing runtime context.",
    strengths: [
      "Good TypeScript developer experience",
      "Pairs agents and workflows cleanly",
      "Includes observability and MCP primitives"
    ],
    tradeoffs: [
      "You still need to define your governance model",
      "Less a protocol, more an app framework",
      "Cross-vendor A2A is not the core abstraction"
    ],
    metrics: { control: 4, businessClarity: 4, interoperability: 3 },
    sources: [
      {
        label: "Mastra agents",
        url: "https://mastra.ai/agents"
      },
      {
        label: "Mastra workflows",
        url: "https://mastra.ai/workflows"
      }
    ]
  },
  {
    id: "mcp",
    name: "MCP",
    family: "Adjacent standard",
    color: "#7a5a12",
    category: "Tool and context protocol",
    summary:
      "A protocol for tools and context, useful alongside agent frameworks but not a full agent-to-agent coordination model.",
    business:
      "Important when the real business problem is not agent chat itself but consistent access to data, tools, and systems.",
    technical:
      "Standardizes how applications provide context and tools to models; it complements but does not replace agent orchestration.",
    principalFit:
      "A principal agent can use MCP so specialists share access to the same tool ecosystem more consistently.",
    strengths: [
      "Strong tool interoperability layer",
      "Reduces custom one-off tool integrations",
      "Pairs well with nearly every agent framework"
    ],
    tradeoffs: [
      "Not a full A2A framework",
      "Needs another runtime for delegation semantics",
      "Should be presented as complementary, not equivalent"
    ],
    metrics: { control: 2, businessClarity: 4, interoperability: 5 },
    sources: [
      {
        label: "Anthropic MCP overview",
        url: "https://docs.anthropic.com/en/docs/mcp"
      }
    ]
  }
];

const scenarios = [
  {
    id: "launch",
    label: "Launch Readiness",
    problem:
      "Should the company launch the AI scheduling assistant this week, delay it, or relaunch with tighter safeguards?",
    businessGoal: "Protect brand trust while still hitting a growth window.",
    technicalGoal: "Balance metrics, security risk, policy readiness, and operational confidence.",
    stages: [
      {
        name: "Brief",
        business: "The principal agent frames the decision, the deadline, and what success looks like.",
        technical: "Supervisor initializes scope, acceptance criteria, and convergence rules."
      },
      {
        name: "Evidence Pull",
        business: "Product and growth gather upside signals such as adoption and conversion potential.",
        technical: "Specialist agents call metrics and research tools, then publish evidence."
      },
      {
        name: "Challenge",
        business: "Security and legal push back on risky assumptions before the business commits.",
        technical: "Risk specialists rebut claims with scan results, policy gaps, and unresolved controls."
      },
      {
        name: "Debate",
        business: "The team argues toward a decision instead of handing over isolated opinions.",
        technical: "Agents exchange critiques, revise confidence, and reduce contradictions."
      },
      {
        name: "Decision",
        business: "The principal agent produces one recommendation with tradeoffs and next actions.",
        technical: "Supervisor synthesizes outputs, applies stop conditions, and emits final structured result."
      }
    ]
  },
  {
    id: "incident",
    label: "Incident Response",
    problem: "Should the company shut down a feature, isolate a service, or keep operating during an anomaly?",
    businessGoal: "Contain customer harm and preserve trust.",
    technicalGoal: "Reduce blast radius fast while confirming root cause with evidence.",
    stages: [
      {
        name: "Triage",
        business: "A principal agent sets severity and mobilizes the right experts.",
        technical: "Supervisor creates priority, assigns owners, and starts investigation branches."
      },
      {
        name: "Parallel Investigation",
        business: "Infra and security investigate at the same time to save time.",
        technical: "Specialists inspect logs, alerts, and access patterns concurrently."
      },
      {
        name: "Customer Pressure",
        business: "Support and comms challenge technical decisions with real customer impact.",
        technical: "Service and messaging constraints feed back into the execution state."
      },
      {
        name: "Alignment",
        business: "The team converges on one story of what is happening.",
        technical: "Contradictory hypotheses are reconciled using timestamped evidence."
      },
      {
        name: "Action Plan",
        business: "The principal agent issues the resolution and communication plan.",
        technical: "Supervisor outputs remediation steps, owners, and rollout sequence."
      }
    ]
  },
  {
    id: "research",
    label: "Research Consensus",
    problem:
      "Which architecture should the company adopt for enterprise retrieval and specialist reasoning?",
    businessGoal: "Make a confident architecture bet without wasting engineering cycles.",
    technicalGoal: "Compare cost, latency, security, and answer quality with defensible evidence.",
    stages: [
      {
        name: "Question",
        business: "The principal agent sets the question the experts must answer together.",
        technical: "Supervisor defines evaluation dimensions and final output schema."
      },
      {
        name: "Hypotheses",
        business: "Specialists produce competing recommendations from different viewpoints.",
        technical: "Domain agents generate options using benchmarks, models, and tooling."
      },
      {
        name: "Review",
        business: "A reviewer agent forces challenge so weak proposals do not slip through.",
        technical: "Critic agent scores assumptions, conflicts, and missing evidence."
      },
      {
        name: "Scoreboard",
        business: "The team narrows choices against shared decision criteria.",
        technical: "State records confidence, cost, risk, and implementation complexity."
      },
      {
        name: "Recommendation",
        business: "The principal agent delivers one recommendation plus fallback paths.",
        technical: "Supervisor emits preferred option, rationale, and unresolved risks."
      }
    ]
  }
];

const audiences = [
  {
    id: "business",
    label: "Business View",
    description: "Explain who decides what, where risk sits, and why the framework matters to delivery and governance."
  },
  {
    id: "technical",
    label: "Technical View",
    description: "Explain runtime model, tool access, state movement, and how specialist agents coordinate under the hood."
  }
];

const laneDefaults = ["langgraph", "a2a"];
let audienceId = "business";
let scenarioId = "launch";
let currentStage = 0;
let autoplay = null;
let compareIds = [...laneDefaults];

const frameworkGrid = document.getElementById("framework-grid-cards");
const audienceChips = document.getElementById("audience-chip-row");
const scenarioChips = document.getElementById("scenario-chip-row");
const playDemoBtn = document.getElementById("play-demo-btn");
const stepDemoBtn = document.getElementById("step-demo-btn");
const comparisonLanes = document.getElementById("comparison-lanes");
const frameworkSummary = document.getElementById("framework-summary");
const architectureGuidance = document.getElementById("architecture-guidance");
const scenarioHeadline = document.getElementById("scenario-headline");
const scenarioSupport = document.getElementById("scenario-support");

function getAudience() {
  return audiences.find((item) => item.id === audienceId);
}

function getScenario() {
  return scenarios.find((item) => item.id === scenarioId);
}

function getFramework(id) {
  return frameworks.find((item) => item.id === id);
}

function metricLabel(value) {
  return `${value}/5`;
}

function laneExplanation(framework, stage, audience) {
  const businessMap = {
    a2a: [
      "The principal agent decides which external specialist service should own the first pass.",
      "Evidence arrives from separate agent services, which is good for organizational ownership.",
      "Risk teams can challenge through follow-up requests without joining one monolithic runtime.",
      "The debate is more formal because each exchange is a protocol task, not an ad hoc chat bubble.",
      "The final decision is easier to defend across teams because responsibilities were clearly separated."
    ],
    "openai-agents": [
      "The principal agent hands the problem to the right specialist inside one application flow.",
      "Each specialist uses tools and returns a focused answer quickly.",
      "A reviewer handoff can challenge the optimistic path before a final answer goes out.",
      "The system stays understandable because handoffs show which specialist owned each part.",
      "The principal agent returns one answer with supporting reasoning and controls."
    ],
    langgraph: [
      "The principal agent follows a visible process map, which business stakeholders can audit.",
      "Specialists work through explicit branches, so it is easier to see what evidence was collected.",
      "Challenge rules are built into the process instead of relying on personality alone.",
      "Debate is bounded because the graph defines where disagreement can loop and where it must stop.",
      "The final recommendation comes from a controlled path with fewer surprises."
    ],
    ag2: [
      "The principal agent invites specialists into a visible discussion that feels like a working team.",
      "Specialists bring evidence into the conversation rather than only returning silent background work.",
      "Pushback is natural because agents can directly challenge one another.",
      "This can feel very intuitive, but the team needs discipline so the conversation does not sprawl.",
      "The principal agent closes the conversation with one consolidated answer."
    ],
    crewai: [
      "The flow behaves like a business manager assigning specialists defined responsibilities.",
      "Each role completes its task and hands work to the next stage of the crew or flow.",
      "Risk review can be inserted as a management checkpoint before approval.",
      "The process stays easy to explain because each role has a clear charter.",
      "The outcome reads like a managed business workflow rather than a loose discussion."
    ],
    "semantic-kernel": [
      "The principal agent coordinates specialists inside an enterprise-ready framework.",
      "Specialists use shared enterprise capabilities while still staying role-specific.",
      "Control and governance can be aligned with broader platform policies.",
      "This is strong when teams care about enterprise consistency as much as raw demo speed.",
      "The final answer can fit neatly into a larger Microsoft-oriented architecture."
    ],
    llamaindex: [
      "The principal agent behaves more like a process owner in an evidence pipeline.",
      "Specialist steps contribute findings in a structured progression.",
      "Challenge becomes part of the workflow rather than a free-form argument.",
      "This is useful when the business wants disciplined research more than theatrical agent dialogue.",
      "The recommendation lands as the final step of the workflow."
    ],
    mastra: [
      "The principal agent can manage specialists through a product-team friendly workflow model.",
      "Evidence collection is explicit and easy to attach to product features.",
      "Challenge can be inserted as a review or guardrail step.",
      "The pattern is practical for a web product team that wants speed without total chaos.",
      "The final decision is packaged in one app-facing runtime."
    ],
    mcp: [
      "MCP is not the decision workflow by itself, but it helps every specialist use the same tools and data.",
      "The value here is consistent access to systems rather than agent delegation semantics.",
      "Challenge quality improves because agents can inspect a shared tool ecosystem.",
      "You still need another coordination pattern to run the debate.",
      "Business users should see MCP as infrastructure that strengthens the other frameworks."
    ]
  };

  const technicalMap = {
    a2a: [
      "Supervisor issues the initial remote task request to protocol-compatible specialist services.",
      "Specialists execute locally with their own tools and return artifacts across the network boundary.",
      "Risk specialists send rebuttals through additional task exchanges and clarifications.",
      "The debate is implemented as chained task messages, not in-process shared state.",
      "Supervisor synthesizes remote outputs and emits the final result."
    ],
    "openai-agents": [
      "Supervisor starts the run and may route via handoff to a specialized agent.",
      "Specialists invoke tools within one runtime and stream or return focused outputs.",
      "A critic or reviewer handoff can inspect the intermediate result before completion.",
      "Debate happens through controlled handoffs and shared run context.",
      "Supervisor terminates the run with a bounded final response."
    ],
    langgraph: [
      "Execution begins at a supervisor node with graph state initialized.",
      "Parallel or conditional branches gather specialist evidence into shared state.",
      "Challenge is an explicit review edge based on state or policy flags.",
      "Looping continues only until graph conditions are satisfied.",
      "The terminal node formats final structured output from accumulated state."
    ],
    ag2: [
      "Supervisor initiates a multi-agent conversation or group chat session.",
      "Specialists contribute findings as conversational turns, often with tool use in the loop.",
      "Critique is native because agents can address each other directly.",
      "Conversation selection and stop conditions must be managed carefully to avoid drift.",
      "Supervisor or designated closer emits the final answer."
    ],
    crewai: [
      "A flow or manager-like process initializes tasks and role assignments.",
      "Agents execute role-scoped tasks with their permitted tools and memory.",
      "Validation or manager review injects challenge before progression.",
      "State advances through task and process boundaries rather than open chat.",
      "The process returns a consolidated workflow output."
    ],
    "semantic-kernel": [
      "Supervisor agent coordinates messaging and shared platform capabilities inside the kernel ecosystem.",
      "Specialists may use plugins, models, and enterprise components from the same stack.",
      "Review can be implemented via additional agents or process logic.",
      "The framework favors governed composition over pure emergent chat.",
      "The result can plug into broader enterprise runtime patterns."
    ],
    llamaindex: [
      "A workflow starts with an event that routes through explicit steps.",
      "Specialist steps or agent workflows emit events with evidence payloads.",
      "A review step challenges weak claims before state advances.",
      "The orchestration is event-driven and easier to inspect than free chat.",
      "The terminal step publishes a final recommendation."
    ],
    mastra: [
      "Supervisor runs through workflow steps or agent network calls inside a TypeScript runtime.",
      "Specialists invoke tools, memory, or MCP-connected systems as needed.",
      "Challenge is introduced as a control-flow branch, review step, or guardrail.",
      "Suspend-resume and branching help contain multi-agent complexity.",
      "The workflow ends with a product-ready output and traces."
    ],
    mcp: [
      "MCP exposes tools and context in a standardized way to the participating agents.",
      "Specialists consume common resources through MCP instead of bespoke adapters.",
      "Challenge quality depends on which orchestration framework is above MCP.",
      "MCP standardizes access, not delegation or debate control.",
      "Final synthesis still belongs to the supervising runtime."
    ]
  };

  const map = audience.id === "business" ? businessMap : technicalMap;
  return map[framework.id][stage];
}

function renderFrameworkGrid() {
  frameworkGrid.innerHTML = frameworks
    .map(
      (framework) => `
        <article class="framework-card ${compareIds.includes(framework.id) ? "active" : ""}">
          <span class="framework-badge" style="background:${framework.color}">${framework.family}</span>
          <div class="framework-meta">
            <h3>${framework.name}</h3>
            <span>${framework.category}</span>
          </div>
          <p>${framework.summary}</p>
          <p><strong>Business fit:</strong> ${framework.business}</p>
          <div class="metric-row compact-metrics">
            <div class="metric">
              <span class="signal-label">Control</span>
              <strong>${metricLabel(framework.metrics.control)}</strong>
            </div>
            <div class="metric">
              <span class="signal-label">Business clarity</span>
              <strong>${metricLabel(framework.metrics.businessClarity)}</strong>
            </div>
            <div class="metric">
              <span class="signal-label">Interop</span>
              <strong>${metricLabel(framework.metrics.interoperability)}</strong>
            </div>
          </div>
        </article>
      `
    )
    .join("");
}

function renderAudienceChips() {
  audienceChips.innerHTML = audiences
    .map(
      (audience) => `
        <button class="chip ${audience.id === audienceId ? "active" : ""}" data-audience="${audience.id}">
          ${audience.label}
        </button>
      `
    )
    .join("");

  audienceChips.querySelectorAll("[data-audience]").forEach((button) => {
    button.addEventListener("click", () => {
      audienceId = button.dataset.audience;
      render();
    });
  });
}

function renderScenarioChips() {
  scenarioChips.innerHTML = scenarios
    .map(
      (scenario) => `
        <button class="chip ${scenario.id === scenarioId ? "active" : ""}" data-scenario="${scenario.id}">
          ${scenario.label}
        </button>
      `
    )
    .join("");

  scenarioChips.querySelectorAll("[data-scenario]").forEach((button) => {
    button.addEventListener("click", () => {
      scenarioId = button.dataset.scenario;
      currentStage = 0;
      render();
    });
  });
}

function renderSummary() {
  const audience = getAudience();
  const scenario = getScenario();
  scenarioHeadline.textContent = `${scenario.label} comparison`;
  scenarioSupport.textContent =
    audience.id === "business" ? scenario.businessGoal : scenario.technicalGoal;

  frameworkSummary.innerHTML = `
    <div class="summary-card">
      <p class="eyebrow">Audience Focus</p>
      <h3>${audience.label}</h3>
      <p>${audience.description}</p>
    </div>
    <div class="summary-card">
      <p class="eyebrow">Scenario Question</p>
      <h3>${scenario.problem}</h3>
      <p>${audience.id === "business" ? scenario.businessGoal : scenario.technicalGoal}</p>
    </div>
  `;
}

function renderLane(frameworkId, laneIndex) {
  const framework = getFramework(frameworkId);
  const scenario = getScenario();
  const audience = getAudience();

  return `
    <article class="compare-lane">
      <div class="lane-top">
        <div>
          <p class="eyebrow">Demo ${laneIndex + 1}</p>
          <h3>${framework.name}</h3>
        </div>
        <select class="lane-select" data-lane="${laneIndex}">
          ${frameworks
            .map(
              (option) => `
                <option value="${option.id}" ${option.id === framework.id ? "selected" : ""}>
                  ${option.name}
                </option>
              `
            )
            .join("")}
        </select>
      </div>

      <div class="lane-pill-row">
        <span class="lane-pill" style="background:${framework.color}">${framework.family}</span>
        <span class="lane-pill neutral">${framework.category}</span>
      </div>

      <p class="lane-summary">${audience.id === "business" ? framework.business : framework.technical}</p>

      <div class="lane-role-box">
        <strong>Principal + specialists fit</strong>
        <p>${framework.principalFit}</p>
      </div>

      <div class="sequence-list">
        ${scenario.stages
          .map((stage, index) => {
            const active = index === currentStage ? "active" : "";
            const text = laneExplanation(framework, index, audience);
            return `
              <div class="sequence-step ${active}">
                <div class="sequence-index">${index + 1}</div>
                <div class="sequence-body">
                  <h4>${stage.name}</h4>
                  <p>${text}</p>
                </div>
              </div>
            `;
          })
          .join("")}
      </div>

      <div class="lane-bottom">
        <article>
          <h4>Strengths</h4>
          <ul>${framework.strengths.map((item) => `<li>${item}</li>`).join("")}</ul>
        </article>
        <article>
          <h4>Tradeoffs</h4>
          <ul>${framework.tradeoffs.map((item) => `<li>${item}</li>`).join("")}</ul>
        </article>
      </div>

      <div class="lane-sources">
        <h4>Primary sources</h4>
        ${framework.sources
          .map((source) => `<a href="${source.url}" target="_blank" rel="noreferrer">${source.label}</a>`)
          .join("")}
      </div>
    </article>
  `;
}

function renderComparison() {
  comparisonLanes.innerHTML = compareIds.map((id, index) => renderLane(id, index)).join("");
  comparisonLanes.querySelectorAll(".lane-select").forEach((select) => {
    select.addEventListener("change", (event) => {
      const laneIndex = Number(event.target.dataset.lane);
      compareIds[laneIndex] = event.target.value;
      render();
    });
  });
}

function renderArchitectureGuidance() {
  const audience = getAudience();
  architectureGuidance.innerHTML = `
    <article>
      <h3>${audience.id === "business" ? "How to talk about it" : "How to design it"}</h3>
      <ul>
        <li>${
          audience.id === "business"
            ? "Frame the principal agent as the decision owner and specialists as controlled advisors."
            : "Make the principal agent own routing, stop conditions, and final synthesis."
        }</li>
        <li>${
          audience.id === "business"
            ? "Separate tool infrastructure, workflow control, and cross-agent communication so buyers do not confuse them."
            : "Treat tools, orchestration, and inter-agent protocol as separate layers."
        }</li>
        <li>${
          audience.id === "business"
            ? "Use side-by-side tradeoffs: faster to ship, easier to govern, easier to integrate, easier to audit."
            : "Evaluate by state model, concurrency, observability, and interoperability boundaries."
        }</li>
      </ul>
    </article>
    <article>
      <h3>Not exhaustive, but broader</h3>
      <ul>
        <li>This app now covers protocol-first, runtime SDK, workflow, conversation, enterprise, and adjacent standard categories.</li>
        <li>It is still a curated landscape, not a definitive list of every agent framework on the market.</li>
        <li>For a buying or architecture decision, these categories are usually more useful than a giant undifferentiated catalog.</li>
      </ul>
    </article>
    <article>
      <h3>Best fit for your scenario</h3>
      <ul>
        <li>If specialists are internal and you want high control, start with workflow or runtime frameworks.</li>
        <li>If specialists are owned by different teams or vendors, put A2A on the shortlist.</li>
        <li>If tools and shared context are the real bottleneck, compare orchestration options alongside MCP.</li>
      </ul>
    </article>
  `;
}

function nextStage() {
  currentStage = (currentStage + 1) % getScenario().stages.length;
  renderComparison();
}

function toggleAutoplay() {
  if (autoplay) {
    window.clearInterval(autoplay);
    autoplay = null;
    playDemoBtn.textContent = "Play Both Demos";
    return;
  }

  playDemoBtn.textContent = "Pause Demos";
  autoplay = window.setInterval(nextStage, 2200);
}

function render() {
  renderFrameworkGrid();
  renderAudienceChips();
  renderScenarioChips();
  renderSummary();
  renderComparison();
  renderArchitectureGuidance();
}

playDemoBtn.addEventListener("click", toggleAutoplay);
stepDemoBtn.addEventListener("click", nextStage);

render();
