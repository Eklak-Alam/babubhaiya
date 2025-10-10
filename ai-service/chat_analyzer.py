from flask import Flask, request, jsonify
import requests
import json

app = Flask(__name__)

# The URL of your local Llama3 model's API endpoint
LLAMA3_API_URL = "http://localhost:11434/api/generate"

@app.route('/analyze', methods=['POST'])
def analyze_chat():
    """
    Analyzes chat history with a local Llama3 model to generate a response.
    """
    data = request.get_json()
    chat_data = data.get('chat_data')
    user_prompt = data.get('user_prompt')

    if not chat_data or not user_prompt:
        return jsonify({'error': 'Missing chat_data or user_prompt'}), 400

    # Construct the prompt for Llama3 Instruct
    prompt = (
        "You are a helpful AI assistant in a group chat. "
        "Analyze the following chat history and answer the user's question. "
        "Your response should be concise and based only on the provided conversation context.\n\n"
        "--- CHAT HISTORY ---\n"
        f"{chat_data}\n\n"
        "--- USER'S QUESTION ---\n"
        f"{user_prompt}\n\n"
        "--- YOUR RESPONSE ---\n"
    )

    # Payload for the Llama3 API
    payload = {
        "model": "llama3:instruct",
        "prompt": prompt,
        "stream": False  # We want the full response at once
    }

    try:
        # Send the request to the local Llama3 model
        response = requests.post(LLAMA3_API_URL, json=payload)
        response.raise_for_status()  # Raise an exception for bad status codes

        # Extract the response content
        response_data = response.json()
        ai_response = response_data.get("response", "").strip()

        return jsonify({'response': ai_response})

    except requests.exceptions.RequestException as e:
        # Handle network-related errors
        error_message = f"Failed to connect to Llama3 model at {LLAMA3_API_URL}. Ensure the model is running and the URL is correct."
        print(f"Error: {error_message}\nDetails: {e}")
        return jsonify({'error': error_message}), 500
    except Exception as e:
        # Handle other potential errors
        print(f"An unexpected error occurred: {e}")
        return jsonify({'error': 'An unexpected error occurred while processing the request.'}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)