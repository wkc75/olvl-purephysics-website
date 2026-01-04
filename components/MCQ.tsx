"use client";

import React, { useId, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

// ✅ IMPORTANT: Make sure KaTeX CSS is loaded globally (see Section 6).

export type MCQCorrectAnswer = number | string;

export type MCQProps = {
  title: string;
  question: string;
  options: string[];
  correctAnswer: MCQCorrectAnswer;
  hint: string;
  affirmation?: string;
  defaultOpen?: boolean;
  id?: string;
  className?: string;
};

/**
 * MathText
 * Renders plain text + $...$ inline math + $$...$$ display math safely.
 *
 * Why ReactMarkdown?
 * - Authors can write natural strings containing LaTeX delimiters.
 * - We do NOT enable raw HTML, so it’s safe-by-default.
 * - remark-math + rehype-katex handles the math rendering.
 */
type MathTextProps = {
  text: string;
  className?: string;
};

export function MathText({ text, className }: MathTextProps) {
  return (
    <div className={className}>
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex]}
      >
        {text}
      </ReactMarkdown>
    </div>
  );
}

/**
 * MCQ
 * - Collapsible card (collapsed by default)
 * - Radio options + Submit
 * - Wrong → hint + retry (no answer reveal)
 * - Correct → lock + affirmation
 * - Accessible fieldset/legend + aria-expanded + keyboard-friendly
 */
export default function MCQ({
  title,
  question,
  options,
  correctAnswer,
  hint,
  affirmation = "Correct — nice work.",
  defaultOpen = false,
  id,
  className = "",
}: MCQProps) {
  const autoId = useId();
  const baseId = id ?? `mcq-${autoId}`;

  // Collapsible UI state (does NOT affect quiz state)
  const [isOpen, setIsOpen] = useState(defaultOpen);

  // Quiz interaction state
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [status, setStatus] = useState<"idle" | "correct" | "wrong">("idle");

  const isLocked = status === "correct";

  // Resolve correct index in a robust way (supports index OR string)
  const correctIndex = useMemo(() => {
    if (typeof correctAnswer === "number") return correctAnswer;
    return options.findIndex((opt) => opt === correctAnswer);
  }, [correctAnswer, options]);

  // Defensive: if author passes a string not in options, we still behave sensibly.
  const canGrade = correctIndex >= 0 && correctIndex < options.length;

  function onSubmit() {
    if (isLocked) return;
    if (selectedIndex === null) return;

    // If grading is impossible due to authoring mismatch, treat as wrong (but you should fix the content).
    if (!canGrade) {
      setStatus("wrong");
      return;
    }

    if (selectedIndex === correctIndex) {
      setStatus("correct");
    } else {
      setStatus("wrong");
    }
  }

  function onTryAgain() {
    // Pedagogical choice: keep the hint visible, but reset selection so the student re-commits deliberately.
    setSelectedIndex(null);
    setStatus("idle");
  }

  const showHint = status === "wrong";
  const showAffirmation = status === "correct";

  const submitDisabled = isLocked || selectedIndex === null;

  return (
    <section
      className={[
        "w-full max-w-3xl rounded-2xl border border-slate-200 bg-white shadow-sm",
        "overflow-hidden",
        className,
      ].join(" ")}
    >
      {/* Collapsible header */}
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        aria-expanded={isOpen}
        aria-controls={`${baseId}-panel`}
        className={[
          "w-full text-left px-5 py-4",
          "flex items-center justify-between gap-4",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400",
          "hover:bg-slate-50 transition-colors",
        ].join(" ")}
      >
        <div className="min-w-0">
          {/* Title supports LaTeX */}
          <MathText
            text={title}
            className="text-base font-semibold text-slate-900 [&>p]:m-0"
          />
          <p className="mt-1 text-sm text-slate-500">
            {isOpen ? "Click to collapse" : "Click to expand"}
          </p>
        </div>

        {/* Simple chevron (no external icon library) */}
        <span
          aria-hidden="true"
          className={[
            "shrink-0 inline-flex h-9 w-9 items-center justify-center rounded-full",
            "border border-slate-200 bg-white",
            "transition-transform duration-200",
            isOpen ? "rotate-180" : "rotate-0",
          ].join(" ")}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-slate-600"
          >
            <path
              d="M5 8L10 13L15 8"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>

      {/* Animated collapsible panel
          Technique: grid rows from 0fr -> 1fr for smooth height animation.
      */}
      <div
        id={`${baseId}-panel`}
        className={[
          "grid transition-[grid-template-rows] duration-300 ease-in-out",
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        ].join(" ")}
      >
        <div className="overflow-hidden">
          <div className="px-5 pb-5 pt-1">
            <fieldset
              disabled={isLocked}
              className={[
                "rounded-xl border",
                status === "correct"
                  ? "border-emerald-200 bg-emerald-50/40"
                  : status === "wrong"
                  ? "border-rose-200 bg-rose-50/30"
                  : "border-slate-200 bg-white",
                "p-4",
              ].join(" ")}
            >
              {/* legend for screen readers (title already visible) */}
              <legend className="sr-only">{title}</legend>

              {/* Question stem (supports LaTeX + paragraphs) */}
              <MathText
                text={question}
                className={[
                  "text-slate-900 leading-relaxed",
                  // ReactMarkdown outputs <p> by default; keep spacing clean:
                  "[&>p]:my-0 [&>p+p]:mt-3",
                ].join(" ")}
              />

              {/* Options */}
              <div className="mt-4 space-y-2">
                {options.map((opt, idx) => {
                  const inputId = `${baseId}-opt-${idx}`;
                  const isSelected = selectedIndex === idx;

                  return (
                    <label
                      key={inputId}
                      htmlFor={inputId}
                      className={[
                        "flex items-start gap-3 rounded-xl border px-3 py-2",
                        "cursor-pointer transition-colors",
                        "focus-within:ring-2 focus-within:ring-slate-400 focus-within:ring-offset-2 focus-within:ring-offset-white",
                        isLocked
                          ? "cursor-default opacity-90"
                          : "hover:bg-slate-50",
                        isSelected
                          ? "border-slate-400 bg-slate-50"
                          : "border-slate-200 bg-white",
                      ].join(" ")}
                    >
                      <input
                        id={inputId}
                        type="radio"
                        name={`${baseId}-group`}
                        className="mt-1"
                        checked={isSelected}
                        onChange={() => {
                          if (isLocked) return;
                          setSelectedIndex(idx);
                          // If student changes mind after wrong, clear the "wrong" banner
                          if (status === "wrong") setStatus("idle");
                        }}
                      />

                      {/* Option text supports LaTeX */}
                      <MathText
                        text={opt}
                        className="text-slate-900 [&>p]:m-0"
                      />
                    </label>
                  );
                })}
              </div>

              {/* Actions */}
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={onSubmit}
                  disabled={submitDisabled}
                  className={[
                    "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold",
                    "transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400",
                    submitDisabled
                      ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                      : "bg-slate-900 text-white hover:bg-slate-800",
                  ].join(" ")}
                >
                  Submit
                </button>

                {/* Feedback area */}
                <div className="min-w-[220px] flex-1">
                  {showAffirmation && (
                    <div className="flex items-start gap-2 text-emerald-800">
                      {/* Green tick */}
                      <span
                        className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-white"
                        aria-hidden="true"
                      >
                        ✓
                      </span>

                      <MathText
                        text={affirmation}
                        className="text-sm [&>p]:m-0"
                      />
                    </div>
                  )}

                  {showHint && (
                    <div className="space-y-2">
                      <div className="text-sm text-rose-800">
                        <p className="m-0 font-semibold">Not quite.</p>
                        <p className="m-0 text-rose-700">
                          Hint (use this, then try again — answer not revealed):
                        </p>
                      </div>

                      <div className="rounded-xl border border-rose-200 bg-white px-3 py-2">
                        <MathText
                          text={hint}
                          className="text-sm text-slate-900 [&>p]:m-0 [&>p+p]:mt-2"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={onTryAgain}
                        className={[
                          "inline-flex items-center rounded-xl border border-slate-200",
                          "px-3 py-2 text-sm font-semibold text-slate-900",
                          "hover:bg-slate-50 transition-colors",
                          "focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400",
                        ].join(" ")}
                      >
                        Try again
                      </button>
                    </div>
                  )}

                  {/* Authoring warning (helps you debug silently without breaking UI) */}
                  {!canGrade && (
                    <p className="mt-2 text-xs text-amber-700">
                      Authoring note: <code>correctAnswer</code> does not match any option.
                      Prefer passing an index, or ensure the string matches exactly.
                    </p>
                  )}
                </div>
              </div>

              {/* Lock hint for UX clarity */}
              {isLocked && (
                <p className="mt-3 text-xs text-emerald-700">
                  Locked (you got it correct). Move on to the next question.
                </p>
              )}
            </fieldset>
          </div>
        </div>
      </div>
    </section>
  );
}
