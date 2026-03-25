# Agent-to-Agent Framework Comparison Lab

This is a lightweight prototype app for comparing agent-to-agent communication approaches using a shared multi-agent scenario.

## What it shows

- A curated comparison of direct A2A frameworks/protocols and adjacent standards
- A shared scenario with a principal agent coordinating specialist agents
- Visual control-flow playback for debate, challenge, and convergence
- Pros, cons, and architecture guidance for supervisor-plus-specialist designs

## Open locally

Because this prototype is dependency-free, you can open [`index.html`](./index.html) directly in a browser.

If you prefer serving it locally:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Suggested next upgrades

- Add richer framework metadata sourced from official docs
- Replace the static simulation with a real event log player
- Add sequence diagrams and side-by-side architecture views
- Introduce filtering by topology: supervisor, mesh, debate, marketplace
- Export comparison summaries for architecture reviews
