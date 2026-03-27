# Policy Checker — PydanticAI Starter Kit

A multi-agent policy review pipeline built with **PydanticAI** and `gpt-4o-mini`.

Five stages run in sequence: **Intake → Specialists (concurrent) → Reviewer → Synthesis → Verdict**.
Each stage uses a dedicated `Agent` with a typed Pydantic `result_type`, ensuring structured, validated outputs at every step. Specialists run concurrently via `asyncio.gather`.

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
