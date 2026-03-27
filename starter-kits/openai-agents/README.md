# Policy Checker — OpenAI Agents SDK Starter Kit

A multi-agent policy review pipeline built with **OpenAI Agents SDK** and `gpt-4o-mini`.

Five stages run in sequence: **Intake → Specialists (concurrent) → Reviewer → Synthesis → Verdict**.
Each stage is a discrete `Agent` object. Specialists run concurrently via `asyncio.gather`.

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
