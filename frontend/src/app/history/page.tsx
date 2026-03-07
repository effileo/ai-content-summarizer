"use client";

import { useEffect, useState } from "react";
import { getHistory, type SummaryHistoryItem } from "@/lib/api";
import { Header } from "@/components/header";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Clock, Youtube, FileText, Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";

export default function HistoryPage() {
    const { user, isLoading: isAuthLoading } = useAuth();
    const [history, setHistory] = useState<SummaryHistoryItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!user) return; // Wait for user to be loaded

        const loadHistory = async () => {
            try {
                const data = await getHistory();
                setHistory(data);
            } catch (err: any) {
                setError(err.message || "Failed to load history.");
            } finally {
                setIsLoading(false);
            }
        };

        loadHistory();
    }, [user]);

    if (isAuthLoading || (isLoading && user)) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-background p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="mt-4 text-zinc-400">Loading your summaries...</p>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-background p-8 text-center">
                <h2 className="mb-4 text-2xl font-bold text-white">Access Denied</h2>
                <p className="mb-8 text-zinc-400">You must be logged in to view your history.</p>
                <Link href="/" className="text-primary hover:underline">
                    Return to home
                </Link>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen bg-background">
            {/* Background Mesh */}
            <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
                <div
                    className="animate-blob-1 absolute -left-32 -top-32 h-96 w-96 rounded-full opacity-30 blur-3xl"
                    style={{ background: "radial-gradient(circle, oklch(0.55 0.25 270 / 0.4), transparent 70%)" }}
                />
                <div
                    className="animate-blob-2 absolute -right-32 top-24 h-80 w-80 rounded-full opacity-25 blur-3xl"
                    style={{ background: "radial-gradient(circle, oklch(0.6 0.22 310 / 0.35), transparent 70%)" }}
                />
            </div>

            <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
                {/* Navigation */}
                <Link
                    href="/"
                    className="group mb-8 inline-flex items-center gap-2 text-sm font-medium text-zinc-400 transition-colors hover:text-white"
                >
                    <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                    Back to Summarizer
                </Link>

                {/* Header */}
                <div className="mb-12 flex items-center gap-4 border-b border-white/10 pb-8">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20">
                        <Clock className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white">Summary History</h1>
                        <p className="mt-1 text-zinc-400">All your AI-generated insights in one place.</p>
                    </div>
                </div>

                {/* Error State */}
                {error && (
                    <div className="mb-8 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-500">
                        <p>{error}</p>
                    </div>
                )}

                {/* Empty State */}
                {!isLoading && !error && history.length === 0 && (
                    <div className="flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-white/5 p-16 text-center backdrop-blur-sm">
                        <Clock className="mb-4 h-12 w-12 text-zinc-600" />
                        <h3 className="text-xl font-semibold text-white">No history yet</h3>
                        <p className="mt-2 text-zinc-400 mb-6">
                            Summarize a PDF or YouTube video to see it here.
                        </p>
                        <Link
                            href="/"
                            className="inline-flex h-10 items-center justify-center rounded-md bg-white px-8 text-sm font-medium text-black transition-colors hover:bg-zinc-200"
                        >
                            Start Summarizing
                        </Link>
                    </div>
                )}

                {/* History List */}
                <div className="grid gap-6">
                    {history.map((item) => (
                        <Card key={item.id} className="glass-panel overflow-hidden transition-all duration-300 hover:border-white/20 hover:bg-white-[0.03]">
                            <CardHeader className="flex flex-row items-start justify-between border-b border-white/5 bg-white/[0.02] pb-4">
                                <div className="space-y-1">
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        {item.source_type === "youtube" ? (
                                            <Youtube className="h-5 w-5 text-red-500" />
                                        ) : (
                                            <FileText className="h-5 w-5 text-blue-500" />
                                        )}
                                        <span className="truncate max-w-[400px]">{item.source_name}</span>
                                    </CardTitle>
                                    <CardDescription className="flex items-center gap-2">
                                        <Clock className="h-3.5 w-3.5" />
                                        {new Date(item.created_at).toLocaleDateString(undefined, {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </CardDescription>
                                </div>
                            </CardHeader>

                            <CardContent className="pt-6">
                                <div className="grid gap-8 md:grid-cols-3">
                                    {/* Summary Section */}
                                    <div className="md:col-span-2 space-y-3">
                                        <h4 className="text-sm font-semibold uppercase tracking-wider text-primary">Summary</h4>
                                        <p className="whitespace-pre-wrap text-[15px] leading-relaxed text-zinc-300 list-disc-styling">
                                            {item.summary}
                                        </p>
                                    </div>

                                    {/* Action Items Section */}
                                    {item.action_items && item.action_items.length > 0 && (
                                        <div className="space-y-3 rounded-xl border border-white/5 bg-white/[0.02] p-4">
                                            <h4 className="text-sm font-semibold uppercase tracking-wider text-amber-500">Action Items</h4>
                                            <ul className="space-y-3">
                                                {item.action_items.map((action, i) => (
                                                    <li key={i} className="flex gap-3 text-sm text-zinc-300">
                                                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-amber-500/70" />
                                                        <span className="leading-relaxed">{action}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
