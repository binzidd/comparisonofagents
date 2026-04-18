const metricDefinitions = {
  "Prompt Glue": {
    definition: "How much repeated prompt text the app has to keep rewriting for the same GitHub policy task.",
    direction: "lower",
    scaleLabel: "1 = less repeated prompting, 5 = more repeated prompting"
  },
  "Tool Wiring": {
    definition: "How much bespoke wrapper code or schema plumbing is needed to connect retrieval, review, and verdict steps.",
    direction: "lower",
    scaleLabel: "1 = less wiring, 5 = more wiring"
  },
  "Output Consistency": {
    definition: "How reliably the run returns the same evidence packet and final answer shape for the GitHub question.",
    direction: "higher",
    scaleLabel: "1 = less consistent, 5 = more consistent"
  },
  "Reuse Across Tasks": {
    definition: "How easily the same policy-grounding capability can be reused on the next GitHub governance or policy question.",
    direction: "higher",
    scaleLabel: "1 = harder to reuse, 5 = easier to reuse"
  }
};

const stageSkillArtifacts = {
  Intake: {
    skillName: "github_policy_intake",
    file: ".claude/skills/github_policy_intake/SKILL.md",
    snippet: [
      "# GitHub Policy Intake",
      "- Load the user's GitHub privacy question.",
      "- Focus on clauses about sharing, retention, deletion, and user rights.",
      "- Return a case brief with question, scope, and target clauses."
    ]
  },
  Review: {
    skillName: "github_clause_extractor",
    file: ".claude/skills/github_clause_extractor/SKILL.md",
    snippet: [
      "# GitHub Clause Extractor",
      "- For each finding, return `clause_quote`, `clause_id`, and `takeaway`.",
      "- Mark whether the clause supports, weakens, or limits the draft answer.",
      "- Reject free-form summaries without a cited GitHub clause."
    ]
  },
  Challenge: {
    skillName: "github_claim_reviewer",
    file: ".claude/skills/github_claim_reviewer/SKILL.md",
    snippet: [
      "# GitHub Claim Reviewer",
      "- Challenge claims that lack a GitHub clause.",
      "- Add caveats when the policy language is conditional or narrow.",
      "- Send the answer back if retention or deletion behavior is overstated."
    ]
  },
  Verdict: {
    skillName: "github_verdict_guard",
    file: ".claude/skills/github_verdict_guard/SKILL.md",
    snippet: [
      "# GitHub Verdict Guard",
      "- Final answer must include verdict, clause ids, and caveats.",
      "- Add a confidence line based on evidence strength.",
      "- Do not ship an answer with uncited policy assertions."
    ]
  }
};

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
      { stage: "Intake", framework: "Opens the graph run, stores the GitHub privacy question, and seeds the shared state object.", skill: "Preloads the clause checklist for sharing, retention, deletion, and user-rights language so every node starts from the same brief." },
      { stage: "Review", framework: "Fans out to retrieval and policy-review nodes, then gathers their findings back into graph state.", skill: "Makes each node return the same packet: clause quote, clause id, plain-English takeaway, and whether it supports or weakens the draft answer." },
      { stage: "Challenge", framework: "Routes into the reviewer edge if the evidence is weak or contradictory.", skill: "Runs the same challenge rubric every time: 'show the GitHub clause', 'flag overclaiming', and 'force a caveat if the text is ambiguous'." },
      { stage: "Verdict", framework: "Merges the branches and emits the final cited answer.", skill: "Standardizes the final answer shape so it includes the verdict, supporting GitHub clause ids, caveats, and confidence before it leaves the graph." }
    ]
  },
  {
    id: "openai-agents",
    name: "OpenAI Agents SDK",
    color: "#6b4bc2",
    runtime: "python",
    pattern: "Parallel Specialists",
    executionModel: "Independent specialist agents gathered concurrently before reviewer and verdict",
    withoutSkill: {
      capabilityUnit: "Specialist agent plus shared prompt bundle",
      headline: "Parallel review is faster, but every specialist still carries repeated evidence and review instructions.",
      resultPacket: "Parallel findings merged into reviewer context",
      promptGlue: "High: repeated grounding rules live across multiple agent prompts",
      reuse: "Reuse is mostly prompt copying across agents"
    },
    withSkill: {
      skillName: "Claude Policy Grounding Skill",
      capabilityUnit: "Specialist agent plus reusable Claude skill bundle",
      headline: "The SDK still owns parallel specialist execution, while the skill packages the evidence contract every specialist can reuse.",
      resultPacket: "Shared skill packet merged after parallel review",
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
      { stage: "Intake", framework: "Creates the run context for the GitHub privacy question and prepares the specialist fan-out.", skill: "Injects one shared grounding brief covering the exact clauses every parallel specialist should look for." },
      { stage: "Review", framework: "Runs compliance, security, legal, and data-ops agents concurrently, then merges their findings.", skill: "Makes each specialist return a normalized packet with GitHub quote, citation id, and answer impact instead of free-form notes." },
      { stage: "Challenge", framework: "Runs the reviewer after the parallel findings are gathered.", skill: "Applies the same review test every run: check missing citations, challenge unsupported claims, and add caveats where GitHub's wording is narrow." },
      { stage: "Verdict", framework: "Returns the final guarded answer after reviewer and synthesis steps.", skill: "Ensures the run cannot finish without a cited verdict, caveat line, and confidence score." }
    ]
  },
  {
    id: "claude-agent-sdk",
    name: "Claude Agent SDK",
    color: "#5f735a",
    runtime: "python",
    pattern: "Agent Loop",
    executionModel: "Claude Code session with streaming messages, hooks, permissions, and custom agents",
    withoutSkill: {
      capabilityUnit: "SDK session plus app-local prompt and hook policy",
      headline: "The agent loop is powerful, but policy-grounding rules can still spread across prompts, hooks, and result parsing.",
      resultPacket: "Streamed messages plus ResultMessage metadata",
      promptGlue: "Moderate: session prompts and reviewer instructions still need shared structure",
      reuse: "Reuse means reusing SDK options, agent definitions, and hook callbacks"
    },
    withSkill: {
      skillName: "Claude Policy Grounding Skill",
      capabilityUnit: "Claude session plus reusable skill contract",
      headline: "The SDK keeps live tool/session control, while the skill packages the repeatable GitHub evidence behavior.",
      resultPacket: "Session transcript plus skill-defined evidence and verdict packet",
      promptGlue: "Lower: the same skill carries clause extraction, reviewer caveats, and final answer shape",
      reuse: "Reuse means attaching the same skill contract to multiple Claude Agent SDK sessions"
    },
    metrics: [
      { label: "Prompt Glue", base: 3, skill: 2 },
      { label: "Tool Wiring", base: 2, skill: 2 },
      { label: "Output Consistency", base: 3, skill: 5 },
      { label: "Reuse Across Tasks", base: 4, skill: 5 }
    ],
    stages: [
      { stage: "Intake", framework: "Starts a ClaudeSDKClient session for the GitHub privacy case.", skill: "Loads the same policy intake brief and required clause fields before the session begins." },
      { stage: "Review", framework: "Uses custom agent definitions or follow-up prompts for specialist review inside the live session.", skill: "Makes every specialist turn return the same clause quote, citation id, answer impact, and confidence fields." },
      { stage: "Challenge", framework: "Runs the reviewer turn with hooks and permission policy available around tool use.", skill: "Applies the reusable unsupported-claim and missing-caveat checks before the session can finalize." },
      { stage: "Verdict", framework: "Streams the final assistant response and records ResultMessage metadata.", skill: "Keeps the final answer in one reusable packet with GitHub citations, caveats, and confidence." }
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
      { stage: "Intake", framework: "Convenes the policy council around the GitHub privacy question.", skill: "Starts the debate with one shared brief that defines the clauses each speaker is allowed to rely on." },
      { stage: "Review", framework: "Lets specialists debate directly over what GitHub's policy means.", skill: "Standardizes every turn into quote, citation id, interpretation, and confidence so the debate stays evidence-led." },
      { stage: "Challenge", framework: "Lets the reviewer sharpen or interrupt the conversation.", skill: "Uses one reusable rebuttal protocol to stop vague claims and ask for the exact GitHub clause behind them." },
      { stage: "Verdict", framework: "Collapses the transcript into one answer.", skill: "Pulls the useful evidence out of the chat and turns it into one clean verdict packet with citations and caveats." }
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
      { stage: "Intake", framework: "Manager opens the GitHub privacy case and assigns the first role-scoped tasks.", skill: "Supplies one shared rubric for what counts as acceptable GitHub evidence before workers start." },
      { stage: "Review", framework: "Workers complete retrieval, analysis, and review tasks.", skill: "Keeps every worker response in the same packet format so the manager can compare findings directly." },
      { stage: "Challenge", framework: "Manager or reviewer halts weak outputs and requests a retry.", skill: "Adds the same missing-support and overclaim checks to every review cycle." },
      { stage: "Verdict", framework: "Manager assembles the final recommendation.", skill: "Ensures the shipped answer still contains the GitHub clause ids, caveats, and confidence line." }
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
      { stage: "Intake", framework: "Creates a governed case record for the GitHub privacy-policy question.", skill: "Adds one reusable intake routine that defines required clauses and evidence fields before the governed flow continues." },
      { stage: "Review", framework: "Runs plugin-backed specialist checks under the governed workflow.", skill: "Makes every specialist emit the same GitHub evidence fields so the governance layer can inspect them cleanly." },
      { stage: "Challenge", framework: "Applies the governance gate before approval.", skill: "Supplies one ambiguity and support checklist so risky claims about GitHub policy are blocked the same way every time." },
      { stage: "Verdict", framework: "Publishes the governed answer after checks pass.", skill: "Standardizes the approved payload with citation ids, caveats, and confidence before release." }
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
      { stage: "Intake", framework: "Emits the first event for the GitHub privacy-policy question.", skill: "Provides a reusable intake packet listing the clauses and evidence fields every downstream handler should expect." },
      { stage: "Review", framework: "Routes GitHub evidence through retrieval and analysis handlers.", skill: "Normalizes clause extraction so each event carries the same quote, citation id, and answer impact fields." },
      { stage: "Challenge", framework: "Requests follow-up evidence when the payload is weak.", skill: "Packages the same missing-proof checks and reviewer prompts into every retry event." },
      { stage: "Verdict", framework: "Aggregates the final payload into one answer.", skill: "Keeps the final verdict packet stable so it always contains the answer, citations, caveats, and confidence." }
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
      { stage: "Intake", framework: "Opens the product workflow context for the GitHub privacy question.", skill: "Packages the intake assumptions, retrieval rules, and expected GitHub evidence fields once for all workflow steps." },
      { stage: "Review", framework: "Runs product-facing specialist steps to fetch and analyze the GitHub clauses.", skill: "Provides one shared evidence-normalization capability so every step returns the same packet." },
      { stage: "Challenge", framework: "Branches into the guardrail review step when needed.", skill: "Adds the reusable reviewer policy instead of hardcoding GitHub-specific caveat rules in each branch." },
      { stage: "Verdict", framework: "Resumes and publishes the product-facing answer.", skill: "Makes the final packet reusable across the UI, API, and any other surface that shows the GitHub answer." }
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
      { stage: "Intake", framework: "Initializes typed models for the GitHub privacy case.", skill: "Adds a reusable grounding routine that defines the evidence schema before the typed flow fans out." },
      { stage: "Review", framework: "Validates specialist outputs against the typed evidence models.", skill: "Keeps every evidence object aligned to the same reusable GitHub policy capability." },
      { stage: "Challenge", framework: "Rejects weak or incomplete outputs during validation.", skill: "Bundles the same missing-support and caveat checks before the typed verdict model can pass." },
      { stage: "Verdict", framework: "Emits a validated answer object.", skill: "Guarantees the final answer object still carries the GitHub citations, caveats, and confidence fields needed by downstream tasks." }
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

function metricSentiment(score, direction) {
  if (direction === "lower") {
    if (score <= 2) return "good";
    if (score === 3) return "mixed";
    return "bad";
  }

  if (score >= 4) return "good";
  if (score === 3) return "mixed";
  return "bad";
}

function pillDots(score, direction) {
  const sentiment = metricSentiment(score, direction);
  return new Array(5)
    .fill(0)
    .map((_, index) => `<span class="noise-dot ${index < score ? `active noise-dot-${sentiment}` : ""}"></span>`)
    .join("");
}

function metricDirectionLabel(metric) {
  return metricDefinitions[metric.label]?.direction === "lower"
    ? "Lower is better"
    : "Higher is better";
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
      <p class="skill-metric-legend">Green = favorable for this metric, amber = mixed, red = weaker.</p>
      <div class="noise-budget-grid">
        ${framework.metrics.map((metric) => `
          <article class="skill-metric-row">
            <div class="skill-metric-copy">
              <strong>${metric.label}</strong>
              <span class="skill-metric-direction">${metricDirectionLabel(metric)}</span>
              <p>${metricDefinitions[metric.label].definition}</p>
              <span class="skill-metric-scale">${metricDefinitions[metric.label].scaleLabel}</span>
            </div>
            <div class="skill-metric-compare">
              <span>Without</span>
              <div class="noise-dot-row">${pillDots(metric.base, metricDefinitions[metric.label].direction)}</div>
              <strong>${metric.base}/5</strong>
            </div>
            <div class="skill-metric-compare">
              <span>With skill</span>
              <div class="noise-dot-row">${pillDots(metric.skill, metricDefinitions[metric.label].direction)}</div>
              <strong>${metric.skill}/5</strong>
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
      ${(() => {
        const artifact = stageSkillArtifacts[item.stage];
        return `
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
          <div class="skill-stage-artifact">
            <div class="skill-stage-artifact-head">
              <span>Example skill</span>
              <strong>${artifact.skillName}</strong>
            </div>
            <code>${artifact.file}</code>
            <pre class="skill-stage-snippet"><code>${artifact.snippet.join("\n")}</code></pre>
          </div>
        </div>
      </article>
    `; })()}
    `)
    .join("");
}

function starterPackForFramework(framework) {
  const byId = {
    langgraph: {
      actualFiles: [
        ["agents.py", "Graph nodes and orchestration"],
        ["app.py", "Streamlit entrypoint"],
        ["README.md", "Setup and usage"],
        ["requirements.txt", "Python dependencies"]
      ],
      suggestedFiles: [
        ["skill_contract.py", "Claude skill boundary"],
        ["review_checklist.md", "Reusable rebuttal rules"],
        [".env.example", "Optional config template"]
      ],
      quickstart: ["Model the state object first", "Wrap retrieval and reviewer logic behind one Claude skill call", "Keep branch nodes thin and packet-oriented"],
      repoKit: "/starter-kits/zips/langgraph.zip"
    },
    "openai-agents": {
      actualFiles: [
        ["agents.py", "Specialist agents"],
        ["app.py", "Streamlit entrypoint"],
        ["README.md", "Setup and usage"],
        ["requirements.txt", "Python dependencies"]
      ],
      suggestedFiles: [
        ["handoff_packets.py", "Shared packet schema"],
        ["skill_contract.py", "Claude skill boundary"],
        [".env.example", "Optional config template"]
      ],
      quickstart: ["Define one shared evidence packet", "Let each specialist handoff call the same Claude skill", "Validate the final return packet before verdict"],
      repoKit: "/starter-kits/zips/openai-agents.zip"
    },
    "claude-agent-sdk": {
      actualFiles: [
        ["agents.py", "Claude Agent SDK session pipeline"],
        ["app.py", "Streamlit entrypoint"],
        ["README.md", "Setup and usage"],
        ["requirements.txt", "Python dependencies"]
      ],
      suggestedFiles: [
        ["skill_contract.py", "Claude skill boundary"],
        ["permissions.py", "Tool allowlist and can_use_tool policy"],
        ["hooks.py", "Progress and reviewer hook callbacks"],
        [".env.example", "Optional config template"]
      ],
      quickstart: ["Install Claude Code and claude-agent-sdk", "Keep allowed tools explicit", "Make the final ResultMessage pass the skill evidence contract"],
      repoKit: "/starter-kits/zips/claude-agent-sdk.zip"
    },
    ag2: {
      actualFiles: [
        ["agents.py", "Debate roles"],
        ["app.py", "Streamlit entrypoint"],
        ["README.md", "Setup and usage"],
        ["requirements.txt", "Python dependencies"]
      ],
      suggestedFiles: [
        ["debate_rules.py", "Turn and stop rules"],
        ["skill_contract.py", "Claude skill boundary"],
        ["review_protocol.md", "Challenge protocol"]
      ],
      quickstart: ["Keep the group chat small", "Use the Claude skill as the evidence-grounding layer", "Terminate debate on missing-support conditions"],
      repoKit: "/starter-kits/zips/ag2.zip"
    },
    crewai: {
      actualFiles: [
        ["Not in repo yet", "No shipped CrewAI starter kit in this repository"]
      ],
      suggestedFiles: [
        ["crew.py", "Crew assembly"],
        ["tasks.py", "Role-scoped tasks"],
        ["skill_contract.py", "Claude skill boundary"],
        ["manager_review.md", "Manager review rubric"],
        [".env.example", "Optional config template"]
      ],
      quickstart: ["Attach the Claude skill to task templates", "Keep the manager prompt focused on routing and approval", "Make every worker emit the same evidence packet"],
      repoKit: null
    },
    "semantic-kernel": {
      actualFiles: [
        ["Not in repo yet", "No shipped Semantic Kernel starter kit in this repository"]
      ],
      suggestedFiles: [
        ["kernel.py", "Kernel entrypoint"],
        ["plugins/policy_skill.py", "Reusable policy plugin"],
        ["skill_contract.py", "Claude skill boundary"],
        ["governance_filters.py", "Approval and audit hooks"],
        [".env.example", "Optional config template"]
      ],
      quickstart: ["Put policy grounding in one reusable plugin boundary", "Let approvals stay in the framework layer", "Keep audit fields in the final packet"],
      repoKit: null
    },
    llamaindex: {
      actualFiles: [
        ["agents.py", "Workflow and specialist logic"],
        ["app.py", "Streamlit entrypoint"],
        ["README.md", "Setup and usage"],
        ["requirements.txt", "Python dependencies"]
      ],
      suggestedFiles: [
        ["events.py", "Optional explicit event payload module"],
        ["skill_contract.py", "Claude skill boundary"],
        ["aggregation.py", "Verdict assembly helper"],
        [".env.example", "Optional config template"]
      ],
      quickstart: ["Normalize event payloads early", "Call the Claude skill from specialist handlers", "Aggregate only validated evidence packets"],
      repoKit: "/starter-kits/zips/llamaindex.zip"
    },
    mastra: {
      actualFiles: [
        ["Not in repo yet", "No shipped Mastra starter kit directory in this repository"]
      ],
      suggestedFiles: [
        ["workflow.ts", "Workflow definition"],
        ["agents.ts", "Agent setup"],
        ["skill-contract.ts", "Claude skill boundary"],
        ["guardrails.ts", "Review branch logic"],
        [".env.example", "Optional config template"]
      ],
      quickstart: ["Keep the workflow step product-facing", "Hide repeated policy logic behind the skill contract", "Resume from guardrail branches with the same packet shape"],
      repoKit: null
    },
    pydanticai: {
      actualFiles: [
        ["agents.py", "Typed agents"],
        ["app.py", "Streamlit entrypoint"],
        ["README.md", "Setup and usage"],
        ["requirements.txt", "Python dependencies"]
      ],
      suggestedFiles: [
        ["models.py", "Optional extracted evidence and verdict models"],
        ["skill_contract.py", "Claude skill boundary"],
        ["validators.py", "Runtime validation helpers"],
        [".env.example", "Optional config template"]
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
  starterPackSupport.textContent = `This section now separates what actually ships in this repository from the extra files you would likely add for Claude skill integration in ${framework.name}.`;

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
        ${pack.actualFiles.map(([file, desc]) => `
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
          <p class="eyebrow">Suggested Skill Additions</p>
          <h3>Files to add for Claude skill integration</h3>
        </div>
      </div>
      <div class="starter-file-list starter-file-list-compact">
        ${pack.suggestedFiles.map(([file, desc]) => `
          <article class="starter-file-row">
            <strong>${file}</strong>
            <span>${desc}</span>
          </article>
        `).join("")}
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
  if (state.liked) {
    return;
  }

  const optimisticCount = state.count + 1;
  likeStore.write({ count: optimisticCount, liked: true });
  renderFooterLike(optimisticCount);
  try {
    const res = await fetch("/api/like", { method: "POST" });
    if (res.ok) {
      const data = await res.json();
      likeStore.write({ count: data.total, liked: true });
      renderFooterLike(data.total);
      return;
    }
    throw new Error(`like POST ${res.status}`);
  } catch (_error) {
    likeStore.write({ count: state.count, liked: false });
    renderFooterLike(state.count);
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
