/*
  HEADER COMPONENT
  =================
  The top branding section of our app.

  WHAT YOU'LL LEARN:
  - How to create a reusable React component in Next.js
  - Lucide icons (icon library that comes with shadcn/ui)
  - CSS gradient text effects
  - Component composition (this component is used inside page.tsx)

  WHY A SEPARATE COMPONENT?
  - Keeps page.tsx clean and focused
  - Can be reused across multiple pages later
  - Easier to maintain and test
*/

import { Sparkles } from "lucide-react";

export function Header() {
    return (
        <header className="flex flex-col items-center gap-4 text-center">
            {/* ── App Icon ── */}
            {/* 
        The icon sits inside a rounded square with a gradient background.
        "p-3 rounded-2xl" = padding + rounded corners
        The gradient goes from indigo to purple, matching our brand.
      */}
            <div className="flex items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 p-3 ring-1 ring-primary/20">
                <Sparkles className="h-8 w-8 text-primary" />
            </div>

            {/* ── App Name ── */}
            {/* 
        "gradient-text" is our custom class from globals.css.
        It fills the text with a gradient instead of a solid color.
        "tracking-tight" tightens letter spacing for a modern look.
      */}
            <h1 className="gradient-text text-4xl font-bold tracking-tight sm:text-5xl">
                AI Content Summarizer
            </h1>

            {/* ── Tagline ── */}
            <p className="max-w-lg text-lg text-muted-foreground">
                Transform PDFs and YouTube videos into{" "}
                <span className="font-medium text-foreground">structured summaries</span>{" "}
                and{" "}
                <span className="font-medium text-foreground">action items</span>{" "}
                — powered by Google Gemini.
            </p>
        </header>
    );
}
