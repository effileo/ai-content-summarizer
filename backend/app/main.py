"""
AI Content Summarizer — FastAPI Backend
========================================
This is the entry point for our backend server.

WHY FastAPI?
- It's one of the fastest Python web frameworks (built on Starlette + Pydantic)
- Auto-generates interactive API docs (Swagger UI) at /docs
- Built-in request validation using Python type hints
- Async support out of the box

HOW THIS FILE WORKS:
1. We create a FastAPI "app" instance — this IS our web server
2. We add CORS middleware — this allows our Next.js frontend (port 3000)
   to talk to our backend (port 8000) without browser blocking it
3. We include our API routers — these define our actual endpoints
4. We define a health check endpoint — a simple way to verify the server is running
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import summarize

# Create the FastAPI application instance
# - title: Shows up in the auto-generated docs at /docs
# - version: Helps track API versions
# - description: Explains what this API does
app = FastAPI(
    title="AI Content Summarizer API",
    version="1.0.0",
    description="Summarize PDFs and YouTube videos using Google Gemini AI",
)

# ─── CORS Middleware ─────────────────────────────────────────────
# CORS = Cross-Origin Resource Sharing
# Without this, your browser will BLOCK requests from localhost:3000
# (frontend) to localhost:8000 (backend) because they're different "origins".
#
# allow_origins: Which domains can make requests (our Next.js dev server)
# allow_methods: Which HTTP methods are allowed (GET, POST, etc.)
# allow_headers: Which headers can be sent with requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # Next.js dev server
    ],
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

# ─── Include Routers ─────────────────────────────────────────────
# Routers let us organize our endpoints into separate files.
# Instead of defining every route in this file, we split them up.
# The prefix="/api/summarize" means all routes in the summarize router
# will start with /api/summarize (e.g., /api/summarize/pdf)
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
