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
    source: "https://langchain-ai.github.io/langgraph/"
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
    source: "https://platform.openai.com/docs/guides/agents"
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
    source: "https://docs.llamaindex.ai/en/stable/module_guides/workflow/"
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

const policyPack = {
  title: "GitHub General Privacy Statement",
  source: "https://docs.github.com/en/site-policy/privacy-policies/github-privacy-statement",
  effectiveDate: "February 1, 2024",
  overview: "Public privacy policy used as the shared corpus for every framework demo.",
  clauses: {
    sharing: {
      id: "sharing",
      title: "Sharing of Personal Data",
      summary: "GitHub may share data with affiliates, organization accounts, authorities, and third-party apps when instructed."
    },
    private_repos: {
      id: "private_repos",
      title: "Private repositories: GitHub Access",
      summary: "Private repository access is restricted, with security, support, integrity, and legal exceptions."
    },
    rights: {
      id: "rights",
      title: "Your Privacy Rights",
      summary: "Users may have rights to access, correct, erase or limit processing, object, withdraw consent, and obtain portability."
    },
    transfers: {
      id: "transfers",
      title: "International data transfers",
      summary: "Transfers can occur across regions, including to the United States and other countries, with SCC-based protections where relevant."
    },
    retention: {
      id: "retention",
      title: "Security and Retention",
      summary: "Personal data may be retained while accounts are active and as needed for contracts, legal obligations, disputes, and agreements."
    }
  }
};

const policyQuestions = [
  {
    id: "retention",
    label: "Can GitHub retain personal data after an account is closed?",
    prompt: "Can GitHub retain personal data after an account is closed, and under what conditions?",
    expectedAnswer: "Yes. The policy says retention can continue where needed for contracts, legal requirements, disputes, or enforcing agreements, and the duration depends on purpose.",
    answerShape: "Answer should be conditional, cite the retention clause, and avoid promising immediate deletion.",
    relevantClauses: ["retention", "rights"],
    specialistClauses: {
      compliance: "retention",
      security: "private_repos",
      legal: "rights",
      finance: "retention",
      reviewer: "retention",
      decision: "rights"
    }
  },
  {
    id: "sharing",
    label: "When may GitHub share personal data with third parties or authorities?",
    prompt: "When may GitHub share personal data with third parties, affiliates, or public authorities?",
    expectedAnswer: "The policy allows sharing with affiliates, organization accounts, competent authorities, abuse and fraud prevention entities, and third-party applications when instructed by the user.",
    answerShape: "Answer should separate user-directed sharing from legal or safety-driven disclosures.",
    relevantClauses: ["sharing", "private_repos", "transfers"],
    specialistClauses: {
      compliance: "sharing",
      security: "private_repos",
      legal: "transfers",
      finance: "sharing",
      reviewer: "sharing",
      decision: "transfers"
    }
  },
  {
    id: "rights",
    label: "What rights do users have over their personal data?",
    prompt: "What rights do users in the EEA, UK, and some US states have over their personal data under this policy?",
    expectedAnswer: "The policy lists access, correction, deletion or erasure in some cases, objection, consent withdrawal, portability, and state-specific rights such as deletion and appeal pathways.",
    answerShape: "Answer should distinguish general privacy rights from region-specific rights and note that some rights depend on applicable law.",
    relevantClauses: ["rights", "retention", "sharing"],
    specialistClauses: {
      compliance: "rights",
      security: "private_repos",
      legal: "rights",
      finance: "retention",
      reviewer: "rights",
      decision: "rights"
    }
  }
];

const stages = [
  {
    id: "intake",
    label: "Intake",
    persona: "Principal Agent",
    caption: "The Principal Agent loads the policy corpus and question, setting up shared state before any specialist runs.",
    activeAgents: ["principal"],
    activeTools: ["policy_text", "question_bank"]
  },
  {
    id: "review",
    label: "Review",
    persona: "Specialist Agents",
    caption: "Four independent domain experts run in parallel: Compliance, Security, Legal, and Data Ops each check their own slice of the policy.",
    activeAgents: ["principal", "compliance", "security", "legal", "finance"],
    activeTools: ["clause_index", "rights_matrix", "retention_map", "exception_checker"]
  },
  {
    id: "challenge",
    label: "Challenge",
    persona: "Reviewer Agent",
    caption: "The Reviewer Agent (a dedicated adversarial persona) tests every specialist finding for unsupported claims, missing caveats, and contradictions.",
    activeAgents: ["compliance", "security", "legal", "finance", "reviewer"],
    activeTools: ["evidence_matrix", "claim_checker"]
  },
  {
    id: "synthesis",
    label: "Synthesis",
    persona: "Principal + Reviewer",
    caption: "The Principal Agent merges reviewer objections and specialist findings into one coherent answer object.",
    activeAgents: ["principal", "reviewer", "security", "legal"],
    activeTools: ["answer_builder", "evidence_matrix"]
  },
  {
    id: "verdict",
    label: "Verdict",
    persona: "Decision Output",
    caption: "The Decision Output agent emits a structured verdict with citations, confidence rating, and reviewer notes.",
    activeAgents: ["principal", "reviewer", "decision"],
    activeTools: ["answer_builder", "confidence_score"]
  }
];

const agentRoster = [
  { id: "principal", label: "Principal Agent", sublabel: "Decision owner", column: 1, row: 1 },
  { id: "compliance", label: "Compliance", sublabel: "Regulatory fit", column: 2, row: 1 },
  { id: "security", label: "Security", sublabel: "Risk and abuse", column: 2, row: 2 },
  { id: "legal", label: "Legal", sublabel: "Terms and contracts", column: 3, row: 1 },
  { id: "finance", label: "Data Ops", sublabel: "Retention operations", column: 3, row: 2 },
  { id: "reviewer", label: "Challenge Agent", sublabel: "Rebuttal gate", column: 4, row: 1 },
  { id: "decision", label: "Decision Output", sublabel: "Approve or revise", column: 5, row: 1 }
];

const toolCatalog = {
  policy_text: "Policy text",
  question_bank: "Question bank",
  clause_index: "Clause index",
  rights_matrix: "Rights matrix",
  retention_map: "Retention map",
  exception_checker: "Exception checker",
  evidence_matrix: "Evidence matrix",
  claim_checker: "Claim checker",
  answer_builder: "Answer builder",
  confidence_score: "Confidence score"
};

const stageTheme = {
  intake: "86, 132, 255",
  review: "68, 181, 129",
  challenge: "255, 168, 76",
  synthesis: "175, 110, 255",
  verdict: "255, 96, 134"
};

const PATTERN_LABELS = {
  "graph-branches": "Parallel Fan-out",
  "sequential-handoffs": "Sequential Chain",
  "conversation-mesh": "Mesh Network",
  "manager-review": "Manager Review",
  "enterprise-gated": "Enterprise Gated",
  "event-pipeline": "Event Pipeline",
  "app-workflow": "App Workflow",
  "typed-review": "Typed Review"
};

const STATE_CONTAINER_LABELS = {
  shared_graph_state: "Shared graph state",
  run_context: "Run context",
  chat_transcript: "Chat transcript",
  task_outputs: "Task bundle",
  governed_case: "Governed case packet",
  event_payload: "Event payload",
  workflow_context: "Workflow context",
  typed_models: "Typed models"
};

const SCORECARD_ORDER = [
  "Time Cost",
  "Token Cost",
  "Latency",
  "Parallelism",
  "Observability",
  "Replayability",
  "Human Review",
  "Context Loss",
  "Unsupported Answer Risk",
  "Error Recovery",
  "Testability",
  "Type Safety"
];

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

const defaultGraphNodes = {
  principal: { x: 50, y: 10, label: "Principal", labelX: 50, labelY: 20 },
  compliance: { x: 14, y: 34, label: "Compliance", labelX: 14, labelY: 45 },
  security: { x: 38, y: 34, label: "Security", labelX: 38, labelY: 45 },
  legal: { x: 62, y: 34, label: "Legal", labelX: 62, labelY: 45 },
  finance: { x: 86, y: 34, label: "Data Ops", labelX: 86, labelY: 45 },
  reviewer: { x: 50, y: 62, label: "Reviewer", labelX: 50, labelY: 73 },
  decision: { x: 50, y: 92, label: "Output", labelX: 50, labelY: 99 }
};

const graphLayouts = {
  "graph-branches": {
    principal: { x: 50, y: 10, labelX: 50, labelY: 20 },
    compliance: { x: 14, y: 34, labelX: 14, labelY: 45 },
    security: { x: 38, y: 34, labelX: 38, labelY: 45 },
    legal: { x: 62, y: 34, labelX: 62, labelY: 45 },
    finance: { x: 86, y: 34, labelX: 86, labelY: 45 },
    reviewer: { x: 50, y: 62, labelX: 50, labelY: 73 },
    decision: { x: 50, y: 92, labelX: 50, labelY: 99 }
  },
  "sequential-handoffs": {
    principal: { x: 10, y: 46, labelX: 10, labelY: 60 },
    compliance: { x: 32, y: 10, labelX: 32, labelY: 22 },
    security: { x: 58, y: 10, labelX: 58, labelY: 22 },
    legal: { x: 84, y: 10, labelX: 84, labelY: 22 },
    finance: { x: 84, y: 50, labelX: 84, labelY: 62 },
    reviewer: { x: 54, y: 82, labelX: 54, labelY: 94 },
    decision: { x: 26, y: 82, labelX: 26, labelY: 94 }
  },
  "conversation-mesh": {
    principal: { x: 50, y: 12, labelX: 50, labelY: 22 },
    compliance: { x: 18, y: 34, labelX: 18, labelY: 45 },
    security: { x: 34, y: 64, labelX: 34, labelY: 75 },
    legal: { x: 66, y: 64, labelX: 66, labelY: 75 },
    finance: { x: 82, y: 34, labelX: 82, labelY: 45 },
    reviewer: { x: 50, y: 46, labelX: 50, labelY: 57 },
    decision: { x: 50, y: 92, labelX: 50, labelY: 99 }
  },
  "manager-review": {
    principal: { x: 50, y: 10, labelX: 50, labelY: 20 },
    compliance: { x: 14, y: 34, labelX: 14, labelY: 45 },
    security: { x: 38, y: 34, labelX: 38, labelY: 45 },
    legal: { x: 62, y: 34, labelX: 62, labelY: 45 },
    finance: { x: 86, y: 34, labelX: 86, labelY: 45 },
    reviewer: { x: 50, y: 58, labelX: 50, labelY: 69 },
    decision: { x: 50, y: 88, labelX: 50, labelY: 97 }
  },
  "enterprise-gated": {
    principal: { x: 50, y: 10, labelX: 50, labelY: 20 },
    compliance: { x: 16, y: 34, labelX: 16, labelY: 45 },
    security: { x: 38, y: 34, labelX: 38, labelY: 45 },
    legal: { x: 62, y: 34, labelX: 62, labelY: 45 },
    finance: { x: 84, y: 34, labelX: 84, labelY: 45 },
    reviewer: { x: 50, y: 58, labelX: 50, labelY: 69 },
    decision: { x: 50, y: 88, labelX: 50, labelY: 97 }
  },
  "event-pipeline": {
    principal: { x: 14, y: 14, labelX: 14, labelY: 25 },
    compliance: { x: 30, y: 34, labelX: 22, labelY: 45 },
    security: { x: 46, y: 34, labelX: 46, labelY: 45 },
    legal: { x: 62, y: 34, labelX: 62, labelY: 45 },
    finance: { x: 78, y: 34, labelX: 78, labelY: 45 },
    reviewer: { x: 50, y: 62, labelX: 50, labelY: 73 },
    decision: { x: 86, y: 86, labelX: 86, labelY: 97 }
  },
  "app-workflow": {
    principal: { x: 50, y: 10, labelX: 50, labelY: 20 },
    compliance: { x: 18, y: 34, labelX: 18, labelY: 45 },
    security: { x: 38, y: 34, labelX: 38, labelY: 45 },
    legal: { x: 62, y: 34, labelX: 62, labelY: 45 },
    finance: { x: 82, y: 34, labelX: 82, labelY: 45 },
    reviewer: { x: 32, y: 64, labelX: 32, labelY: 75 },
    decision: { x: 68, y: 64, labelX: 68, labelY: 75 }
  },
  "typed-review": {
    principal: { x: 50, y: 10, labelX: 50, labelY: 20 },
    compliance: { x: 14, y: 34, labelX: 14, labelY: 45 },
    security: { x: 38, y: 34, labelX: 38, labelY: 45 },
    legal: { x: 62, y: 34, labelX: 62, labelY: 45 },
    finance: { x: 86, y: 34, labelX: 86, labelY: 45 },
    reviewer: { x: 50, y: 58, labelX: 50, labelY: 69 },
    decision: { x: 50, y: 86, labelX: 50, labelY: 97 }
  }
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

const TIME_REASONS = {
  "graph-branches": "Specialists run as parallel graph branches; stage time equals the slowest single specialist, not the sum of all four. That keeps per-stage times low even with 4 concurrent domain checks.",
  "sequential-handoffs": "Each specialist is a separate agent handoff: 4 specialists = 4 serial LLM round-trips. The review and challenge stages stack those latencies, which is why you see high per-stage times (e.g. 17–35 s). It is the architectural trade-off of the handoff model.",
  "conversation-mesh": "Specialists engage in conversational turns. Multi-turn exchanges on contested claims add latency beyond a single LLM call per specialist; each back-and-forth round adds an API call.",
  "manager-review": "The manager routes tasks sequentially; stage time scales with the number of specialists called and any re-routing decisions the manager makes.",
  "enterprise-gated": "Approval gate checkpoints add deliberate synchronous pauses; each gate waits for the previous stage to fully complete and be approved before the next begins.",
  "event-pipeline": "Events are dispatched to specialist handlers that each await their LLM response before emitting the next event. High stage times reflect chained awaits across multiple sequential specialist calls.",
  "typed-review": "Typed schema validation adds a check step per handoff, but overall latency is dominated by sequential specialist LLM calls accumulating per stage.",
  "app-workflow": "Workflow steps execute one at a time; stage time reflects LLM latency for each step in the defined sequence."
};

const METRIC_DEFINITIONS = {
  "Latency": "How fast the framework completes a full multi-agent pipeline run end to end.",
  "Observability": "How visible agent decisions, state transitions, and errors are during a live run.",
  "Replayability": "Whether runs can be checkpointed and resumed, or replayed from a failure point.",
  "Human Review": "How well the framework supports human-in-the-loop pauses and approval gates.",
  "Context Loss": "Risk that earlier findings or policy clauses get dropped across agent steps. Higher = worse.",
  "Unsupported Answer Risk": "Risk that the final answer lacks citations or makes ungrounded claims. Higher = worse.",
  "Error Recovery": "Resilience to agent or tool failures: retries, fallbacks, and partial-run rollback.",
  "Parallelism": "Native support for running multiple agents concurrently rather than sequentially.",
  "Testability": "Ease of writing deterministic unit tests, mocking LLM calls, and isolating agent behavior.",
  "Type Safety": "Degree of structured output validation, schema enforcement, and typed agent interfaces.",
  "Time Cost": "Measured wall-clock time for the verdict stage of this real SDK pipeline run. Per-stage times vary; hover the info icon on any stage's time display to see why.",
  "Token Cost": "Total tokens consumed at the verdict stage across all agent calls."
};

const NODE_DESCRIPTIONS = {
  principal: "Routes the question to specialist agents",
  compliance: "Validates regulatory compliance requirements",
  legal: "Reviews legal precedents and obligations",
  finance: "Evaluates financial risk and impact",
  security: "Checks access controls and security policy",
  reviewer: "Challenges weak or conflicting claims",
  output: "Synthesizes a single policy verdict"
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
      links: ["reviewer-security", "reviewer-legal", "reviewer-finance"],
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
      links: ["legal-reviewer", "security-reviewer", "finance-reviewer"],
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
      links: ["compliance-reviewer", "legal-reviewer", "security-reviewer", "finance-reviewer"],
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

function formatMs(ms) {
  if (ms >= 60000) return `${(ms / 60000).toFixed(1)} min`;
  if (ms >= 1000) return `${(ms / 1000).toFixed(1)} s`;
  return `${ms} ms`;
}

let currentStage = 0;
let compareIds = ["langgraph", "openai-agents"];
let selectedQuestionId = "retention";

let frameworkCatalogCards;
let policyCasePanel;
let stageChipRow;
let graphTooltip;
let metricTooltip;
let prevStageBtn;
let stepDemoBtn;
let frameworkSummary;
let appStatus;
let skeletonCaption;
let skeletonBoard;
let scenarioHeadline;
let scenarioSupport;
let comparisonLanes;
let scoreRationale;
let traceStore = null;
let footerLikeBtn;
let footerLikeCount;

const likeStore = {
  storageKey: "comparison_lab_like_state",
  read() {
    try {
      const raw = window.localStorage.getItem(this.storageKey);
      if (!raw) {
        return { count: 0, liked: false };
      }
      const parsed = JSON.parse(raw);
      return {
        count: Number.isFinite(Number(parsed.count)) ? Number(parsed.count) : 0,
        liked: parsed.liked === true
      };
    } catch (error) {
      return { count: 0, liked: false };
    }
  },
  write(nextState) {
    window.localStorage.setItem(this.storageKey, JSON.stringify(nextState));
  }
};

function getStage() {
  return stages[currentStage];
}

function getFramework(id) {
  return demoFrameworks.find((item) => item.id === id);
}

function getQuestion() {
  return policyQuestions.find((item) => item.id === selectedQuestionId);
}

function getGraphNodes(framework) {
  const layout = framework ? graphLayouts[framework.pattern] || {} : {};
  return Object.fromEntries(
    Object.entries(defaultGraphNodes).map(([nodeId, node]) => [
      nodeId,
      {
        ...node,
        ...(layout[nodeId] || {})
      }
    ])
  );
}

function getTraceStage(frameworkId, stageId) {
  return traceStore?.questions?.[selectedQuestionId]?.frameworks?.[frameworkId]?.stages?.[stageId] || null;
}

function getTraceTotals(frameworkId) {
  const frameworkStages = traceStore?.questions?.[selectedQuestionId]?.frameworks?.[frameworkId]?.stages;
  if (!frameworkStages) {
    return null;
  }

  return stages.reduce(
    (totals, stage) => {
      const metrics = frameworkStages[stage.id]?.metrics;
      if (!metrics) {
        return totals;
      }

      return {
        timeMs: totals.timeMs + metrics.time_ms,
        tokens: totals.tokens + metrics.token_total_estimate,
        cost: totals.cost + metrics.usd_cost_estimate
      };
    },
    { timeMs: 0, tokens: 0, cost: 0 }
  );
}

function cardMarkup(item) {
  return `
    <article class="catalog-card ${item.kind}">
      <h4>${item.name}</h4>
      <p class="catalog-tagline">${item.tagline}</p>
      <p>${item.summary}</p>
      <a href="${item.source}" target="_blank" rel="noreferrer">Official docs</a>
    </article>
  `;
}

function renderCatalog() {
  frameworkCatalogCards.innerHTML = catalogItems.filter((item) => item.kind === "framework").map(cardMarkup).join("");
}

function renderPolicyCase() {
  const question = getQuestion();

  policyCasePanel.innerHTML = `
    <div class="policy-case-head">
      <div class="policy-case-copy">
        <p class="eyebrow">Policy Corpus</p>
        <h3>${policyPack.title}</h3>
        <p>${policyPack.overview}</p>
        <div class="policy-source-meta">
          <span>Effective ${policyPack.effectiveDate}</span>
          <a href="${policyPack.source}" target="_blank" rel="noreferrer">Open source policy</a>
        </div>
      </div>
      <label class="policy-question-picker">
        <span>Question</span>
        <select id="policy-question-select">
          ${policyQuestions
            .map(
              (item) => `
                <option value="${item.id}" ${item.id === selectedQuestionId ? "selected" : ""}>${item.label}</option>
              `
            )
            .join("")}
        </select>
      </label>
    </div>

    <div class="policy-answer-strip compact">
      <article>
        <span>Question</span>
        <strong>${question.label}</strong>
      </article>
      <article>
        <span>Expected answer</span>
        <strong>${question.expectedAnswer}</strong>
      </article>
    </div>
  `;

  policyCasePanel.querySelector("#policy-question-select").addEventListener("change", (event) => {
    selectedQuestionId = event.target.value;
    render();
  });
}

function renderStageChips() {
  stageChipRow.innerHTML = stages
    .map(
      (stage, index) => `
        <button class="chip ${index === currentStage ? "active" : ""}" data-stage="${index}">
          <span class="chip-persona">${stage.persona}</span>
          <span class="chip-stage-label">${stage.label}</span>
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
  const stage = getStage();
  const question = getQuestion();

  scenarioHeadline.textContent = "Public policy checker across frameworks";
  scenarioSupport.textContent = `Click through one stage at a time to compare orchestration, eval, and risk handling for the same question: ${question.label}`;
  frameworkSummary.innerHTML = "";
  appStatus.textContent = "";
  skeletonCaption.textContent = "Compare the selected frameworks by state carrier, reviewer stop signal, and emitted verdict artifact.";
}

function renderSkeletonMini() {
  return `
    <div class="skeleton-mini">
      <article><span>Principal</span><strong>Route question</strong></article>
      <div class="skeleton-mini-arrow">↓</div>
      <article><span>Specialists</span><strong>Check policy clauses</strong></article>
      <div class="skeleton-mini-arrow">↓</div>
      <article><span>Review</span><strong>Challenge weak claims</strong></article>
      <div class="skeleton-mini-arrow">↓</div>
      <article><span>Output</span><strong>Return one answer</strong></article>
    </div>
  `;
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

function getNodeShape(role, x, y) {
  const r = 7;
  switch (role) {
    case "principal":
      return `<polygon class="node-shape" points="${x},${y-r} ${x+r},${y} ${x},${y+r} ${x-r},${y}" />`;
    case "reviewer": {
      const s = 5.5;
      return `<rect class="node-shape" x="${x-s}" y="${y-s}" width="${s*2}" height="${s*2}" rx="1.5" />`;
    }
    case "decision": {
      const pts = Array.from({length: 6}, (_, i) => {
        const a = (Math.PI / 3) * i - Math.PI / 2;
        return `${(x + r * Math.cos(a)).toFixed(1)},${(y + r * Math.sin(a)).toFixed(1)}`;
      }).join(" ");
      return `<polygon class="node-shape" points="${pts}" />`;
    }
    default:
      return `<circle class="node-shape" cx="${x}" cy="${y}" r="${r}" />`;
  }
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
            <button class="step-item ${activeClass}" style="--item-rgb:${stageTheme[stage.id]}" data-goto-stage="${index}">
              <span class="step-number">${index + 1}</span>
              <span class="step-name">${stage.persona}</span>
            </button>
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
      intro: "LangGraph's graph-first design delivers best-in-class checkpointing, observability, and true parallel fan-out. The go-to when auditability and reviewer gates are non-negotiable.",
      cards: [
        { label: "Execution", value: "Supervisor graph with explicit branch and merge nodes" },
        { label: "Performance", value: "Higher setup cost, but review can run in parallel branches" },
        { label: "Evals", value: "Best with node assertions, checkpoint replay, and branch-level tests" },
        { label: "Context Risk", value: "Low to medium because one shared state object holds evidence" },
        { label: "Challenge", value: "Exception paths can make the graph dense as policy rules expand" },
        { label: "Tools", value: "Node-scoped tools keep retrieval and checks tightly bounded" }
      ],
      scorecard: [
        { label: "Latency", value: 3, reason: "Parallel branches help, but graph compilation and state serialization add measurable overhead." },
        { label: "Observability", value: 5, reason: "LangSmith tracing gives node-level diffs, step timing, and token counts per branch." },
        { label: "Replayability", value: 5, reason: "Checkpoint-and-resume is a core primitive; any node can be rolled back and re-run from state." },
        { label: "Human Review", value: 5, reason: "interrupt_before breakpoints pause execution at any named node for human approval." },
        { label: "Context Loss", value: 2, reason: "A single shared state dict holds all findings; nothing drops on branch crossings." },
        { label: "Unsupported Answer Risk", value: 2, reason: "Conditional edges gate the answer path on reviewer approval and clause coverage checks." },
        { label: "Error Recovery", value: 5, reason: "Checkpoints mean partial failures resume from the last stable state without re-running early nodes." },
        { label: "Parallelism", value: 5, reason: "Fan-out branches are the primary execution pattern; specialists run truly in parallel." },
        { label: "Testability", value: 4, reason: "Individual nodes can be unit-tested against mocked state; checkpoint replay aids debugging." },
        { label: "Type Safety", value: 3, reason: "TypedDict state provides basic structure but graph edges carry no schema-validated payloads." }
      ],
      arrowA: "branch",
      arrowB: "gate",
      arrowC: "merge",
      evalCode: `assert cited_clauses_present(state)
assert answer_is_conditional(state)
checkpoint("before_reviewer")
replay_if_clause_coverage_fails()`
    },
    "sequential-handoffs": {
      intro: "OpenAI Agents SDK offers the clearest specialist handoff model with strong built-in tracing, but its serial execution means stage latency stacks with each agent in the chain.",
      cards: [
        { label: "Execution", value: "Linear baton-pass handoffs inside one run context" },
        { label: "Performance", value: "Simple to reason about, but latency stacks if specialists are sequential" },
        { label: "Evals", value: "Guardrails fit naturally at handoff boundaries and before final return" },
        { label: "Context Risk", value: "Medium because each handoff can compress or reshape prior findings" },
        { label: "Challenge", value: "Long policy chains can lose nuance if each agent summarizes too aggressively" },
        { label: "Tools", value: "Agent-local tools stay clean, but cross-agent evidence stitching matters" }
      ],
      scorecard: [
        { label: "Latency", value: 2, reason: "Every specialist handoff is sequential; total latency is the sum of all individual agent calls." },
        { label: "Observability", value: 4, reason: "SDK tracing captures handoff boundaries and tool calls but no per-node state diffs." },
        { label: "Replayability", value: 4, reason: "Run context is serializable but replay requires re-triggering the full handoff chain from scratch." },
        { label: "Human Review", value: 4, reason: "Input and output guardrails provide review hooks at each handoff boundary." },
        { label: "Context Loss", value: 3, reason: "Each agent receives prior output but aggressive summarization can compress clause detail." },
        { label: "Unsupported Answer Risk", value: 3, reason: "Reviewer agent can block but no automatic citation check enforces answer grounding." },
        { label: "Error Recovery", value: 3, reason: "SDK handles basic retries but no checkpoint rollback if a mid-chain failure occurs." },
        { label: "Parallelism", value: 2, reason: "Handoffs are inherently linear; no native fan-out exists for concurrent specialist execution." },
        { label: "Testability", value: 3, reason: "Agents can be tested individually with mock runners but there is no built-in deterministic test mode." },
        { label: "Type Safety", value: 4, reason: "Tool function JSON schemas are enforced; structured_output constrains the final response type." }
      ],
      arrowA: "handoff",
      arrowB: "review",
      arrowC: "return",
      evalCode: `on_handoff(validate_schema)
assert no_required_clause_dropped(ctx)
reviewer.must_reject_if_support_missing()`
    },
    "conversation-mesh": {
      intro: "AG2 enables dynamic multi-agent debates where specialists challenge each other directly. Highly flexible for exploratory analysis, but requires firm stopping rules to prevent conversation sprawl.",
      cards: [
        { label: "Execution", value: "Conversation mesh with direct specialist challenge" },
        { label: "Performance", value: "Great for exploration, but turn-taking can be token and latency heavy" },
        { label: "Evals", value: "Needs transcript scoring, stop rules, and claim verification after debate" },
        { label: "Context Risk", value: "High because long threads can bury the original policy question" },
        { label: "Challenge", value: "Without hard stopping conditions, policy review can sprawl" },
        { label: "Tools", value: "Tools are easy to invoke, but evidence grounding must stay explicit" }
      ],
      scorecard: [
        { label: "Latency", value: 1, reason: "Multi-round group chat debate is token-heavy and synchronous; latency compounds with every turn." },
        { label: "Observability", value: 2, reason: "Conversation transcript is accessible but there is no structured step-level tracing or state diff." },
        { label: "Replayability", value: 2, reason: "No built-in checkpoint; replaying requires seeding the full prior message history manually." },
        { label: "Human Review", value: 4, reason: "Human proxy agents can be injected to pause and provide input at any conversation turn." },
        { label: "Context Loss", value: 5, reason: "Long threads bury early policy context under later debate turns, a structural risk of the mesh pattern." },
        { label: "Unsupported Answer Risk", value: 4, reason: "Non-deterministic debate can produce confident but poorly cited conclusions." },
        { label: "Error Recovery", value: 3, reason: "Basic API retry on transient failures but no structured rollback or turn-level checkpoint." },
        { label: "Parallelism", value: 3, reason: "Group chat turns are sequential internally but multiple independent chats can run in parallel." },
        { label: "Testability", value: 2, reason: "Non-deterministic conversation flow makes test assertions fragile; no mock LLM mode built in." },
        { label: "Type Safety", value: 2, reason: "Agent messages are unstructured strings with no enforced output schema." }
      ],
      arrowA: "debate",
      arrowB: "challenge",
      arrowC: "converge",
      evalCode: `score_transcript_for_support()
limit_turns(max=8)
force_reviewer_to_request_clause_ids()`
    },
    "manager-review": {
      intro: "CrewAI frames multi-agent coordination as a managed crew with defined roles, making workflows readable and business-friendly at the cost of dynamic mesh coordination.",
      cards: [
        { label: "Execution", value: "Manager assigns specialist tasks, then resumes after checkpoint review" },
        { label: "Performance", value: "Operationally clear and easy to split, with moderate orchestration overhead" },
        { label: "Evals", value: "Checkpoint validation is natural before manager synthesis" },
        { label: "Context Risk", value: "Medium because task outputs may be concise but detached from source wording" },
        { label: "Challenge", value: "Manager prompts can become the bottleneck if too much policy logic lives there" },
        { label: "Tools", value: "Role-scoped tools map cleanly to specialist task ownership" }
      ],
      scorecard: [
        { label: "Latency", value: 3, reason: "Sequential task execution with moderate crew orchestration overhead per task." },
        { label: "Observability", value: 4, reason: "Task-level logging and crew run events give good per-task visibility across the pipeline." },
        { label: "Replayability", value: 4, reason: "Task outputs can be cached and individual tasks retried without re-running the full crew." },
        { label: "Human Review", value: 5, reason: "human_input=True on any task halts execution until manual review confirms the result." },
        { label: "Context Loss", value: 3, reason: "Task outputs are explicit objects but manager synthesis can lose clause-level nuance." },
        { label: "Unsupported Answer Risk", value: 3, reason: "Reviewer task can block but relies on LLM judgment without enforced citation checks." },
        { label: "Error Recovery", value: 3, reason: "Task-level retry is available but crew state is not checkpointed for mid-run failures." },
        { label: "Parallelism", value: 4, reason: "Process.parallel runs independent specialist tasks concurrently within the crew." },
        { label: "Testability", value: 3, reason: "Tasks and agents can be unit-tested but crew dynamics require integration-level validation." },
        { label: "Type Safety", value: 3, reason: "Pydantic output models are available for task results but not enforced by default." }
      ],
      arrowA: "assign",
      arrowB: "checkpoint",
      arrowC: "approve",
      evalCode: `checkpoint.requires([
  "cited_clauses",
  "unsupported_claims=0",
  "human_review_note"
])`
    },
    "enterprise-gated": {
      intro: "Semantic Kernel brings enterprise governance and Microsoft-stack integration to agent pipelines, with deliberate approval gates that prioritise auditability over raw throughput.",
      cards: [
        { label: "Execution", value: "Governed workflow with platform-level checkpoints and controls" },
        { label: "Performance", value: "Heavier platform cost, but strong fit when auditability matters" },
        { label: "Evals", value: "Formal review gates and policy conformance checks fit well" },
        { label: "Context Risk", value: "Low to medium because state is centralized but platform abstractions are heavier" },
        { label: "Challenge", value: "Can feel heavyweight for a narrow policy checker unless governance is a requirement" },
        { label: "Tools", value: "Enterprise plugins centralize retrieval, logging, and review policies" }
      ],
      scorecard: [
        { label: "Latency", value: 2, reason: "Enterprise platform overhead and synchronous plugin calls add latency at each step." },
        { label: "Observability", value: 5, reason: "OpenTelemetry integration and kernel events give deep platform-level tracing out of the box." },
        { label: "Replayability", value: 4, reason: "Kernel state and plan steps are serializable; replay requires re-driving the plan with saved state." },
        { label: "Human Review", value: 5, reason: "Function filters and step-level hooks provide formal review gates in the execution plan." },
        { label: "Context Loss", value: 2, reason: "Kernel memory and shared plugin context preserve evidence across all specialist calls." },
        { label: "Unsupported Answer Risk", value: 2, reason: "Governance gate explicitly requires verified evidence before the plan is allowed to proceed." },
        { label: "Error Recovery", value: 4, reason: "Platform-level retry policies and circuit breakers handle transient service failures." },
        { label: "Parallelism", value: 3, reason: "Parallel function invocation is supported but plan steps tend to be sequential in practice." },
        { label: "Testability", value: 4, reason: "Plugin interfaces and kernel abstractions are easily mockable in .NET and Python test suites." },
        { label: "Type Safety", value: 4, reason: "Plugin input and output schemas are strictly typed; kernel functions use validated parameters." }
      ],
      arrowA: "route",
      arrowB: "govern",
      arrowC: "publish",
      evalCode: `governance_gate.assert_audit_fields()
require_exception_path_for_ambiguous_answers()`
    },
    "event-pipeline": {
      intro: "LlamaIndex Workflows models specialist coordination as an event-driven pipeline. Strong for retrieval-heavy evidence gathering, though sequential event handlers stack latency per stage.",
      cards: [
        { label: "Execution", value: "Event-driven evidence pipeline with aggregation steps" },
        { label: "Performance", value: "Scales well when evidence extraction is eventful and decoupled" },
        { label: "Evals", value: "Good for per-step validation and replay of failed events" },
        { label: "Context Risk", value: "Medium because payload contracts matter more than conversational continuity" },
        { label: "Challenge", value: "Policy nuance can fragment if events are too small or loosely typed" },
        { label: "Tools", value: "Step-level evidence calls fit clause extraction and answer building" }
      ],
      scorecard: [
        { label: "Latency", value: 4, reason: "Async event emission lets steps progress without blocking; pipeline throughput is high." },
        { label: "Observability", value: 4, reason: "Step-level event tracing and LlamaTrace integration provide solid run visibility." },
        { label: "Replayability", value: 5, reason: "Event payloads are serializable; failed steps can be replayed by re-emitting their input event." },
        { label: "Human Review", value: 3, reason: "Human input can be modeled as an event but requires custom wiring rather than built-in support." },
        { label: "Context Loss", value: 3, reason: "Evidence travels in event payloads; over-aggregation at steps can silently drop clause-level detail." },
        { label: "Unsupported Answer Risk", value: 3, reason: "No automatic citation gate; the reviewer step relies on LLM judgment without schema enforcement." },
        { label: "Error Recovery", value: 4, reason: "Step isolation means a failed step can be retried without re-running earlier pipeline stages." },
        { label: "Parallelism", value: 4, reason: "Async event pipeline naturally supports concurrent step execution across specialists." },
        { label: "Testability", value: 3, reason: "Workflow steps can be unit-tested with mock events; full pipeline requires integration testing." },
        { label: "Type Safety", value: 3, reason: "Event types are defined but payload schemas are loosely enforced at runtime." }
      ],
      arrowA: "emit",
      arrowB: "recheck",
      arrowC: "aggregate",
      evalCode: `validate_event_payloads()
requeue_if_clause_score < threshold
aggregate_only_supported_findings()`
    },
    "app-workflow": {
      intro: "Mastra combines agents, workflows, and tracing in a TypeScript-first runtime built for product teams who want strong developer ergonomics without deep agent-negotiation complexity.",
      cards: [
        { label: "Execution", value: "App-native workflow that keeps orchestration close to product code" },
        { label: "Performance", value: "Strong product-team ergonomics with moderate workflow overhead" },
        { label: "Evals", value: "Good fit for inline guardrail branches and UI-facing assertions" },
        { label: "Context Risk", value: "Medium because app state helps, but workflow branches can hide missing evidence" },
        { label: "Challenge", value: "You must design governance discipline yourself rather than inherit it" },
        { label: "Tools", value: "Workflow steps make it easy to attach retrieval and scoring tools" }
      ],
      scorecard: [
        { label: "Latency", value: 3, reason: "Workflow overhead is moderate; parallel steps help but HTTP API adds round-trip cost per call." },
        { label: "Observability", value: 4, reason: "Workflow run logs and step traces are accessible; OpenTelemetry support is included." },
        { label: "Replayability", value: 4, reason: "Workflow runs are stored with step outputs; resuming from a checkpoint step is supported." },
        { label: "Human Review", value: 4, reason: "Workflows can pause at approval steps and wait for external human input via trigger." },
        { label: "Context Loss", value: 3, reason: "App-facing state helps but workflow branches can omit evidence if not explicitly threaded through." },
        { label: "Unsupported Answer Risk", value: 3, reason: "Guardrail branch exists but enforcement depends on how each individual step is designed." },
        { label: "Error Recovery", value: 4, reason: "Workflow-level retry and step isolation allow partial re-runs on failure without starting over." },
        { label: "Parallelism", value: 4, reason: "Parallel step execution is a first-class workflow primitive in Mastra." },
        { label: "Testability", value: 4, reason: "TypeScript-native testing with isolated step mocks and full workflow simulation." },
        { label: "Type Safety", value: 5, reason: "TypeScript and Zod schemas validate all step inputs and outputs at compile time." }
      ],
      arrowA: "step",
      arrowB: "branch",
      arrowC: "resume",
      evalCode: `if (!hasCitation(answer)) branch("review")
if (confidence < 0.7) branch("human_check")`
    },
    "typed-review": {
      intro: "PydanticAI enforces schema-validated typed outputs at every specialist handoff. The strongest choice when data integrity and structured interfaces matter more than dynamic topology.",
      cards: [
        { label: "Execution", value: "Typed orchestration pipeline with validated inputs and outputs" },
        { label: "Performance", value: "Moderate runtime cost, offset by lower downstream cleanup and retries" },
        { label: "Evals", value: "Schema validation and typed reviewer checks are the default strength" },
        { label: "Context Risk", value: "Low to medium because structured outputs preserve key answer fields" },
        { label: "Challenge", value: "You still have to design the multi-agent topology around the typed core" },
        { label: "Tools", value: "Typed tools and result models suit policy answers with citations and confidence" }
      ],
      scorecard: [
        { label: "Latency", value: 3, reason: "Sequential agent calls add up, but validated outputs reduce costly downstream retries." },
        { label: "Observability", value: 4, reason: "Logfire integration provides detailed span-level tracing for each individual agent run." },
        { label: "Replayability", value: 4, reason: "Agent runs can be logged and replayed using model overrides for offline testing and debug." },
        { label: "Human Review", value: 4, reason: "Validator functions can pause and request human confirmation on schema violations." },
        { label: "Context Loss", value: 2, reason: "Structured output models preserve all required fields across agent boundaries by design." },
        { label: "Unsupported Answer Risk", value: 1, reason: "Pydantic validation rejects any answer missing required citation or confidence fields at runtime." },
        { label: "Error Recovery", value: 3, reason: "Basic retry on validation failures; no checkpoint rollback across multi-agent runs." },
        { label: "Parallelism", value: 2, reason: "Agent calls are sequential by default; asyncio is needed for manual parallel execution." },
        { label: "Testability", value: 5, reason: "TestModel provides fully deterministic runs; mock providers make unit testing trivial." },
        { label: "Type Safety", value: 5, reason: "Pydantic models are the execution primitive; every output is validated against a schema." }
      ],
      arrowA: "validate",
      arrowB: "rebut",
      arrowC: "compose",
      evalCode: `Decision.model_validate(answer)
assert all_finding_models_have_clause_ids()
assert reviewer_flags_are_explicit()`
    }
  };

  return framework ? profiles[framework.pattern] : {
    cards: [
      { label: "Execution", value: "One principal agent plus specialists, reviewer, and final output" },
      { label: "Policy", value: "Shared GitHub privacy statement and one selected question" },
      { label: "Evals", value: "Cited clauses, conditional answers, and reviewer objections" },
      { label: "Context Risk", value: "Baseline reference only; each framework changes how context moves" }
    ],
    scorecard: [
      { label: "Latency", value: 3 },
      { label: "Observability", value: 3 },
      { label: "Replayability", value: 3 },
      { label: "Human Review", value: 4 },
      { label: "Context Loss", value: 3 },
      { label: "Unsupported Answer Risk", value: 3 }
    ],
    arrowA: "route",
    arrowB: "review",
    arrowC: "decide",
    evalCode: `answer must cite policy clauses
reviewer can reject unsupported claims
final output includes confidence`
  };
}

const riskMetricLabels = new Set(["Context Loss", "Unsupported Answer Risk"]);

function scoreState(label, value) {
  if (riskMetricLabels.has(label)) {
    if (value >= 4) {
      return { tone: "danger", label: "High risk" };
    }

    if (value === 3) {
      return { tone: "caution", label: "Watch" };
    }

    return { tone: "safe", label: "Contained" };
  }

  if (value <= 2) {
    return { tone: "danger", label: "Weak" };
  }

  if (value === 3) {
    return { tone: "caution", label: "Moderate" };
  }

  return { tone: "safe", label: "Strong" };
}

function scoreFromTimeMs(timeMs) {
  if (timeMs <= 260) {
    return 5;
  }
  if (timeMs <= 360) {
    return 4;
  }
  if (timeMs <= 520) {
    return 3;
  }
  if (timeMs <= 700) {
    return 2;
  }
  return 1;
}

function scoreFromTokens(tokens) {
  if (tokens <= 420) {
    return 5;
  }
  if (tokens <= 560) {
    return 4;
  }
  if (tokens <= 700) {
    return 3;
  }
  if (tokens <= 900) {
    return 2;
  }
  return 1;
}

function traceScoreRows(framework) {
  const verdictTrace = framework ? getTraceStage(framework.id, "verdict") : null;
  if (!verdictTrace?.metrics) {
    return [];
  }
  const timeReason = framework?.pattern ? (TIME_REASONS[framework.pattern] || "") : "";

  return [
    {
      label: "Time Cost",
      value: scoreFromTimeMs(verdictTrace.metrics.time_ms),
      detail: formatMs(verdictTrace.metrics.time_ms),
      reason: timeReason
    },
    {
      label: "Token Cost",
      value: scoreFromTokens(verdictTrace.metrics.token_total_estimate),
      detail: `${verdictTrace.metrics.token_total_estimate} tok`
    }
  ];
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
      "reviewer-finance",
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
      "finance-reviewer",
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
      "finance-reviewer",
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

function sharedPolicyHelpers(question) {
  const clauseList = question.relevantClauses
    .map((clauseId) => policyPack.clauses[clauseId].title)
    .join(", ");

  return `# Shared definitions and helper functions
# - PolicyAnswer model
# - retrieve_clause(question, clause_id)
# - check_for_unsupported_claims(findings)
# - compose_answer(question, findings, reviewer_notes)
# Shared corpus for this example: ${clauseList}`;
}

function frameworkExampleCode(framework, question) {
  const clauseNames = question.relevantClauses.map((clauseId) => policyPack.clauses[clauseId].title);
  const clauseString = clauseNames.map((item) => `"${item}"`).join(", ");
  const helpers = sharedPolicyHelpers(question);

  const examples = {
    "graph-branches": `${helpers}

from langgraph.graph import StateGraph, END

class PolicyState(dict):
    question: str
    clauses: list[str]
    findings: dict
    reviewer_notes: list[str]
    answer: str

# [review]
def compliance_node(state):
    state["findings"]["compliance"] = retrieve_clause(state["question"], "retention")
    return state

def security_node(state):
    state["findings"]["security"] = retrieve_clause(state["question"], "private_repos")
    return state

def legal_node(state):
    state["findings"]["legal"] = retrieve_clause(state["question"], "rights")
    return state

def data_ops_node(state):
    state["findings"]["data_ops"] = retrieve_clause(state["question"], "retention")
    return state

def reviewer_node(state):
    state["reviewer_notes"] = check_for_unsupported_claims(state["findings"])
    return state

# [synthesis]
def principal_node(state):
    state["answer"] = compose_answer(
        question=state["question"],
        findings=state["findings"],
        reviewer_notes=state["reviewer_notes"],
    )
    return state

graph = StateGraph(PolicyState)
graph.add_node("principal", principal_node)
graph.add_node("compliance", compliance_node)
graph.add_node("security", security_node)
graph.add_node("legal", legal_node)
graph.add_node("data_ops", data_ops_node)
graph.add_node("reviewer", reviewer_node)

# [intake]
graph.add_edge("principal", "compliance")
graph.add_edge("principal", "security")
graph.add_edge("principal", "legal")
graph.add_edge("principal", "data_ops")

# [challenge]
graph.add_edge("compliance", "reviewer")
graph.add_edge("security", "reviewer")
graph.add_edge("legal", "reviewer")
graph.add_edge("data_ops", "reviewer")

# [verdict]
graph.add_edge("reviewer", "principal")
graph.add_edge("principal", END)

result = graph.compile().invoke({
    "question": "${question.prompt}",
    "clauses": [${clauseString}],
    "findings": {},
    "reviewer_notes": [],
})
print(result["answer"])`,
    "sequential-handoffs": `${helpers}

from agents import Agent, Runner

# [intake]
policy_case = {
    "question": "${question.prompt}",
    "clauses": [${clauseString}],
}

# [review]
compliance = Agent(
    name="Compliance",
    instructions="Extract retention and rights language. Return citations.",
    tools=[retrieve_clause],
)

security = Agent(
    name="Security",
    instructions="Check repository-access and security exceptions that affect the answer.",
    tools=[retrieve_clause],
)

legal = Agent(
    name="Legal",
    instructions="Rewrite the answer with conditions and legal caveats preserved.",
    tools=[retrieve_clause],
)

finance = Agent(
    name="DataOps",
    instructions="Assess retention lifecycle and operational data implications.",
    tools=[retrieve_clause],
)

# [challenge]
reviewer = Agent(
    name="Reviewer",
    instructions="Reject answers that lack clause support or overclaim policy rights.",
)

# [synthesis]
principal = Agent(
    name="Principal",
    instructions="Own the final policy answer and include confidence plus citations. Use compose_answer once findings are returned.",
    handoffs=[compliance, security, legal, finance, reviewer],
)

# [verdict]
result = Runner.run_sync(principal, input=policy_case)
print(result.final_output)`,
    "conversation-mesh": `${helpers}

from autogen import AssistantAgent, GroupChat, GroupChatManager

# [intake]
shared_case = {
    "question": "${question.prompt}",
    "required_clauses": [${clauseString}],
}

def build_agent(name: str, system_message: str) -> AssistantAgent:
    return AssistantAgent(name=name, system_message=system_message, llm_config={"temperature": 0})

principal = build_agent("Principal", "Drive toward a final cited answer.")
compliance = build_agent("Compliance", "Argue from retention and privacy-rights clauses.")
security = build_agent("Security", "Challenge risky security assumptions.")
legal = build_agent("Legal", "Preserve conditions, exceptions, and precise wording.")
data_ops = build_agent("DataOps", "Reason about retention operations and lifecycle edge cases.")
reviewer = build_agent("Reviewer", "Interrupt when claims are unsupported or vague.")

# [review]
chat = GroupChat(
    agents=[principal, compliance, security, legal, data_ops, reviewer],
    messages=[{"role": "user", "content": str(shared_case)}],
    max_round=8,
)

# [challenge]
manager = GroupChatManager(groupchat=chat)
# [synthesis]
principal.initiate_chat(manager, message="Produce a final cited answer with caveats.")
# [verdict]
print(chat.messages[-1]["content"])`,
    "manager-review": `${helpers}

from crewai import Agent, Task, Crew, Process

# [intake]
question = "${question.prompt}"

# [review]
principal = Agent(role="Principal", goal="Ship the final policy answer with confidence and citations.")
compliance = Agent(role="Compliance", goal="Check privacy and retention obligations.")
security = Agent(role="Security", goal="Check security and access exceptions.")
legal = Agent(role="Legal", goal="Preserve exact policy conditions.")
data_ops = Agent(role="Data Ops", goal="Review retention lifecycle implications.")
reviewer = Agent(role="Reviewer", goal="Block unsupported answers.")

# [challenge]
tasks = [
    Task(description=f"Answer {question} from retention and rights clauses.", agent=compliance),
    Task(description="Find repository-access or security exceptions.", agent=security),
    Task(description="Rewrite findings into policy-accurate legal language.", agent=legal),
    Task(description="Assess operational retention implications.", agent=data_ops),
    Task(description="Reject unsupported or overconfident claims.", agent=reviewer),
]

# [synthesis]
crew = Crew(
    agents=[principal, compliance, security, legal, data_ops, reviewer],
    tasks=tasks,
    process=Process.sequential,
)

# [verdict]
result = crew.kickoff()
print(result)`,
    "enterprise-gated": `${helpers}

from semantic_kernel.agents import ChatCompletionAgent

# [intake]
policy_case = {
    "question": "${question.prompt}",
    "clauses": [${clauseString}],
}

principal = ChatCompletionAgent(service=kernel, name="Principal")
compliance = ChatCompletionAgent(service=kernel, name="Compliance")
security = ChatCompletionAgent(service=kernel, name="Security")
legal = ChatCompletionAgent(service=kernel, name="Legal")
data_ops = ChatCompletionAgent(service=kernel, name="DataOps")
reviewer = ChatCompletionAgent(service=kernel, name="Reviewer")

# [review]
findings = {
    "compliance": compliance.get_response(policy_case),
    "security": security.get_response(policy_case),
    "legal": legal.get_response(policy_case),
    "data_ops": data_ops.get_response(policy_case),
}

# [challenge]
review_gate = reviewer.get_response({
    "question": policy_case["question"],
    "findings": findings,
    "rule": "Reject unsupported claims and missing caveats.",
})

# [synthesis]
final_answer = principal.get_response({
    "question": policy_case["question"],
    "findings": findings,
    "review_gate": review_gate,
})
# [verdict]
print(final_answer)`,
    "event-pipeline": `${helpers}

from llama_index.core.workflow import StartEvent, StopEvent, Workflow, step

class PolicyWorkflow(Workflow):
    # [intake]
    @step
    async def intake(self, event: StartEvent):
        return {"question": "${question.prompt}", "clauses": [${clauseString}]}

    # [review]
    @step
    async def specialist_review(self, event):
        findings = [
            retrieve_clause(event["question"], "retention"),
            retrieve_clause(event["question"], "private_repos"),
            retrieve_clause(event["question"], "rights"),
            retrieve_clause(event["question"], "data_ops"),
        ]
        return {"question": event["question"], "findings": findings}

    # [challenge]
    @step
    async def challenge(self, event):
        event["reviewer_notes"] = check_for_unsupported_claims(event["findings"])
        return event

    # [verdict]
    @step
    async def verdict(self, event):
        return StopEvent(result=compose_answer(event["question"], event["findings"], event["reviewer_notes"]))

# [synthesis]
workflow = PolicyWorkflow(timeout=120)
result = workflow.run()
print(result)`,
    "app-workflow": `${helpers}

import requests
from dataclasses import dataclass

@dataclass
class PolicyCase:
    question: str
    clauses: list[str]
    user_id: str

# [intake]
def start_mastra_policy_checker(case: PolicyCase) -> dict:
    response = requests.post(
        "http://localhost:4111/api/workflows/policy-checker/start",
        json={
            "input": {
                "question": case.question,
                "clauses": case.clauses,
                "userId": case.user_id,
            }
        },
        timeout=30,
    )
    response.raise_for_status()
    return response.json()

# [review]
def get_mastra_run(run_id: str) -> dict:
    response = requests.get(
        f"http://localhost:4111/api/workflows/runs/{run_id}",
        timeout=30,
    )
    response.raise_for_status()
    return response.json()

# [challenge]
case = PolicyCase(
    question="${question.prompt}",
    clauses=[${clauseString}],
    user_id="policy-reviewer-42",
)

# [synthesis]
run = start_mastra_policy_checker(case)
# [verdict]
result = get_mastra_run(run["runId"])
print(result)`,
    "typed-review": `${helpers}

from pydantic import BaseModel
from pydantic_ai import Agent

# [intake]
class PolicyCase(BaseModel):
    question: str
    clauses: list[str]

class Finding(BaseModel):
    agent: str
    citation: str
    conclusion: str

class Decision(BaseModel):
    answer: str
    citations: list[str]
    confidence: float
    reviewer_notes: list[str]

MODEL = "openai:gpt-4.1"

principal = Agent(
    MODEL,
    result_type=Decision,
    system_prompt="Return a policy answer with citations, confidence, and reviewer notes.",
)
specialist = Agent(
    MODEL,
    result_type=Finding,
    system_prompt="Return one structured finding with a citation and precise conclusion.",
)
reviewer = Agent(
    MODEL,
    result_type=list[str],
    system_prompt="Return reviewer notes when claims are unsupported or missing caveats.",
)

# [review]
case = PolicyCase(
    question="${question.prompt}",
    clauses=[${clauseString}],
)

findings = [
    specialist.run_sync(f"Compliance review: {case.model_dump_json()}").output,
    specialist.run_sync(f"Security review: {case.model_dump_json()}").output,
    specialist.run_sync(f"Legal review: {case.model_dump_json()}").output,
    specialist.run_sync(f"DataOps review: {case.model_dump_json()}").output,
]

# [challenge]
reviewer_notes = reviewer.run_sync(f"Challenge these findings: {findings}").output
# [synthesis]
decision = principal.run_sync(
    f"Return a final answer with citations and confidence. Case={case} Findings={findings} Notes={reviewer_notes}"
).output
# [verdict]
print(decision)`
  };

  if (!framework) {
    return `${helpers}

# [intake]
policy_case = {
  "question": "${question.prompt}",
  "clauses": [${clauseString}]
}

# [review]
findings = [
    retrieve_clause(policy_case["question"], "retention"),
    retrieve_clause(policy_case["question"], "rights"),
]
# [challenge]
reviewer_notes = check_for_unsupported_claims(findings)
# [synthesis]
decision = compose_answer(policy_case["question"], findings, reviewer_notes)
# [verdict]
print(decision)`;
  }

  return examples[framework.pattern];
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function renderHighlightedCode(code, stageId) {
  const lines = code.split("\n");
  const markers = [];
  lines.forEach((line, index) => {
    const match = line.match(/# \[(intake|review|challenge|synthesis|verdict)\]/i);
    if (match) {
      markers.push({ stage: match[1].toLowerCase(), index });
    }
  });

  const activeLines = new Set();
  for (let i = 0; i < markers.length; i += 1) {
    const marker = markers[i];
    const nextMarkerIndex = i < markers.length - 1 ? markers[i + 1].index : lines.length;
    if (marker.stage === stageId) {
      for (let line = marker.index; line < nextMarkerIndex; line += 1) {
        activeLines.add(line + 1);
      }
    }
  }

  return lines
    .map((line, index) => {
      const lineNumber = index + 1;
      const activeClass = activeLines.has(lineNumber) ? " active" : "";
      return `<span class="code-line${activeClass}"><span class="code-line-no">${lineNumber}</span><span class="code-line-text">${escapeHtml(line) || "&nbsp;"}</span></span>`;
    })
    .join("");
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
      ${profile.cards
        .map(
          (item) => `
            <article>
              <span>${item.label}</span>
              <strong>${item.value}</strong>
            </article>
          `
        )
        .join("")}
    </div>
  `;
}

function scorePillMarkup(score) {
  return new Array(5)
    .fill(0)
    .map((_, index) => `<span class="score-dot ${index < score ? "active" : ""}"></span>`)
    .join("");
}

function formatSignalLabel(value) {
  return String(value || "")
    .replaceAll("_", " ")
    .replaceAll("-", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function traceStateCarrier(traceStage) {
  const stateContainer = traceStage?.state?.state_container;
  return STATE_CONTAINER_LABELS[stateContainer] || formatSignalLabel(stateContainer || "runtime packet");
}

function traceControlSignal(traceStage) {
  if (!traceStage) {
    return "No live trace signal";
  }
  const output = traceStage.output || {};
  return formatSignalLabel(
    output.reviewer_action
      || output.status
      || output.review_shape
      || output.merge_style
      || traceStage.runtime
  );
}

function traceArtifactSummary(traceStage, stageId) {
  if (!traceStage) {
    return "Reference-only stage";
  }
  const state = traceStage.state || {};
  const output = traceStage.output || {};

  if (stageId === "intake") {
    const loadedCount = Object.keys(state.loaded || {}).filter((key) => state.loaded[key]).length;
    return `${loadedCount || 0} inputs primed for specialist work`;
  }

  if (stageId === "review") {
    return `${Object.keys(state.findings || {}).length || 0} specialist findings added to ${traceStateCarrier(traceStage).toLowerCase()}`;
  }

  if (stageId === "challenge") {
    const noteCount = (output.notes || state.reviewer_notes || []).length;
    const questionCount = (state.open_questions || []).length;
    return `${noteCount} reviewer notes, ${questionCount} open questions`;
  }

  if (stageId === "synthesis") {
    return `${formatSignalLabel(output.merge_style || traceStage.runtime)} merge creates the draft answer`;
  }

  if (stageId === "verdict") {
    const citations = output.citations?.length || state.citations?.length || 0;
    const confidence = output.confidence ?? state.confidence;
    return `${citations} citations attached${confidence !== undefined ? ` · ${Math.round(confidence * 100)}% confidence` : ""}`;
  }

  return "Stage artifact ready";
}

function traceMessageSummary(traceStage, highlights) {
  const messages = traceStage?.messages?.map((item) => item.message).filter(Boolean) || [];
  if (messages.length) {
    return messages.slice(0, 2).join(" / ");
  }
  return highlights?.messages?.join(" / ") || "Execution signal unavailable";
}

function buildOrderedScoreRows(framework) {
  const profile = frameworkTechProfile(framework);
  const byLabel = new Map(
    [...traceScoreRows(framework), ...profile.scorecard].map((item) => [item.label, item])
  );

  return SCORECARD_ORDER
    .map((label) => byLabel.get(label))
    .filter(Boolean);
}

function renderExecutionSignatureCard(framework) {
  const intakeTrace = getTraceStage(framework.id, "intake");
  const challengeTrace = getTraceStage(framework.id, "challenge");
  const verdictTrace = getTraceStage(framework.id, "verdict");
  const profile = frameworkTechProfile(framework);

  return `
    <article class="signature-card" style="--framework-color:${framework.color}">
      <div class="signature-card-head">
        <div>
          <span class="signature-kicker">${PATTERN_LABELS[framework.pattern] || framework.pattern}</span>
          <h4>${framework.name}</h4>
        </div>
        <span class="signature-runtime">${intakeTrace?.runtime || framework.pattern}</span>
      </div>
      <div class="signature-grid">
        <article>
          <span>Coordination</span>
          <strong>${profile.cards[0].value}</strong>
        </article>
        <article>
          <span>State Carrier</span>
          <strong>${traceStateCarrier(intakeTrace)}</strong>
        </article>
        <article>
          <span>Review Pressure</span>
          <strong>${traceControlSignal(challengeTrace)}</strong>
        </article>
        <article>
          <span>Verdict Artifact</span>
          <strong>${traceArtifactSummary(verdictTrace, "verdict")}</strong>
        </article>
      </div>
    </article>
  `;
}

function renderExecutionSnapshot(framework, stageId) {
  const stage = getStage();
  const traceStage = getTraceStage(framework.id, stageId);
  const highlights = flowHighlights(framework.pattern, stageId);
  const traceMessages = traceStage?.messages || [];
  const stageArtifactLabel = stageId === "verdict" ? "Verdict payload" : stageId === "challenge" ? "Review interruption" : "Stage artifact";
  const messageMarkup = traceMessages.length
    ? traceMessages
      .map((item) => {
        const clause = evidenceClauseForLink(item.link_id);
        return `
          <article class="execution-message">
            <strong>${item.message}</strong>
            <span>${clause ? clause.title : "Shared policy evidence"}</span>
          </article>
        `;
      })
      .join("")
    : `
      <article class="execution-message">
        <strong>${traceMessageSummary(traceStage, highlights)}</strong>
        <span>${highlights.business}</span>
      </article>
    `;

  return `
    <section class="execution-panel">
      <div class="execution-panel-head">
        <div>
          <span class="execution-kicker">Stage signature</span>
          <h4>${stage.label} in ${framework.name}</h4>
        </div>
        <span class="execution-runtime">${traceStage?.runtime || framework.pattern}</span>
      </div>
      <div class="execution-grid">
        <article>
          <span>How work moves</span>
          <strong>${highlights.business}</strong>
        </article>
        <article>
          <span>State carrier</span>
          <strong>${traceStateCarrier(traceStage)}</strong>
        </article>
        <article>
          <span>Control signal</span>
          <strong>${traceControlSignal(traceStage)}</strong>
        </article>
        <article>
          <span>Runtime artifact</span>
          <strong>${traceArtifactSummary(traceStage, stageId)}</strong>
        </article>
      </div>
      <div class="state-signature-rail" aria-label="Execution signature flow">
        <article class="state-signature-step">
          <span>Carrier</span>
          <strong>${traceStateCarrier(traceStage)}</strong>
        </article>
        <div class="state-signature-arrow" aria-hidden="true">→</div>
        <article class="state-signature-step">
          <span>Control</span>
          <strong>${traceControlSignal(traceStage)}</strong>
        </article>
        <div class="state-signature-arrow" aria-hidden="true">→</div>
        <article class="state-signature-step">
          <span>${stageArtifactLabel}</span>
          <strong>${traceArtifactSummary(traceStage, stageId)}</strong>
        </article>
      </div>
      <div class="execution-transcript">
        <span class="execution-transcript-label">What the run emits here</span>
        <div class="execution-message-list">
          ${messageMarkup}
        </div>
      </div>
    </section>
  `;
}

function renderFrameworkScorecard(framework) {
  const rows = buildOrderedScoreRows(framework);
  return `
    <section class="framework-scorecard">
      <div class="framework-scorecard-head">
        <h4>Framework Scoreboard</h4>
        <span>1 low · 5 high</span>
      </div>
      <div class="framework-score-grid">
        ${rows
          .map((item) => {
            const state = scoreState(item.label, item.value);
            const def = METRIC_DEFINITIONS[item.label] || "";
            const reason = item.reason || "";
            return `
              <article class="framework-score-row ${state.tone}"
                data-metric-def="${def.replaceAll('"', '&quot;')}"
                data-metric-reason="${reason.replaceAll('"', '&quot;')}"
                data-metric-label="${item.label}"
                data-metric-score="${item.value}">
                <strong>${item.label}${item.detail ? ` <em>${item.detail}</em>` : ""} <span class="metric-info-icon" aria-hidden="true">ℹ</span></strong>
                <div class="score-dot-row" aria-label="${item.label} score ${item.value} out of 5">
                  ${scorePillMarkup(item.value)}
                </div>
                <span class="score-status">${state.label}</span>
              </article>
            `;
          })
          .join("")}
      </div>
    </section>
  `;
}

function renderCodeHint(framework, stageId) {
  const codeSourceLabel = framework ? framework.name : "Reference skeleton";
  const codeSourceHref = framework ? framework.source : policyPack.source;
  const implementationCode = frameworkExampleCode(framework, getQuestion());
  const highlightedImplementation = renderHighlightedCode(implementationCode, stageId);
  const traceStage = framework ? getTraceStage(framework.id, stageId) : null;
  const traceTotals = framework ? getTraceTotals(framework.id) : null;
  const verdictMetricChips = stageId === "verdict" && traceStage?.metrics
    ? `
      <div class="verdict-metric-row" aria-label="Verdict metrics">
        <span class="verdict-metric-chip">Total time: ${formatMs(traceTotals ? traceTotals.timeMs : traceStage.metrics.time_ms)}</span>
        <span class="verdict-metric-chip">Total tokens: ${traceTotals ? traceTotals.tokens : traceStage.metrics.token_total_estimate}</span>
        <span class="verdict-metric-chip">Total cost: $${traceTotals ? traceTotals.cost.toFixed(5) : traceStage.metrics.usd_cost_estimate}</span>
      </div>
    `
    : "";
  const isRealRun = traceStage?.execution_mode === "real-sdk-calls";
  const frameworkNote = framework
    ? isRealRun
      ? `${framework.name}: metrics from a real ${traceStage.runtime} SDK run (gpt-4o-mini). Code example shows the framework API; provider model strings are not the orchestration framework.`
      : `${framework.name} example and ${traceStage?.runtime || framework.pattern} harness view. Provider strings in code examples are not the same thing as the orchestration framework.`
    : "Reference-only implementation view.";
  return `
    <section class="code-hint">
      <div class="code-panel code-panel-wide">
        <div class="code-hint-head">
          <strong>Framework implementation for this policy checker</strong>
          <a href="${codeSourceHref}" target="_blank" rel="noreferrer">${codeSourceLabel} docs</a>
        </div>
        <pre><code class="code-block-highlight">${highlightedImplementation}</code></pre>
      </div>
      ${traceStage ? `
        <div class="code-panel code-panel-wide">
          <div class="code-hint-head">
            <strong>${isRealRun ? "SDK run output" : "Python harness output"}</strong>
            <span>${formatMs(traceStage.metrics.time_ms)} · ${traceStage.metrics.token_total_estimate} tok · $${traceStage.metrics.usd_cost_estimate}</span>
          </div>
          ${verdictMetricChips}
          <pre><code>${escapeHtml(JSON.stringify(traceStage.output, null, 2))}</code></pre>
          <p class="trace-footnote">${frameworkNote}${isRealRun
            ? " Executed using the official SDK runtime."
            : " Executed by the repo’s Python comparison harness for this framework shape, not the official SDK runtime."
          }</p>
        </div>
      ` : ""}
    </section>
  `;
}

function evidenceClauseForLink(linkId) {
  const question = getQuestion();
  const [, toId] = linkEndpoints[linkId];
  const clauseId = question.specialistClauses[toId] || question.relevantClauses[0];
  return policyPack.clauses[clauseId];
}

function renderMessageList(framework, stageId) {
  const graphNodes = getGraphNodes(framework);
  const traceStage = framework ? getTraceStage(framework.id, stageId) : null;
  const messages = traceStage
    ? traceStage.messages.map((message) => [message.link_id, message.message])
    : Object.entries(graphMessageMap(framework, stageId));
  return `
    <div class="message-list">
      ${messages
        .map(([linkId, message]) => {
          const [fromId, toId] = linkEndpoints[linkId];
          const clause = evidenceClauseForLink(linkId);
          return `
            <article class="message-row">
              <strong>${graphNodes[fromId].label} → ${graphNodes[toId].label}</strong>
              <span>${message}</span>
              <small>Evidence: ${clause.title}</small>
            </article>
          `;
        })
        .join("")}
    </div>
  `;
}

function renderGraphMap({ framework, activeAgents, stageId, color, neutral = false }) {
  const graphNodes = getGraphNodes(framework);
  const traceStage = framework ? getTraceStage(framework.id, stageId) : null;
  const stageHighlights = traceStage ? {
    links: traceStage.active_links,
    messages: traceStage.messages.map((item) => item.message)
  } : framework ? flowHighlights(framework.pattern, stageId) : {
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
    .map(([nodeId, node]) => {
      const role = getAgentRole(nodeId);
      return `
      <g class="graph-node ${activeAgentSet.has(nodeId) ? "active" : ""} role-${role}"
         data-node-id="${nodeId}"
         data-node-desc="${NODE_DESCRIPTIONS[nodeId] || nodeId}">
        ${getNodeShape(role, node.x, node.y)}
        <text x="${node.labelX}" y="${node.labelY}" text-anchor="middle">${node.label}</text>
      </g>
    `;
    })
    .join("");

  const patternLabel = framework ? (PATTERN_LABELS[framework.pattern] || framework.pattern) : "";

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
        ${patternLabel ? `<text class="graph-pattern-label" x="50" y="5" text-anchor="middle">${patternLabel}</text>` : ""}
        ${lineMarkup}
        ${nodeMarkup}
      </svg>
    </div>
  `;
}

function renderBoard({ framework, color, activeAgents, activeTools, messages, stageId, neutral = false }) {
  const profile = frameworkTechProfile(framework);
  return `
    <div class="flow-board ${neutral ? "neutral" : ""}" style="--framework-color:${color}; --stage-rgb:${stageTheme[stageId] || stageTheme.review}">
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
          <span class="flow-section-label">Principal Agent</span>
        </div>
        ${agentRoster
          .filter((agent) => agent.id === "principal")
          .map(
            (agent) => `
              <article class="flow-agent role-${getAgentRole(agent.id)} ${activeAgents.has(agent.id) ? "active" : ""}">
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
          <span class="flow-section-label">Specialist Agents</span>
        </div>
        <div class="specialist-grid">
          ${agentRoster
            .filter((agent) => ["compliance", "security", "legal", "finance"].includes(agent.id))
            .map(
              (agent) => `
                <article class="flow-agent role-${getAgentRole(agent.id)} ${activeAgents.has(agent.id) ? "active" : ""}">
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
          <span class="flow-section-label">Reviewer Agent</span>
        </div>
        ${agentRoster
          .filter((agent) => agent.id === "reviewer")
          .map(
            (agent) => `
              <article class="flow-agent role-${getAgentRole(agent.id)} ${activeAgents.has(agent.id) ? "active" : ""}">
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
          <span class="flow-section-label">Decision Output</span>
        </div>
        ${agentRoster
          .filter((agent) => agent.id === "decision")
          .map(
            (agent) => `
              <article class="flow-agent role-${getAgentRole(agent.id)} ${activeAgents.has(agent.id) ? "active" : ""}">
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
  const selectedFrameworks = compareIds.map((id) => getFramework(id)).filter(Boolean);
  skeletonCaption.textContent = "Each framework runs the same principal-specialist-reviewer loop, but the real differentiator is what gets passed between steps, how review interrupts the flow, and what artifact the runtime emits.";
  skeletonBoard.innerHTML = `
    <div class="skel-rationale signature-rationale">
      <p class="skel-rationale-why">What actually differentiates the runs?</p>
      <p class="skel-rationale-body">Not the shape of the routing diagram. What matters is the execution signature: shared state versus handoffs versus transcripts versus typed payloads, the exact reviewer stop signal, and the artifact each runtime leaves behind for debugging and audits.</p>
      <p class="skel-conformance">These cards compare the selected frameworks by execution semantics, using the current question's real trace data rather than a generic topology sketch.</p>
    </div>
    <div class="signature-board">
      ${selectedFrameworks.map((framework) => renderExecutionSignatureCard(framework)).join("")}
    </div>
  `;
}

function renderFrameworkAnalysis(framework) {
  const question = getQuestion();
  return `
    <div class="lane-bottom lane-analysis-grid">
      <article>
        <h4>Strengths for this checker</h4>
        <ul>${framework.pros.map((item) => `<li>${item}</li>`).join("")}</ul>
      </article>
      <article>
        <h4>Framework challenges</h4>
        <ul>${framework.cons.map((item) => `<li>${item}</li>`).join("")}</ul>
      </article>
      <article>
        <h4>Best eval move</h4>
        <p>${frameworkTechProfile(framework).cards[2].value}</p>
      </article>
      <article>
        <h4>Where context can drop</h4>
        <p>${frameworkTechProfile(framework).cards[3].value} For this question: ${question.answerShape}</p>
      </article>
    </div>
  `;
}

function renderScoreRationale() {
  const frameworks = compareIds.map((id) => getFramework(id));
  scoreRationale.innerHTML = `
    <div class="section-heading">
      <p class="eyebrow">Score Rationale</p>
      <h3>Why low or risky scores are low</h3>
    </div>
    <div class="lane-bottom lane-analysis-grid">
      ${frameworks
        .map((framework) => {
          const profile = frameworkTechProfile(framework);
          const rows = [...traceScoreRows(framework), ...profile.scorecard];
          const flagged = rows.filter((item) => {
            const state = scoreState(item.label, item.value);
            return state.tone !== "safe";
          });
          return `
            <article>
              <h4>${framework.name}</h4>
              <ul>
                ${flagged
                  .map((item) => {
                    const reason =
                      item.label === "Time Cost" || item.label === "Token Cost" || item.label === "Latency" || item.label === "Parallelism"
                        ? profile.cards[1].value
                        : item.label === "Observability" || item.label === "Replayability" || item.label === "Human Review" || item.label === "Testability"
                          ? profile.cards[2].value
                          : item.label === "Type Safety"
                            ? profile.cards[5].value
                            : item.label === "Error Recovery"
                              ? profile.cards[0].value
                              : profile.cards[3].value;
                    const detail = item.detail ? ` Measured: ${item.detail}.` : "";
                    return `<li><strong>${item.label}:</strong> ${reason}${detail} Score: ${item.value}/5.</li>`;
                  })
                  .join("")}
              </ul>
            </article>
          `;
        })
        .join("")}
    </div>
  `;
}

function renderExecutiveSummary(framework) {
  const profile = frameworkTechProfile(framework);
  const rows = [...traceScoreRows(framework), ...profile.scorecard];

  const annotated = rows.map((item) => {
    const isRisk = riskMetricLabels.has(item.label);
    const state = scoreState(item.label, item.value);
    const effectiveScore = isRisk ? 5 - item.value : item.value;
    return { ...item, isRisk, state, effectiveScore };
  });

  const sorted = [...annotated].sort((a, b) => b.effectiveScore - a.effectiveScore);
  const strengths = sorted.filter((m) => m.state.tone === "safe").slice(0, 3);
  const concerns = sorted.filter((m) => m.state.tone !== "safe");

  const pillHtml = (items, tone) =>
    items.map((m) => `<span class="exec-pill exec-pill-${tone}">${m.label}${m.detail ? ` · ${m.detail}` : ""}</span>`).join("");

  return `
    <div class="exec-summary">
      <span class="exec-summary-label">Our Findings</span>
      <div class="exec-summary-groups">
        ${strengths.length ? `
        <div class="exec-group">
          <span class="exec-group-title">Strengths</span>
          <div class="exec-pills">${pillHtml(strengths, "safe")}</div>
        </div>` : ""}
        ${concerns.length ? `
        <div class="exec-group">
          <span class="exec-group-title">Watch</span>
          <div class="exec-pills">${pillHtml(concerns, concerns[0].state.tone)}</div>
        </div>` : ""}
      </div>
    </div>
  `;
}

function laneMarkup(frameworkId, laneIndex) {
  const framework = getFramework(frameworkId);
  const stage = getStage();
  const highlights = flowHighlights(framework.pattern, stage.id);
  const profile = frameworkTechProfile(framework);

  return `
    <article class="compare-lane" style="--stage-rgb:${stageTheme[stage.id]}">
      <div class="lane-top">
        <div>
          <p class="eyebrow">Demo ${laneIndex + 1}</p>
          <h3>${framework.name}</h3>
        </div>
        <div class="lane-top-actions">
          <a class="kit-download-btn" href="/starter-kits/zips/${framework.id}.zip" download title="Download starter kit">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/><path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/></svg>
            Starter Kit
          </a>
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
      </div>

      <p class="lane-intro">${profile.intro}</p>
      ${renderExecutiveSummary(framework)}
      ${renderFrameworkTechStrip(framework)}

      ${renderStepTrail()}

      <div class="lane-role-box lane-role-box-top">
        <div class="lane-role-box-who">
          <span class="lane-stage-eyebrow">${stage.label}</span>
          <strong>${stage.persona}</strong>
        </div>
        <p class="lane-role-primary">${highlights.technical}</p>
        <p class="lane-role-support">${stage.caption}</p>
      </div>

      ${renderExecutionSnapshot(framework, stage.id)}

      ${renderFrameworkScorecard(framework)}

      ${renderCodeHint(framework, stage.id)}

      ${renderFrameworkAnalysis(framework)}
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
      renderScoreRationale();
    });
  });
  comparisonLanes.querySelectorAll("[data-goto-stage]").forEach((btn) => {
    btn.addEventListener("click", () => {
      currentStage = Number(btn.dataset.gotoStage);
      render();
    });
  });
}

function handleNodeHover(e) {
  const nodeG = e.target.closest("[data-node-id]");
  if (!nodeG) return;
  const stage = getStage();
  const isActive = nodeG.classList.contains("active");
  const desc = nodeG.dataset.nodeDesc || nodeG.dataset.nodeId;
  graphTooltip.textContent = isActive
    ? `${nodeG.dataset.nodeId}: active in ${stage.label}`
    : desc;
  graphTooltip.removeAttribute("hidden");
}

function handleNodeOut(e) {
  if (!e.relatedTarget?.closest("[data-node-id]")) {
    graphTooltip.setAttribute("hidden", "");
  }
}

function handleNodeMove(e) {
  graphTooltip.style.left = `${e.clientX + 14}px`;
  graphTooltip.style.top = `${e.clientY - 36}px`;
}

function handleMetricHover(e) {
  const row = e.target.closest("[data-metric-label]");
  if (!row) return;
  const label = row.dataset.metricLabel;
  const def = row.dataset.metricDef;
  const reason = row.dataset.metricReason;
  const score = row.dataset.metricScore;
  metricTooltip.innerHTML = `
    <div class="metric-tooltip-label">${label}</div>
    ${def ? `<div class="metric-tooltip-def">${def}</div>` : ""}
    ${reason ? `<div class="metric-tooltip-reason">Score ${score}/5: ${reason}</div>` : ""}
  `;
  metricTooltip.removeAttribute("hidden");
}

function handleMetricOut(e) {
  if (!e.relatedTarget?.closest("[data-metric-label]")) {
    metricTooltip.setAttribute("hidden", "");
  }
}

function handleMetricMove(e) {
  const rect = metricTooltip.getBoundingClientRect();
  const x = e.clientX + 14;
  const y = e.clientY - 36;
  metricTooltip.style.left = `${Math.min(x, window.innerWidth - rect.width - 16)}px`;
  metricTooltip.style.top = `${Math.max(4, y - rect.height)}px`;
}

function nextStage() {
  currentStage = (currentStage + 1) % stages.length;
  render();
}

function previousStage() {
  currentStage = (currentStage - 1 + stages.length) % stages.length;
  render();
}

function render() {
  renderCatalog();
  renderPolicyCase();
  renderStageChips();
  renderSummary();
  renderSkeleton();
  renderComparison();
  renderScoreRationale();
}

function renderFooterLike(serverTotal) {
  if (!footerLikeBtn || !footerLikeCount) {
    return;
  }

  const state = likeStore.read();
  const displayTotal = serverTotal !== undefined ? serverTotal : state.count;
  footerLikeCount.textContent = String(displayTotal);
  footerLikeBtn.classList.toggle("liked", state.liked);
  footerLikeBtn.setAttribute("aria-pressed", state.liked ? "true" : "false");
  const icon = footerLikeBtn.querySelector(".like-icon");
  if (icon) {
    icon.textContent = state.liked ? "♥" : "♡";
  }
}

async function toggleFooterLike() {
  const state = likeStore.read();
  const nowLiked = !state.liked;

  if (nowLiked) {
    // Optimistic update, then confirm with server
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
    } catch (_err) {
      // Keep the optimistic state; server unavailable
    }
  } else {
    // Unlike: local-only (CSV is append-only)
    const newCount = Math.max(0, state.count - 1);
    likeStore.write({ count: newCount, liked: false });
    renderFooterLike(newCount);
  }
}

async function loadTraces() {
  try {
    const response = await fetch("./traces/framework_traces.json", { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Trace file returned ${response.status}`);
    }
    traceStore = await response.json();
  } catch (error) {
    traceStore = null;
    console.error("Trace load failed", error);
  }
}

// ── Theme toggle ──────────────────────────────────────────────────────────────

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

async function initApp() {
  frameworkCatalogCards = document.getElementById("framework-catalog-cards");
  policyCasePanel = document.getElementById("policy-case-panel");
  stageChipRow = document.getElementById("stage-chip-row");
  prevStageBtn = document.getElementById("prev-stage-btn");
  stepDemoBtn = document.getElementById("step-demo-btn");
  frameworkSummary = document.getElementById("framework-summary");
  appStatus = document.getElementById("app-status");
  skeletonCaption = document.getElementById("skeleton-caption");
  skeletonBoard = document.getElementById("skeleton-board");
  scenarioHeadline = document.getElementById("scenario-headline");
  scenarioSupport = document.getElementById("scenario-support");
  comparisonLanes = document.getElementById("comparison-lanes");
  scoreRationale = document.getElementById("score-rationale");
  footerLikeBtn = document.getElementById("footer-like-btn");
  footerLikeCount = document.getElementById("footer-like-count");
  graphTooltip = document.getElementById("graph-tooltip");
  metricTooltip = document.getElementById("metric-tooltip");

  const requiredElements = [
    ["framework-catalog-cards", frameworkCatalogCards],
    ["policy-case-panel", policyCasePanel],
    ["stage-chip-row", stageChipRow],
    ["prev-stage-btn", prevStageBtn],
    ["step-demo-btn", stepDemoBtn],
    ["framework-summary", frameworkSummary],
    ["app-status", appStatus],
    ["skeleton-caption", skeletonCaption],
    ["skeleton-board", skeletonBoard],
    ["scenario-headline", scenarioHeadline],
    ["scenario-support", scenarioSupport],
    ["comparison-lanes", comparisonLanes],
    ["score-rationale", scoreRationale],
    ["footer-like-btn", footerLikeBtn],
    ["footer-like-count", footerLikeCount],
    ["graph-tooltip", graphTooltip],
    ["metric-tooltip", metricTooltip]
  ];

  const missingIds = requiredElements.filter(([, element]) => !element).map(([id]) => id);
  if (missingIds.length > 0) {
    throw new Error(`Missing DOM nodes: ${missingIds.join(", ")}`);
  }

  await loadTraces();
  prevStageBtn.addEventListener("click", previousStage);
  stepDemoBtn.addEventListener("click", nextStage);
  footerLikeBtn.addEventListener("click", toggleFooterLike);
  comparisonLanes.addEventListener("mouseover", handleNodeHover);
  comparisonLanes.addEventListener("mouseout", handleNodeOut);
  comparisonLanes.addEventListener("mousemove", handleNodeMove);
  comparisonLanes.addEventListener("mouseover", handleMetricHover);
  comparisonLanes.addEventListener("mouseout", handleMetricOut);
  comparisonLanes.addEventListener("mousemove", handleMetricMove);
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
