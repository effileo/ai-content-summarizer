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
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

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

    const handleCopy = () => {
        navigator.clipboard.writeText(summary).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <Card className="animate-fade-in-up gradient-accent-left overflow-hidden border-border/50 bg-card/80 backdrop-blur-sm">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/5">
                            <Sparkles className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <CardTitle className="text-lg">Summary</CardTitle>
                            <CardDescription className="flex items-center gap-2">
                                <Badge
                                    variant="secondary"
                                    className={`gap-1 text-xs ${sourceType === "youtube"
                                        ? "border-red-500/20 bg-red-500/10 text-red-400"
                                        : "border-primary/20 bg-primary/10 text-primary"
                                        }`}
                                >
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

                    {/* Copy button with success animation */}
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleCopy}
                        className={`shrink-0 transition-all ${copied
                            ? "text-green-500 hover:text-green-500"
                            : "text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        {copied ? (
                            <>
                                <Check className="animate-check-bounce h-4 w-4" />
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
                <div className="prose prose-neutral dark:prose-invert max-w-none text-sm leading-relaxed text-foreground/90 
                    prose-headings:text-primary prose-headings:font-semibold 
                    prose-h1:text-xl prose-h2:text-lg prose-h3:text-base 
                    prose-p:leading-relaxed prose-p:text-foreground/90
                    prose-a:text-primary hover:prose-a:text-primary/80 
                    prose-strong:text-foreground 
                    prose-ul:list-disc prose-ol:list-decimal prose-li:-my-2">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {summary}
                    </ReactMarkdown>
                </div>
            </CardContent>
        </Card>
    );
}
