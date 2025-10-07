# Gaprio - AI Contract Generator & Negotiator

Gaprio is an AI-powered application that transforms spoken conversations into legally-aware contracts. It uses a multi-stage AI pipeline to transcribe audio, identify speakers, extract key legal terms, and generate a formal contract based on a knowledge base of Indian law.

## Features

* **Audio Transcription:** Converts audio files into text.
* **Speaker Diarization:** Identifies and labels different speakers in the conversation.
* **RAG-based Contract Generation:** Uses a Retrieval-Augmented Generation system with a knowledge base of Indian law to generate accurate contracts.
* **PDF Output:** Saves the final contract as a professional PDF document.

## How to Run

1.  **Set up the environment:**
    ```bash
    # Create and activate a virtual environment
    python -m venv venv
    .\venv\Scripts\activate

    # Install dependencies
    pip install -r requirements.txt
    ```
2.  **Build the Knowledge Base:**
    ```bash
    # Add your legal documents to the 'knowledge_base' folder
    python ingest.py
    ```
3.  **Run the Server:**
    ```bash
    uvicorn main:app --port 8001
    ```
