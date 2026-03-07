"""
Supabase Client — Initializes the Supabase Python SDK
=====================================================
Provides a configured Supabase client for auth token verification
and direct database operations.
"""

import os

from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_URL or not SUPABASE_ANON_KEY:
    raise ValueError(
        "❌ SUPABASE_URL and SUPABASE_ANON_KEY must be set in your .env file."
    )

# Public client (uses anon key, respects RLS)
supabase: Client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)

# Service role client (bypasses RLS — use only in backend)
supabase_admin: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
