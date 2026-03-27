"""
LlamaIndex Workflows — Policy Checker · Streamlit Frontend
"""

import streamlit as st
from agents import run_pipeline

st.set_page_config(
    page_title="Policy Checker · LlamaIndex",
    page_icon="⚖️",
    layout="centered",
)

st.title("Policy Checker — LlamaIndex Workflows")
st.caption(
    "Multi-agent pipeline · Intake → Specialists → Reviewer → Synthesis → Verdict"
)

question = st.text_area(
    "Enter a policy question",
    placeholder="e.g. Can employees retain company data after leaving the organisation?",
    height=120,
)

run_btn = st.button("Run Pipeline", type="primary", disabled=not question.strip())

if run_btn and question.strip():
    with st.spinner("Running pipeline — this may take 20–40 seconds…"):
        results = run_pipeline(question.strip())

    st.divider()

    with st.expander("Stage 1 · Intake", expanded=True):
        st.markdown(results["intake"])

    domain_labels = {
        "compliance": "Compliance",
        "legal": "Legal",
        "security": "Security",
        "data_ops": "Data Operations",
    }
    for domain, label in domain_labels.items():
        specialist_text = results["specialists"].get(domain, "_No result_")
        with st.expander(f"Stage 2 · Specialist — {label}"):
            st.markdown(specialist_text)

    with st.expander("Stage 3 · Reviewer Challenge"):
        st.markdown(results["reviewer"])

    with st.expander("Stage 4 · Synthesis"):
        st.markdown(results["synthesis"])

    st.subheader("Stage 5 · Verdict")
    verdict_text = results["verdict"]
    verdict_upper = verdict_text.upper()
    if verdict_upper.startswith("NON-COMPLIANT"):
        st.error(verdict_text)
    elif verdict_upper.startswith("CONDITIONAL"):
        st.warning(verdict_text)
    else:
        st.success(verdict_text)
