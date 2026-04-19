# Policy Checker - Claude Agent SDK Starter Kit

A multi-stage policy review pipeline built with **Claude Agent SDK**.

Five stages run through live Claude Agent SDK calls: **Intake -> Specialists -> Reviewer -> Synthesis -> Verdict**. The specialist reviews run concurrently with `asyncio.gather`; reviewer and preliminary synthesis also run in parallel before the final verdict step.

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

By default the starter keeps the simpler read-only session shape: the policy corpus is embedded in the prompt, `allowed_tools=[]`, and `permission_mode="dontAsk"`.

An optional experiment enables one in-process MCP tool, `get_policy_corpus`, annotated with `readOnlyHint=True`. When enabled, Claude can fetch the shared policy text through that read-only tool instead of carrying the full corpus in every prompt.

```bash
CLAUDE_AGENT_READ_ONLY_HINT=true
```

The tool-enabled path raises `max_turns` to `2` so Claude can call the tool and still answer.
