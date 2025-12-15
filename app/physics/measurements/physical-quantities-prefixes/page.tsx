/**
 * page.tsx
 *
 * =========================================
 * WHAT THIS FILE IS
 * =========================================
 * This is a Next.js App Router PAGE file.
 *
 * It defines the webpage at:
 * /physics/measurements/physical-quantities-prefixes
 *
 * This file is a SERVER COMPONENT:
 * - It runs on the server
 * - It can read files from disk
 * - It does NOT run in the browser
 *
 * Its job is to:
 * 1. Read an MDX lesson file from disk
 * 2. Compile that MDX into React
 * 3. Allow custom React components inside the MDX
 * 4. Render math using KaTeX
 *
 * =========================================
 * WHEN THIS FILE RUNS
 * =========================================
 * - At request time (server-side)
 * - Every time a user opens this page
 *
 * =========================================
 * HOW NEXT.JS USES IT
 * =========================================
 * Next.js automatically finds this file because:
 * - It is named `page.tsx`
 * - It lives inside the `app/` folder
 * - Its folder structure maps directly to the URL
 *
 * No manual routing is required.
 */

// ===============================
// Node.js utilities (SERVER ONLY)
// ===============================

// fs = file system
// Used to read files from disk
import fs from "fs";

// path = safe way to build file paths
import path from "path";

// ===============================
// MDX rendering (SERVER)
// ===============================

// MDXRemote converts MDX source code into React components
// The `/rsc` version is specifically for SERVER COMPONENTS
import { MDXRemote } from "next-mdx-remote/rsc";

// ===============================
// MDX plugins
// ===============================

// Allows math syntax like: $v = \frac{d}{t}$
import remarkMath from "remark-math";

// Renders math using KaTeX (pretty equations)
import rehypeKatex from "rehype-katex";

// ===============================
// Custom React components
// ===============================

// These components can be used INSIDE the MDX file
// Example inside content.mdx:
// <BaseUnitTable />
// <PracticeMCQ_Homogenity />

import { BaseUnitTable } from "@/components/table";
import PracticeMCQ_BaseVsDerived from "@/components/h2_phy_measurements/physical_quantities_prefixes/PracticeMCQ_BaseVsDerived";
import PracticeMCQ_PrefixesConversion from "@/components/h2_phy_measurements/physical_quantities_prefixes/PracticeMCQ_PrefixesConversion";
import PracticeMCQ_Homogenity from "@/components/h2_phy_measurements/physical_quantities_prefixes/PracticeMCQ_Homogenity";

// ===============================
// Page component
// ===============================

/**
 * Page
 *
 * This is the default export, which Next.js treats
 * as the actual page renderer.
 *
 * It is marked `async` because:
 * - Reading files is an async operation
 * - MDX compilation can be async
 */
export default async function Page() {

  // =========================================
  // READ THE MDX FILE FROM DISK
  // =========================================

  /**
   * process.cwd()
   * → The root of your project
   *
   * path.join(...)
   * → Safely builds the file path across OSes
   *
   * fs.readFileSync(...)
   * → Reads the MDX file as a string
   *
   * IMPORTANT:
   * This ONLY works because this is a SERVER COMPONENT.
   * You CANNOT do this in a client component.
   */
  const source = fs.readFileSync(
    path.join(
      process.cwd(),
      "app",
      "physics",
      "measurements",
      "physical-quantities-prefixes",
      "content.mdx"
    ),
    "utf8"
  );

  // =========================================
  // RENDER THE MDX CONTENT
  // =========================================

  return (
    <MDXRemote
      /**
       * source
       * The raw MDX text read from the file
       */
      source={source}

      /**
       * components
       * This is the MOST IMPORTANT PART.
       *
       * It tells MDX:
       * "When you see these tags inside MDX,
       * use these React components."
       */
      components={{
        BaseUnitTable,
        PracticeMCQ_BaseVsDerived,
        PracticeMCQ_PrefixesConversion,
        PracticeMCQ_Homogenity,
      }}

      /**
       * options
       * Controls how MDX is processed
       */
      options={{
        mdxOptions: {
          // Enables LaTeX-style math syntax
          remarkPlugins: [remarkMath],

          // Converts math into rendered KaTeX HTML
          rehypePlugins: [rehypeKatex],
        },
      }}
    />
  );
}
