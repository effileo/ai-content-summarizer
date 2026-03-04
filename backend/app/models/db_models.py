"""
Database Models — SQLAlchemy ORM Table Definitions
===================================================
These classes map directly to tables in your Supabase PostgreSQL database.

HOW ORM MODELS DIFFER FROM PYDANTIC SCHEMAS:
- Pydantic schemas (schemas.py) define the shape of API request/response data
- ORM models (this file) define the shape of database TABLES
- You'll often convert between the two in your route handlers

EACH CLASS = ONE TABLE:
- Class name  → table name (via __tablename__)
- Class attrs → table columns
"""

import uuid
from datetime import datetime

from sqlalchemy import DateTime, String, Text, func, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class Summary(Base):
    """
    The 'summaries' table — stores every generated summary.

    Columns:
        id              → Unique identifier (UUID, auto-generated)
        user_id         → References auth.users(id) — who owns this summary
        source_type     → 'youtube' or 'pdf'
        source_url      → The original YouTube URL or PDF filename
        content_summary → The AI-generated summary text
        action_items    → JSONB list of action-item strings
        created_at      → Timestamp when the summary was created
    """

    __tablename__ = "summaries"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        server_default=func.gen_random_uuid(),
    )

    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("auth.users.id", ondelete="CASCADE"),
        nullable=False,
        comment="The Supabase auth user who owns this summary",
    )

    source_type: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
        comment="Type of content: 'youtube' or 'pdf'",
    )

    source_url: Mapped[str] = mapped_column(
        Text,
        nullable=False,
        comment="Original YouTube URL or uploaded PDF filename",
    )

    content_summary: Mapped[str] = mapped_column(
        Text,
        nullable=False,
        comment="The AI-generated structured summary",
    )

    action_items: Mapped[list | dict] = mapped_column(
        JSONB,
        nullable=False,
        default=list,
        server_default="[]",
        comment="JSONB list of action items extracted from the content",
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
        comment="Timestamp when this summary was generated",
    )

    def __repr__(self) -> str:
        return (
            f"<Summary(id={self.id!r}, user_id={self.user_id!r}, "
            f"source_type={self.source_type!r}, source_url={self.source_url!r})>"
        )
