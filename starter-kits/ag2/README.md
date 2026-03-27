# Policy Checker — AG2 Starter Kit

A multi-agent policy review pipeline built with **AG2 (AutoGen v2)** and `gpt-4o-mini`.

Five stages run in sequence: **Intake → Specialists (GroupChat) → Reviewer → Synthesis → Verdict**.
The four specialist agents (Compliance, Legal, Security, Data Operations) participate in a `GroupChat` with round-robin selection. Each subsequent stage uses a focused single-turn `AssistantAgent` + `UserProxyAgent` chat.

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
