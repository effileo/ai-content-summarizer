/*
  HEADER COMPONENT — Premium Hero Section
  =========================================
  The top branding section with animated badge, gradient text, and glow effects.
*/

import { Sparkles, Zap } from "lucide-react";

export function Header() {
    return (
        <header className="animate-fade-in-up flex flex-col items-center gap-6 text-center">
            {/* ── Animated Badge ── */}
            <div className="animate-fade-in-scale inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm text-primary backdrop-blur-sm">
                <Zap className="h-3.5 w-3.5" />
                <span className="font-medium">Powered by Gemini AI</span>
                <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/60"></span>
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
                </span>
            </div>

            {/* ── App Icon with Glow Ring ── */}
            <div className="animate-glow-ring relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 ring-1 ring-primary/20">
                <Sparkles className="h-8 w-8 text-primary" />
                {/* Decorative blur orb behind icon */}
                <div className="absolute -z-10 h-24 w-24 rounded-full bg-primary/10 blur-2xl" />
            </div>

            {/* ── App Name ── */}
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
                <span className="h-3 w-px bg-border"></span>
                <span className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
                    No signup required
                </span>
            </div>
        </header>
    );
}
