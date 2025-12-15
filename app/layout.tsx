/**
 * app/layout.tsx
 *
 * =========================================
 * WHAT THIS FILE IS
 * =========================================
 * This is the ROOT LAYOUT of the Next.js App Router.
 *
 * It defines the global structure of the entire website:
 * - HTML structure (<html>, <body>)
 * - Fonts
 * - Global CSS
 * - Sidebar layout
 * - Scrolling behaviour
 *
 * Every page in the app is rendered INSIDE this layout.
 *
 * =========================================
 * FILE TYPE
 * =========================================
 * - Layout (not a page)
 * - Server Component
 *
 * It runs on the server and does NOT handle user interaction.
 */

// ===============================
// Next.js types
// ===============================

// Metadata controls <title>, <meta description>, etc.
import type { Metadata } from "next";

// ===============================
// Fonts (server-side)
// ===============================

// Next.js font optimization system
// Fonts are loaded at build/request time, not via CSS files
import { Geist, Geist_Mono } from "next/font/google";

// ===============================
// Global styles
// ===============================

// Global Tailwind + base styles
// This file is applied to the entire site
import "./globals.css";

// KaTeX styles for math rendering in MDX
// Needed because MDX renders math as HTML
import "katex/dist/katex.min.css";

// ===============================
// Layout components
// ===============================

// Sidebar appears on EVERY page
// This is a Client Component (interactive)
import Sidebar from "../components/Sidebar";

// ===============================
// Font configuration
// ===============================

// Configure Geist Sans font
// This generates a CSS variable (--font-geist-sans)
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// Configure Geist Mono font
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ===============================
// Metadata (SEO)
// ===============================

// This controls the page title and description
// Automatically applied to every route
export const metadata: Metadata = {
  title: "Kin Chong's A Level H2 Physics Interactive Guide",
  description:
    "You can find H2 Physics notes, questions and relevant simulations here",
};

// ===============================
// Root Layout component
// ===============================

/**
 * RootLayout
 *
 * This function wraps ALL pages in the app.
 *
 * The `children` prop represents:
 * - The content of the current page
 * - Whatever `page.tsx` is being rendered
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Root HTML element (required in root layout)
    <html lang="en">
      <body
        /**
         * Font variables:
         * - Injects CSS variables for Geist fonts
         *
         * antialiased:
         * - Improves font rendering
         *
         * overflow-hidden:
         * - Prevents the BODY from scrolling
         * - This is important for your sidebar layout
         */
        className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-hidden`}
      >
        {/* 
          Full viewport layout
          - flex: horizontal layout
          - h-screen: exactly one viewport height
        */}
        <div className="flex h-screen">
          {/* 
            Sidebar
            - Appears on every page
            - Visually fixed because only <main> scrolls
          */}
          <Sidebar />

          {/* 
            Main content area
            - flex-1: take remaining width
            - overflow-y-auto: ONLY this scrolls
            - p-8: padding
            - bg-slate-50: background colour
          */}
          <main className="flex-1 overflow-y-auto p-8 bg-slate-50">
            {/*
              This is where page.tsx content is injected.
              Example:
              /physics/.../page.tsx → rendered here
            */}
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
