/*
  ACTION ITEMS COMPONENT — Refined
  ==================================
  Animated progress bar, staggered entrance, check bounce, strikethrough.
*/

"use client";

import { useState } from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ListChecks, Trophy } from "lucide-react";

interface ActionItemsProps {
    items: string[];
}

export function ActionItems({ items }: ActionItemsProps) {
    const [checkedItems, setCheckedItems] = useState<boolean[]>(
        () => new Array(items.length).fill(false)
    );

    const toggleItem = (index: number) => {
        setCheckedItems((prev) => {
            const next = [...prev];
            next[index] = !next[index];
            return next;
        });
    };

    const completedCount = checkedItems.filter(Boolean).length;
    const progressPercent = items.length > 0 ? (completedCount / items.length) * 100 : 0;
    const allDone = completedCount === items.length && items.length > 0;

    if (items.length === 0) return null;

    return (
        <Card className="animate-fade-in-up delay-200 gradient-accent-left overflow-hidden border-border/50 bg-card/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/5">
                            {allDone ? (
                                <Trophy className="h-5 w-5 text-amber-500" />
                            ) : (
                                <ListChecks className="h-5 w-5 text-primary" />
                            )}
                        </div>
                        <CardTitle className="text-lg">
                            {allDone ? "All Done! 🎉" : "Action Items"}
                        </CardTitle>
                    </div>
                    {/* Progress counter */}
                    <span
                        className={`text-sm font-medium transition-colors ${allDone ? "text-green-500" : "text-muted-foreground"
                            }`}
                    >
                        {completedCount}/{items.length}
                    </span>
                </div>

                {/* ── Animated Progress Bar ── */}
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
                    <div
                        className="progress-fill h-full rounded-full"
                        style={{ width: `${progressPercent}%` }}
                    />
                </div>
            </CardHeader>
            <CardContent>
                <ul className="space-y-1">
                    {items.map((item, index) => (
                        <li
                            key={index}
                            className={`flex items-start gap-3 rounded-lg p-2.5 transition-all duration-200 hover:bg-muted/30 ${checkedItems[index] ? "opacity-60" : ""
                                }`}
                            style={{ animationDelay: `${(index + 1) * 80}ms` }}
                        >
                            <Checkbox
                                id={`action-item-${index}`}
                                checked={checkedItems[index]}
                                onCheckedChange={() => toggleItem(index)}
                                className={`mt-0.5 transition-all ${checkedItems[index] ? "animate-check-bounce" : ""
                                    }`}
                            />
                            <label
                                htmlFor={`action-item-${index}`}
                                className={`cursor-pointer text-sm leading-relaxed transition-all duration-300 ${checkedItems[index]
                                        ? "text-muted-foreground line-through decoration-primary/40"
                                        : "text-foreground"
                                    }`}
                            >
                                {item}
                            </label>
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    );
}
