/*
  YOUTUBE INPUT COMPONENT
  ========================
  An input field where users paste a YouTube URL and submit it.

  WHAT YOU'LL LEARN:
  - React state management (useState) for tracking input value
  - Form handling and validation in React
  - Passing data from child → parent via callback props
  - Conditional rendering (showing/hiding elements based on state)
  - TypeScript interfaces for component props

  COMPONENT PROPS:
  - onSubmit: A function the PARENT gives us. When the user clicks
    "Summarize", we call this function with the URL. The parent
    (page.tsx) decides what to do with it (call the API).
  - isLoading: Whether the parent is currently processing a request.
    We use this to disable the button and show a spinner.
*/

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, ArrowRight } from "lucide-react";

/*
  TypeScript INTERFACE
  - Defines the "contract" for this component's props
  - If the parent doesn't pass these props, TypeScript will error
  - This catches bugs BEFORE your code runs (at compile time)
*/
interface YouTubeInputProps {
    onSubmit: (url: string) => void;
    isLoading: boolean;
}

/*
  YOUTUBE URL VALIDATION
  - We use a regex (Regular Expression) to check if the URL looks valid
  - This catches typos before making an API call
  - It supports: youtube.com/watch?v=..., youtu.be/..., youtube.com/shorts/...
*/
function isValidYouTubeUrl(url: string): boolean {
    const pattern =
        /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/|shorts\/|v\/)|youtu\.be\/).+/i;
    return pattern.test(url.trim());
}

export function YouTubeInput({ onSubmit, isLoading }: YouTubeInputProps) {
    /*
      useState HOOK
      - Creates a piece of "reactive" state
      - When state changes, React re-renders the component
      - url: the current value
      - setUrl: function to update the value
      - "": initial value (empty string)
    */
    const [url, setUrl] = useState("");
    const [error, setError] = useState("");

    /*
      FORM SUBMIT HANDLER
      - Validates the URL before calling onSubmit
      - Prevents the default form submission (which would reload the page)
    */
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault(); // Prevent page reload

        // Clear any previous error
        setError("");

        // Trim whitespace and validate
        const trimmedUrl = url.trim();
        if (!trimmedUrl) {
            setError("Please enter a YouTube URL");
            return;
        }
        if (!isValidYouTubeUrl(trimmedUrl)) {
            setError("Please enter a valid YouTube URL");
            return;
        }

        // URL is valid — pass it up to the parent!
        onSubmit(trimmedUrl);
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            {/* ── URL Input Field ── */}
            <div className="flex gap-2">
                <Input
                    type="url"
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={url}
                    onChange={(e) => {
                        setUrl(e.target.value);
                        if (error) setError(""); // Clear error when user types
                    }}
                    disabled={isLoading}
                    className="flex-1 bg-background/50"
                />

                {/* ── Submit Button ── */}
                {/*
          disabled={isLoading || !url.trim()}
          - Button is disabled when loading OR when input is empty
          - This prevents double-submissions and empty requests
        */}
                <Button
                    type="submit"
                    disabled={isLoading || !url.trim()}
                    className="shrink-0"
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

            {/* ── Error Message ── */}
            {/*
        Conditional rendering: {error && <p>...</p>}
        - If error is "" (falsy), nothing renders
        - If error has text (truthy), the <p> element renders
        - This pattern is VERY common in React
      */}
            {error && (
                <p className="text-sm text-destructive">{error}</p>
            )}
        </form>
    );
}
