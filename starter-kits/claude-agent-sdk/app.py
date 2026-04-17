"""
Claude Agent SDK policy checker - Streamlit frontend.
"""

import streamlit as st

from agents import run_pipeline

st.set_page_config(
    page_title="Policy Checker - Claude Agent SDK",
    layout="centered",
)

st.title("Policy Checker - Claude Agent SDK")
st.caption("Claude session pipeline · Intake -> Specialists -> Reviewer -> Synthesis -> Verdict")

question = st.text_area(
    "Enter a policy question",
    placeholder="Can GitHub retain personal data after an account is closed?",
    height=120,
)

run_btn = st.button("Run Pipeline", type="primary", disabled=not question.strip())

if run_btn and question.strip():
    with st.spinner("Running the live Claude Agent SDK session..."):
        results = run_pipeline(question.strip())

    st.divider()

    with st.expander("Stage 1 · Intake", expanded=True):
        st.markdown(results["intake"])

    with st.expander("Stage 2 · Specialists"):
        st.markdown(results["specialists"])

    with st.expander("Stage 3 · Reviewer Challenge"):
        st.markdown(results["reviewer"])

    with st.expander("Stage 4 · Synthesis"):
        st.markdown(results["synthesis"])

    st.subheader("Stage 5 · Verdict")
    st.markdown(results["verdict"])
