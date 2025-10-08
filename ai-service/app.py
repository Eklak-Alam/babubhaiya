# File: ai-service/app.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import requests
import json
import re

class AskRequest(BaseModel):
    history: str = ""
    question: str
    analysis_mode: bool = False

app = FastAPI()

OLLAMA_API_URL = "http://localhost:11434/api/generate"

@app.post("/ask")
async def ask_ai(request: AskRequest):
    chat_history = request.history
    question = request.question.strip()

    if request.analysis_mode:
        # Deep analysis prompt
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
        # Check if this is a direct question or based on conversation history
        if chat_history:
            prompt = f"""
You are Accord, an AI assistant in a chat application. You've been tagged in a conversation.

**Conversation Context:**
{chat_history}

**Current Question/Directive:** {question}

**Instructions:**
- If the question refers to the conversation history, use that context to provide a relevant answer
- If it's asking for analysis, summary, or insights about the conversation, provide that
- If it's a general question not related to the history, answer based on your knowledge
- Be conversational, helpful, and concise
- If you need clarification, ask a follow-up question

**Your response:**
"""
        else:
            # No conversation history available
            prompt = f"""
You are Accord, an AI assistant in a chat application. A user has tagged you with a question.

**Question:** {question}

**Instructions:**
- Be helpful, friendly, and conversational
- Provide clear and concise answers
- If the question is unclear, ask for clarification

**Your response:**
"""

    payload = { 
        "model": "llama3:instruct", 
        "prompt": prompt, 
        "stream": False,
        "options": {
            "temperature": 0.7,
            "top_p": 0.9
        }
    }

    try:
        response = requests.post(OLLAMA_API_URL, json=payload, timeout=30)
        response.raise_for_status()
        
        json_objects = [json.loads(line) for line in response.text.strip().split('\n') if line]
        ai_answer = json_objects[-1].get("response", "Sorry, I could not generate a response.")

        return {"answer": ai_answer}

    except requests.exceptions.Timeout:
        return {"answer": "I'm taking too long to respond. Please try again in a moment."}
    except requests.exceptions.RequestException as e:
        return {"answer": "I'm having trouble connecting right now. Please try again later."}
    except (json.JSONDecodeError, IndexError) as e:
        return {"answer": "There was an error processing your request. Please try again."}