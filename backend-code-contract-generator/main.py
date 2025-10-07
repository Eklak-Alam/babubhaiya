from fastapi import FastAPI, UploadFile, File, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from app.whisper_utils import transcribe_audio
from app.ai_utils import generate_contract
from app.pdf_utils import save_contract_pdf
import shutil, os, logging
from datetime import datetime

# Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Voice-to-Contract Generator")

# CORS — list your actual frontends here
ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://localhost:8000",  # Swagger
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=False,  # keep False if you use "*"
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure folders exist
os.makedirs("audio", exist_ok=True)
os.makedirs("contracts", exist_ok=True)


@app.post("/generate_contract/")
async def contract_from_audio(request: Request, file: UploadFile = File(...)):
    try:
        # Save uploaded file with timestamp to avoid collisions
        ts = datetime.now().strftime("%Y%m%d_%H%M%S")
        safe_name = file.filename.replace("/", "_").replace("\\", "_")
        audio_path = os.path.join("audio", f"{ts}_{safe_name}")

        with open(audio_path, "wb") as f:
            shutil.copyfileobj(file.file, f)
        logger.info(f"Saved upload to {audio_path}")

        # Transcribe → generate contract
        transcript = transcribe_audio(audio_path)
        contract_text = generate_contract(transcript)

        # Save PDF (✅ pass only filename, not full path)
        pdf_filename = f"contract_{ts}.pdf"
        pdf_path = save_contract_pdf(contract_text, filename=pdf_filename)
        logger.info(f"PDF saved at {pdf_path}")

        # ✅ Ensure frontend gets just the filename
        pdf_filename = os.path.basename(pdf_path)

        # Build absolute URL for frontend
        contracts_url = request.url_for("contracts", path=pdf_filename)
        return {
            "message": "Contract generated successfully",
            "transcript": transcript,
            "contract_text": contract_text,
            "pdf_url": str(contracts_url),  # frontend can fetch/download
            "pdf_filename": pdf_filename,
        }

    except Exception as e:
        logger.exception("Error in contract generation")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/download_contract/{filename}")
async def download_contract(filename: str):
    file_path = os.path.join("contracts", filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(file_path, media_type="application/pdf", filename=filename)


# Static hosting for PDFs (name is used by url_for above)
app.mount("/contracts", StaticFiles(directory="contracts"), name="contracts")
