from langchain_community.llms import Ollama
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import Runnable

MODEL = "llama3:instruct"
OLLAMA_URL = "http://localhost:11434"

llm = Ollama(model=MODEL, base_url=OLLAMA_URL)

prompt = ChatPromptTemplate.from_template("""
You are a legal assistant trained in Indian contract law.
Create a fair, clear, and legally sound contract based on this conversation:

--------------------
{conversation}
--------------------

Ensure the contract:
- Uses appropriate legal terms
- Is unbiased and professional
- Includes clear section headings
- Avoids ambiguity
- Does NOT use any markdown formatting (no **bold**, _italics_, etc.)
- Uses plain text with clear line breaks between sections

Respond only with the contract. No explanation needed.
""")

chain: Runnable = prompt | llm

def generate_contract(conversation: str) -> str:
    return chain.invoke({"conversation": conversation})


























# this is number 2

# app/ai_utils.py
# from langchain_community.llms import Ollama
# from langchain_core.prompts import ChatPromptTemplate
# from langchain_core.runnables import Runnable

# MODEL = "llama3:instruct"
# OLLAMA_URL = "http://localhost:11434"

# llm = Ollama(model=MODEL, base_url=OLLAMA_URL)

# prompt = ChatPromptTemplate.from_template("""
# You are a legal assistant trained in Indian contract law.

# Create a fair, clear, and legally sound SALES SERVICES contract based on this conversation:

# --------------------
# {conversation}
# --------------------

# STRICT FORMATTING RULES (very important):
# - Do NOT use Markdown. Absolutely no **bold**, no *italics*, no # headings.
# - Use <b>...</b> for bold section headings.
# - Use normal text for body.
# - Use line breaks as <br/> (self-closing).
# - For lists, use simple hyphen bullets like: "- Item text". (No numbering needed.)
# - Do not include any explanations before or after the contract. Output ONLY the contract body.

# The contract must include:
# - Title
# - Parties with placeholders in [BRACKETS] where needed
# - Definitions
# - Sales Approach
# - Co-Call Conduct
# - Obligations
# - Termination (with [NUMBER] days)
# - Governing Law (India)
# - Entire Agreement
# - Amendments
# - Signature blocks with [DATE]
# """)

# chain: Runnable = prompt | llm

# def generate_contract(conversation: str) -> str:
#     return chain.invoke({"conversation": conversation})
