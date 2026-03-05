"""
Summarize Router — Wired to real AI + extraction services
"""

from fastapi import APIRouter, UploadFile, File, HTTPException
from app.models.schemas import YouTubeRequest, SummaryResponse
from app.services.ai_service import generate_summary
from app.services.pdf_service import extract_text_from_pdf
from app.services.youtube_service import extract_transcript, TranscriptExtractionError

router = APIRouter()


@router.post("/youtube", response_model=SummaryResponse)
async def summarize_youtube(request: YouTubeRequest):
    """Extract transcript from YouTube video, then summarize with Gemini."""
    try:
        transcript = await extract_transcript(request.url)
    except TranscriptExtractionError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc

    result = await generate_summary(transcript, source_type="youtube")

    return SummaryResponse(
        summary=result["summary"],
        action_items=result["action_items"],
        source_type="youtube",
        source_name=request.url,
    )


@router.post("/pdf", response_model=SummaryResponse)
async def summarize_pdf(file: UploadFile = File(...)):
    """Extract text from PDF, then summarize with Gemini."""
    file_bytes = await file.read()

    try:
        text = await extract_text_from_pdf(file_bytes)
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc

    result = await generate_summary(text, source_type="pdf")

    return SummaryResponse(
        summary=result["summary"],
        action_items=result["action_items"],
        source_type="pdf",
        source_name=file.filename or "uploaded.pdf",
    )
