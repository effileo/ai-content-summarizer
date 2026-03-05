"""
AI Service — Google Gemini Integration
========================================
Takes extracted text (from PDF or YouTube transcript),
sends it to Gemini with a structured prompt, and parses
the response into a summary + action items.

Includes automatic retry with exponential backoff for rate limits.
"""

import asyncio
import json
import os

import google.generativeai as genai
from dotenv import load_dotenv

# ─── Load API Key ───────────────────────────────────────────────
load_dotenv()
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

# ─── Gemini Model ──────────────────────────────────────────────
# "gemini-2.0-flash-lite" → lightest model, separate quota from flash
model = genai.GenerativeModel("gemini-2.0-flash-lite")

# ─── Retry Config ──────────────────────────────────────────────
MAX_RETRIES = 3
INITIAL_WAIT = 30  # seconds

# ─── Prompt Template ───────────────────────────────────────────
PROMPT_TEMPLATE = """You are an expert content summarizer.

Analyze the following {source_type} content and return a JSON object with exactly two keys:

1. "summary" — A well-structured, detailed summary of the content.
   Use clear paragraphs. Highlight key points.

2. "action_items" — A JSON array of specific, actionable tasks
   the reader should take based on this content.
   Each item should be a short, clear sentence.

IMPORTANT: Return ONLY valid JSON. No markdown, no code fences, no extra text.

Content to analyze:
{content}
"""


async def generate_summary(content: str, source_type: str) -> dict:
    """
    Generate a structured summary using Google Gemini.
    Automatically retries on rate limit errors (429).

    Args:
        content: The extracted text to summarize
        source_type: Either 'pdf' or 'youtube'

    Returns:
        dict with 'summary' and 'action_items' keys
    """
    prompt = PROMPT_TEMPLATE.format(
        source_type=source_type,
        content=content[:50000],
    )

    for attempt in range(MAX_RETRIES):
        try:
            response = await model.generate_content_async(prompt)
            text = response.text.strip()

            # Clean up if Gemini wraps the JSON in code fences
            if text.startswith("```"):
                text = text.split("\n", 1)[1]
                text = text.rsplit("```", 1)[0]
                text = text.strip()

            result = json.loads(text)

            return {
                "summary": result.get("summary", "No summary generated."),
                "action_items": result.get("action_items", []),
            }

        except json.JSONDecodeError:
            return {
                "summary": response.text.strip(),
                "action_items": [],
            }
        except Exception as e:
            error_msg = str(e)
            # If rate limited (429), wait and retry
            if "429" in error_msg and attempt < MAX_RETRIES - 1:
                wait_time = INITIAL_WAIT * (attempt + 1)
                print(f"⏳ Rate limited. Retrying in {wait_time}s... (attempt {attempt + 1}/{MAX_RETRIES})")
                await asyncio.sleep(wait_time)
                continue
            # Final attempt or non-retryable error
            return {
                "summary": f"Error generating summary: {error_msg}",
                "action_items": [],
            }

    return {
        "summary": "Failed after multiple retries. Please try again later.",
        "action_items": [],
    }
