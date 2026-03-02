from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.routers import summarize
from app.models.schemas import YouTubeRequest, TranscriptResponse
from app.services.youtube_service import extract_transcript, TranscriptExtractionError

app = FastAPI(
    title="AI Content Summarizer API",
    version="1.0.0",
    description="Summarize PDFs and YouTube videos using Google Gemini AI",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # Next.js dev server
    ],
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)
app.include_router(summarize.router, prefix="/api/summarize", tags=["Summarize"])


# ─── Health Check Endpoint ───────────────────────────────────────
# This is a simple endpoint that returns {"status": "ok"}
# WHY? It's used to verify the server is running — useful for:
# - Monitoring tools checking if your server is alive
# - Frontend checking if the backend is reachable
# - CI/CD pipelines verifying deployment succeeded
@app.get("/api/health")
async def health_check():
    return {"status": "ok", "message": "AI Content Summarizer API is running"}


@app.post("/process-youtube", response_model=TranscriptResponse)
async def process_youtube(request: YouTubeRequest):
    try:
        transcript = await extract_transcript(request.url)
    except TranscriptExtractionError as exc:
        raise HTTPException(
            status_code=422,
            detail={
                "message": str(exc),
                "yt_dlp_suggestion": exc.yt_dlp_suggestion,
            },
        ) from exc

    return TranscriptResponse(transcript=transcript)
