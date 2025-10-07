# File: ai-service/app.py
# Purpose: Add a new, more detailed prompt for deep analysis.

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import requests
import json

class AskRequest(BaseModel):
    history: str = ""
    question: str
    analysis_mode: bool = False # New flag to trigger deep analysis

app = FastAPI()

OLLAMA_API_URL = "http://localhost:11434/api/generate"

@app.post("/ask")
async def ask_ai(request: AskRequest):
    chat_history = request.history
    question = request.question

    if request.analysis_mode:
        # This is the new, more detailed prompt for deep analysis
        prompt = f"""
You are Accord, an advanced AI psychologist and communication analyst. Your task is to perform a deep, unbiased analysis of the following conversation. Do not take sides. Your analysis should be structured into three parts:

1.  **Interaction Summary:** Briefly summarize the main topics of discussion and who said what.
2.  **Emotional Tone Analysis:** Identify the underlying emotions (e.g., frustration, excitement, confusion) for each participant. Provide brief quotes as evidence.
3.  **Psychological Dynamics:** Analyze the communication patterns. Is one person more dominant? Is there a misunderstanding? Are there signs of collaboration or conflict?

**Conversation History:**
{chat_history}
---
Provide your analysis now:
"""
    else:
        # This is the original prompt for direct questions
        prompt = f"""
You are Accord, an AI assistant. Based on the conversation history, answer the user's question factually and concisely.

**Conversation History:**
{chat_history}
---
**User's Question:** "{question}"

Your response:
"""

    payload = { "model": "llama3:instruct", "prompt": prompt, "stream": False }

    try:
        response = requests.post(OLLAMA_API_URL, json=payload)
        response.raise_for_status()
        
        json_objects = [json.loads(line) for line in response.text.strip().split('\n') if line]
        ai_answer = json_objects[-1].get("response", "Sorry, I could not generate a response.")

        return {"answer": ai_answer}

    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Could not connect to the local AI model: {e}")
    except (json.JSONDecodeError, IndexError) as e:
        raise HTTPException(status_code=500, detail=f"Received an invalid response from the AI model: {e}")