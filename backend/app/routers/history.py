"""
History Router — Retrieve past summaries for the logged-in user
"""

from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth import get_current_user
from app.database import get_db
from app.models.db_models import Summary
from app.models.schemas import SummaryHistoryItem

router = APIRouter()


@router.get("/", response_model=list[SummaryHistoryItem])
async def get_history(
    user_id: str = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Fetch all summaries for the authenticated user, newest first."""
    result = await db.execute(
        select(Summary)
        .where(Summary.user_id == user_id)
        .order_by(Summary.created_at.desc())
    )
    summaries = result.scalars().all()

    return [
        SummaryHistoryItem(
            id=str(s.id),
            source_type=s.source_type,
            source_name=s.source_url,
            summary=s.content_summary,
            action_items=s.action_items if isinstance(s.action_items, list) else [],
            created_at=s.created_at.isoformat(),
        )
        for s in summaries
    ]
