/**
 * components/BaseUnitTable.tsx
 *
 * =========================================
 * WHAT THIS FILE IS
 * =========================================
 * This file defines a reusable TABLE WRAPPER
 * for physics content.
 *
 * It is designed to be used inside MDX files
 * to display physics tables with consistent
 * styling.
 *
 * =========================================
 * COMPONENT TYPE
 * =========================================
 * - Component
 * - Server Component (default)
 *
 * No "use client" is present, so:
 * - It runs on the server
 * - It produces static HTML
 */

// ===============================
// React types
// ===============================

import React from "react";

// ===============================
// BaseUnitTable component
// ===============================

/**
 * BaseUnitTable
 *
 * This component wraps a <table> element
 * with consistent styling and layout.
 *
 * It accepts `children`, which represents
 * the actual table rows and cells written
 * in MDX.
 */
export default function Table({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    /**
     * Outer wrapper
     * - Used for layout, scrolling, or spacing
     * - Styled via CSS class `table-wrapper`
     */
    <div className="table-wrapper">
      
      {/*
        Table element
        - Uses `physics-table` class for
          consistent styling
        - Actual table content comes from `children`
      */}
      <table className="physics-table">
        {children}
      </table>
    </div>
  );
}
