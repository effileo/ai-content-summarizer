/*
  HEADER COMPONENT — Premium Hero Section
  =========================================
  The top branding section with animated badge, gradient text, and glow effects.
*/

import { LogOut, Clock } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export function Header() {
    const { user, signOut } = useAuth();

    return (
        <header className="animate-fade-in-up flex w-full max-w-5xl flex-col items-center gap-6 text-center">
            {/* ── Top Nav bar: separate row with clear spacing ── */}
            <div className="flex w-full items-center justify-end gap-2 border-b border-border/60 bg-background/80 px-4 py-3 backdrop-blur-sm sm:gap-3 sm:px-6">
                <ThemeToggle />
                {user && (
                    <>
                        <span className="h-4 w-px bg-border" aria-hidden />
                        <Link
                            href="/history"
                            className="flex items-center gap-2 rounded-lg border border-border bg-muted/50 px-3 py-2 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-muted hover:border-primary/30 hover:text-primary"
                        >
                            <Clock className="h-4 w-4" />
                            History
                        </Link>
                        <button
                            onClick={signOut}
                            className="flex items-center gap-2 rounded-lg border border-border bg-muted/50 px-3 py-2 text-sm font-medium text-foreground shadow-sm transition-colors hover:border-destructive/50 hover:bg-destructive/10 hover:text-destructive"
                        >
                            <LogOut className="h-4 w-4" />
                            Sign Out
                        </button>
                    </>
                )}
            </div>

            {/* ── Hero content ── */}
            <div className="flex w-full flex-col items-center gap-6 pt-8">
            <h1 className="gradient-text-animated text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
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
            </div>
        </header>
    );
}
