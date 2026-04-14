# 20-Minute Team Showcase: Agent Frameworks, Claude Skills, and AgentCore

Audience: executives and product leaders  
Format: timed speaking notes with clearly separated speaking and demo cues  
Site: https://comparisonofagents.vercel.app/

## Presenter Legend

Use this file as your run-of-show.

- **SAY:** Words to speak out loud.
- **DEMO:** What to show, click, scroll, or point at on the site.
- **POINT:** The specific visual or idea to draw attention to.
- **TAKEAWAY:** The message the audience should remember before you move on.

## Core Message

SAY:

I built this as an experiment to answer a practical product and architecture question: before we commit to an agent framework, can we see how different frameworks behave on the same enterprise-style workflow, where they help, where they leave gaps, and how Claude Skills plus Amazon Bedrock AgentCore make the pattern more reusable and production-ready?

TAKEAWAY:

Frameworks decide how agents collaborate. Skills package reusable domain capability. AgentCore helps productionize the runtime.

## Five Refinement Passes Applied

1. **Coverage pass:** Covers Framework Lab, Claude Skills Lab, Decision Lab, and the recently updated Analytics Agent Lab.
2. **Narrative pass:** Moves from experiment, to framework findings, to reusable skills, to production architecture.
3. **Executive clarity pass:** Emphasizes risk, governance, reuse, evidence preservation, and product fit.
4. **Demo clarity pass:** Separates what you say from what you show using SAY, DEMO, POINT, and TAKEAWAY.
5. **Polish pass:** Sharpens opening, transitions, and the final close.

---

## 0:00-2:00 - Opening: Why This Experiment Exists

DEMO:

Open the home page and stay on the hero section.

SAY:

Good morning everyone. I built this as an experiment because teams building AI agents hit the same decision very early: which framework do we use?

That sounds technical, but it quickly becomes a product and risk decision. The framework affects reliability, debugging, governance, cost of change, and how much rework we create if we choose badly.

Most framework comparisons are abstract. They describe concepts, but they do not show what happens when the same workflow is implemented across different agent stacks.

This site is a comparison lab. It takes one enterprise-style task, runs it through multiple frameworks, and makes the differences visible: orchestration shape, execution stages, confidence, cost, latency, evidence handling, and production readiness.

POINT:

Point to the page navigation: Framework Lab, Claude Skills Lab, Decision Lab, Analytics Agent Lab.

SAY:

The story today has four parts.

First, I will show how different frameworks behave on the same task.  
Second, I will show what Claude Skills change by packaging reusable capability.  
Third, I will show how the decision changes based on runtime, complexity, and priority.  
Fourth, I will close with the production architecture pattern in the Analytics Agent Lab, where AgentCore becomes important.

TAKEAWAY:

This is not a beauty contest where one framework wins everything. It is a decision aid for choosing the right architecture before we commit real delivery effort.

---

## 2:00-7:00 - Framework Lab: Same Task, Different Agent Operating Models

DEMO:

Stay on Framework Lab. Scroll to "Frameworks in scope", then move into "Public policy checker across frameworks."

SAY:

The first page is the Framework Lab. To make the comparison fair, I held the task constant.

The shared scenario is a public policy checker using GitHub's General Privacy Statement as the source corpus. The app asks questions like: can GitHub retain personal data after an account is closed, when can personal data be shared, and what privacy rights do users have?

This works well as a benchmark because it looks like a real enterprise workflow. It requires policy interpretation, evidence gathering, specialist review, caveats, and a final answer that should not overclaim.

DEMO:

Click through the five stages: Intake, Review, Challenge, Synthesis, Verdict.

SAY:

Every framework runs the same five-stage flow.

Intake loads the policy question and source material.  
Review sends the case to specialist agents such as compliance, security, legal, and data operations.  
Challenge uses a reviewer agent to test weak claims, missing caveats, and unsupported conclusions.  
Synthesis merges specialist findings into a coherent answer.  
Verdict produces the final structured answer with citations and confidence.

POINT:

Point at the execution signatures and framework lanes.

SAY:

What changes is not the business task. What changes is the operating model.

LangGraph behaves like explicit workflow control. It is strong when we need branching, checkpoints, reviewer loops, and durable state.

OpenAI Agents SDK behaves like clean specialist handoffs. It is easy to understand and useful for product teams that want a fast path to agents, tools, and traces.

AG2 behaves like a conversation mesh. It is natural for debate and specialist challenge, but needs strong stopping rules.

CrewAI maps to a manager-and-crew model. It is easy to explain because tasks and roles are readable.

Semantic Kernel is the enterprise-governed pattern. It becomes attractive when controls and governance matter more than lightweight experimentation.

LlamaIndex is the event and evidence pipeline pattern. It is strong where retrieval and evidence flow matter.

Mastra is TypeScript-first and product-team friendly. It fits teams that want agent workflows close to app code.

PydanticAI is the typed-validation pattern. It is strong when structured outputs and reliable contracts matter.

POINT:

Point out Google A2A and MCP in the catalog if visible.

SAY:

I also included A2A and MCP as adjacent concepts. A2A is about remote agent interoperability. MCP is about tools and context. They complement orchestration, but they do not remove the need to choose how the workflow itself runs.

TAKEAWAY:

The framework choice determines the shape of collaboration: graph, handoff, debate, manager review, governed flow, event pipeline, app workflow, or typed validation.

TRANSITION:

Once I had the same workflow running across frameworks, the findings were not just about speed. The more important findings were about evidence, confidence, and governance.

---

## 7:00-11:00 - Key Findings: What Actually Matters

DEMO:

Move to execution signatures, comparison lanes, the Verdict stage, and the score/rationale area.

SAY:

Here are the findings I would emphasize from this experiment.

First: orchestration shape matters. A graph gives us explicit branching and reconvergence. A handoff chain gives us a clean baton pass. A debate mesh gives us richer challenge but more variability. A typed workflow gives us stronger output guarantees.

These are different operating models, not just different SDKs.

SAY:

Second: evidence preservation matters more than raw speed.

For policy, compliance, contract review, risk analysis, and analytics use cases, the question is not just "did the agent answer?" The question is "did the final answer preserve the evidence and caveats that justify it?"

POINT:

Show the retention question or final verdict area.

SAY:

For example, the retention question should not simply say, "yes, GitHub can retain data." It needs the condition: retention may continue for contracts, legal obligations, disputes, or enforcement needs, and duration depends on purpose.

That conditional wording is the compliance value.

SAY:

Third: confidence varies by structure. PydanticAI is strong because validation forces the answer to keep required fields. LangGraph is strong because state and reviewer paths are explicit. AG2 is useful for debate, but the confidence is lower because conversation-heavy patterns introduce more noise unless tightly governed.

SAY:

Fourth: cost alone is not the decision driver. The token cost in this experiment is small compared with the delivery risk of choosing the wrong operating model. The bigger business question is: which framework gives us the reliability, observability, governance, and team fit we need?

DEMO:

Hover or point at the scorecard categories: latency, observability, replayability, human review, context loss, unsupported answer risk, error recovery, testability, and type safety.

SAY:

This page gives us better decision language. Instead of asking, "which framework is popular?", we can ask, "what failure mode are we trying to avoid?"

TAKEAWAY:

The real evaluation is not "which framework is fastest?" It is "which operating model reduces the risk of unsupported, untraceable, or hard-to-govern answers for this product use case?"

TRANSITION:

But choosing a framework does not solve everything. I found that teams still repeat the same domain behavior in prompts, helper code, reviewer instructions, and output validation. That is where Claude Skills come in.

---

## 11:00-14:00 - Claude Skills Lab: Packaging Reusable Capability

DEMO:

Click "Claude Skills Lab". Show the hero, then select LangGraph and OpenAI Agents SDK as examples.

SAY:

The Claude Skills Lab asks a different question. It does not replace the framework. It asks: what happens when the framework still owns orchestration, but the reusable capability is packaged as a Claude Skill?

In the framework-only version, each framework still needs local prompts, helper code, reviewer rubrics, evidence rules, and answer-shape instructions. That creates prompt glue. The same policy-grounding behavior gets copied across agents, nodes, handoffs, and validators.

In the skill-assisted version, the framework continues to own routing and runtime state. But the Claude Skill packages the repeatable behavior.

DEMO:

Scroll to the stage impact board: "Framework still owns" versus "Claude skill now packages."

SAY:

For this policy example, the skill layer packages four reusable capabilities.

GitHub Policy Intake identifies the question, scope, and target clauses.  
GitHub Clause Extractor returns the clause quote, clause id, and takeaway.  
GitHub Claim Reviewer challenges unsupported claims and adds caveats when policy wording is conditional.  
GitHub Verdict Guard requires verdict, clause ids, caveats, and confidence before the answer ships.

POINT:

Point at the side-by-side framework and skill columns.

SAY:

This is the clean mental model: the framework owns the route; the skill owns the reusable capability.

LangGraph can still branch. OpenAI Agents can still hand off. AG2 can still run debate. PydanticAI can still validate typed outputs. But the repeated policy-grounding logic no longer has to be reauthored everywhere.

DEMO:

Show "Framework alone vs framework with Claude skill" and the modeled execution delta.

SAY:

The modeled deltas show the pattern: prompt glue drops, output consistency improves, and reuse across tasks improves. The skill becomes the portable domain capability that can sit behind multiple frameworks.

TAKEAWAY:

Claude Skills do not replace orchestration frameworks. They package the domain capability that every framework otherwise keeps rewriting.

TRANSITION:

The Framework Lab helps compare execution models. The Skills Lab shows how to reduce duplicated capability. The Decision Lab turns those findings into a practical selection lens.

---

## 14:00-15:00 - Decision Lab: Turning Findings Into a Choice

DEMO:

Click "Decision Lab". Show the decision inputs: Runtime, Orchestration, Priority.

SAY:

The Decision Lab is the one-minute executive view. It asks: given our real constraints, which framework is the better fit?

The inputs are intentionally simple. Are we Python-first or TypeScript-first? Is the workflow simple, moderate, or advanced? Do we care most about shipping speed, reliability, enterprise governance, or product fit?

DEMO:

Toggle a few combinations, for example:

- Python + advanced + reliability.
- Python + simple + shipping speed.
- TypeScript + moderate + product fit.

SAY:

The matrix compares every framework across five criteria: Developer Experience, Agent Capabilities, Context and Memory, Deployment and Hosting, and Security and Compliance.

The same framework can be a good or bad fit depending on the product context. A regulated workflow values governance and replayability. A prototype values speed and developer experience. A structured extraction workflow values type safety and validation.

TAKEAWAY:

The right framework is conditional on runtime, complexity, and business priority. This page makes that tradeoff visible.

TRANSITION:

Now I want to close with production. Once we know the framework and the skill pattern, what do we need to safely run this for real users? That is where the updated Analytics Agent Lab and AgentCore come in.

---

## 15:00-20:00 - Analytics Agent Lab and AgentCore: Productionizing the Pattern

DEMO:

Click "Analytics Agent Lab". Start at the hero.

SAY:

The Analytics Agent Lab moves from framework comparison into a production-style analytics agent architecture.

The scenario is natural language to insight. A user selects a product line such as Simple Fund 360, CAS 360, or SmartDocs 360, asks a business question, and the agent turns that into a governed analytics workflow.

DEMO:

Show the product selector and business question selector. Pick one example:

- SF360 -> Investment Trends
- CAS360 -> Product Feedback
- SmartDocs -> Processing Bottleneck

POINT:

Point to the question card, the selected product skill, and the analytic table count.

SAY:

This is deliberately product-shaped. The agent is not a generic SQL bot. It is scoped by product domain, business question, governed schema knowledge, and a runtime boundary.

### 15:45-17:15 - Seven-Stage Pipeline

DEMO:

Step through the seven timeline stages.

SAY:

The pipeline has seven stages.

User Request opens the AgentCore session and identifies the request as analytics.  
Schema Discovery loads the product skill and uses AgentCore Gateway or MCP-style tools to discover authoritative table metadata.  
SQL Generation writes a SELECT query against governed analytic tables.  
Security Validation blocks unsafe SQL before it reaches Athena.  
Query Execution runs against S3-backed Athena tables and writes results back to S3.  
Analysis uses sandboxed Python to process the downloaded CSV and generate charts or summaries.  
Response returns the insight and keeps the session open for follow-up questions.

POINT:

Point to the right-hand knowledge panel as you move through stages.

SAY:

The updated lab makes the agent's active knowledge visible. Some stages use product-specific SKILL.md guidance. Some use global CLAUDE.md policy, such as SELECT-only SQL, output paths, and sandboxed Python conventions. Schema discovery relies on governed MCP/Gateway tools rather than guesswork.

TAKEAWAY:

The demo is showing not just a flow, but where the agent's knowledge comes from at each stage.

### 17:15-18:15 - Stage Ownership: Agent vs Gateway vs Data Foundation

DEMO:

On each pipeline step, point to the "Stage ownership" cards.

SAY:

The newer piece I want to call out is stage ownership. Each step now shows who is active across three layers: Agent, MCP or Gateway, and Data Foundation.

At User Request, the agent is active, Gateway is idle, and no tables are touched.  
At Schema Discovery, all three layers become active: the agent chooses the product skill, Gateway exposes catalog tools, and the data foundation returns table names, columns, owners, partitions, freshness, and profile stats.  
At SQL Generation, the agent composes a SELECT, while the data foundation constrains validity through pre-built views and typed columns.  
At Security Validation, the agent submits SQL but does not self-approve it. The validation gate protects Athena and S3.  
At Query Execution, Athena and S3 are active, while the agent orchestrates and downloads the result file.  
At Analysis, the agent writes sandboxed Python against the downloaded result.  
At Response, the agent explains the result and preserves session context for follow-ups.

POINT:

Point at the Agent, MCP/Gateway, and Data Foundation ownership cards side by side.

SAY:

This is important because production agent systems fail when ownership is blurry. If the agent owns business rules, schema authority, SQL safety, and data execution all at once, the system becomes hard to govern.

The ownership cards make the architecture explainable: the agent handles language and orchestration, Gateway handles governed tools, and the data foundation remains the source of truth.

TAKEAWAY:

Production readiness depends on clear ownership boundaries, not just a smarter model.

### 18:15-19:00 - Separation of Concerns and Anti-Patterns

DEMO:

Scroll to "Separation of Concerns", then "Best Practices / Anti-Patterns."

SAY:

The separation of concerns is the heart of this page.

The data foundation layer, S3 plus Athena, owns deterministic business logic: typed tables, partitioned Parquet, KPI definitions, compliance thresholds, joins, aggregations, Glue catalog metadata, and the single source of truth.

The agent layer owns language and orchestration: understanding the user question, loading the right skill, calling governed schema tools, writing basic SELECT statements, executing Python safely, and summarizing the result.

SAY:

The anti-pattern is letting the agent own joins, aggregations, business rules, and raw data handling. That creates drift, risk, and non-determinism.

POINT:

Point to the best practices and the paired anti-patterns.

SAY:

The best practices are practical:

Put business logic in Athena views, not prompts.  
Bypass the context window for result sets by using S3 and the file system.  
Use one skill per product domain.  
Gate every query through a security layer.  
Ground schema knowledge in governed metadata through AgentCore Gateway and MCP tools.  
Keep sessions open for multi-turn analysis.

TAKEAWAY:

The agent should not become the data platform. It should sit on top of governed data and tool boundaries.

### 19:00-20:00 - Why AgentCore Matters

DEMO:

Scroll to "Why AgentCore for production analytics agents."

SAY:

This is where AgentCore helps close the production gap.

AgentCore does not choose the framework for us, and it does not replace skills. Its value is the production runtime around the agent.

AgentCore Runtime gives us stateful execution, so a user can ask a follow-up like "now break that down by quarter" without starting from scratch.

Session isolation gives each user a separated execution environment, reducing cross-user data leakage risk.

Identity-based access control means the agent operates within the user's permissions instead of creating a separate shadow permission model.

Sandboxed code execution means the agent can run Python for charts and analysis without uncontrolled access to production systems.

AgentCore Gateway helps expose governed tools, including schema discovery and table profiling, so the agent asks the data platform for authoritative metadata instead of guessing.

POINT:

Point to the four AgentCore feature cards: Persistence, Security, Compliance, Safety.

SAY:

That gives us the complete pattern.

Frameworks define how agents collaborate.  
Claude Skills package repeatable domain capability.  
AgentCore provides the production runtime, identity, Gateway, session isolation, and sandboxed execution.

FINAL CLOSE:

The reason this experiment matters is that agent architecture is moving from demos to operating systems for business workflows.

The question is no longer just "can the model answer?" The question is: can the system preserve evidence, enforce governance, reuse capability, and run safely for real users?

My takeaway is that we should not choose an agent framework in isolation. We should choose the orchestration model, package reusable capability as skills, and run it inside a governed production runtime like AgentCore.

TAKEAWAY:

That is the architecture path this experiment points toward.

---

## Page-by-Page Takeaways

### Framework Lab

SAY:

The framework determines the agent operating model. Use this page to compare orchestration style, evidence preservation, confidence, observability, replayability, and risk.

### Claude Skills Lab

SAY:

Skills package the reusable behavior that otherwise gets duplicated across prompts, agents, helper code, and validators. The framework owns control flow; the skill owns capability.

### Decision Lab

SAY:

The best framework depends on runtime, complexity, and priority. Use this page to discuss tradeoffs rather than forcing a universal winner.

### Analytics Agent Lab

SAY:

The production pattern is separation of concerns: deterministic data logic in S3/Athena, language orchestration in the agent, governed schema tools through Gateway, and safe runtime execution through AgentCore.

POINT:

In the updated Analytics Lab, emphasize the Stage ownership cards. They make it clear when the Agent is active, when MCP/Gateway is active, and when the Data Foundation is active.

---

## Backup Q&A

### Q: Are you saying one framework is the winner?

SAY:

No. The experiment shows fit by use case. LangGraph is strong for advanced stateful workflows. OpenAI Agents SDK is strong for product-speed handoffs. Semantic Kernel is strong for enterprise governance. PydanticAI is strong for typed reliability. The right answer depends on the product workflow and failure mode we care about.

### Q: Why use a policy task for the framework comparison?

SAY:

Policy review is a good benchmark because it forces evidence, caveats, specialist review, and final confidence. Those are the same reliability concerns we see in contract review, compliance, risk, and analytics.

### Q: What did the experiment reveal that a framework comparison table would not?

SAY:

It revealed execution behavior. We can see how state moves, where evidence is preserved or compressed, how reviewer loops work, how confidence changes, and which frameworks need more governance around them.

### Q: Do Claude Skills replace frameworks?

SAY:

No. Skills package reusable capability. The framework still decides routing, state, handoffs, event flow, validation, or debate. Skills make domain behavior portable across those execution models.

### Q: Why does AgentCore matter if we already have a framework?

SAY:

Frameworks help define agent collaboration. AgentCore addresses production runtime concerns: stateful sessions, identity, session isolation, governed tool access, and sandboxed code execution.

### Q: What is new or important in the Analytics Agent Lab?

SAY:

The Analytics Lab now makes ownership explicit. At each pipeline step, we can see what the agent owns, what MCP or Gateway owns, and what the data foundation owns. That makes the architecture easier to explain, govern, and productionize.

### Q: What is the practical next step for our team?

SAY:

Pick one high-value workflow, identify the failure mode we care about most, choose one or two candidate frameworks, package the reusable domain behavior as a skill, and validate it inside a governed runtime pattern before scaling.

### Q: How should product leaders think about ROI?

SAY:

The ROI is reduced architecture rework and reduced operational risk. The lab helps us avoid committing too early to a framework that looks good in a demo but does not match our governance, reliability, or product constraints.

### Q: Where should we be cautious?

SAY:

We should avoid treating prompts as the source of business rules, avoid loading large data into context windows, avoid ungoverned schema discovery, avoid skipping SQL validation, and avoid choosing frameworks based only on popularity or speed.

---

## Demo Flow Checklist

1. DEMO: Open Framework Lab hero and frame the experiment.
2. DEMO: Scroll to framework catalog and name the operating models.
3. DEMO: Step through Intake, Review, Challenge, Synthesis, Verdict.
4. DEMO: Show final verdict and score/rationale area.
5. DEMO: Open Claude Skills Lab and show "framework still owns" vs "skill now packages."
6. DEMO: Open Decision Lab and toggle runtime/priority combinations.
7. DEMO: Open Analytics Agent Lab and select a product/question.
8. DEMO: Step through the seven-stage pipeline.
9. DEMO: Point to the active knowledge panel: SKILL.md, CLAUDE.md, Gateway/MCP.
10. DEMO: Point to Stage ownership cards: Agent, MCP/Gateway, Data Foundation.
11. DEMO: Scroll to Separation of Concerns and Best Practices / Anti-Patterns.
12. DEMO: Close on AgentCore feature cards.

---

## Short Version If Time Runs Over

SAY:

If I had to compress the whole presentation into one minute, I would say this:

I built this lab because agent framework choice is no longer just a developer preference. It changes how evidence moves, how review works, how confidence is produced, and how governable the system becomes.

The Framework Lab shows that each framework has a different operating model. The Claude Skills Lab shows that reusable domain capability should be packaged once rather than repeated across prompts and helper code. The Decision Lab turns that into a tradeoff conversation. The Analytics Agent Lab shows the production pattern: governed data, scoped skills, clear stage ownership, safe tool access, and AgentCore as the runtime boundary.

The point is not to crown one framework. The point is to choose deliberately, reuse capability, and productionize safely.

---

## Source Notes

Primary site:

- https://comparisonofagents.vercel.app/

Local source files used:

- `index.html`, `app.js`, and `traces/framework_traces.json` for Framework Lab content and metrics.
- `skills.html` and `skills.js` for Claude Skills Lab content.
- `decision.html`, `decision.js`, and `data/framework_metadata.json` for Decision Lab criteria and framework fit.
- `analytics.html` and `analytics.js` for the updated Analytics Agent Lab, including the active knowledge panel, seven-stage flow, stage ownership cards, separation of concerns, best practices, anti-patterns, and AgentCore feature cards.

AgentCore references:

- Amazon Bedrock AgentCore developer guide: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/develop-agents.html
- AgentCore Runtime code deployment: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-get-started-code-deploy.html
- AgentCore Gateway MCP server targets: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-target-MCPservers.html
- AgentCore Code Interpreter resource management: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/code-interpreter-resource-management.html
