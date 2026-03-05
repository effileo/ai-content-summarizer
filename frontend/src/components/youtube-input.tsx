/*
  YOUTUBE INPUT COMPONENT — Refined
  ====================================
  Gradient submit button, focus glow on input, animated error state.
*/

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, ArrowRight, AlertCircle } from "lucide-react";

interface YouTubeInputProps {
    onSubmit: (url: string) => Promise<void>;
    isLoading: boolean;
}

function isValidYouTubeUrl(url: string): boolean {
    const pattern =
        /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/|shorts\/|v\/)|youtu\.be\/).+/i;
    return pattern.test(url.trim());
}

export function YouTubeInput({ onSubmit, isLoading }: YouTubeInputProps) {
    const [url, setUrl] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        const trimmedUrl = url.trim();
        if (!trimmedUrl) {
            setError("Please enter a YouTube URL");
            return;
        }
        if (!isValidYouTubeUrl(trimmedUrl)) {
            setError("Please enter a valid YouTube URL");
            return;
        }
        await onSubmit(trimmedUrl);
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            {/* ── URL Input with Focus Glow ── */}
            <div className="input-glow flex gap-2 rounded-lg transition-all">
                <Input
                    type="url"
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={url}
                    onChange={(e) => {
                        setUrl(e.target.value);
                        if (error) setError("");
                    }}
                    disabled={isLoading}
                    className="flex-1 border-0 bg-background/50 shadow-none focus-visible:ring-0"
                />
                <Button
                    type="submit"
                    disabled={isLoading || !url.trim()}
                    className="btn-gradient shrink-0 border-0 text-white shadow-md"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span className="sr-only">Summarizing...</span>
                        </>
                    ) : (
                        <>
                            Summarize
                            <ArrowRight className="h-4 w-4" />
                        </>
                    )}
                </Button>
            </div>

            {/* ── Error Message with Icon ── */}
            {error && (
                <div className="animate-fade-in-scale flex items-center gap-2 text-sm text-destructive">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    <p>{error}</p>
                </div>
            )}
        </form>
    );
}
