# Policy Checker - Claude Agent SDK Starter Kit

A multi-stage policy review pipeline built with **Claude Agent SDK**.

Five stages run through one live Claude session: **Intake -> Specialists -> Reviewer -> Synthesis -> Verdict**. The SDK owns the session, streaming response loop, custom agent definitions, and permission boundary.

## Setup

1. Install Claude Code and authenticate it for the environment where this app will run.
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Run the app:
   ```bash
   streamlit run app.py
   ```

Optional environment settings:

```bash
CLAUDE_AGENT_MODEL=sonnet
```

The starter uses `allowed_tools=[]` and `permission_mode="dontAsk"` so the default policy checker stays read-only inside the SDK session.
