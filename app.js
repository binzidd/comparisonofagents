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
    caption: "Supervisor loads the policy corpus, chosen question, and expected answer shape into state.",
    activeAgents: ["principal"],
    activeTools: ["policy_text", "question_bank"]
  },
  {
    id: "review",
    label: "Review",
    caption: "Compliance, security, legal, and data ops agents run clause retrieval and scoped checks in parallel.",
    activeAgents: ["principal", "compliance", "security", "legal", "finance"],
    activeTools: ["clause_index", "rights_matrix", "retention_map", "exception_checker"]
  },
  {
    id: "challenge",
    label: "Challenge",
    caption: "Reviewer checks unsupported claims, clause coverage, and contradiction across agent outputs.",
    activeAgents: ["compliance", "security", "legal", "finance", "reviewer"],
    activeTools: ["evidence_matrix", "claim_checker"]
  },
  {
    id: "synthesis",
    label: "Synthesis",
    caption: "Supervisor merges clause evidence, reviewer objections, and structured findings into one answer object.",
    activeAgents: ["principal", "reviewer", "security", "legal"],
    activeTools: ["answer_builder", "evidence_matrix"]
  },
  {
    id: "verdict",
    label: "Verdict",
    caption: "Supervisor emits a structured answer with citations, confidence, and reviewer notes.",
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
    principal: { x: 16, y: 14, labelX: 16, labelY: 25 },
    compliance: { x: 32, y: 32, labelX: 24, labelY: 43 },
    security: { x: 50, y: 48, labelX: 50, labelY: 59 },
    legal: { x: 68, y: 64, labelX: 68, labelY: 75 },
    finance: { x: 84, y: 80, labelX: 84, labelY: 91 },
    reviewer: { x: 50, y: 80, labelX: 50, labelY: 91 },
    decision: { x: 50, y: 96, labelX: 50, labelY: 99 }
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

let currentStage = 0;
let compareIds = ["langgraph", "openai-agents"];
let selectedQuestionId = "retention";

let frameworkCatalogCards;
let policyCasePanel;
let stageChipRow;
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

const likeStorageKey = "comparison_lab_like_count";
const likeActiveKey = "comparison_lab_like_active";

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
  const stage = getStage();
  const question = getQuestion();

  scenarioHeadline.textContent = "Public policy checker across frameworks";
  scenarioSupport.textContent = `Click through one stage at a time to compare orchestration, eval, and risk handling for the same question: ${question.label}`;
  frameworkSummary.innerHTML = `
    <div class="summary-pill">Policy: ${policyPack.title}</div>
    <div class="summary-pill">Question: ${question.label}</div>
    <div class="summary-pill">Stage: ${stage.label}</div>
  `;
  appStatus.textContent = `${stage.label} active. ${stage.caption}`;
  skeletonCaption.textContent = "Reference only: principal routes work to specialists, reviewer challenges weak claims, and output returns one policy answer.";
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
            <div class="step-item ${activeClass}" style="--item-rgb:${stageTheme[stage.id]}">
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
      cards: [
        { label: "Execution", value: "Supervisor graph with explicit branch and merge nodes" },
        { label: "Performance", value: "Higher setup cost, but review can run in parallel branches" },
        { label: "Evals", value: "Best with node assertions, checkpoint replay, and branch-level tests" },
        { label: "Context Risk", value: "Low to medium because one shared state object holds evidence" },
        { label: "Challenge", value: "Exception paths can make the graph dense as policy rules expand" },
        { label: "Tools", value: "Node-scoped tools keep retrieval and checks tightly bounded" }
      ],
      scorecard: [
        { label: "Latency", value: 3 },
        { label: "Observability", value: 5 },
        { label: "Replayability", value: 5 },
        { label: "Human Review", value: 5 },
        { label: "Context Loss", value: 2 },
        { label: "Unsupported Answer Risk", value: 2 }
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
      cards: [
        { label: "Execution", value: "Linear baton-pass handoffs inside one run context" },
        { label: "Performance", value: "Simple to reason about, but latency stacks if specialists are sequential" },
        { label: "Evals", value: "Guardrails fit naturally at handoff boundaries and before final return" },
        { label: "Context Risk", value: "Medium because each handoff can compress or reshape prior findings" },
        { label: "Challenge", value: "Long policy chains can lose nuance if each agent summarizes too aggressively" },
        { label: "Tools", value: "Agent-local tools stay clean, but cross-agent evidence stitching matters" }
      ],
      scorecard: [
        { label: "Latency", value: 2 },
        { label: "Observability", value: 4 },
        { label: "Replayability", value: 4 },
        { label: "Human Review", value: 4 },
        { label: "Context Loss", value: 3 },
        { label: "Unsupported Answer Risk", value: 3 }
      ],
      arrowA: "handoff",
      arrowB: "review",
      arrowC: "return",
      evalCode: `on_handoff(validate_schema)
assert no_required_clause_dropped(ctx)
reviewer.must_reject_if_support_missing()`
    },
    "conversation-mesh": {
      cards: [
        { label: "Execution", value: "Conversation mesh with direct specialist challenge" },
        { label: "Performance", value: "Great for exploration, but turn-taking can be token and latency heavy" },
        { label: "Evals", value: "Needs transcript scoring, stop rules, and claim verification after debate" },
        { label: "Context Risk", value: "High because long threads can bury the original policy question" },
        { label: "Challenge", value: "Without hard stopping conditions, policy review can sprawl" },
        { label: "Tools", value: "Tools are easy to invoke, but evidence grounding must stay explicit" }
      ],
      scorecard: [
        { label: "Latency", value: 1 },
        { label: "Observability", value: 2 },
        { label: "Replayability", value: 2 },
        { label: "Human Review", value: 4 },
        { label: "Context Loss", value: 5 },
        { label: "Unsupported Answer Risk", value: 4 }
      ],
      arrowA: "debate",
      arrowB: "challenge",
      arrowC: "converge",
      evalCode: `score_transcript_for_support()
limit_turns(max=8)
force_reviewer_to_request_clause_ids()`
    },
    "manager-review": {
      cards: [
        { label: "Execution", value: "Manager assigns specialist tasks, then resumes after checkpoint review" },
        { label: "Performance", value: "Operationally clear and easy to split, with moderate orchestration overhead" },
        { label: "Evals", value: "Checkpoint validation is natural before manager synthesis" },
        { label: "Context Risk", value: "Medium because task outputs may be concise but detached from source wording" },
        { label: "Challenge", value: "Manager prompts can become the bottleneck if too much policy logic lives there" },
        { label: "Tools", value: "Role-scoped tools map cleanly to specialist task ownership" }
      ],
      scorecard: [
        { label: "Latency", value: 3 },
        { label: "Observability", value: 4 },
        { label: "Replayability", value: 4 },
        { label: "Human Review", value: 5 },
        { label: "Context Loss", value: 3 },
        { label: "Unsupported Answer Risk", value: 3 }
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
      cards: [
        { label: "Execution", value: "Governed workflow with platform-level checkpoints and controls" },
        { label: "Performance", value: "Heavier platform cost, but strong fit when auditability matters" },
        { label: "Evals", value: "Formal review gates and policy conformance checks fit well" },
        { label: "Context Risk", value: "Low to medium because state is centralized but platform abstractions are heavier" },
        { label: "Challenge", value: "Can feel heavyweight for a narrow policy checker unless governance is a requirement" },
        { label: "Tools", value: "Enterprise plugins centralize retrieval, logging, and review policies" }
      ],
      scorecard: [
        { label: "Latency", value: 2 },
        { label: "Observability", value: 5 },
        { label: "Replayability", value: 4 },
        { label: "Human Review", value: 5 },
        { label: "Context Loss", value: 2 },
        { label: "Unsupported Answer Risk", value: 2 }
      ],
      arrowA: "route",
      arrowB: "govern",
      arrowC: "publish",
      evalCode: `governance_gate.assert_audit_fields()
require_exception_path_for_ambiguous_answers()`
    },
    "event-pipeline": {
      cards: [
        { label: "Execution", value: "Event-driven evidence pipeline with aggregation steps" },
        { label: "Performance", value: "Scales well when evidence extraction is eventful and decoupled" },
        { label: "Evals", value: "Good for per-step validation and replay of failed events" },
        { label: "Context Risk", value: "Medium because payload contracts matter more than conversational continuity" },
        { label: "Challenge", value: "Policy nuance can fragment if events are too small or loosely typed" },
        { label: "Tools", value: "Step-level evidence calls fit clause extraction and answer building" }
      ],
      scorecard: [
        { label: "Latency", value: 4 },
        { label: "Observability", value: 4 },
        { label: "Replayability", value: 5 },
        { label: "Human Review", value: 3 },
        { label: "Context Loss", value: 3 },
        { label: "Unsupported Answer Risk", value: 3 }
      ],
      arrowA: "emit",
      arrowB: "recheck",
      arrowC: "aggregate",
      evalCode: `validate_event_payloads()
requeue_if_clause_score < threshold
aggregate_only_supported_findings()`
    },
    "app-workflow": {
      cards: [
        { label: "Execution", value: "App-native workflow that keeps orchestration close to product code" },
        { label: "Performance", value: "Strong product-team ergonomics with moderate workflow overhead" },
        { label: "Evals", value: "Good fit for inline guardrail branches and UI-facing assertions" },
        { label: "Context Risk", value: "Medium because app state helps, but workflow branches can hide missing evidence" },
        { label: "Challenge", value: "You must design governance discipline yourself rather than inherit it" },
        { label: "Tools", value: "Workflow steps make it easy to attach retrieval and scoring tools" }
      ],
      scorecard: [
        { label: "Latency", value: 3 },
        { label: "Observability", value: 4 },
        { label: "Replayability", value: 4 },
        { label: "Human Review", value: 4 },
        { label: "Context Loss", value: 3 },
        { label: "Unsupported Answer Risk", value: 3 }
      ],
      arrowA: "step",
      arrowB: "branch",
      arrowC: "resume",
      evalCode: `if (!hasCitation(answer)) branch("review")
if (confidence < 0.7) branch("human_check")`
    },
    "typed-review": {
      cards: [
        { label: "Execution", value: "Typed orchestration pipeline with validated inputs and outputs" },
        { label: "Performance", value: "Moderate runtime cost, offset by lower downstream cleanup and retries" },
        { label: "Evals", value: "Schema validation and typed reviewer checks are the default strength" },
        { label: "Context Risk", value: "Low to medium because structured outputs preserve key answer fields" },
        { label: "Challenge", value: "You still have to design the multi-agent topology around the typed core" },
        { label: "Tools", value: "Typed tools and result models suit policy answers with citations and confidence" }
      ],
      scorecard: [
        { label: "Latency", value: 3 },
        { label: "Observability", value: 4 },
        { label: "Replayability", value: 4 },
        { label: "Human Review", value: 4 },
        { label: "Context Loss", value: 2 },
        { label: "Unsupported Answer Risk", value: 1 }
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

  return [
    {
      label: "Time Cost",
      value: scoreFromTimeMs(verdictTrace.metrics.time_ms),
      detail: `${verdictTrace.metrics.time_ms} ms`
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

function sharedPolicyHelpers(question) {
  const clauseEntries = question.relevantClauses
    .map((clauseId) => `    "${clauseId}": "${policyPack.clauses[clauseId].summary}"`)
    .join(",\n");

  return `from dataclasses import dataclass, field
from typing import Any

POLICY_TEXT = {
${clauseEntries}
}

@dataclass
class PolicyAnswer:
    answer: str
    citations: list[str]
    confidence: float
    reviewer_notes: list[str] = field(default_factory=list)

def retrieve_clause(question: str, clause_id: str) -> dict[str, str]:
    return {
        "clause_id": clause_id,
        "question": question,
        "summary": POLICY_TEXT[clause_id],
    }

def check_for_unsupported_claims(findings: Any) -> list[str]:
    notes = []
    serialized = str(findings).lower()
    if "immediate deletion" in serialized:
        notes.append("Policy does not promise immediate deletion.")
    if "always" in serialized:
        notes.append("Answer overclaims certainty; preserve conditions and exceptions.")
    return notes

def compose_answer(question: str, findings: Any, reviewer_notes: list[str]) -> PolicyAnswer:
    citations = [item["clause_id"] for item in findings if isinstance(item, dict) and "clause_id" in item]
    if not citations:
        citations = ["retention", "rights"]
    return PolicyAnswer(
        answer="Answer the policy question with conditions, cited clauses, and reviewer caveats.",
        citations=sorted(set(citations)),
        confidence=0.78 if reviewer_notes else 0.9,
        reviewer_notes=reviewer_notes,
    )`;
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
graph.add_node("reviewer", reviewer_node)

# [intake]
graph.add_edge("principal", "compliance")
graph.add_edge("principal", "security")
graph.add_edge("principal", "legal")

# [challenge]
graph.add_edge("compliance", "reviewer")
graph.add_edge("security", "reviewer")
graph.add_edge("legal", "reviewer")

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

reviewer = Agent(
    name="Reviewer",
    instructions="Reject answers that lack clause support or overclaim policy rights.",
)

# [synthesis]
principal = Agent(
    name="Principal",
    instructions="Own the final policy answer and include confidence plus citations. Use compose_answer once findings are returned.",
    handoffs=[compliance, security, legal, reviewer],
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
reviewer = ChatCompletionAgent(service=kernel, name="Reviewer")

# [review]
findings = {
    "compliance": compliance.get_response(policy_case),
    "security": security.get_response(policy_case),
    "legal": legal.get_response(policy_case),
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

function renderFrameworkScorecard(framework) {
  const profile = frameworkTechProfile(framework);
  const rows = [...traceScoreRows(framework), ...profile.scorecard];
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
            return `
              <article class="framework-score-row ${state.tone}">
                <strong>${item.label}${item.detail ? ` <em>${item.detail}</em>` : ""}</strong>
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
        <span class="verdict-metric-chip">Total time: ${traceTotals ? traceTotals.timeMs : traceStage.metrics.time_ms} ms</span>
        <span class="verdict-metric-chip">Total tokens: ${traceTotals ? traceTotals.tokens : traceStage.metrics.token_total_estimate}</span>
        <span class="verdict-metric-chip">Total cost: $${traceTotals ? traceTotals.cost.toFixed(5) : traceStage.metrics.usd_cost_estimate}</span>
      </div>
    `
    : "";
  const frameworkNote = framework
    ? `${framework.name} example and ${traceStage?.runtime || framework.pattern} harness view. Provider strings in code examples are not the same thing as the orchestration framework.`
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
            <strong>Python harness output</strong>
            <span>${traceStage.metrics.time_ms} ms · ${traceStage.metrics.token_total_estimate} tok · $${traceStage.metrics.usd_cost_estimate}</span>
          </div>
          ${verdictMetricChips}
          <pre><code>${escapeHtml(JSON.stringify(traceStage.output, null, 2))}</code></pre>
          <p class="trace-footnote">${frameworkNote} Executed by the repo’s Python comparison harness for this framework shape, not the official SDK runtime.</p>
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
          <span class="flow-section-label">Principal</span>
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
          <span class="flow-section-label">Specialists</span>
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
          <span class="flow-section-label">Review</span>
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
          <span class="flow-section-label">Output</span>
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
  skeletonBoard.innerHTML = `
    <div class="lane-role-box lane-role-box-top" style="--stage-rgb:${stageTheme.review}">
      <strong>Static reference structure</strong>
      <p>Principal routes work to specialists, reviewer challenges weak claims, and output returns one policy answer.</p>
    </div>
    ${renderSkeletonMini()}
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
                      item.label === "Time Cost" || item.label === "Token Cost" || item.label === "Latency"
                        ? profile.cards[1].value
                        : item.label === "Observability" || item.label === "Replayability" || item.label === "Human Review"
                          ? profile.cards[2].value
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

function laneMarkup(frameworkId, laneIndex) {
  const framework = getFramework(frameworkId);
  const stage = getStage();
  const highlights = flowHighlights(framework.pattern, stage.id);

  return `
    <article class="compare-lane" style="--stage-rgb:${stageTheme[stage.id]}">
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
        <p>${highlights.technical}</p>
      </div>

      ${renderGraphMap({
        framework,
        activeAgents: stage.activeAgents,
        stageId: stage.id,
        color: framework.color
      })}

      ${renderMessageList(framework, stage.id)}

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
    });
  });
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

function getStoredLikeCount() {
  const value = window.localStorage.getItem(likeStorageKey);
  return Number.isFinite(Number(value)) ? Number(value) : 0;
}

function hasLiked() {
  return window.localStorage.getItem(likeActiveKey) === "true";
}

function renderFooterLike() {
  if (!footerLikeBtn || !footerLikeCount) {
    return;
  }

  const count = getStoredLikeCount();
  const liked = hasLiked();
  footerLikeCount.textContent = String(count);
  footerLikeBtn.classList.toggle("liked", liked);
  footerLikeBtn.setAttribute("aria-pressed", liked ? "true" : "false");
  const icon = footerLikeBtn.querySelector(".like-icon");
  if (icon) {
    icon.textContent = liked ? "♥" : "♡";
  }
}

function toggleFooterLike() {
  const liked = hasLiked();
  const nextCount = Math.max(0, getStoredLikeCount() + (liked ? -1 : 1));
  window.localStorage.setItem(likeStorageKey, String(nextCount));
  window.localStorage.setItem(likeActiveKey, liked ? "false" : "true");
  renderFooterLike();
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
    ["footer-like-count", footerLikeCount]
  ];

  const missingIds = requiredElements.filter(([, element]) => !element).map(([id]) => id);
  if (missingIds.length > 0) {
    throw new Error(`Missing DOM nodes: ${missingIds.join(", ")}`);
  }

  await loadTraces();
  prevStageBtn.addEventListener("click", previousStage);
  stepDemoBtn.addEventListener("click", nextStage);
  footerLikeBtn.addEventListener("click", toggleFooterLike);
  renderFooterLike();
  render();
}

initApp();
