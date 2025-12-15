"use client";

import React, { useMemo, useState } from "react";

/**
 * PracticeMCQ_BaseVsDerived
 *
 * Adds an expand / collapse (toggle) feature
 * while preserving ALL existing quiz logic and behaviour.
 */
export default function PracticeMCQ_BaseVsDerived() {

  // ===============================
  // 🔹 TOGGLE UI STATE (NEW)
  // ===============================

  /**
   * isOpen
   * Controls whether the MCQ card is expanded or collapsed.
   * - false → collapsed (only header visible)
   * - true  → expanded (full question shown)
   *
   * IMPORTANT:
   * This state is purely UI-related.
   * It does NOT touch or reset quiz logic.
   */
  const [isOpen, setIsOpen] = useState(false);

  // ===============================
  // 1️⃣ QUIZ STATE VARIABLES (UNCHANGED)
  // ===============================

  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  // ===============================
  // 2️⃣ QUESTION DATA (UNCHANGED)
  // ===============================

  const question = "What is the unit of force, F, in base units?";

  const options = [
    "N",
    "kg m s⁻¹",
    "kg m s⁻²",
    "m s⁻²",
  ];

  const correctAnswer = "kg m s⁻²";

  // ===============================
  // 3️⃣ ANSWER CHECKING LOGIC (UNCHANGED)
  // ===============================

  const isCorrect = useMemo(() => {
    return selectedOption === correctAnswer;
  }, [selectedOption]);

  const isOptionCorrectAndShouldHighlight = (option: string) =>
    showAnswer && option === correctAnswer;

  // ===============================
  // 4️⃣ UI RENDERING
  // ===============================

  return (
    <section className="max-w-2xl">
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

        {/* ===============================
            TOGGLE HEADER (NEW)
            =============================== */}
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-expanded={isOpen}
          className="w-full flex items-center justify-between p-6 text-left"
        >
          <h2 className="text-lg font-semibold text-slate-900">
            Practice Question: Base Units
          </h2>

          {/* Simple visual indicator for expand / collapse */}
          <span
            className={`transition-transform duration-300 ${
              isOpen ? "rotate-180" : ""
            }`}
          >
            ▼
          </span>
        </button>

        {/* ===============================
            COLLAPSIBLE CONTENT WRAPPER (NEW)
            =============================== */}
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            isOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          {/* Inner padding separated so header padding is not animated */}
          <div className="px-6 pb-6">

            {/* Question text */}
            <p className="mt-1 text-slate-800">{question}</p>

            {/* ===============================
                OPTIONS SECTION
                =============================== */}
            <fieldset className="mt-4 space-y-2">
              <legend className="sr-only">Multiple choice options</legend>

              {options.map((option) => (
                <label
                  key={option}
                  className={[
                    "flex items-center gap-3 rounded-xl border px-4 py-3 cursor-pointer",
                    "transition-colors",
                    selectedOption === option
                      ? "border-slate-400 bg-slate-50"
                      : "border-slate-200 bg-white hover:bg-slate-50",
                    isOptionCorrectAndShouldHighlight(option)
                      ? "border-green-500 bg-green-50"
                      : "",
                  ].join(" ")}
                >
                  <input
                    type="radio"
                    name="force-base-units"
                    checked={selectedOption === option}
                    onChange={() => setSelectedOption(option)}
                    className="h-4 w-4"
                  />
                  <span className="text-slate-900">{option}</span>
                </label>
              ))}
            </fieldset>

            {/* ===============================
                SUBMIT BUTTON
                =============================== */}
            <button
              type="button"
              className="mt-5 rounded-xl bg-slate-900 px-4 py-2 text-white hover:bg-slate-800 disabled:opacity-50"
              disabled={selectedOption === null}
              onClick={() => {
                setHasSubmitted(true);
                setShowAnswer(false);
              }}
            >
              Submit Answer
            </button>

            {/* ===============================
                FEEDBACK SECTION
                =============================== */}
            {hasSubmitted && (
              <div className="mt-5 rounded-xl border bg-slate-50 p-4">

                {isCorrect ? (
                  <>
                    <p className="font-semibold text-green-700">✅ Correct!</p>
                    <p className="mt-2 text-slate-800">
                      <span className="font-medium">Why:</span> Force is defined
                      by <span className="font-medium">F = ma</span>.
                      <br />
                      Mass → <span className="font-medium">kg</span>, acceleration
                      → <span className="font-medium">m s⁻²</span>.
                      <br />
                      So the base unit is{" "}
                      <span className="font-medium">kg m s⁻²</span>.
                    </p>
                  </>
                ) : (
                  <>
                    <p className="font-semibold text-red-700">
                      ❌ That’s not correct.
                    </p>

                    <p className="mt-2 text-slate-800">
                      Think about the equation used to define force.
                    </p>

                    <div className="mt-4 flex gap-3">
                      <button
                        className="rounded-xl border px-4 py-2"
                        onClick={() => {
                          setSelectedOption(null);
                          setHasSubmitted(false);
                          setShowAnswer(false);
                        }}
                      >
                        Try Again
                      </button>

                      <button
                        className="rounded-xl bg-blue-600 px-4 py-2 text-white"
                        onClick={() => setShowAnswer(true)}
                      >
                        Show Answer
                      </button>
                    </div>

                    {showAnswer && (
                      <div className="mt-4 rounded-xl bg-blue-50 p-4">
                        <p className="font-semibold text-blue-900">
                          ✅ Answer: kg m s⁻²
                        </p>
                        <p className="mt-2 text-blue-900">
                          From <span className="font-medium">F = ma</span>:
                          <br />
                          <span className="font-mono">
                            kg × m s⁻² = kg m s⁻²
                          </span>
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
