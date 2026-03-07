"""
Pydantic Schemas — Data Validation Models
==========================================
These models define the SHAPE of data flowing in and out of our API.

WHY PYDANTIC?
- Automatic validation: If someone sends bad data, they get a clear error
- Type safety: You know exactly what shape your data is
- Auto-documentation: FastAPI uses these to generate Swagger docs
- Serialization: Converts Python objects ↔ JSON automatically

HOW TO READ THESE:
- Each class defines a "shape" of data (like a TypeScript interface)
- Field types (str, list, etc.) are enforced — wrong types = error
- Optional fields have default values
"""

from pydantic import BaseModel, Field


class YouTubeRequest(BaseModel):
    """
    What the frontend sends when summarizing a YouTube video.

    Example JSON body:
    {
        "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    }
    """
    url: str = Field(
        ...,  # (...) means REQUIRED — no default value
        description="The YouTube video URL to summarize",
        examples=["https://www.youtube.com/watch?v=dQw4w9WgXcQ"],
    )


class SummaryResponse(BaseModel):
    """
    What our API sends back after summarizing content.

    Example JSON response:
    {
        "summary": "This video explains...",
        "action_items": ["Review chapter 3", "Practice exercises"],
        "source_type": "youtube",
        "source_name": "https://youtube.com/..."
    }
    """
    summary: str = Field(
        ...,
        description="The AI-generated structured summary",
    )
    action_items: list[str] = Field(
        default_factory=list,  # Default to empty list if not provided
        description="List of action items extracted from the content",
    )
    source_type: str = Field(
        ...,
        description="Type of source: 'pdf' or 'youtube'",
    )
    source_name: str = Field(
        ...,
        description="Name of the source file or URL",
    )


class TranscriptResponse(BaseModel):
    """Response schema for full YouTube transcript extraction."""

    transcript: str = Field(
        ...,
        description="The full transcript of the provided YouTube video as a single string.",
    )


class SummaryHistoryItem(BaseModel):
    """A single summary in the user's history."""

    id: str = Field(..., description="Unique summary ID")
    source_type: str = Field(..., description="'youtube' or 'pdf'")
    source_name: str = Field(..., description="URL or filename")
    summary: str = Field(..., description="The AI-generated summary")
    action_items: list[str] = Field(default_factory=list)
    created_at: str = Field(..., description="ISO timestamp")

