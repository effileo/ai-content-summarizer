"""
YouTube Service — Transcript Extraction
=======================================
This service handles extracting transcripts from YouTube videos.
"""

from urllib.parse import parse_qs, urlparse

from youtube_transcript_api import YouTubeTranscriptApi
from youtube_transcript_api._errors import TranscriptsDisabled, VideoUnavailable, NoTranscriptFound


class TranscriptExtractionError(Exception):
    def __init__(self, message: str, youtube_url: str):
        super().__init__(message)
        self.yt_dlp_suggestion = (
            "Transcript unavailable via youtube-transcript-api. "
            "Fallback: use yt-dlp to download audio, then transcribe it with an ASR model like Whisper. "
            f'Example: yt-dlp -x --audio-format mp3 -o "%(id)s.%(ext)s" "{youtube_url}"'
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
        transcript_entries = YouTubeTranscriptApi.get_transcript(video_id)
    except (TranscriptsDisabled, NoTranscriptFound, VideoUnavailable) as exc:
        raise TranscriptExtractionError(
            "Transcript is unavailable for this video.", youtube_url
        ) from exc
    except Exception as exc:
        raise TranscriptExtractionError(
            f"Failed to fetch transcript: {exc}", youtube_url
        ) from exc

    transcript_text = " ".join(
        entry.get("text", "").strip() for entry in transcript_entries if entry.get("text")
    ).strip()

    if not transcript_text:
        raise TranscriptExtractionError(
            "Transcript was fetched but contained no text.", youtube_url
        )

    return transcript_text
