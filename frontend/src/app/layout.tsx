import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

/*
  WHY Inter FONT?
  - Inter is designed specifically for screens/UIs
  - It has excellent readability at small sizes
  - Used by companies like GitHub, Figma, Linear
  - The "variable" option loads it as a CSS variable,
    so we can reference it as font-family: var(--font-inter)
*/
const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

/*
  METADATA — SEO (Search Engine Optimization)
  - title: What shows in the browser tab
  - description: What Google shows under your site's link in search results
  - Good metadata = better discoverability + professional look
*/
export const metadata: Metadata = {
  title: "AI Content Summarizer | PDF & YouTube Summaries",
  description:
    "Transform PDFs and YouTube videos into structured summaries and actionable checklists using Google Gemini AI.",
};

/*
  ROOT LAYOUT
  - This wraps EVERY page in your app
  - Think of it as the <html> + <body> shell
  - The {children} prop is whatever page component is currently active
  - "antialiased" makes fonts render smoother on screens
*/
import { AuthProvider } from "@/context/auth-context";
import { ThemeProvider } from "@/components/theme-provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
