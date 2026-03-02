"""
AI Service — Google Gemini Integration (Placeholder)
=====================================================
This service will handle communication with Google's Gemini AI.

WHAT WILL THIS DO? (Phase 2)
1. Take extracted text (from PDF or YouTube transcript)
2. Send it to Gemini with a carefully crafted prompt
3. Parse the AI response into a structured summary + action items

WHY A SEPARATE SERVICE?
- Separation of Concerns: Routes handle HTTP, services handle logic
- Reusability: Both PDF and YouTube routes use the same AI service
- Testability: Easier to test AI logic independently from HTTP layer
"""


async def generate_summary(content: str, source_type: str) -> dict:
    """
    Generate a structured summary using Google Gemini.

    Args:
        content: The extracted text to summarize
        source_type: Either 'pdf' or 'youtube'

    Returns:
        dict with 'summary' and 'action_items' keys

    TODO (Phase 2):
        - Initialize Gemini client
        - Design prompt template
        - Handle API errors and rate limits
    """
    # Placeholder — will be replaced with actual Gemini API call
    return {
        "summary": f"Summary of {source_type} content will appear here.",
        "action_items": ["This is a placeholder action item"],
    }
