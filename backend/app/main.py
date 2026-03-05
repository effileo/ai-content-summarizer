from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import summarize


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
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(summarize.router, prefix="/api/summarize", tags=["Summarize"])


@app.get("/api/health")
async def health_check():
    return {"status": "ok", "message": "AI Content Summarizer API is running"}
