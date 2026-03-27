# Policy Checker — LlamaIndex Starter Kit

A multi-agent policy review pipeline built with **LlamaIndex Workflows** and `gpt-4o-mini`.

Five stages run in sequence: **Intake → Specialists (concurrent) → Reviewer → Synthesis → Verdict**.
Each stage is a typed `@step` in a `Workflow` class, connected by custom `Event` types. The four specialists run concurrently using `asyncio.gather` inside the specialist step.

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
