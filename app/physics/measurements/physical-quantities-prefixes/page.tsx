/**
 * page.tsx
 *
 * =========================================
 * WHAT THIS FILE IS
 * =========================================
 * A Next.js App Router PAGE.
 *
 * Route:
 * /physics/measurements/physical-quantities-prefixes
 *
 * This file is a SERVER COMPONENT by default.
 *
 * Its ONLY responsibility is to:
 * - Render precompiled MDX content
 *
 * MDX compilation, math processing, and component
 * mapping are handled elsewhere:
 * - @next/mdx (build-time)
 * - next.config.mjs (remark / rehype)
 * - mdx-components.tsx (custom components)
 */

// ===============================
// MDX content (BUILD-TIME)
// ===============================

// Because @next/mdx is enabled,
// this MDX file is compiled at build time
// and can be imported like a normal React component.
import Content from "./content.mdx";

// ===============================
// Page component
// ===============================

export default function Page() {
  return <Content />;
}
