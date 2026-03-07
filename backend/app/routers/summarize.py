"""
Summarize Router — AI + extraction services with auth + DB persistence
"""

from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.schemas import YouTubeRequest, SummaryResponse
from app.services.ai_service import generate_summary
from app.services.pdf_service import extract_text_from_pdf
from app.services.youtube_service import extract_transcript, TranscriptExtractionError
from app.auth import get_current_user
from app.database import get_db
from app.models.db_models import Summary

router = APIRouter()


@router.post("/youtube", response_model=SummaryResponse)
async def summarize_youtube(
    request: YouTubeRequest,
    user_id: str = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Extract transcript from YouTube video, summarize with Gemini, and save to DB."""
    try:
        transcript = await extract_transcript(request.url)
    except TranscriptExtractionError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc

    result = await generate_summary(transcript, source_type="youtube")

    # Save to database
    db.add(
        Summary(
            user_id=user_id,
            source_type="youtube",
            source_url=request.url,
            content_summary=result["summary"],
            action_items=result["action_items"],
        )
    )
    await db.commit()

    return SummaryResponse(
        summary=result["summary"],
        action_items=result["action_items"],
        source_type="youtube",
        source_name=request.url,
    )


@router.post("/pdf", response_model=SummaryResponse)
async def summarize_pdf(
    file: UploadFile = File(...),
    user_id: str = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Extract text from PDF, summarize with Gemini, and save to DB."""
    file_bytes = await file.read()

    try:
        text = await extract_text_from_pdf(file_bytes)
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc

    result = await generate_summary(text, source_type="pdf")

    # Save to database
    filename = file.filename or "uploaded.pdf"
    db.add(
        Summary(
            user_id=user_id,
            source_type="pdf",
            source_url=filename,
            content_summary=result["summary"],
            action_items=result["action_items"],
        )
    )
    await db.commit()

    return SummaryResponse(
        summary=result["summary"],
        action_items=result["action_items"],
        source_type="pdf",
        source_name=filename,
    )
