"""AI Assistant — RAG + Groq LLaMA 3.1"""
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
import tempfile, os
from pathlib import Path

from models.schemas import AIQueryRequest
from utils.auth import get_current_user, require_faculty
from rag.pipeline import rag

router = APIRouter()


@router.post("/ask")
async def ask(req: AIQueryRequest, current_user=Depends(get_current_user)):
    if not req.query.strip():
        raise HTTPException(status_code=400, detail="Query cannot be empty")
    try:
        result = rag.query(question=req.query, mode=req.mode)
        answer = result["answer"]

        # Translate if needed (free, no API key)
        if req.language != "en":
            from utils.translate import translate_text
            answer = await translate_text(answer, req.language)

        return {"answer": answer, "source_documents": result.get("sources", []), "mode": req.mode, "language": req.language}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/upload-doc")
async def upload_doc(file: UploadFile = File(...), current_user=Depends(require_faculty)):
    allowed = ["application/pdf",
               "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]
    if file.content_type not in allowed:
        raise HTTPException(status_code=400, detail="Only PDF and DOCX files supported")

    suffix = Path(file.filename).suffix
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        tmp.write(await file.read())
        tmp_path = tmp.name

    try:
        chunks = rag.index_documents(tmp_path)
        return {"status": "indexed", "filename": file.filename, "chunks": chunks}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        os.unlink(tmp_path)
