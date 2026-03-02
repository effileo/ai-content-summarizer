/*
  SUMMARY DISPLAY COMPONENT
  ==========================
  Shows the AI-generated structured summary in a styled card.

  WHAT YOU'LL LEARN:
  - Clipboard API (navigator.clipboard.writeText)
  - Conditional rendering with multiple states
  - Lucide icons for visual indicators
  - Component composition with shadcn/ui Card
*/

"use client";

import { useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Copy, FileText, Youtube, Sparkles } from "lucide-react";

interface SummaryDisplayProps {
    summary: string;
    sourceType: "pdf" | "youtube";
    sourceName: string;
}

export function SummaryDisplay({
    summary,
    sourceType,
    sourceName,
}: SummaryDisplayProps) {
    const [copied, setCopied] = useState(false);

    /*
      CLIPBOARD API
      - navigator.clipboard.writeText() copies text to the user's clipboard
      - It returns a Promise (async), so we use .then()
      - We show a "Copied!" confirmation for 2 seconds using setTimeout
    */
    const handleCopy = () => {
        navigator.clipboard.writeText(summary).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                            <Sparkles className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <CardTitle className="text-lg">Summary</CardTitle>
                            <CardDescription className="flex items-center gap-2">
                                {/* Badge shows what type of content was summarized */}
                                <Badge variant="secondary" className="gap-1 text-xs">
                                    {sourceType === "youtube" ? (
                                        <Youtube className="h-3 w-3" />
                                    ) : (
                                        <FileText className="h-3 w-3" />
                                    )}
                                    {sourceType === "youtube" ? "YouTube" : "PDF"}
                                </Badge>
                                <span className="max-w-[200px] truncate text-xs">
                                    {sourceName}
                                </span>
                            </CardDescription>
                        </div>
                    </div>

                    {/* Copy button */}
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleCopy}
                        className="shrink-0"
                    >
                        {copied ? (
                            <>
                                <Check className="h-4 w-4 text-green-500" />
                                Copied!
                            </>
                        ) : (
                            <>
                                <Copy className="h-4 w-4" />
                                Copy
                            </>
                        )}
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                {/* 
          "whitespace-pre-wrap" preserves line breaks from the AI response.
          Without it, all text would render on one line.
          "leading-relaxed" adds comfortable spacing between lines.
        */}
                <div className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
                    {summary}
                </div>
            </CardContent>
        </Card>
    );
}
