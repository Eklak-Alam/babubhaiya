from flask import Flask, request, jsonify
import requests
import json

app = Flask(__name__)

# The URL of your local Llama3 model's API endpoint
OLLAMA_API_URL = "http://localhost:11434/api/generate"

@app.route('/analyze', methods=['POST'])
def analyze_chat():
    """
    Analyzes chat history with a local Llama3 model to generate a response.
    """
    data = request.get_json()
    chat_data = data.get('chat_data', '')
    user_prompt = data.get('user_prompt', '')

    if not user_prompt:
        return jsonify({'error': 'Missing user_prompt'}), 400

    # Construct the prompt for Llama3 Instruct
    if chat_data:
        prompt = (
            "You are Accord, a helpful AI assistant in a chat application. "
            "You've been tagged in a conversation. Use the context to provide a relevant answer.\n\n"
            "**Conversation Context:**\n"
            f"{chat_data}\n\n"
            "**Current Question/Directive:**\n"
            f"{user_prompt}\n\n"
            "**Instructions:**\n"
            "- If the question refers to the conversation history, use that context\n"
            "- If it's asking for analysis, summary, or insights about the conversation, provide that\n"
            "- If it's a general question not related to the history, answer based on your knowledge\n"
            "- Be conversational, helpful, and concise\n"
            "- If you need clarification, ask a follow-up question\n\n"
            "**Your response:**"
        )
    else:
        # No conversation history available
        prompt = (
            "You are Accord, a helpful AI assistant in a chat application. "
            "A user has tagged you with a question.\n\n"
            "**Question:**\n"
            f"{user_prompt}\n\n"
            "**Instructions:**\n"
            "- Be helpful, friendly, and conversational\n"
            "- Provide clear and concise answers\n"
            "- If the question is unclear, ask for clarification\n\n"
            "**Your response:**"
        )

    # Payload for the Ollama API
    payload = {
        "model": "llama3:instruct",
        "prompt": prompt,
        "stream": False,  # We want the full response at once
        "options": {
            "temperature": 0.7,
            "top_p": 0.9
        }
    }

    try:
        # Send the request to the local Ollama model
        response = requests.post(OLLAMA_API_URL, json=payload, timeout=30)
        response.raise_for_status()  # Raise an exception for bad status codes

        # Extract the response content
        response_data = response.json()
        ai_response = response_data.get("response", "").strip()

        return jsonify({'response': ai_response})

    except requests.exceptions.Timeout:
        return jsonify({'response': "I'm taking too long to respond. Please try again in a moment."})
    except requests.exceptions.RequestException as e:
        # Handle network-related errors
        error_message = f"Failed to connect to Ollama model at {OLLAMA_API_URL}. Ensure the model is running and the URL is correct."
        print(f"Error: {error_message}\nDetails: {e}")
        return jsonify({'response': "I'm having trouble connecting right now. Please try again later."})
    except Exception as e:
        # Handle other potential errors
        print(f"An unexpected error occurred: {e}")
        return jsonify({'response': "There was an error processing your request. Please try again."})

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint to verify the AI service is running"""
    try:
        # Test connection to Ollama
        test_payload = {
            "model": "llama3:instruct",
            "prompt": "Say 'OK' if you are working.",
            "stream": False
        }
        response = requests.post(OLLAMA_API_URL, json=test_payload, timeout=10)
        return jsonify({'status': 'healthy', 'ollama_connected': response.status_code == 200})
    except:
        return jsonify({'status': 'healthy', 'ollama_connected': False})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5002, debug=True)