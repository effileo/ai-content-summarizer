/*
  MAIN PAGE — Premium Refined Layout
  =====================================
  Animated mesh background, staggered card entrances, shimmer loading, footer.
*/

"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { YouTubeInput } from "@/components/youtube-input";
import { PdfDropzone } from "@/components/pdf-dropzone";
import { SummaryDisplay } from "@/components/summary-display";
import { ActionItems } from "@/components/action-items";
import { summarizeYoutube, summarizePdf, type SummaryResult, ApiError } from "@/lib/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileText, Youtube, AlertCircle, Sparkles, Heart, Loader2 } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { AuthForm } from "@/components/auth-form";

export default function Home() {
  const { user, isLoading: isAuthLoading } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SummaryResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleYouTube = async (url: string) => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await summarizeYoutube(url);
      setResult(data);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Something went wrong. Is the backend running?");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePdf = async (file: File) => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await summarizePdf(file);
      setResult(data);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Something went wrong. Is the backend running?");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isAuthLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // If no user, show the Auth Form only (wrap it in the same cool background)
  if (!user) {
    return (
      <div className="relative flex min-h-screen flex-col items-center justify-center bg-background p-4 sm:p-8">
        <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          <div className="animate-blob-1 absolute -left-32 -top-32 h-96 w-96 rounded-full opacity-30 blur-3xl" style={{ background: "radial-gradient(circle, oklch(0.55 0.25 270 / 0.4), transparent 70%)" }} />
          <div className="animate-blob-2 absolute -right-32 top-24 h-80 w-80 rounded-full opacity-25 blur-3xl" style={{ background: "radial-gradient(circle, oklch(0.6 0.22 310 / 0.35), transparent 70%)" }} />
        </div>
        <Header />
        <div className="mt-12 w-full max-w-sm">
          <AuthForm />
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-background">
      {/* ══════════════════════════════════════════════════════════ */}
      {/*  ANIMATED MESH BACKGROUND                                */}
      {/* ══════════════════════════════════════════════════════════ */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        {/* Blob 1 — top-left */}
        <div
          className="animate-blob-1 absolute -left-32 -top-32 h-96 w-96 rounded-full opacity-30 blur-3xl"
          style={{
            background: "radial-gradient(circle, oklch(0.55 0.25 270 / 0.4), transparent 70%)",
          }}
        />
        {/* Blob 2 — top-right */}
        <div
          className="animate-blob-2 absolute -right-32 top-24 h-80 w-80 rounded-full opacity-25 blur-3xl"
          style={{
            background: "radial-gradient(circle, oklch(0.6 0.22 310 / 0.35), transparent 70%)",
          }}
        />
        {/* Blob 3 — center-bottom */}
        <div
          className="animate-blob-3 absolute bottom-32 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full opacity-20 blur-3xl"
          style={{
            background: "radial-gradient(circle, oklch(0.55 0.2 240 / 0.3), transparent 70%)",
          }}
        />
        {/* Subtle grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(oklch(0.5 0 0 / 0.3) 1px, transparent 1px), linear-gradient(to right, oklch(0.5 0 0 / 0.3) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* ══════════════════════════════════════════════════════════ */}
      {/*  MAIN CONTENT                                             */}
      {/* ══════════════════════════════════════════════════════════ */}
      <main className="mx-auto flex min-h-screen max-w-5xl flex-col px-4 py-16 sm:px-6 sm:py-24">
        <div className="flex-1">
          {/* ── Header ── */}
          <Header />

          {/* ── Input Cards ── */}
          <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* YouTube Card */}
            <Card className="animate-slide-in-left card-glow border-border/50 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10">
                    <Youtube className="h-5 w-5 text-red-500" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">YouTube Video</CardTitle>
                    <CardDescription>
                      Paste a YouTube URL to summarize
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <YouTubeInput onSubmit={handleYouTube} isLoading={isLoading} />
              </CardContent>
            </Card>

            {/* PDF Card */}
            <Card className="animate-slide-in-right card-glow border-border/50 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">PDF Document</CardTitle>
                    <CardDescription>
                      Upload a PDF to summarize
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <PdfDropzone onFileSelect={handlePdf} isLoading={isLoading} />
              </CardContent>
            </Card>
          </div>

          {/* ── Error Display ── */}
          {error && (
            <div className="animate-fade-in-scale mt-8 flex items-center gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4 backdrop-blur-sm">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-destructive/10">
                <AlertCircle className="h-5 w-5 text-destructive" />
              </div>
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {/* ── Loading State — Shimmer Skeletons ── */}
          {isLoading && (
            <div className="mt-14 space-y-5">
              {/* Summary skeleton */}
              <div className="animate-fade-in-up overflow-hidden rounded-xl border border-border/30 bg-card/50 p-6 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="animate-shimmer h-10 w-10 rounded-lg"></div>
                  <div className="flex-1 space-y-2">
                    <div className="animate-shimmer h-4 w-24 rounded"></div>
                    <div className="animate-shimmer h-3 w-32 rounded"></div>
                  </div>
                </div>
                <div className="mt-5 space-y-2.5">
                  <div className="animate-shimmer h-3 w-full rounded delay-100"></div>
                  <div className="animate-shimmer h-3 w-5/6 rounded delay-200"></div>
                  <div className="animate-shimmer h-3 w-4/6 rounded delay-300"></div>
                  <div className="animate-shimmer h-3 w-3/4 rounded delay-400"></div>
                </div>
              </div>
              {/* Action items skeleton */}
              <div className="animate-fade-in-up delay-200 overflow-hidden rounded-xl border border-border/30 bg-card/50 p-6 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="animate-shimmer h-10 w-10 rounded-lg"></div>
                  <div className="animate-shimmer h-4 w-28 rounded"></div>
                </div>
                <div className="mt-5 space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="animate-shimmer h-4 w-4 rounded" style={{ animationDelay: `${i * 100}ms` }}></div>
                      <div className="animate-shimmer h-3 rounded" style={{ width: `${85 - i * 12}%`, animationDelay: `${i * 100}ms` }}></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Results ── */}
          {result && !isLoading && (
            <div className="mt-14 space-y-6">
              <SummaryDisplay
                summary={result.summary}
                sourceType={result.source_type}
                sourceName={result.source_name}
              />
              {result.action_items.length > 0 && (
                <ActionItems items={result.action_items} />
              )}
            </div>
          )}
        </div>

        {/* ══════════════════════════════════════════════════════════ */}
        {/*  FOOTER                                                   */}
        {/* ══════════════════════════════════════════════════════════ */}
        <footer className="mt-24 border-t border-border/30 pt-8 text-center">
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span>AI Content Summarizer</span>
            </div>
            <p className="flex items-center gap-1 text-xs text-muted-foreground/60">
              Built with <Heart className="inline h-3 w-3 text-red-400" /> using Next.js & Gemini AI
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}
