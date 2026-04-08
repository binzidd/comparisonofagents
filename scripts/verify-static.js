const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const htmlPath = path.join(root, "index.html");
const skillsHtmlPath = path.join(root, "skills.html");
const decisionHtmlPath = path.join(root, "decision.html");
const cssPath = path.join(root, "styles.css");
const jsPath = path.join(root, "app.js");
const skillsJsPath = path.join(root, "skills.js");
const decisionJsPath = path.join(root, "decision.js");
const tracePath = path.join(root, "traces", "framework_traces.json");
const metadataPath = path.join(root, "data", "framework_metadata.json");

const requiredFiles = [htmlPath, skillsHtmlPath, decisionHtmlPath, cssPath, jsPath, skillsJsPath, decisionJsPath, tracePath, metadataPath];
requiredFiles.forEach((filePath) => {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing required file: ${path.basename(filePath)}`);
  }
});

const html = fs.readFileSync(htmlPath, "utf8");
const skillsHtml = fs.readFileSync(skillsHtmlPath, "utf8");
const decisionHtml = fs.readFileSync(decisionHtmlPath, "utf8");

const requiredIds = [
  "framework-catalog-cards",
  "stage-chip-row",
  "prev-stage-btn",
  "step-demo-btn",
  "framework-summary",
  "skeleton-caption",
  "skeleton-board",
  "scenario-headline",
  "scenario-support",
  "app-status",
  "comparison-lanes",
  "score-rationale"
];

const missingIds = requiredIds.filter((id) => !html.includes(`id="${id}"`));
if (missingIds.length > 0) {
  throw new Error(`Missing required HTML ids: ${missingIds.join(", ")}`);
}

if (!html.includes('<script src="./app.js" defer></script>')) {
  throw new Error("Expected deferred app.js script tag was not found.");
}

if (!html.includes('<link rel="stylesheet" href="./styles.css" />')) {
  throw new Error("Expected styles.css link tag was not found.");
}

const requiredSkillsIds = [
  "skills-headline",
  "skills-support",
  "skills-framework-row",
  "skills-summary-grid",
  "skills-comparison-grid",
  "skills-stage-board",
  "starter-pack-support",
  "starter-pack-grid",
  "agentcore-support",
  "agentcore-board"
];

const missingSkillsIds = requiredSkillsIds.filter((id) => !skillsHtml.includes(`id="${id}"`));
if (missingSkillsIds.length > 0) {
  throw new Error(`Missing required skills HTML ids: ${missingSkillsIds.join(", ")}`);
}

if (!skillsHtml.includes('<script src="./skills.js" defer></script>')) {
  throw new Error("Expected deferred skills.js script tag was not found.");
}

const requiredDecisionIds = [
  "decision-support",
  "runtime-row",
  "complexity-row",
  "priority-row",
  "decision-results",
  "matrix-support",
  "criteria-matrix",
  "framework-metadata-row",
  "metadata-board"
];

const missingDecisionIds = requiredDecisionIds.filter((id) => !decisionHtml.includes(`id="${id}"`));
if (missingDecisionIds.length > 0) {
  throw new Error(`Missing required decision HTML ids: ${missingDecisionIds.join(", ")}`);
}

if (!decisionHtml.includes('<script src="./decision.js" defer></script>')) {
  throw new Error("Expected deferred decision.js script tag was not found.");
}

console.log("Static app verification passed.");
