# Agent-to-Agent Framework Comparison Lab

This is a Vercel-ready static app that compares how agent frameworks handle one shared public-policy checking flow.

## What it shows

- A shared public policy corpus based on the GitHub General Privacy Statement
- Selectable policy questions with expected answers and evidence clauses
- Specialist agents for compliance, security, legal, and data operations
- Side-by-side framework comparisons with eval, performance, and context-loss considerations
- Business and technical explanation modes

## Local development

Run:

```bash
npm run check
npm run dev
```

Then open `http://localhost:8000`.

## Deploy to Vercel from GitHub

1. Push this repository to GitHub.
2. In Vercel, choose `Add New Project`.
3. Import the GitHub repository.
4. Keep the framework preset as `Other`.
5. Leave the build command empty.
6. Leave the output directory empty.
7. Deploy.

Vercel will serve the static files from the repository root using [`vercel.json`](./vercel.json).

## Verification

Run:

```bash
npm run check
```

This validates:

- `app.js` syntax
- required HTML mount points
- deferred script loading
- stylesheet wiring
