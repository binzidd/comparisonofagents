const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const htmlPath = path.join(root, "index.html");
const cssPath = path.join(root, "styles.css");
const jsPath = path.join(root, "app.js");
const tracePath = path.join(root, "traces", "framework_traces.json");

const requiredFiles = [htmlPath, cssPath, jsPath, tracePath];
requiredFiles.forEach((filePath) => {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing required file: ${path.basename(filePath)}`);
  }
});

const html = fs.readFileSync(htmlPath, "utf8");

const requiredIds = [
  "framework-catalog-cards",
  "stage-chip-row",
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

console.log("Static app verification passed.");
