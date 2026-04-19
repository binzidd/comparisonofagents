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

const runtimeOptions = [
  { id: "python", label: "Python" },
  { id: "typescript", label: "TypeScript" },
  { id: "any", label: "Any" }
];

const complexityOptions = [
  { id: "simple", label: "Simple" },
  { id: "moderate", label: "Moderate" },
  { id: "advanced", label: "Advanced" }
];

const priorityOptions = [
  { id: "speed", label: "Shipping Speed" },
  { id: "reliability", label: "Reliability" },
  { id: "enterprise", label: "Enterprise" },
  { id: "product", label: "Product Fit" }
];

const criterionDefinitions = {
  "Developer Experience": "How quickly a team can understand, build, debug, and maintain workflows in this framework.",
  "Agent Capabilities": "How strong the framework is at orchestration patterns like branching, review loops, tool use, and multi-agent coordination.",
  "Context & Memory": "How well the framework preserves state, supports checkpoints or durable memory, and avoids dropping important context.",
  "Deployment & Hosting": "How practical the framework is to host, scale, and fit into common production environments.",
  "Security & Compliance": "How well the framework supports governance, controls, auditable behavior, and enterprise-oriented safety requirements."
};

const sharedScenario = "Shared scenario: answer one GitHub privacy-policy question through Intake, Review, Challenge, Synthesis, and Verdict.";

let selectedRuntime = "python";
let selectedComplexity = "moderate";
let selectedPriority = "reliability";
let selectedFrameworkId = "langgraph";
let metadata = null;

let decisionSupport;
let runtimeRow;
let complexityRow;
let priorityRow;
let decisionResults;
let matrixSupport;
let criteriaMatrix;
let frameworkMetadataRow;
let decisionRationaleBoard;
let decisionTooltip;
let footerLikeBtn;
let footerLikeCount;

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

async function loadMetadata() {
  const res = await fetch("./data/framework_metadata.json", { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Metadata load failed: ${res.status}`);
  }
  metadata = await res.json();
}

function frameworks() {
  return metadata?.frameworks || [];
}

function getFramework(id = selectedFrameworkId) {
  return frameworks().find((item) => item.id === id) || frameworks()[0];
}

function scoreFramework(framework) {
  let score = 0;
  if (selectedRuntime === "any" || framework.runtime === selectedRuntime) score += 2;
  if (framework.best_for.includes(selectedComplexity)) score += 2;
  if (framework.best_for.includes(selectedPriority)) score += 2;
  score += framework.criteria_scores["Developer Experience"] >= 4 && selectedPriority === "speed" ? 1 : 0;
  score += framework.criteria_scores["Context & Memory"] >= 4 && selectedPriority === "reliability" ? 1 : 0;
  score += framework.criteria_scores["Security & Compliance"] >= 4 && selectedPriority === "enterprise" ? 1 : 0;
  score += framework.criteria_scores["Deployment & Hosting"] >= 4 && selectedPriority === "product" ? 1 : 0;
  return score;
}

function orderedFrameworks() {
  return [...frameworks()].sort((a, b) => scoreFramework(b) - scoreFramework(a));
}

function criterionRank(criterion, frameworkId) {
  const framework = frameworks().find((item) => item.id === frameworkId);
  const higher = frameworks().filter((item) => item.criteria_scores[criterion] > framework.criteria_scores[criterion]).length;
  return higher + 1;
}

function topCriteria(framework) {
  return metadata.criteria
    .map((criterion) => ({ criterion, score: framework.criteria_scores[criterion] }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 2);
}

function lowCriteria(framework) {
  return metadata.criteria
    .map((criterion) => ({ criterion, score: framework.criteria_scores[criterion] }))
    .sort((a, b) => a.score - b.score)
    .slice(0, 2);
}

function scoreBreakdown(framework) {
  const runtimeMatch = selectedRuntime === "any" || framework.runtime === selectedRuntime;
  const complexityMatch = framework.best_for.includes(selectedComplexity);
  const priorityMatch = framework.best_for.includes(selectedPriority);
  const bonusMap = {
    speed: "Developer Experience",
    reliability: "Context & Memory",
    enterprise: "Security & Compliance",
    product: "Deployment & Hosting"
  };
  const bonusCriterion = bonusMap[selectedPriority];
  const bonus = framework.criteria_scores[bonusCriterion] >= 4;

  return [
    {
      label: "Runtime match",
      value: runtimeMatch ? "+2" : "+0",
      detail: runtimeMatch ? `${framework.runtime} matches the selected runtime.` : `${framework.runtime} does not match the selected runtime.`
    },
    {
      label: "Complexity fit",
      value: complexityMatch ? "+2" : "+0",
      detail: complexityMatch ? `${framework.name} is tagged for ${selectedComplexity} orchestration.` : `${framework.name} is not a primary fit for ${selectedComplexity} orchestration.`
    },
    {
      label: "Priority fit",
      value: priorityMatch ? "+2" : "+0",
      detail: priorityMatch ? `${framework.name} is explicitly tagged for ${selectedPriority}.` : `${framework.name} is not one of the strongest fits for ${selectedPriority}.`
    },
    {
      label: `${bonusCriterion} bonus`,
      value: bonus ? "+1" : "+0",
      detail: bonus ? `${framework.name} scores 4 or 5 on ${bonusCriterion}.` : `${framework.name} does not get the extra bonus on ${bonusCriterion}.`
    }
  ];
}

function metricDots(score) {
  return new Array(5)
    .fill(0)
    .map((_, index) => `<span class="noise-dot ${index < score ? "active" : ""}"></span>`)
    .join("");
}

function renderChipRow(root, options, selectedId, onSelect) {
  root.innerHTML = options
    .map((option) => `
      <button class="chip decision-chip ${option.id === selectedId ? "active" : ""}" type="button" data-id="${option.id}">
        ${option.label}
      </button>
    `)
    .join("");
  root.querySelectorAll("[data-id]").forEach((button) => {
    button.addEventListener("click", () => onSelect(button.dataset.id));
  });
}

function renderControls() {
  decisionSupport.textContent = `${sharedScenario} This page explains which framework is the best fit before you open the full execution trace.`;
  renderChipRow(runtimeRow, runtimeOptions, selectedRuntime, (id) => {
    selectedRuntime = id;
    render();
  });
  renderChipRow(complexityRow, complexityOptions, selectedComplexity, (id) => {
    selectedComplexity = id;
    render();
  });
  renderChipRow(priorityRow, priorityOptions, selectedPriority, (id) => {
    selectedPriority = id;
    render();
  });
}

function renderRecommendations() {
  const ranked = orderedFrameworks();
  const top = ranked.slice(0, 3);
  if (!top.find((item) => item.id === selectedFrameworkId)) {
    selectedFrameworkId = top[0].id;
  }

  decisionResults.innerHTML = top
    .map((framework, index) => `
      <article class="decision-result-card ${index === 0 ? "top-pick" : ""}" style="--framework-color:${framework.color}">
        <div class="decision-result-head">
          <div>
            <span class="eyebrow">${index === 0 ? "Top Pick" : `Option ${index + 1}`}</span>
            <h3>${framework.name}</h3>
          </div>
          <span class="capability-pattern">${framework.runtime}</span>
        </div>
        <p>${sharedScenario} ${framework.name} is a strong fit when ${selectedPriority} matters most.</p>
        <div class="decision-result-pills">
          <span class="summary-pill">Match score: ${scoreFramework(framework)}</span>
          <span class="summary-pill">Best for: ${framework.best_for.join(", ")}</span>
        </div>
        <div class="decision-result-pills">
          ${topCriteria(framework).map((item) => `<span class="summary-pill">Strength: ${item.criterion}</span>`).join("")}
          ${lowCriteria(framework).map((item) => `<span class="summary-pill">Watch: ${item.criterion}</span>`).join("")}
        </div>
        <div class="decision-result-actions">
          <button
            class="secondary-btn compact"
            type="button"
            data-framework-pick="${framework.id}"
            data-tooltip-title="${framework.name} · Recommendation"
            data-tooltip-def="This card combines runtime match, orchestration fit, priority fit, and one bonus criterion tied to your selected priority."
            data-tooltip-reason="Why it scored ${scoreFramework(framework)}: ${scoreBreakdown(framework).map((item) => `${item.label} ${item.value}`).join(', ')}."
            data-tooltip-rank="Currently ranked ${index + 1} of ${frameworks().length} for this specific decision setup."
            data-tooltip-strengths="${topCriteria(framework).map((item) => item.criterion).join(', ')}"
            data-tooltip-weaknesses="${lowCriteria(framework).map((item) => item.criterion).join(', ')}">Why this fit?</button>
          <a class="secondary-btn compact decision-link-btn" href="./index.html?framework=${framework.id}">Open in Framework Lab</a>
        </div>
      </article>
    `)
    .join("");

  decisionResults.querySelectorAll("[data-framework-pick]").forEach((button) => {
    button.addEventListener("click", () => {
      selectedFrameworkId = button.dataset.frameworkPick;
      renderMetadataControls();
      renderDecisionRationale();
      decisionRationaleBoard.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

function renderCriteriaMatrix() {
  matrixSupport.textContent = `${sharedScenario} Hover any score to see why it landed there and how it compares with the rest of the framework pool.`;
  const criteria = metadata.criteria;
  criteriaMatrix.innerHTML = `
    <thead>
      <tr>
        <th>Framework</th>
        ${criteria.map((criterion) => `<th>${criterion}</th>`).join("")}
      </tr>
    </thead>
    <tbody>
      ${frameworks().map((framework) => `
        <tr>
          <td><button class="matrix-framework-btn" type="button" data-matrix-framework="${framework.id}">${framework.name}</button></td>
          ${criteria.map((criterion) => `
            <td>
              <div
                class="matrix-score-cell"
                data-tooltip-title="${framework.name} · ${criterion}"
                data-tooltip-def="${criterionDefinitions[criterion]}"
                data-tooltip-reason="${framework.criteria_notes[criterion]}"
                data-tooltip-rank="Ranked ${criterionRank(criterion, framework.id)} of ${frameworks().length} in the current framework pool."
                data-tooltip-strengths="${topCriteria(framework).map((item) => item.criterion).join(', ')}"
                data-tooltip-weaknesses="${lowCriteria(framework).map((item) => item.criterion).join(', ')}"
                tabindex="0">
                <div class="noise-dot-row">${metricDots(framework.criteria_scores[criterion])}</div>
              </div>
            </td>
          `).join("")}
        </tr>
      `).join("")}
    </tbody>
  `;

  criteriaMatrix.querySelectorAll("[data-matrix-framework]").forEach((button) => {
    button.addEventListener("click", () => {
      selectedFrameworkId = button.dataset.matrixFramework;
      renderMetadataControls();
      renderDecisionRationale();
      decisionRationaleBoard.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

function renderMetadataControls() {
  frameworkMetadataRow.innerHTML = frameworks()
    .map((framework) => `
      <button
        class="chip decision-chip ${framework.id === selectedFrameworkId ? "active" : ""}"
        type="button"
        data-framework-id="${framework.id}">
        ${framework.name}
      </button>
    `)
    .join("");

  frameworkMetadataRow.querySelectorAll("[data-framework-id]").forEach((button) => {
    button.addEventListener("click", () => {
      selectedFrameworkId = button.dataset.frameworkId;
      renderMetadataControls();
      renderDecisionRationale();
    });
  });
}

function listMarkup(items) {
  return items.map((item) => `<span class="starter-file-chip">${item}</span>`).join("");
}

function renderDecisionRationale() {
  const framework = getFramework();
  const breakdown = scoreBreakdown(framework);
  decisionRationaleBoard.innerHTML = `
    <article class="metadata-card" style="--framework-color:${framework.color}">
      <div class="capability-card-head">
        <div>
          <p class="eyebrow">Why This Decision</p>
          <h3>${framework.name} scores ${scoreFramework(framework)} for this GitHub policy checker</h3>
        </div>
      </div>
      <div class="decision-breakdown-list">
        ${breakdown.map((item) => `
          <article class="decision-breakdown-row">
            <strong>${item.label}</strong>
            <span>${item.value}</span>
            <p>${item.detail}</p>
          </article>
        `).join("")}
      </div>
    </article>
    <article class="metadata-card" style="--framework-color:${framework.color}">
      <div class="capability-card-head">
        <div>
          <p class="eyebrow">Relative To The Pool</p>
          <h3>Where it stands in this framework set</h3>
        </div>
      </div>
      <div class="metadata-chip-group">${listMarkup(topCriteria(framework).map((item) => `${item.criterion} (${item.score}/5)`))}</div>
      <p>Best relative strengths: ${topCriteria(framework).map((item) => item.criterion).join(" and ")}.</p>
      <div class="metadata-chip-group">${listMarkup(lowCriteria(framework).map((item) => `${item.criterion} (${item.score}/5)`))}</div>
      <p class="metadata-risk">Main watchouts: ${lowCriteria(framework).map((item) => item.criterion).join(" and ")}.</p>
    </article>
    <article class="metadata-card" style="--framework-color:${framework.color}">
      <div class="capability-card-head">
        <div>
          <p class="eyebrow">Context Behind The Scores</p>
          <h3>What that means in this 5-stage run</h3>
        </div>
      </div>
      <div class="decision-context-block">
        <span>Context & Memory</span>
        <strong>${framework.memory.model}</strong>
        <p>${framework.criteria_notes["Context & Memory"]}</p>
      </div>
      <div class="decision-context-block">
        <span>Deployment & Hosting</span>
        <strong>${framework.deployment.fit}</strong>
        <p>${framework.deployment.tradeoff}</p>
      </div>
      <div class="decision-context-block">
        <span>Security & Compliance</span>
        <strong>${framework.security.fit}</strong>
        <p>${framework.security.tradeoff}</p>
      </div>
    </article>
    ${framework.performance_technique ? `
    <article class="metadata-card" style="--framework-color:${framework.color}">
      <div class="capability-card-head">
        <div>
          <p class="eyebrow">Performance Technique</p>
          <h3>How latency is reduced in this benchmark</h3>
        </div>
      </div>
      <div class="decision-context-block">
        <span>Optimisation applied</span>
        <strong>${framework.performance_technique}</strong>
        <p>The critical-path depth after specialist fan-out determines wall-clock time. Parallelising the reviewer challenge and preliminary synthesis removes one sequential LLM round-trip, and switching to async invocation allows the event loop to schedule concurrent work without blocking OS threads.</p>
      </div>
      <div class="metadata-chip-group">${listMarkup(framework.memory.strengths)}</div>
      <p class="metadata-risk">Memory watchouts: ${framework.memory.risks.join("; ")}.</p>
    </article>
    ` : ""}
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

function handleDecisionTooltipHover(e) {
  const target = e.target.closest("[data-tooltip-title]");
  if (!target) return;
  decisionTooltip.innerHTML = `
    <div class="metric-tooltip-label">${target.dataset.tooltipTitle}</div>
    <div class="metric-tooltip-def">${target.dataset.tooltipDef}</div>
    <div class="metric-tooltip-reason">${target.dataset.tooltipReason}</div>
    <div class="metric-tooltip-reason">${target.dataset.tooltipRank}</div>
    <div class="metric-tooltip-reason">Strengths in pool: ${target.dataset.tooltipStrengths}</div>
    <div class="metric-tooltip-reason">Weaknesses in pool: ${target.dataset.tooltipWeaknesses}</div>
  `;
  decisionTooltip.removeAttribute("hidden");
}

function handleDecisionTooltipOut(e) {
  if (!e.relatedTarget?.closest("[data-tooltip-title]")) {
    decisionTooltip.setAttribute("hidden", "");
  }
}

function handleDecisionTooltipMove(e) {
  const rect = decisionTooltip.getBoundingClientRect();
  const x = e.clientX + 14;
  const y = e.clientY - 36;
  decisionTooltip.style.left = `${Math.min(x, window.innerWidth - rect.width - 16)}px`;
  decisionTooltip.style.top = `${Math.max(4, y - rect.height)}px`;
}

function render() {
  renderControls();
  renderRecommendations();
  renderCriteriaMatrix();
  renderMetadataControls();
  renderDecisionRationale();
}

async function initApp() {
  decisionSupport = document.getElementById("decision-support");
  runtimeRow = document.getElementById("runtime-row");
  complexityRow = document.getElementById("complexity-row");
  priorityRow = document.getElementById("priority-row");
  decisionResults = document.getElementById("decision-results");
  matrixSupport = document.getElementById("matrix-support");
  criteriaMatrix = document.getElementById("criteria-matrix");
  frameworkMetadataRow = document.getElementById("framework-metadata-row");
  decisionRationaleBoard = document.getElementById("decision-rationale-board");
  decisionTooltip = document.getElementById("decision-tooltip");
  footerLikeBtn = document.getElementById("footer-like-btn");
  footerLikeCount = document.getElementById("footer-like-count");

  const required = [
    decisionSupport,
    runtimeRow,
    complexityRow,
    priorityRow,
    decisionResults,
    matrixSupport,
    criteriaMatrix,
    frameworkMetadataRow,
    decisionRationaleBoard,
    decisionTooltip,
    footerLikeBtn,
    footerLikeCount
  ];

  if (required.some((item) => !item)) {
    throw new Error("Missing DOM nodes for decision page.");
  }

  await loadMetadata();
  footerLikeBtn.addEventListener("click", toggleFooterLike);
  decisionResults.addEventListener("mouseover", handleDecisionTooltipHover);
  decisionResults.addEventListener("mouseout", handleDecisionTooltipOut);
  decisionResults.addEventListener("mousemove", handleDecisionTooltipMove);
  criteriaMatrix.addEventListener("mouseover", handleDecisionTooltipHover);
  criteriaMatrix.addEventListener("mouseout", handleDecisionTooltipOut);
  criteriaMatrix.addEventListener("mousemove", handleDecisionTooltipMove);
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
