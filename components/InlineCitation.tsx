"use client";

import React, {
  useCallback,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

type InlineCitationProps = {
  /**
   * label
   * What shows inline, e.g. "1a" -> renders as [1a]
   */
  label: string;

  /**
   * content
   * Tooltip content. Can be a string or ReactNode.
   * (In MDX, passing rich JSX is often easier via children.)
   */
  content?: React.ReactNode;

  /**
   * children
   * Alternative to `content` for JSX-rich tooltip content:
   * <InlineCitation label="1a"> ... </InlineCitation>
   */
  children?: React.ReactNode;

  /**
   * sideOffset
   * Pixel offset between the citation and tooltip.
   */
  sideOffset?: number;

  /**
   * maxWidth
   * Tooltip max width (px). Prevents super-wide tooltips.
   */
  maxWidth?: number;

  /**
   * className
   * Optional styling override for the inline citation token.
   */
  className?: string;
};

type Pos = { top: number; left: number };

export default function InlineCitation({
  label,
  content,
  children,
  sideOffset = 8,
  maxWidth = 320,
  className,
}: InlineCitationProps) {
  const tooltipId = useId();
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  // Controls visibility (hover/focus)
  const [open, setOpen] = useState(false);

  // Stores computed tooltip position (fixed coords)
  const [pos, setPos] = useState<Pos | null>(null);

  const tooltipBody = useMemo(() => {
    // Prefer children if provided, else content
    return children ?? content;
  }, [children, content]);

  const close = useCallback(() => setOpen(false), []);
  const openNow = useCallback(() => setOpen(true), []);

  const computePosition = useCallback(() => {
    const el = triggerRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();

    // Basic placement: below & aligned to left edge of the citation
    // Using fixed positioning so it never affects layout and follows viewport.
    let top = rect.bottom + sideOffset;
    let left = rect.left;

    // Clamp within viewport horizontally
    const padding = 8;
    const vw = window.innerWidth;
    const clampedLeft = Math.min(Math.max(left, padding), vw - maxWidth - padding);
    left = clampedLeft;

    // If tooltip would go below viewport, flip above
    const estimatedHeight = 120; // small estimate; good enough for flipping logic
    const vh = window.innerHeight;
    if (top + estimatedHeight > vh - padding) {
      top = rect.top - sideOffset;
    }

    setPos({ top, left });
  }, [sideOffset, maxWidth]);

  // When opening, measure position immediately (before paint) to reduce flicker.
  useLayoutEffect(() => {
    if (!open) return;
    computePosition();

    // Recompute on scroll/resize while open so tooltip stays near the citation.
    const onScroll = () => computePosition();
    const onResize = () => computePosition();

    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onResize);
    };
  }, [open, computePosition]);

  // Keyboard: Escape closes tooltip
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") close();
  };

  // If there’s no tooltip content, don’t render anything fancy
  if (!tooltipBody) {
    return (
      <span className="align-baseline text-xs text-slate-500">[{label}]</span>
    );
  }

  return (
    <>
      {/* Inline trigger token */}
      <button
        ref={triggerRef}
        type="button"
        className={[
          // academic-style: tiny, subtle, inline, no layout jump
          "inline align-baseline",
          "text-xs text-blue-600 hover:text-blue-900",
          "rounded px-1",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400",
          // prevent changing line height: keep it compact
          "leading-none",
          className ?? "",
        ].join(" ")}
        aria-describedby={open ? tooltipId : undefined}
        onMouseEnter={openNow}
        onMouseLeave={close}
        onFocus={openNow}
        onBlur={close}
        onKeyDown={onKeyDown}
      >
        [{label}]
      </button>

      {/* Tooltip in a portal so it won't be clipped by parents / won't reflow layout */}
      {open && pos && typeof document !== "undefined"
        ? createPortal(
            <div
              id={tooltipId}
              role="tooltip"
              aria-live="polite"
              // Tooltip should NOT trap focus; it’s informational only
              tabIndex={-1}
              style={{
                position: "fixed",
                top: pos.top,
                left: pos.left,
                maxWidth: maxWidth,
                zIndex: 50,
              }}
              className={[
                // Animation: fade + slight lift
                "transform transition duration-150 ease-out",
                // When placed above (flip), we still want it to feel “lifted”.
                "opacity-100 translate-y-0",
                // Visual style
                "rounded-lg border border-slate-200 bg-white shadow-lg",
                "px-3 py-2 text-sm text-slate-800",
              ].join(" ")}
            >
              {/* Small visual hint: keep it compact like a footnote */}
              <div className="text-xs font-semibold text-slate-500 mb-1">
                Source [{label}]
              </div>
              <div className="leading-snug">{tooltipBody}</div>
            </div>,
            document.body
          )
        : null}
    </>
  );
}
