"""
YouTube Service — Transcript Extraction (Placeholder)
======================================================
This service will handle extracting transcripts from YouTube videos.

WHAT WILL THIS DO? (Phase 2)
1. Receive a YouTube URL
2. Extract the video ID from the URL
3. Use youtube-transcript-api to fetch the transcript
4. Return the combined transcript text for AI summarization

WHY youtube-transcript-api?
- No API key needed (uses YouTube's public transcript data)
- Supports multiple languages
- Simple and reliable
"""


async def extract_transcript(youtube_url: str) -> str:
    """
    Extract the transcript from a YouTube video.

    Args:
        youtube_url: Full YouTube video URL

    Returns:
        Video transcript as a single string

    TODO (Phase 2):
        - Parse video ID from URL
        - Fetch transcript using youtube-transcript-api
        - Handle videos without transcripts
        - Support multiple languages
    """
    # Placeholder — will be replaced with actual transcript extraction
    return "YouTube transcript will appear here."
