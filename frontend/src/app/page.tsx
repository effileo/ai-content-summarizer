/*
  MAIN PAGE — The Complete Application
  ======================================
  This is where everything comes together!

  WHAT YOU'LL LEARN:
  - React state management for a real app (multiple state variables)
  - Async/await with error handling in React
  - Component composition (assembling smaller components into a page)
  - Conditional rendering for different app states (idle, loading, results, error)

  STATE FLOW:
  1. User enters YouTube URL or uploads PDF → triggers handleYouTube/handlePdf
  2. State changes: isLoading = true, error = null
  3. API call is made (fetch to backend)
  4. On success: result is stored in state → summary + action items render
  5. On error: error message is stored → error display renders
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
import { FileText, Youtube, AlertCircle } from "lucide-react";

export default function Home() {
  /*
    APP STATE
    - isLoading: Are we currently waiting for the API?
    - result: The summary data from the API (null = no result yet)
    - error: Error message to display (null = no error)
    
    These three states cover ALL possible UI states:
    1. Idle:    isLoading=false, result=null,  error=null  → Show input forms
    2. Loading: isLoading=true,  result=null,  error=null  → Show spinner
    3. Success: isLoading=false, result={...}, error=null  → Show summary
    4. Error:   isLoading=false, result=null,  error="..." → Show error
  */
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SummaryResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  /*
    YOUTUBE HANDLER
    - Called when user submits a YouTube URL
    - Manages the loading → success/error state transitions
    - async/await makes Promise-based code read like synchronous code
  */
  const handleYouTube = async (url: string) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await summarizeYoutube(url);
      setResult(data);
    } catch (err) {
      /*
        Error handling strategy:
        - ApiError: We know the status and message (from our API)
        - Other errors: Generic message (network failure, etc.)
        - instanceof checks the error TYPE at runtime
      */
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Something went wrong. Is the backend running?");
      }
    } finally {
      /*
        finally block ALWAYS runs — whether success or error
        This ensures we stop the loading state no matter what
      */
      setIsLoading(false);
    }
  };

  /* PDF HANDLER — Same pattern as YouTube */
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

  return (
    <div className="min-h-screen bg-background">
      {/* ── Background Gradient ── */}
      <div
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse at top, oklch(0.25 0.06 270 / 0.3) 0%, transparent 60%)",
        }}
      />

      <main className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
        {/* ── Header ── */}
        <Header />

        {/* ── Input Cards ── */}
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* YouTube Card */}
          <Card className="card-glow border-border/50 bg-card/80 backdrop-blur-sm">
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
          <Card className="card-glow border-border/50 bg-card/80 backdrop-blur-sm">
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
          <div className="mt-8 flex items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4">
            <AlertCircle className="h-5 w-5 shrink-0 text-destructive" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {/* ── Loading State ── */}
        {isLoading && (
          <div className="mt-12 space-y-4">
            {/* Skeleton loaders — animated placeholder blocks */}
            <div className="animate-pulse-glow rounded-xl border border-border/30 bg-card/50 p-6">
              <div className="mb-4 h-4 w-1/4 rounded bg-muted"></div>
              <div className="space-y-2">
                <div className="h-3 w-full rounded bg-muted"></div>
                <div className="h-3 w-5/6 rounded bg-muted"></div>
                <div className="h-3 w-4/6 rounded bg-muted"></div>
              </div>
            </div>
            <div className="animate-pulse-glow rounded-xl border border-border/30 bg-card/50 p-6">
              <div className="mb-4 h-4 w-1/3 rounded bg-muted"></div>
              <div className="space-y-2">
                <div className="h-3 w-3/4 rounded bg-muted"></div>
                <div className="h-3 w-2/3 rounded bg-muted"></div>
              </div>
            </div>
          </div>
        )}

        {/* ── Results ── */}
        {result && !isLoading && (
          <div className="mt-12 space-y-6">
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
      </main>
    </div>
  );
}
