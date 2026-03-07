"""
Database Layer — Supabase (PostgreSQL) via SQLAlchemy Async
============================================================
This module sets up the async database engine and session factory
for connecting to a Supabase-hosted PostgreSQL database.

HOW IT WORKS:
- Reads DATABASE_URL from your .env file
- Creates an async SQLAlchemy engine (connection pool)
- Provides a session factory for database operations
- Exposes get_db() as a FastAPI dependency for route handlers

USAGE IN ROUTES:
    from app.database import get_db
    from sqlalchemy.ext.asyncio import AsyncSession

    @router.get("/items")
    async def list_items(db: AsyncSession = Depends(get_db)):
        result = await db.execute(select(MyModel))
        return result.scalars().all()
"""

import os
from collections.abc import AsyncGenerator

from dotenv import load_dotenv
from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)
from sqlalchemy.orm import DeclarativeBase

# ─── Load Environment Variables ─────────────────────────────────
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise ValueError(
        "❌ DATABASE_URL is not set! "
        "Add it to your backend/.env file. See .env.example for the format."
    )

# ─── SQLAlchemy Async Engine ────────────────────────────────────
# The engine manages a pool of database connections.
# - echo=False → set to True to log every SQL statement (useful for debugging)
# - pool_size  → max number of persistent connections in the pool
engine = create_async_engine(
    DATABASE_URL,
    echo=False,
    pool_size=5,
    max_overflow=10,
)

# ─── Session Factory ────────────────────────────────────────────
# Each request gets its own session (unit of work).
# expire_on_commit=False keeps objects usable after commit.
async_session = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


# ─── Declarative Base ───────────────────────────────────────────
# All ORM models inherit from this base class.
class Base(DeclarativeBase):
    pass


# ─── FastAPI Dependency ─────────────────────────────────────────
async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """
    Yield a database session for each request, then close it.

    Usage:
        @router.get("/example")
        async def example(db: AsyncSession = Depends(get_db)):
            ...
    """
    async with async_session() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise


# ─── Lifecycle Helpers ──────────────────────────────────────────
async def init_db() -> None:
    """
    Create all tables on startup (if they don't exist).

    This uses the ORM models registered with Base.metadata.
    In production with Supabase, you may prefer running schema.sql
    directly in the SQL Editor instead.
    """
    # Import models so they register with Base.metadata
    import app.models.db_models  # noqa: F401

    async with engine.begin() as conn:
        # We comment this out because Supabase already created our tables via schema.sql,
        # and SQLAlchemy doesn't have access to the internal `auth.users` table to validate foreign keys.
        # await conn.run_sync(Base.metadata.create_all)
        pass

    print("✅ Database connected — tables verified")


async def close_db() -> None:
    """Dispose of the connection pool on shutdown."""
    await engine.dispose()
    print("🔌 Database connection pool closed")
