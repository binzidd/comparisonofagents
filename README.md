# Agent-to-Agent Framework Comparison Lab

This is a Vercel-ready static app that compares how agent frameworks handle one shared policy-evaluation flow.

## What it shows

- A principal agent evaluating a customer data retention policy
- Specialist agents for compliance, security, legal, and finance
- A challenge agent that forces rebuttals before final approval
- Side-by-side animated framework comparisons
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
