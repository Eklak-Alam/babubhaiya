# app.py - Enhanced AI Service for Accord Chat with Rate Limiting
from flask import Flask, request, jsonify, Response
import requests
import json
import logging
import time
from datetime import datetime, timedelta
import re
from functools import wraps
import threading

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = Flask(__name__)

# Configuration
OLLAMA_API_URL = "http://localhost:11434/api/generate"
MAX_RESPONSE_LENGTH = 1500  # Reduced character limit
MAX_CHAT_HISTORY_LENGTH = 500000  # Maximum characters of chat history to process
MAX_PROMPT_LENGTH = 6000  # Maximum total prompt length
REQUEST_TIMEOUT = 100  # Reduced timeout for faster responses
RATE_LIMIT_REQUESTS = 10  # Max requests per minute per IP
RATE_LIMIT_WINDOW = 60  # Time window in seconds

# Rate limiting storage
rate_limit_data = {}
rate_lock = threading.Lock()

class AIService:
    def __init__(self):
        self.ollama_url = OLLAMA_API_URL
        self.model = "llama3:instruct"
    
    def truncate_chat_history(self, chat_data, max_length=MAX_CHAT_HISTORY_LENGTH):
        """Truncate chat history to prevent overly long prompts"""
        if not chat_data or len(chat_data) <= max_length:
            return chat_data
        
        # Keep the most recent part of the conversation (most relevant)
        truncated = chat_data[-max_length:]
        logger.info(f"Truncated chat history from {len(chat_data)} to {len(truncated)} characters")
        return f"...{truncated}"  # Indicate it was truncated
    
    def generate_prompt(self, chat_data, user_prompt, analysis_mode=False):
        """Generate appropriate prompt with optimized length"""
        
        # Truncate chat history to prevent overly long prompts
        truncated_chat = self.truncate_chat_history(chat_data)
        
        if analysis_mode:
            prompt = f"""
You are Accord, an AI communication analyst. Analyze this conversation briefly:

**Recent Messages:**
{truncated_chat}

**Analysis Focus:**
- Main topics discussed
- Conversation tone
- Key points

**Keep analysis concise (2-3 paragraphs max).**
"""
        elif truncated_chat:
            prompt = f"""
You are Accord, a helpful AI assistant.

**Recent Conversation:**
{truncated_chat}

**User's Message:**
{user_prompt}

**Guidelines:**
- Respond conversationally and helpfully
- Reference recent chat if relevant
- Keep response brief and focused
- Maximum 2-3 paragraphs

**Response:**
"""
        else:
            prompt = f"""
You are Accord, a helpful AI assistant.

**User's Question:**
{user_prompt}

**Please provide a concise, helpful response (1-2 paragraphs max).**
"""
        
        # Ensure prompt doesn't exceed maximum length
        if len(prompt) > MAX_PROMPT_LENGTH:
            excess = len(prompt) - MAX_PROMPT_LENGTH
            prompt = prompt[:MAX_PROMPT_LENGTH] + "\n[Content truncated due to length]"
            logger.warning(f"Prompt truncated by {excess} characters")
        
        return prompt
    
    def call_ollama(self, prompt):
        """Make request to Ollama API with timeout protection"""
        
        payload = {
            "model": self.model,
            "prompt": prompt,
            "stream": False,
            "options": {
                "temperature": 0.7,
                "top_p": 0.9,
                "num_predict": 500,  # Reduced for faster responses
                "repeat_penalty": 1.1,
            }
        }
        
        try:
            start_time = time.time()
            response = requests.post(self.ollama_url, json=payload, timeout=REQUEST_TIMEOUT)
            response_time = time.time() - start_time
            
            logger.info(f"Ollama response time: {response_time:.2f}s")
            
            if response.status_code != 200:
                logger.error(f"Ollama API error: {response.status_code}")
                return None, "AI service is temporarily unavailable. Please try again shortly."
            
            response_data = response.json()
            ai_response = response_data.get("response", "").strip()
            
            # Clean and truncate response
            ai_response = self.clean_response(ai_response)
            
            return ai_response, None
            
        except requests.exceptions.Timeout:
            logger.warning("Ollama request timeout")
            return None, "I'm taking too long to respond. Please try again with a shorter message or different question."
            
        except requests.exceptions.ConnectionError:
            logger.error("Cannot connect to Ollama service")
            return None, "AI service is currently offline. Please make sure Ollama is running."
            
        except requests.exceptions.RequestException as e:
            logger.error(f"Ollama request exception: {str(e)}")
            return None, "Temporary AI service issue. Please try again in a moment."
            
        except Exception as e:
            logger.error(f"Unexpected error calling Ollama: {str(e)}")
            return None, "An unexpected error occurred. Please try again."
    
    def clean_response(self, response):
        """Clean and format the AI response"""
        if not response:
            return "I couldn't generate a response. Please try again."
        
        # Remove excessive whitespace
        response = re.sub(r'\n\s*\n', '\n\n', response)
        
        # Truncate if too long
        if len(response) > MAX_RESPONSE_LENGTH:
            response = response[:MAX_RESPONSE_LENGTH].rsplit('.', 1)[0] + "..."
        
        return response.strip()

# Initialize AI service
ai_service = AIService()

def rate_limit(f):
    """Rate limiting decorator"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        # Get client IP
        client_ip = request.remote_addr
        
        current_time = time.time()
        
        with rate_lock:
            # Clean old entries
            for ip in list(rate_limit_data.keys()):
                if current_time - rate_limit_data[ip]['start_time'] > RATE_LIMIT_WINDOW:
                    del rate_limit_data[ip]
            
            # Check rate limit
            if client_ip not in rate_limit_data:
                rate_limit_data[client_ip] = {
                    'count': 1,
                    'start_time': current_time
                }
            else:
                rate_limit_data[client_ip]['count'] += 1
            
            request_count = rate_limit_data[client_ip]['count']
        
        if request_count > RATE_LIMIT_REQUESTS:
            logger.warning(f"Rate limit exceeded for IP: {client_ip}")
            return jsonify({
                'error': 'Rate limit exceeded',
                'message': f'Maximum {RATE_LIMIT_REQUESTS} requests per minute allowed',
                'retry_after': RATE_LIMIT_WINDOW
            }), 429
        
        return f(*args, **kwargs)
    return decorated_function

@app.before_request
def before_request():
    """Global request timing"""
    request.start_time = time.time()

@app.after_request
def after_request(response):
    """Log request completion time"""
    if hasattr(request, 'start_time'):
        response_time = time.time() - request.start_time
        logger.info(f"Request {request.method} {request.path} completed in {response_time:.2f}s - Status: {response.status_code}")
    
    # Add security headers
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['X-Frame-Options'] = 'DENY'
    
    return response

@app.route('/analyze', methods=['POST'])
@rate_limit
def analyze_chat():
    """
    Optimized chat analysis endpoint with rate limiting
    """
    try:
        # Validate request
        if not request.is_json:
            return jsonify({'error': 'Request must be JSON'}), 400
            
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No JSON data provided'}), 400
        
        chat_data = data.get('chat_data', '')
        user_prompt = data.get('user_prompt', '')
        analysis_mode = data.get('analysis_mode', False)
        
        # Validate required fields
        if not user_prompt:
            return jsonify({'error': 'Missing user_prompt'}), 400
        
        # Validate input lengths
        if len(user_prompt) > 1000:
            return jsonify({'error': 'User prompt too long (max 1000 characters)'}), 400
        
        if len(chat_data) > 10000:  # Absolute maximum
            return jsonify({'error': 'Chat history too long (max 10000 characters)'}), 400
        
        logger.info(f"AI Request - Prompt: {user_prompt[:80]}... | Chat history: {len(chat_data)} chars")
        
        # Generate prompt and get AI response
        prompt = ai_service.generate_prompt(chat_data, user_prompt, analysis_mode)
        ai_response, error = ai_service.call_ollama(prompt)
        
        if error:
            return jsonify({'response': error})
        
        # Calculate response time
        response_time = time.time() - request.start_time
        
        logger.info(f"AI Response generated in {response_time:.2f}s - Length: {len(ai_response)}")
        
        return jsonify({
            'response': ai_response,
            'metadata': {
                'response_time': round(response_time, 2),
                'response_length': len(ai_response),
                'timestamp': datetime.utcnow().isoformat()
            }
        })
        
    except Exception as e:
        logger.error(f"Unexpected error in /analyze: {str(e)}")
        return jsonify({
            'response': "Service temporarily unavailable. Please try again."
        }), 500

@app.route('/ask', methods=['POST'])
@rate_limit
def ask_ai():
    """
    Legacy endpoint with rate limiting
    """
    try:
        if not request.is_json:
            return jsonify({'error': 'Request must be JSON'}), 400
            
        data = request.get_json()
        history = data.get('history', '')
        question = data.get('question', '')
        analysis_mode = data.get('analysis_mode', False)
        
        if not question:
            return jsonify({'error': 'Missing question'}), 400
        
        # Validate input lengths
        if len(question) > 1000:
            return jsonify({'error': 'Question too long (max 1000 characters)'}), 400
        
        # Convert to new format
        prompt = ai_service.generate_prompt(history, question, analysis_mode)
        ai_response, error = ai_service.call_ollama(prompt)
        
        if error:
            return jsonify({'answer': error})
        
        return jsonify({'answer': ai_response})
        
    except Exception as e:
        logger.error(f"Error in /ask: {str(e)}")
        return jsonify({'answer': "Service temporarily unavailable. Please try again."})

@app.route('/health', methods=['GET'])
def health_check():
    """Enhanced health check endpoint"""
    health_data = {
        'status': 'healthy',
        'timestamp': datetime.utcnow().isoformat(),
        'service': 'Accord AI Service',
        'version': '2.0.0',
        'rate_limits': {
            'requests_per_minute': RATE_LIMIT_REQUESTS,
            'max_prompt_length': MAX_PROMPT_LENGTH,
            'max_response_length': MAX_RESPONSE_LENGTH
        }
    }
    
    try:
        # Quick Ollama connection test
        test_payload = {
            "model": "llama3:instruct",
            "prompt": "Say OK",
            "stream": False,
            "options": {"num_predict": 5}
        }
        
        start_time = time.time()
        response = requests.post(OLLAMA_API_URL, json=test_payload, timeout=5)
        response_time = time.time() - start_time
        
        health_data['ollama_connected'] = response.status_code == 200
        health_data['ollama_response_time'] = round(response_time, 2)
        health_data['ollama_status'] = 'connected' if health_data['ollama_connected'] else 'disconnected'
        
    except Exception as e:
        health_data.update({
            'ollama_connected': False,
            'ollama_status': f'error: {str(e)}',
            'ollama_response_time': None
        })
    
    return jsonify(health_data)

@app.route('/status', methods=['GET'])
def status():
    """Simple status endpoint"""
    return jsonify({
        'status': 'ok', 
        'service': 'Accord AI',
        'timestamp': datetime.utcnow().isoformat()
    })

@app.route('/', methods=['GET'])
def index():
    """Root endpoint with service information"""
    return jsonify({
        'service': 'Accord AI Service',
        'version': '2.0.0',
        'endpoints': {
            '/analyze': 'POST - Main AI analysis endpoint (rate limited)',
            '/ask': 'POST - Legacy AI endpoint (rate limited)',
            '/health': 'GET - Health check',
            '/status': 'GET - Simple status'
        },
        'rate_limits': {
            'requests_per_minute': RATE_LIMIT_REQUESTS,
            'max_request_size': '10KB'
        }
    })

@app.route('/limits', methods=['GET'])
def get_limits():
    """Endpoint to check current rate limits"""
    client_ip = request.remote_addr
    current_time = time.time()
    
    with rate_lock:
        if client_ip in rate_limit_data:
            data = rate_limit_data[client_ip]
            remaining_time = RATE_LIMIT_WINDOW - (current_time - data['start_time'])
            requests_used = data['count']
        else:
            remaining_time = RATE_LIMIT_WINDOW
            requests_used = 0
    
    return jsonify({
        'ip': client_ip,
        'requests_used': requests_used,
        'requests_allowed': RATE_LIMIT_REQUESTS,
        'window_seconds': RATE_LIMIT_WINDOW,
        'remaining_window_seconds': max(0, round(remaining_time)),
        'requests_remaining': max(0, RATE_LIMIT_REQUESTS - requests_used)
    })

# Error handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(405)
def method_not_allowed(error):
    return jsonify({'error': 'Method not allowed'}), 405

@app.errorhandler(429)
def rate_limit_exceeded(error):
    return jsonify({
        'error': 'Rate limit exceeded',
        'message': f'Maximum {RATE_LIMIT_REQUESTS} requests per minute allowed',
        'retry_after': RATE_LIMIT_WINDOW
    }), 429

@app.errorhandler(500)
def internal_error(error):
    logger.error(f"Internal server error: {error}")
    return jsonify({'error': 'Internal server error'}), 500

@app.errorhandler(413)
def too_large(error):
    return jsonify({'error': 'Request too large'}), 413

if __name__ == '__main__':
    logger.info("Starting Enhanced Accord AI Service...")
    
    # Quick Ollama health check
    try:
        test_response = requests.post(OLLAMA_API_URL, json={
            "model": "llama3:instruct",
            "prompt": "Test",
            "stream": False,
            "options": {"num_predict": 5}
        }, timeout=5)
        
        if test_response.status_code == 200:
            logger.info("✅ Ollama connection verified")
        else:
            logger.warning(f"⚠️ Ollama status: {test_response.status_code}")
            
    except Exception as e:
        logger.warning(f"⚠️ Ollama not available: {str(e)}")
    
    logger.info("🚀 AI Service starting with features:")
    logger.info(f"   • Rate limiting: {RATE_LIMIT_REQUESTS} requests/minute")
    logger.info(f"   • Request timeout: {REQUEST_TIMEOUT}s")
    logger.info(f"   • Max response length: {MAX_RESPONSE_LENGTH} chars")
    logger.info(f"   • Max chat history: {MAX_CHAT_HISTORY_LENGTH} chars")
    
    # Start Flask app
    app.run(
        host='0.0.0.0',
        port=5001,
        debug=False
    )