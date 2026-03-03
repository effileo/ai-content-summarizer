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

from sqlalchemy import DateTime, JSON, String, Text, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class Summary(Base):
    """
    The 'summaries' table — stores every generated summary.

    Columns:
        id           → Unique identifier (UUID, auto-generated)
        source_type  → 'youtube' or 'pdf'
        source_name  → The original YouTube URL or PDF filename
        summary      → The AI-generated summary text
        action_items → JSON list of action-item strings
        created_at   → Timestamp when the summary was created
    """

    __tablename__ = "summaries"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        server_default=func.gen_random_uuid(),
    )

    source_type: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
        comment="Type of content: 'youtube' or 'pdf'",
    )

    source_name: Mapped[str] = mapped_column(
        Text,
        nullable=False,
        comment="Original YouTube URL or uploaded PDF filename",
    )

    summary: Mapped[str] = mapped_column(
        Text,
        nullable=False,
        comment="The AI-generated structured summary",
    )

    action_items: Mapped[list | dict] = mapped_column(
        JSON,
        nullable=False,
        default=list,
        comment="JSON list of action items extracted from the content",
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
        comment="Timestamp when this summary was generated",
    )

    def __repr__(self) -> str:
        return (
            f"<Summary(id={self.id!r}, source_type={self.source_type!r}, "
            f"source_name={self.source_name!r})>"
        )
