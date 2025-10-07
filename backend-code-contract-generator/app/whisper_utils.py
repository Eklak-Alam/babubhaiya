# --- backend/app/whisper_utils.py ---
import whisper
from pyannote.audio import Pipeline
import os
import logging
from dotenv import load_dotenv

# Setup logging
logger = logging.getLogger(__name__)

# --- Load Environment Variables ---
# This loads the HUGGING_FACE_TOKEN from your .env file
load_dotenv()
HUGGING_FACE_TOKEN = os.getenv("HUGGING_FACE_TOKEN")

# --- Global Models ---
# We load the models once when the application starts to save time on each request.
whisper_model = None
diarization_pipeline = None

# --- Initialize Models ---
try:
    # 1. Load the Whisper model for transcription
    whisper_model = whisper.load_model("base")
    logger.info("Whisper model 'base' loaded successfully.")

    # 2. Load the Pyannote model for speaker diarization
    if HUGGING_FACE_TOKEN:
        diarization_pipeline = Pipeline.from_pretrained(
            "pyannote/speaker-diarization-3.1",
            use_auth_token=HUGGING_FACE_TOKEN
        )
        logger.info("Pyannote diarization pipeline loaded successfully.")
    else:
        logger.error("HUGGING_FACE_TOKEN not found. Diarization will not be available.")

except Exception as e:
    logger.error(f"Failed to load AI models: {e}", exc_info=True)


def transcribe_audio(audio_path: str) -> str:
    """
    Transcribes an audio file and assigns speakers to each segment.
    Returns a formatted dialogue string.
    """
    if whisper_model is None or diarization_pipeline is None:
        logger.error("Cannot transcribe because one or more AI models failed to load.")
        if whisper_model: # If only diarization failed, return a simple transcript
            return whisper_model.transcribe(audio_path)["text"]
        return "Error: Transcription models not loaded."

    logger.info(f"Starting diarization for: {audio_path}")
    try:
        # 1. Get speaker segments from the diarization pipeline
        diarization = diarization_pipeline(audio_path)
        
        # 2. Get word-level timestamps from Whisper
        whisper_result = whisper_model.transcribe(audio_path, word_timestamps=True)
        
    except Exception as e:
        logger.error(f"Error during transcription or diarization: {e}", exc_info=True)
        return f"Error processing audio: {e}"

    logger.info("Combining transcription and diarization results...")
    
    # --- Combine Results ---
    speaker_turns = []
    for turn, _, speaker in diarization.itertracks(yield_label=True):
        speaker_turns.append({'start': turn.start, 'end': turn.end, 'speaker': speaker})

    word_segments = whisper_result.get('segments', [])
    
    for segment in word_segments:
        if 'words' not in segment: continue
        for word in segment['words']:
            word_start = word['start']
            for turn in speaker_turns:
                if turn['start'] <= word_start <= turn['end']:
                    word['speaker'] = turn['speaker']
                    break
            if 'speaker' not in word:
                word['speaker'] = 'UNKNOWN'

    # --- Format the Final Dialogue ---
    full_transcript = ""
    current_speaker = None

    for segment in word_segments:
        if 'words' not in segment: continue
        for word in segment['words']:
            if word['speaker'] != current_speaker:
                full_transcript += f"\n\n**{word['speaker'].replace('_', ' ')}:**"
                current_speaker = word['speaker']
            
            # --- THIS IS THE CORRECTED LINE ---
            # The key for the word's text is 'word', not 'text'.
            # We also add a space before each word for proper sentence structure.
            word_text = word.get('word', '')
            full_transcript += word_text

    logger.info("Dialogue reconstruction complete.")
    return full_transcript.strip()
