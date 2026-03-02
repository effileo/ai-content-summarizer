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
