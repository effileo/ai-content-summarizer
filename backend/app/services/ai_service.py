"""
AI Service — Google Gemini Integration
========================================
Takes extracted text (from PDF or YouTube transcript),
sends it to Gemini with a structured prompt, and parses
the response into a summary + action items.
"""

import json
import os

import google.generativeai as genai
from dotenv import load_dotenv

# ─── Load API Key ───────────────────────────────────────────────
load_dotenv()
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

# ─── Gemini Model ──────────────────────────────────────────────
# "gemini-1.5-flash" → fast and cheap, great for summarization
# "gemini-1.5-pro"   → slower but deeper analysis
model = genai.GenerativeModel("gemini-1.5-flash")

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

    Args:
        content: The extracted text to summarize
        source_type: Either 'pdf' or 'youtube'

    Returns:
        dict with 'summary' and 'action_items' keys
    """
    prompt = PROMPT_TEMPLATE.format(
        source_type=source_type,
        content=content[:50000],  # Limit to ~50k chars to stay within token limit
    )

    try:
        response = await model.generate_content_async(prompt)
        text = response.text.strip()

        # Clean up if Gemini wraps the JSON in code fences
        if text.startswith("```"):
            text = text.split("\n", 1)[1]  # Remove first line (```json)
            text = text.rsplit("```", 1)[0]  # Remove last ``` 
            text = text.strip()

        result = json.loads(text)

        return {
            "summary": result.get("summary", "No summary generated."),
            "action_items": result.get("action_items", []),
        }

    except json.JSONDecodeError:
        # If Gemini returns non-JSON, use the raw text as the summary
        return {
            "summary": response.text.strip(),
            "action_items": [],
        }
    except Exception as e:
        return {
            "summary": f"Error generating summary: {str(e)}",
            "action_items": [],
        }
