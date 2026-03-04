from contextlib import asynccontextmanager

from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.routers import summarize
from app.models.schemas import SummaryResponse, YouTubeRequest
from app.services.ai_service import generate_summary
from app.services.youtube_service import extract_transcript, TranscriptExtractionError
from app.database import close_db, get_db, init_db
from app.models.db_models import Summary
from sqlalchemy.ext.asyncio import AsyncSession


# ─── Application Lifespan ───────────────────────────────────────
# Code before `yield` runs on STARTUP (connect to DB)
# Code after `yield` runs on SHUTDOWN (close DB pool)
@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield
    await close_db()


app = FastAPI(
    title="AI Content Summarizer API",
    version="1.0.0",
    description="Summarize PDFs and YouTube videos using Google Gemini AI",
    lifespan=lifespan,
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


@app.post("/process-youtube", response_model=SummaryResponse)
async def process_youtube(
    request: YouTubeRequest,
    db: AsyncSession = Depends(get_db),
):
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

    summary_result = await generate_summary(transcript, source_type="youtube")
    action_items = summary_result.get("action_items", [])

    # NOTE: user_id should come from the authenticated user in production.
    # For now, you'll need to pass it once Supabase Auth is integrated.
    db.add(
        Summary(
            source_type="youtube",
            source_url=request.url,
            content_summary=summary_result.get("summary", ""),
            action_items=action_items,
            user_id=request.user_id,  # TODO: get from auth context
        )
    )
    await db.commit()

    return SummaryResponse(
        summary=summary_result.get("summary", ""),
        action_items=action_items,
        source_type="youtube",
        source_name=request.url,
    )
