"""
Summarize Router — API Endpoints for Content Summarization
============================================================
This file defines the URL endpoints that the frontend will call.

WHAT IS A ROUTER?
- A Router groups related endpoints together
- Think of it as a "section" of your API
- It keeps main.py clean by separating route definitions into files

HOW IT WORKS:
- POST /api/summarize/pdf    → Upload a PDF file, get a summary back
- POST /api/summarize/youtube → Send a YouTube URL, get a summary back
  (The /api/summarize prefix is added in main.py when we include this router)
"""

from fastapi import APIRouter, UploadFile, File
from app.models.schemas import YouTubeRequest, SummaryResponse

# Create a router instance
# This works just like the main FastAPI app, but it's meant to be "included"
# into the main app (which we do in main.py)
router = APIRouter()


@router.post("/pdf", response_model=SummaryResponse)
async def summarize_pdf(file: UploadFile = File(...)):
    """
    Summarize a PDF document.

    WHAT HAPPENS HERE (will be implemented in Phase 2):
    1. Receive the uploaded PDF file
    2. Extract text from the PDF using pypdf
    3. Send the text to Google Gemini for summarization
    4. Return the structured summary + action items

    UploadFile: FastAPI's way of handling file uploads
    File(...): The (...) means this field is REQUIRED
    """
    return SummaryResponse(
        summary="PDF summarization coming in Phase 2!",
        action_items=["Implement PDF parsing", "Connect to Gemini AI"],
        source_type="pdf",
        source_name=file.filename or "uploaded.pdf",
    )


@router.post("/youtube", response_model=SummaryResponse)
async def summarize_youtube(request: YouTubeRequest):
    """
    Summarize a YouTube video.

    WHAT HAPPENS HERE (will be implemented in Phase 2):
    1. Receive the YouTube URL
    2. Extract the video transcript using youtube-transcript-api
    3. Send the transcript to Google Gemini for summarization
    4. Return the structured summary + action items

    YouTubeRequest: A Pydantic model that validates the incoming JSON body
    """
    return SummaryResponse(
        summary="YouTube summarization coming in Phase 2!",
        action_items=["Implement YouTube transcript extraction", "Connect to Gemini AI"],
        source_type="youtube",
        source_name=request.url,
    )
