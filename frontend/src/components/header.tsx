/*
  HEADER COMPONENT — Premium Hero Section
  =========================================
  The top branding section with animated badge, gradient text, and glow effects.
*/

import { LogOut, Clock } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import Link from "next/link";

export function Header() {
    const { user, signOut } = useAuth();

    return (
        <header className="animate-fade-in-up relative flex w-full max-w-5xl flex-col items-center gap-6 text-center pt-8">
            {/* ── Top Nav (if logged in) ── */}
            {user && (
                <div className="absolute right-0 top-0 mt-4 flex items-center gap-4">
                    <Link
                        href="/history"
                        className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-white"
                    >
                        <Clock className="h-4 w-4" />
                        History
                    </Link>
                    <button
                        onClick={signOut}
                        className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-destructive"
                    >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                    </button>
                </div>
            )}

            {/* ── App Name ── */}
            <h1 className="gradient-text-animated mt-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                AI Content Summarizer
            </h1>

            {/* ── Tagline ── */}
            <p className="max-w-xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
                Transform PDFs and YouTube videos into{" "}
                <span className="font-semibold text-foreground">structured summaries</span>{" "}
                and{" "}
                <span className="font-semibold text-foreground">action items</span>{" "}
                — in seconds.
            </p>

            {/* ── Trust Indicators ── */}
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span>
                    Free to use
                </span>
                <span className="h-3 w-px bg-border"></span>
                <span className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                    AI-powered
                </span>
            </div>
        </header>
    );
}
