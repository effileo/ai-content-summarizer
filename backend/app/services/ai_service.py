"""
AI Service — Google Gemini Integration
========================================
Uses the official google.genai package (v1+) to generate
structured summaries and action items from content.

Includes automatic retry with exponential backoff for rate limits.
"""

import asyncio
import json
import os

from dotenv import load_dotenv
from google import genai

# ─── Load API Key ───────────────────────────────────────────────
load_dotenv()

client = genai.Client(api_key=os.getenv("GOOGLE_API_KEY"))

# ─── Config ────────────────────────────────────────────────────
MODEL = "gemini-2.5-flash"
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
            response = client.models.generate_content(
                model=MODEL,
                contents=prompt,
            )
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
            return {
                "summary": f"Error generating summary: {error_msg}",
                "action_items": [],
            }

    return {
        "summary": "Failed after multiple retries. Please try again later.",
        "action_items": [],
    }
