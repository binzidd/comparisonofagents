# Policy Checker — LangGraph Starter Kit

A multi-agent policy review pipeline built with **LangGraph** and `gpt-4o-mini`.

Five stages run in sequence: **Intake → Specialists (parallel) → Reviewer → Synthesis → Verdict**.
Four specialist agents (Compliance, Legal, Security, Data Operations) analyse the policy question in parallel using LangGraph's `Send` API before a reviewer challenges their findings.

## Setup

1. **Clone / download** this directory and `cd` into it.
2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```
3. **Run the app**
   ```bash
   streamlit run app.py
   ```

> **Required:** Create a `.env` file in this directory containing:
> ```
> OPENAI_API_KEY=sk-...
> ```
