/*
  ACTION ITEMS COMPONENT
  =======================
  An interactive checklist displaying action items extracted by the AI.

  WHAT YOU'LL LEARN:
  - Managing a list of items with state (array of booleans)
  - The shadcn/ui Checkbox component
  - Array.map() for rendering lists in React
  - Toggling individual items in an array without mutating state

  WHY NOT JUST MUTATE THE ARRAY?
  React uses "reference equality" to detect changes.
  If you do: checkedItems[0] = true  ← React won't notice (same array ref)
  Instead:  setCheckedItems([...copy]) ← New array = React sees the change
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
import { ListChecks } from "lucide-react";

interface ActionItemsProps {
    items: string[];
}

export function ActionItems({ items }: ActionItemsProps) {
    /*
      STATE: An array of booleans, one per item
      - items = ["Review docs", "Write tests"]
      - checkedItems = [false, false]  ← track which are checked
      - Array(items.length).fill(false) creates [false, false, ...]
    */
    const [checkedItems, setCheckedItems] = useState<boolean[]>(
        () => new Array(items.length).fill(false)
    );

    /*
      TOGGLE HANDLER
      - Creates a NEW array (spread operator [...])
      - Flips the value at the given index
      - Sets the new array as state → React re-renders
    */
    const toggleItem = (index: number) => {
        setCheckedItems((prev) => {
            const next = [...prev];
            next[index] = !next[index];
            return next;
        });
    };

    // Count how many items are checked (for progress display)
    const completedCount = checkedItems.filter(Boolean).length;

    if (items.length === 0) return null;

    return (
        <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                            <ListChecks className="h-5 w-5 text-primary" />
                        </div>
                        <CardTitle className="text-lg">Action Items</CardTitle>
                    </div>
                    {/* Progress counter */}
                    <span className="text-sm text-muted-foreground">
                        {completedCount}/{items.length} done
                    </span>
                </div>
            </CardHeader>
            <CardContent>
                {/* 
          items.map() — THE core React pattern for rendering lists
          - For each item in the array, we return a JSX element
          - "key={index}" helps React track which items changed
            (in production, use unique IDs instead of indexes)
        */}
                <ul className="space-y-3">
                    {items.map((item, index) => (
                        <li
                            key={index}
                            className="flex items-start gap-3 rounded-lg p-2 transition-colors hover:bg-muted/30"
                        >
                            <Checkbox
                                id={`action-item-${index}`}
                                checked={checkedItems[index]}
                                onCheckedChange={() => toggleItem(index)}
                                className="mt-0.5"
                            />
                            <label
                                htmlFor={`action-item-${index}`}
                                className={`cursor-pointer text-sm leading-relaxed transition-all ${checkedItems[index]
                                        ? "text-muted-foreground line-through"
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
