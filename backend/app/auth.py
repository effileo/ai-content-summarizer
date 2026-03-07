"""
Auth Middleware — Verify Supabase JWT Tokens
=============================================
FastAPI dependency that extracts the Bearer token from the
Authorization header and verifies it with Supabase.

Usage in routes:
    from app.auth import get_current_user

    @router.get("/protected")
    async def protected_route(user_id: str = Depends(get_current_user)):
        return {"user_id": user_id}
"""

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.supabase_client import supabase

# HTTPBearer extracts the token from "Authorization: Bearer <token>"
security = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> str:
    """
    Verify the Supabase JWT and return the user's UUID.

    How it works:
    1. Frontend sends: Authorization: Bearer <supabase_access_token>
    2. We call supabase.auth.get_user(token) to verify it
    3. If valid, we return the user's UUID
    4. If invalid, we raise 401 Unauthorized

    Returns:
        str: The authenticated user's UUID
    """
    token = credentials.credentials

    try:
        response = supabase.auth.get_user(token)
        user = response.user

        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired token",
            )

        return user.id

    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Authentication failed: {str(exc)}",
        ) from exc
