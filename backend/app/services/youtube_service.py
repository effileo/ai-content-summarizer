"""
YouTube Service — Transcript Extraction
=======================================
This service handles extracting transcripts from YouTube videos.
Updated for youtube-transcript-api v1.x
"""

from urllib.parse import parse_qs, urlparse

from youtube_transcript_api import YouTubeTranscriptApi


class TranscriptExtractionError(Exception):
    def __init__(self, message: str, youtube_url: str = ""):
        super().__init__(message)
        self.yt_dlp_suggestion = (
            "Transcript unavailable via youtube-transcript-api. "
            "Fallback: use yt-dlp to download audio, then transcribe with Whisper."
        )


def _extract_video_id(youtube_url: str) -> str:
    parsed = urlparse(youtube_url)
    host = parsed.netloc.lower()

    if host in {"youtu.be", "www.youtu.be"}:
        return parsed.path.strip("/")

    if "youtube.com" in host:
        if parsed.path == "/watch":
            video_id = parse_qs(parsed.query).get("v", [""])[0]
            if video_id:
                return video_id

        path_parts = [part for part in parsed.path.split("/") if part]
        if len(path_parts) >= 2 and path_parts[0] in {"embed", "shorts", "v"}:
            return path_parts[1]

    raise TranscriptExtractionError("Invalid or unsupported YouTube URL.", youtube_url)


async def extract_transcript(youtube_url: str) -> str:
    """
    Extract the transcript from a YouTube video.

    Args:
        youtube_url: Full YouTube video URL

    Returns:
        Video transcript as a single string
    """
    video_id = _extract_video_id(youtube_url)

    try:
        # v1.x API: create instance, then call .fetch()
        ytt_api = YouTubeTranscriptApi()
        transcript = ytt_api.fetch(video_id)

        transcript_text = " ".join(
            snippet.text.strip() for snippet in transcript if snippet.text
        ).strip()

    except Exception as exc:
        raise TranscriptExtractionError(
            f"Failed to fetch transcript: {exc}", youtube_url
        ) from exc

    if not transcript_text:
        raise TranscriptExtractionError(
            "Transcript was fetched but contained no text.", youtube_url
        )

    return transcript_text
