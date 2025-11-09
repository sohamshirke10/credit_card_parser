from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pdfplumber
from PyPDF2 import PdfReader
from io import BytesIO

from services.bank_detector import detect_bank
from services.parsers import get_parser
from services.utils import collapse_ws

app = FastAPI(title="Credit Card Statement Parser", version="1.0.0")

# Allow frontend later
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

def extract_text_from_pdf(file_bytes: bytes) -> str:
    # Try pdfplumber first
    try:
        with pdfplumber.open(BytesIO(file_bytes)) as pdf:
            text = "\n".join([p.extract_text() or "" for p in pdf.pages])
            if text.strip():
                return text
    except:
        pass

    # Fallback to PyPDF2
    try:
        reader = PdfReader(BytesIO(file_bytes))
        text = "\n".join([(p.extract_text() or "") for p in reader.pages])
        return text
    except:
        return ""

@app.get("/health")
def health():
    return {"ok": True}

@app.post("/parse")
async def parse_pdf(file: UploadFile = File(...)):
    if file.content_type not in ["application/pdf", "application/octet-stream"]:
        raise HTTPException(status_code=400, detail="Upload a PDF only.")

    file_bytes = await file.read()
    raw = extract_text_from_pdf(file_bytes)
    text = collapse_ws(raw)

    bank = detect_bank(text)
    parser = get_parser(bank)
    if parser is None:
        return {"error": f"Unsupported or undetected bank: {bank}"}

    result = parser.parse(text)
    return result
