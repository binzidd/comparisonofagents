const frameworks = [
  {
    id: "langgraph",
    name: "LangGraph",
    color: "#1f5f5b",
    runtime: "python",
    pattern: "Parallel Fan-out",
    executionModel: "Supervisor graph with explicit branch and merge nodes",
    withoutSkill: {
      capabilityUnit: "Graph node plus app-local helper code",
      headline: "The graph is strong, but every evidence rubric and reviewer checklist still lives in custom app code.",
      resultPacket: "State keys vary with the graph implementation",
      promptGlue: "High: node prompts and evidence rules are repeated in graph code",
      reuse: "Reuse mostly means copying nodes or subgraphs"
    },
    withSkill: {
      skillName: "Claude Policy Grounding Skill",
      capabilityUnit: "Graph node plus reusable Claude skill contract",
      headline: "The graph still owns routing, but the skill standardizes retrieval rules, caveats, and answer shape.",
      resultPacket: "EvidencePacket -> ReviewPacket -> DecisionPacket",
      promptGlue: "Lower: graph nodes call the same bundled capability instead of redefining it",
      reuse: "Reuse means attaching the same skill to any graph node that needs policy grounding"
    },
    metrics: [
      { label: "Prompt Glue", base: 4, skill: 2 },
      { label: "Tool Wiring", base: 3, skill: 2 },
      { label: "Output Consistency", base: 3, skill: 5 },
      { label: "Reuse Across Tasks", base: 3, skill: 5 }
    ],
    stages: [
      { stage: "Intake", framework: "Opens the graph run and seeds shared state.", skill: "Loads the reusable policy-ingestion rubric and question template." },
      { stage: "Review", framework: "Fans out to specialists and gathers findings.", skill: "Normalizes clause extraction, evidence formatting, and citation requirements." },
      { stage: "Challenge", framework: "Routes into a reviewer edge when needed.", skill: "Packages a fixed rebuttal checklist so reviewer behavior is reusable." },
      { stage: "Verdict", framework: "Merges branches and emits the final answer.", skill: "Ensures the final packet keeps caveats, citations, and confidence fields." }
    ]
  },
  {
    id: "openai-agents",
    name: "OpenAI Agents SDK",
    color: "#6b4bc2",
    runtime: "python",
    pattern: "Sequential Chain",
    executionModel: "Linear baton-pass handoffs inside one run context",
    withoutSkill: {
      capabilityUnit: "Specialist agent plus handoff-specific prompt bundle",
      headline: "Handoffs are clean, but every specialist still carries repeated evidence and review instructions.",
      resultPacket: "Run context shaped by each handoff",
      promptGlue: "High: repeated grounding rules live across multiple agent prompts",
      reuse: "Reuse is mostly prompt copying across agents"
    },
    withSkill: {
      skillName: "Claude Policy Grounding Skill",
      capabilityUnit: "Specialist handoff plus reusable Claude skill bundle",
      headline: "The SDK still owns specialist handoffs, while the skill packages the evidence contract every specialist can reuse.",
      resultPacket: "Shared skill packet attached to the handoff chain",
      promptGlue: "Lower: specialists call the same skill instead of restating the grounding policy",
      reuse: "Reuse means the same skill can sit behind multiple specialists and tasks"
    },
    metrics: [
      { label: "Prompt Glue", base: 5, skill: 2 },
      { label: "Tool Wiring", base: 4, skill: 2 },
      { label: "Output Consistency", base: 3, skill: 5 },
      { label: "Reuse Across Tasks", base: 3, skill: 5 }
    ],
    stages: [
      { stage: "Intake", framework: "Creates the run context and decides the first handoff.", skill: "Prepares the shared grounding instructions and evidence schema once." },
      { stage: "Review", framework: "Hands the case from specialist to specialist.", skill: "Makes each specialist return a normalized evidence packet." },
      { stage: "Challenge", framework: "Passes through the reviewer handoff.", skill: "Adds the same reusable review rubric and failure criteria every time." },
      { stage: "Verdict", framework: "Returns the final guarded answer.", skill: "Standardizes what the final answer must contain before it leaves the chain." }
    ]
  },
  {
    id: "ag2",
    name: "AG2",
    color: "#cf8f2e",
    runtime: "python",
    pattern: "Mesh Network",
    executionModel: "Conversation mesh with direct specialist challenge",
    withoutSkill: {
      capabilityUnit: "Specialist persona plus conversation prompt stack",
      headline: "The debate shape is flexible, but the same grounding and citation instructions keep getting repeated in chat roles.",
      resultPacket: "Conversation transcript with variable evidence quality",
      promptGlue: "Very high: debate roles and reviewer constraints grow quickly",
      reuse: "Reuse is mostly conversational prompt reuse"
    },
    withSkill: {
      skillName: "Claude Policy Grounding Skill",
      capabilityUnit: "Conversation role plus reusable Claude skill bundle",
      headline: "AG2 still runs the debate, but the skill gives every specialist the same evidence contract and stop rules.",
      resultPacket: "Transcript plus normalized evidence packet",
      promptGlue: "Lower: reusable grounding logic sits in the skill instead of every role prompt",
      reuse: "Reuse means the same skill keeps new debates anchored"
    },
    metrics: [
      { label: "Prompt Glue", base: 5, skill: 3 },
      { label: "Tool Wiring", base: 2, skill: 2 },
      { label: "Output Consistency", base: 2, skill: 4 },
      { label: "Reuse Across Tasks", base: 3, skill: 5 }
    ],
    stages: [
      { stage: "Intake", framework: "Convenes the policy council.", skill: "Injects one reusable framing packet so the debate starts anchored." },
      { stage: "Review", framework: "Lets specialists debate directly.", skill: "Standardizes how each speaker cites and formats evidence." },
      { stage: "Challenge", framework: "Reviewer sharpens the discussion.", skill: "Applies the same rebuttal protocol and stop conditions each run." },
      { stage: "Verdict", framework: "Converges the transcript into one answer.", skill: "Extracts a clean decision packet from the noisy conversation." }
    ]
  },
  {
    id: "crewai",
    name: "CrewAI",
    color: "#445fbb",
    runtime: "python",
    pattern: "Manager Review",
    executionModel: "Manager assigns specialist tasks, then resumes after review",
    withoutSkill: {
      capabilityUnit: "Task definition plus manager prompt",
      headline: "Task ownership is clear, but the same policy-grounding logic often gets duplicated inside task descriptions.",
      resultPacket: "Task outputs with manager-specific summary logic",
      promptGlue: "Moderate: repeated grounding text lives in task descriptions",
      reuse: "Reuse means cloning or editing task bundles"
    },
    withSkill: {
      skillName: "Claude Policy Grounding Skill",
      capabilityUnit: "Task bundle plus reusable Claude skill bundle",
      headline: "CrewAI still owns the task flow, while the skill carries the shared evidence and review logic across tasks.",
      resultPacket: "Task outputs normalized by one reusable skill packet",
      promptGlue: "Lower: tasks stay role-specific while the skill holds the reusable grounding behavior",
      reuse: "Reuse means dropping the same skill into different crews"
    },
    metrics: [
      { label: "Prompt Glue", base: 4, skill: 2 },
      { label: "Tool Wiring", base: 3, skill: 2 },
      { label: "Output Consistency", base: 3, skill: 4 },
      { label: "Reuse Across Tasks", base: 4, skill: 5 }
    ],
    stages: [
      { stage: "Intake", framework: "Manager opens the task bundle.", skill: "Supplies the shared policy rubric once for all downstream tasks." },
      { stage: "Review", framework: "Workers complete role-scoped tasks.", skill: "Keeps the evidence packet format consistent across workers." },
      { stage: "Challenge", framework: "Manager or reviewer halts weak outputs.", skill: "Packages the reusable review checklist and missing-support rules." },
      { stage: "Verdict", framework: "Manager assembles the recommendation.", skill: "Guarantees the final packet retains citations and caveats." }
    ]
  },
  {
    id: "semantic-kernel",
    name: "Semantic Kernel",
    color: "#9b4c3d",
    runtime: "python",
    pattern: "Enterprise Gated",
    executionModel: "Governed workflow with platform-level checkpoints and controls",
    withoutSkill: {
      capabilityUnit: "Governed plugin step plus platform policy",
      headline: "Governance is strong, but reusable evidence behavior still often gets implemented in custom plugin code.",
      resultPacket: "Governed packet shaped by plugin and policy code",
      promptGlue: "Moderate: less prompt noise, more runtime policy code",
      reuse: "Reuse flows through shared plugins more than shared prompts"
    },
    withSkill: {
      skillName: "Claude Policy Grounding Skill",
      capabilityUnit: "Governed step plus reusable Claude skill bundle",
      headline: "The platform still owns approvals, while the skill packages the repeatable policy-grounding behavior the plugins keep calling.",
      resultPacket: "Governed packet with reusable skill-defined evidence fields",
      promptGlue: "Lower: evidence policy becomes reusable instead of plugin-specific",
      reuse: "Reuse means the same skill supports multiple governed flows"
    },
    metrics: [
      { label: "Prompt Glue", base: 3, skill: 2 },
      { label: "Tool Wiring", base: 4, skill: 3 },
      { label: "Output Consistency", base: 4, skill: 5 },
      { label: "Reuse Across Tasks", base: 4, skill: 5 }
    ],
    stages: [
      { stage: "Intake", framework: "Creates a governed case record.", skill: "Adds a reusable policy-ingestion routine inside the governed flow." },
      { stage: "Review", framework: "Runs plugin-backed specialist checks.", skill: "Makes every specialist emit the same evidence fields." },
      { stage: "Challenge", framework: "Applies the governance gate.", skill: "Supplies one reusable ambiguity and support checklist." },
      { stage: "Verdict", framework: "Publishes the governed answer.", skill: "Standardizes the answer payload before approval and release." }
    ]
  },
  {
    id: "llamaindex",
    name: "LlamaIndex",
    color: "#3f6b2a",
    runtime: "python",
    pattern: "Event Pipeline",
    executionModel: "Event-driven evidence pipeline with aggregation steps",
    withoutSkill: {
      capabilityUnit: "Event handler plus local payload contract",
      headline: "The event pipeline is clean, but payload normalization and retrieval policy are still easy to duplicate across steps.",
      resultPacket: "Event payloads that vary by workflow design",
      promptGlue: "Moderate: less dialogue noise, more payload and step duplication",
      reuse: "Reuse usually means sharing handlers or event contracts"
    },
    withSkill: {
      skillName: "Claude Policy Grounding Skill",
      capabilityUnit: "Event handler plus reusable Claude skill bundle",
      headline: "LlamaIndex still owns event flow, while the skill packages reusable evidence extraction and answer-shaping logic.",
      resultPacket: "Reusable evidence packet passed through the pipeline",
      promptGlue: "Lower: specialist steps call the same skill-defined capability",
      reuse: "Reuse means the same skill can sit behind multiple workflow handlers"
    },
    metrics: [
      { label: "Prompt Glue", base: 3, skill: 2 },
      { label: "Tool Wiring", base: 3, skill: 2 },
      { label: "Output Consistency", base: 3, skill: 5 },
      { label: "Reuse Across Tasks", base: 4, skill: 5 }
    ],
    stages: [
      { stage: "Intake", framework: "Emits the initial case event.", skill: "Provides a reusable intake packet and retrieval rubric." },
      { stage: "Review", framework: "Routes evidence through handlers.", skill: "Normalizes clause extraction so events stay comparable." },
      { stage: "Challenge", framework: "Requests follow-up evidence.", skill: "Packages the same reviewer prompts and missing-proof checks." },
      { stage: "Verdict", framework: "Aggregates the final payload.", skill: "Keeps the final answer packet stable across workflows." }
    ]
  },
  {
    id: "mastra",
    name: "Mastra",
    color: "#0f6d90",
    runtime: "typescript",
    pattern: "App Workflow",
    executionModel: "App-native workflow that keeps orchestration close to product code",
    withoutSkill: {
      capabilityUnit: "Workflow step plus app-local prompt/tool wrappers",
      headline: "Product-friendly orchestration is great, but repeated grounding behavior can still sprawl across workflow steps.",
      resultPacket: "Workflow context shaped by product code",
      promptGlue: "Moderate: repeated wrappers often spread through step implementations",
      reuse: "Reuse usually means sharing workflow helpers"
    },
    withSkill: {
      skillName: "Claude Policy Grounding Skill",
      capabilityUnit: "Workflow step plus reusable Claude skill bundle",
      headline: "Mastra still owns workflow control, while the skill bundles the reusable policy capability the product steps keep calling.",
      resultPacket: "Workflow context plus normalized decision packet",
      promptGlue: "Lower: workflow steps stay slim while the skill carries the repeated capability",
      reuse: "Reuse means the same skill can power multiple product flows"
    },
    metrics: [
      { label: "Prompt Glue", base: 3, skill: 2 },
      { label: "Tool Wiring", base: 3, skill: 2 },
      { label: "Output Consistency", base: 3, skill: 5 },
      { label: "Reuse Across Tasks", base: 4, skill: 5 }
    ],
    stages: [
      { stage: "Intake", framework: "Opens the workflow context.", skill: "Packages intake assumptions, retrieval rules, and expected packet fields." },
      { stage: "Review", framework: "Runs specialist workflow steps.", skill: "Provides one shared evidence-normalization capability." },
      { stage: "Challenge", framework: "Branches into guardrail review.", skill: "Adds a reusable reviewer policy instead of hardcoding each branch." },
      { stage: "Verdict", framework: "Resumes and publishes the product-facing answer.", skill: "Makes the final packet reusable across multiple app surfaces." }
    ]
  },
  {
    id: "pydanticai",
    name: "PydanticAI",
    color: "#b34747",
    runtime: "python",
    pattern: "Typed Review",
    executionModel: "Typed orchestration pipeline with validated inputs and outputs",
    withoutSkill: {
      capabilityUnit: "Typed model plus framework-specific validation code",
      headline: "Typed outputs already reduce noise, but reusable evidence behavior can still be rewritten around the models.",
      resultPacket: "Validated models, but packaging logic remains app-specific",
      promptGlue: "Lower than most, though reusable capability still lives in local code",
      reuse: "Reuse centers on models and helpers"
    },
    withSkill: {
      skillName: "Claude Policy Grounding Skill",
      capabilityUnit: "Typed model plus reusable Claude skill bundle",
      headline: "PydanticAI keeps type guarantees, while the Claude skill carries the repeatable grounding logic around those models.",
      resultPacket: "Typed decision packet with skill-defined evidence fields",
      promptGlue: "Lowest: schemas and the skill split validation from reusable behavior cleanly",
      reuse: "Reuse means the same skill can feed many typed workflows"
    },
    metrics: [
      { label: "Prompt Glue", base: 2, skill: 1 },
      { label: "Tool Wiring", base: 3, skill: 2 },
      { label: "Output Consistency", base: 4, skill: 5 },
      { label: "Reuse Across Tasks", base: 4, skill: 5 }
    ],
    stages: [
      { stage: "Intake", framework: "Initializes typed case models.", skill: "Adds a reusable grounding routine before the models fan out." },
      { stage: "Review", framework: "Validates specialist outputs.", skill: "Keeps every evidence object aligned to the same reusable policy capability." },
      { stage: "Challenge", framework: "Rejects weak or incomplete outputs.", skill: "Bundles the same missing-support and caveat checks each run." },
      { stage: "Verdict", framework: "Emits a validated answer object.", skill: "Guarantees the reusable answer packet stays portable across typed tasks." }
    ]
  }
];

const likeStore = {
  storageKey: "comparison_lab_like_state",
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

let selectedFrameworkId = "langgraph";
let skillsHeadline;
let skillsSupport;
let skillsFrameworkRow;
let skillsSummaryGrid;
let skillsComparisonGrid;
let skillsStageBoard;
let starterPackSupport;
let starterPackGrid;
let agentcoreSupport;
let agentcoreBoard;
let footerLikeBtn;
let footerLikeCount;

function getFramework(id = selectedFrameworkId) {
  return frameworks.find((item) => item.id === id) || frameworks[0];
}

function pillDots(score) {
  return new Array(5)
    .fill(0)
    .map((_, index) => `<span class="noise-dot ${index < score ? "active" : ""}"></span>`)
    .join("");
}

function renderFrameworkChips() {
  skillsFrameworkRow.innerHTML = frameworks
    .map((framework) => `
      <button
        class="chip framework-skill-chip ${framework.id === selectedFrameworkId ? "active" : ""}"
        type="button"
        data-framework-id="${framework.id}"
        style="--chip-color:${framework.color}">
        ${framework.name}
      </button>
    `)
    .join("");

  skillsFrameworkRow.querySelectorAll("[data-framework-id]").forEach((button) => {
    button.addEventListener("click", () => {
      selectedFrameworkId = button.dataset.frameworkId;
      render();
    });
  });
}

function renderSummary() {
  const framework = getFramework();
  skillsHeadline.textContent = `${framework.name} alone vs ${framework.name} with a Claude skill`;
  skillsSupport.textContent = "These are modeled skill-assisted execution results, not raw SDK benchmarks. The framework still owns orchestration. The Claude skill owns the reusable policy-grounding behavior that would otherwise keep getting rewritten in prompts, helper code, and validation wrappers.";

  skillsSummaryGrid.innerHTML = `
    <article class="skills-summary-card" style="--framework-color:${framework.color}">
      <span class="eyebrow">Execution Layer</span>
      <h3>${framework.executionModel}</h3>
      <p>${framework.withoutSkill.headline}</p>
      <div class="skills-summary-pills">
        <span class="summary-pill">Pattern: ${framework.pattern}</span>
        <span class="summary-pill">Framework keeps routing and runtime state</span>
      </div>
    </article>
    <article class="skills-summary-card skill-accent" style="--framework-color:${framework.color}">
      <span class="eyebrow">Skill Layer</span>
      <h3>${framework.withSkill.skillName}</h3>
      <p>${framework.withSkill.headline}</p>
      <div class="skills-summary-pills">
        <span class="summary-pill">Skill packages evidence rules</span>
        <span class="summary-pill">Framework + skill becomes the reusable unit</span>
      </div>
    </article>
  `;
}

function comparisonCard(title, details, accent = false) {
  return `
    <article class="skill-exec-card ${accent ? "skill-exec-card-accent" : ""}">
      <div class="skill-exec-head">
        <h3>${title}</h3>
      </div>
      <div class="capability-grid">
        <article>
          <span>Capability Unit</span>
          <strong>${details.capabilityUnit}</strong>
        </article>
        <article>
          <span>Execution Result</span>
          <strong>${details.resultPacket}</strong>
        </article>
        <article>
          <span>Prompt Glue</span>
          <strong>${details.promptGlue}</strong>
        </article>
        <article>
          <span>Reuse Story</span>
          <strong>${details.reuse}</strong>
        </article>
      </div>
    </article>
  `;
}

function renderComparison() {
  const framework = getFramework();
  skillsComparisonGrid.innerHTML = `
    ${comparisonCard(`${framework.name} Alone`, framework.withoutSkill)}
    ${comparisonCard(`${framework.name} + Claude Skill`, framework.withSkill, true)}
    <section class="framework-scorecard skills-metric-card">
      <div class="framework-scorecard-head">
        <h4>Modeled Execution Delta</h4>
        <span>Before vs skill-assisted</span>
      </div>
      <div class="noise-budget-grid">
        ${framework.metrics.map((metric) => `
          <article class="skill-metric-row">
            <div>
              <strong>${metric.label}</strong>
            </div>
            <div class="skill-metric-compare">
              <span>Without</span>
              <div class="noise-dot-row">${pillDots(metric.base)}</div>
            </div>
            <div class="skill-metric-compare">
              <span>With skill</span>
              <div class="noise-dot-row">${pillDots(metric.skill)}</div>
            </div>
          </article>
        `).join("")}
      </div>
    </section>
  `;
}

function renderStageBoard() {
  const framework = getFramework();
  skillsStageBoard.innerHTML = framework.stages
    .map((item) => `
      <article class="skill-stage-row">
        <div class="skill-stage-title">
          <span class="lane-stage-eyebrow">${item.stage}</span>
        </div>
        <div class="skill-stage-column">
          <span>Framework still owns</span>
          <strong>${item.framework}</strong>
        </div>
        <div class="skill-stage-column skill-stage-column-accent">
          <span>Claude skill now packages</span>
          <strong>${item.skill}</strong>
        </div>
      </article>
    `)
    .join("");
}

function starterPackForFramework(framework) {
  const byId = {
    langgraph: {
      files: [
        ["agents.py", "Graph nodes and orchestration"],
        ["app.py", "Runtime entrypoint"],
        ["skill_contract.py", "Claude skill boundary"],
        ["review_checklist.md", "Reusable rebuttal rules"],
        [".env.example", "Config template"]
      ],
      quickstart: ["Model the state object first", "Wrap retrieval and reviewer logic behind one Claude skill call", "Keep branch nodes thin and packet-oriented"],
      repoKit: "/starter-kits/zips/langgraph.zip"
    },
    "openai-agents": {
      files: [
        ["agents.py", "Specialist agents"],
        ["app.py", "Runner entrypoint"],
        ["handoff_packets.py", "Shared packet schema"],
        ["skill_contract.py", "Claude skill boundary"],
        [".env.example", "Config template"]
      ],
      quickstart: ["Define one shared evidence packet", "Let each specialist handoff call the same Claude skill", "Validate the final return packet before verdict"],
      repoKit: "/starter-kits/zips/openai-agents.zip"
    },
    ag2: {
      files: [
        ["agents.py", "Debate roles"],
        ["app.py", "Chat runtime entrypoint"],
        ["debate_rules.py", "Turn and stop rules"],
        ["skill_contract.py", "Claude skill boundary"],
        ["review_protocol.md", "Challenge protocol"]
      ],
      quickstart: ["Keep the group chat small", "Use the Claude skill as the evidence-grounding layer", "Terminate debate on missing-support conditions"],
      repoKit: "/starter-kits/zips/ag2.zip"
    },
    crewai: {
      files: [
        ["crew.py", "Crew assembly"],
        ["tasks.py", "Role-scoped tasks"],
        ["skill_contract.py", "Claude skill boundary"],
        ["manager_review.md", "Manager review rubric"],
        [".env.example", "Config template"]
      ],
      quickstart: ["Attach the Claude skill to task templates", "Keep the manager prompt focused on routing and approval", "Make every worker emit the same evidence packet"],
      repoKit: null
    },
    "semantic-kernel": {
      files: [
        ["kernel.py", "Kernel entrypoint"],
        ["plugins/policy_skill.py", "Reusable policy plugin"],
        ["skill_contract.py", "Claude skill boundary"],
        ["governance_filters.py", "Approval and audit hooks"],
        [".env.example", "Config template"]
      ],
      quickstart: ["Put policy grounding in one reusable plugin boundary", "Let approvals stay in the framework layer", "Keep audit fields in the final packet"],
      repoKit: null
    },
    llamaindex: {
      files: [
        ["workflow.py", "Workflow definition"],
        ["events.py", "Event payloads"],
        ["skill_contract.py", "Claude skill boundary"],
        ["aggregation.py", "Verdict assembly"],
        [".env.example", "Config template"]
      ],
      quickstart: ["Normalize event payloads early", "Call the Claude skill from specialist handlers", "Aggregate only validated evidence packets"],
      repoKit: "/starter-kits/zips/llamaindex.zip"
    },
    mastra: {
      files: [
        ["workflow.ts", "Workflow definition"],
        ["agents.ts", "Agent setup"],
        ["skill-contract.ts", "Claude skill boundary"],
        ["guardrails.ts", "Review branch logic"],
        [".env.example", "Config template"]
      ],
      quickstart: ["Keep the workflow step product-facing", "Hide repeated policy logic behind the skill contract", "Resume from guardrail branches with the same packet shape"],
      repoKit: null
    },
    pydanticai: {
      files: [
        ["agents.py", "Typed agents"],
        ["models.py", "Evidence and verdict models"],
        ["skill_contract.py", "Claude skill boundary"],
        ["validators.py", "Runtime validation"],
        [".env.example", "Config template"]
      ],
      quickstart: ["Define the evidence packet in Pydantic first", "Use the Claude skill for reusable extraction behavior", "Let model validation guard the final verdict"],
      repoKit: "/starter-kits/zips/pydanticai.zip"
    }
  };

  return byId[framework.id];
}

function agentCorePlanForFramework(framework) {
  const directCode = framework.runtime === "python";
  const deployMode = directCode ? "Direct code deployment to AgentCore Runtime" : "Container-oriented AgentCore Runtime deployment";
  const why = directCode
    ? "AWS AgentCore's starter-toolkit path is most straightforward for the Python-based frameworks in this repo."
    : "Mastra is TypeScript-first, so a container or custom runtime package is the safer fit. This is an implementation inference based on AWS's current Python-first starter-toolkit flow.";
  const steps = directCode
    ? [
        "Install the AgentCore starter toolkit and configure AWS credentials.",
        "Point AgentCore at the framework entrypoint that already wraps the Claude skill contract.",
        "Run locally with `agentcore dev` and verify `/invocations` responds with the normalized packet.",
        "Deploy with the current AgentCore CLI flow. AWS quickstart docs show `agentcore deploy`, while the starter-toolkit tutorial still documents `agentcore launch`."
      ]
    : [
        "Package the framework-plus-skill runtime as a container or custom runtime artifact.",
        "Keep the Claude skill contract inside the app layer and expose one invocation endpoint to AgentCore Runtime.",
        "Test the container locally before handing it to AgentCore Runtime.",
        "Deploy through AgentCore Runtime using the runtime artifact path rather than the Python starter-kit shortcut."
      ];

  const commands = directCode
    ? [
        "pip install bedrock-agentcore-starter-toolkit",
        "agentcore configure -e app.py",
        "agentcore dev",
        "agentcore deploy"
      ]
    : [
        "docker build -t framework-skill-agent .",
        "docker run -p 8080:8080 framework-skill-agent",
        "agentcore configure",
        "agentcore deploy"
      ];

  return {
    deployMode,
    why,
    toolSurface: "If the Claude skill needs file ops, browsing, or code execution, AgentCore Runtime alone is not the whole story. You likely need AgentCore built-in tools such as Code Interpreter or Browser, each created as its own tool resource and invoked through sessions.",
    sandboxNote: "Code Interpreter is a separate isolated tool surface with its own network mode choices: Sandbox, Public, or VPC. That is different from simply deploying the framework runtime.",
    steps,
    commands,
    docs: [
      { label: "AgentCore interfaces", href: "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/develop-agents.html" },
      { label: "Direct code deployment", href: "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-get-started-code-deploy.html" },
      { label: "Built-in tools", href: "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/built-in-tools.html" },
      { label: "Code Interpreter resource management", href: "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/code-interpreter-resource-management.html" }
    ]
  };
}

function renderStarterPack() {
  const framework = getFramework();
  const pack = starterPackForFramework(framework);
  starterPackSupport.textContent = `This starter pack is tailored to ${framework.name}. The framework still owns orchestration; the Claude skill contract owns the reusable policy-grounding capability.`;

  starterPackGrid.innerHTML = `
    <article class="starter-pack-card" style="--framework-color:${framework.color}">
      <div class="capability-card-head">
        <div>
          <p class="eyebrow">Starter Files</p>
          <h3>${framework.name} + Claude skill starter pack</h3>
        </div>
        ${pack.repoKit ? `<a class="kit-download-btn" href="${pack.repoKit}" download>Starter Kit</a>` : `<span class="capability-pattern">Blueprint</span>`}
      </div>
      <div class="starter-file-list starter-file-list-compact">
        ${pack.files.map(([file, desc]) => `
          <article class="starter-file-row">
            <strong>${file}</strong>
            <span>${desc}</span>
          </article>
        `).join("")}
      </div>
    </article>
    <article class="starter-pack-card">
      <div class="capability-card-head">
        <div>
          <p class="eyebrow">Tailoring Notes</p>
          <h3>How this pack should be used</h3>
        </div>
      </div>
      <div class="starter-guidance-list">
        ${pack.quickstart.map((item) => `<article><strong>${item}</strong></article>`).join("")}
      </div>
    </article>
  `;
}

function renderAgentCore() {
  const framework = getFramework();
  const plan = agentCorePlanForFramework(framework);
  agentcoreSupport.textContent = "Based on the current official Amazon Bedrock AgentCore docs, AgentCore Runtime is framework-agnostic, but the easiest documented path is the starter-toolkit flow for Python agents. The TypeScript recommendation here is an implementation inference.";

  agentcoreBoard.innerHTML = `
    <article class="agentcore-card" style="--framework-color:${framework.color}">
      <div class="capability-card-head">
        <div>
          <p class="eyebrow">Deployment Mode</p>
          <h3>${plan.deployMode}</h3>
        </div>
        <span class="capability-pattern">AWS AgentCore</span>
      </div>
      <p>${plan.why}</p>
      <div class="agentcore-callout-grid">
        <article class="agentcore-callout">
          <span>Runtime layer</span>
          <strong>${plan.deployMode}</strong>
        </article>
        <article class="agentcore-callout">
          <span>Tool surface</span>
          <strong>${plan.toolSurface}</strong>
        </article>
        <article class="agentcore-callout">
          <span>Sandbox note</span>
          <strong>${plan.sandboxNote}</strong>
        </article>
      </div>
      <div class="starter-guidance-list">
        ${plan.steps.map((item, index) => `<article><span>${index + 1}</span><strong>${item}</strong></article>`).join("")}
      </div>
    </article>
    <article class="agentcore-card">
      <div class="capability-card-head">
        <div>
          <p class="eyebrow">CLI Flow</p>
          <h3>Suggested commands</h3>
        </div>
      </div>
      <pre class="agentcore-code"><code>${plan.commands.join("\n")}</code></pre>
      <div class="agentcore-links">
        ${plan.docs.map((doc) => `<a href="${doc.href}" target="_blank" rel="noreferrer">${doc.label}</a>`).join("")}
      </div>
    </article>
  `;
}

function renderFooterLike(serverTotal) {
  if (!footerLikeBtn || !footerLikeCount) return;
  const state = likeStore.read();
  const displayTotal = serverTotal !== undefined ? serverTotal : state.count;
  footerLikeCount.textContent = String(displayTotal);
  footerLikeBtn.classList.toggle("liked", state.liked);
  footerLikeBtn.setAttribute("aria-pressed", state.liked ? "true" : "false");
  const icon = footerLikeBtn.querySelector(".like-icon");
  if (icon) icon.textContent = state.liked ? "♥" : "♡";
}

async function toggleFooterLike() {
  const state = likeStore.read();
  const nowLiked = !state.liked;

  if (nowLiked) {
    const optimisticCount = state.count + 1;
    likeStore.write({ count: optimisticCount, liked: true });
    renderFooterLike(optimisticCount);
    try {
      const res = await fetch("/api/like", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        likeStore.write({ count: data.total, liked: true });
        renderFooterLike(data.total);
      }
    } catch (_error) {
      // Keep optimistic state if the endpoint is unavailable.
    }
  } else {
    const newCount = Math.max(0, state.count - 1);
    likeStore.write({ count: newCount, liked: false });
    renderFooterLike(newCount);
  }
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

function render() {
  renderFrameworkChips();
  renderSummary();
  renderComparison();
  renderStageBoard();
  renderStarterPack();
  renderAgentCore();
}

function initApp() {
  skillsHeadline = document.getElementById("skills-headline");
  skillsSupport = document.getElementById("skills-support");
  skillsFrameworkRow = document.getElementById("skills-framework-row");
  skillsSummaryGrid = document.getElementById("skills-summary-grid");
  skillsComparisonGrid = document.getElementById("skills-comparison-grid");
  skillsStageBoard = document.getElementById("skills-stage-board");
  starterPackSupport = document.getElementById("starter-pack-support");
  starterPackGrid = document.getElementById("starter-pack-grid");
  agentcoreSupport = document.getElementById("agentcore-support");
  agentcoreBoard = document.getElementById("agentcore-board");
  footerLikeBtn = document.getElementById("footer-like-btn");
  footerLikeCount = document.getElementById("footer-like-count");

  const required = [
    skillsHeadline,
    skillsSupport,
    skillsFrameworkRow,
    skillsSummaryGrid,
    skillsComparisonGrid,
    skillsStageBoard,
    starterPackSupport,
    starterPackGrid,
    agentcoreSupport,
    agentcoreBoard,
    footerLikeBtn,
    footerLikeCount
  ];

  if (required.some((item) => !item)) {
    throw new Error("Missing DOM nodes for skills page.");
  }

  footerLikeBtn.addEventListener("click", toggleFooterLike);
  initTheme();
  renderFooterLike();
  fetch("/api/like")
    .then((r) => r.json())
    .then((data) => {
      const state = likeStore.read();
      likeStore.write({ liked: state.liked, count: data.total });
      renderFooterLike(data.total);
    })
    .catch(() => {});
  render();
}

initApp();
