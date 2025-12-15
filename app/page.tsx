/**
 * app/page.tsx
 *
 * =========================================
 * WHAT THIS FILE IS
 * =========================================
 * This file defines the HOME PAGE of the website.
 *
 * Route:
 * /
 *
 * It introduces the author and explains the purpose
 * of the website.
 *
 * =========================================
 * COMPONENT TYPE
 * =========================================
 * - Page
 * - Server Component (default)
 *
 * No "use client" is needed because:
 * - There is no user interaction
 * - No state or effects
 */

// ===============================
// Next.js Image component
// ===============================

import Image from "next/image";

// ===============================
// Home page component
// ===============================

export default function Home() {
  return (
    /**
     * Outer wrapper
     * - Centers content both vertically and horizontally
     * - Ensures full viewport height
     * - Handles light / dark background
     */
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      
      {/*
        Main content container
        - Limits content width for readability
        - Uses vertical layout
        - Adds generous padding for breathing space
      */}
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">

        {/*
          Intro text section
          - Contains heading and descriptive paragraph
          - Responsive alignment (center on mobile, left on desktop)
        */}
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          
          {/* Main heading */}
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            Hi, I’m Wong Kin Chong.
          </h1>

          {/* Description / mission statement */}
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            I am a Year 1 Computer Science student at the National University of Singapore (NUS)
            and a tuition teacher. Physics is my favourite subject to teach.
            <br />
            <br />
            This website exists because, unlike O-Level Physics, H2 Physics does not have a single,
            well-structured textbook. Many students struggle to find clear and coherent notes.
            My goal is to build a place with structured, student-friendly explanations for my own
            students and other H2 Physics learners.
            <br />
            <br />
            The site is still under development. In the long run, I hope to include all H2 Physics
            chapters, practice questions, and interactive simulations to help build real intuition.
          </p>
        </div>

        {/*
          Call-to-action buttons
          - Links styled as buttons
          - Encourage users to explore the site
        */}
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
        </div>
      </main>
    </div>
  );
}
