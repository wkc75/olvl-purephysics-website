"use client";

import React, { useMemo, useState } from "react";

/**
 * PracticeMCQ_PrefixConversion
 *
 * A single, interactive MCQ practice component for SI prefix conversions.
 *
 * Topic: Prefixes (SI units)
 * Question: "What is 12.3 km in pm?"
 *
 * This component includes:
 * ✅ Expand / Collapse toggle (collapsed by default)
 * ✅ MCQ selection + submit
 * ✅ Correct / Wrong feedback
 * ✅ "Try Again" + "Show Answer" flow
 * ✅ Highlights correct option ONLY when "Show Answer" is clicked
 *
 * IMPORTANT DESIGN RULE:
 * - Toggle state should NOT reset quiz progress.
 *   (So expanding/collapsing does not change selectedOption, hasSubmitted, showAnswer.)
 */
export default function PracticeMCQ_PrefixConversion() {
  // =========================================================
  // 0️⃣ TOGGLE UI STATE (controls expand/collapse only)
  // =========================================================
  /**
   * isOpen
   * - false: collapsed (only header visible)
   * - true : expanded (full question visible)
   *
   * This is purely UI state (layout).
   * It should NOT affect quiz state.
   */
  const [isOpen, setIsOpen] = useState(false);

  // =========================================================
  // 1️⃣ QUIZ STATE VARIABLES (controls learning logic)
  // =========================================================
  /**
   * selectedOption
   * Stores what the student selected.
   * - null means: student hasn't chosen an option yet
   * - string means: one of the option strings (e.g., "1.23 × 10¹⁶ pm")
   */
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  /**
   * hasSubmitted
   * Controls whether feedback is shown.
   * - false: no feedback shown (student still thinking)
   * - true : feedback appears (after "Submit Answer")
   */
  const [hasSubmitted, setHasSubmitted] = useState(false);

  /**
   * showAnswer
   * Only used after a wrong attempt.
   * - false: do not reveal correct option/explanation
   * - true : highlight correct option + show full explanation
   */
  const [showAnswer, setShowAnswer] = useState(false);

  // =========================================================
  // 2️⃣ QUESTION DATA (the physics content)
  // =========================================================
  const question = "What is 12.3 km in pm?";

  /**
   * We include 4 options with common mistakes:
   *
   * Correct reasoning (summary):
   * - km → m: multiply by 10³
   * - m  → pm: multiply by 10¹²
   * - total multiply by 10^(3+12) = 10^15
   * - 12.3 × 10^15 = 1.23 × 10^16 (scientific form)
   *
   * Common mistakes included:
   * - using 10^12 only (forgetting kilo)
   * - adding powers wrong (10^14)
   * - keeping non-scientific form (12.3 × 10^15)
   */
  const options = [
    "1.23 × 10¹⁶ pm", // ✅ correct (proper scientific form)
    "1.23 × 10¹⁵ pm", // ❌ power too small (off by 10)
    "1.23 × 10¹⁴ pm", // ❌ power too small (off by 100)
    "12.3 × 10¹⁵ pm", // ❌ equivalent value but NOT in scientific form
  ];

  const correctAnswer = "1.23 × 10¹⁶ pm";

  // =========================================================
  // 3️⃣ ANSWER CHECKING LOGIC (programming logic)
  // =========================================================
  /**
   * isCorrect
   * - true if the student selected the correctAnswer
   * - false otherwise
   *
   * useMemo is used to clearly express:
   * "isCorrect is a value derived from selectedOption"
   * It recalculates only when selectedOption changes.
   */
  const isCorrect = useMemo(() => {
    return selectedOption === correctAnswer;
  }, [selectedOption, correctAnswer]);

  /**
   * This helper decides if an option should be highlighted green.
   * We ONLY highlight the correct option when:
   * - showAnswer === true
   * - AND option === correctAnswer
   */
  const isOptionCorrectAndShouldHighlight = (option: string) =>
    showAnswer && option === correctAnswer;

  // =========================================================
  // 4️⃣ UI RENDERING (what the student sees)
  // =========================================================
  return (
    <section className="max-w-2xl">
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* =====================================================
            TOGGLE HEADER (always visible)
            ===================================================== */}
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-expanded={isOpen}
          className="w-full flex items-center justify-between p-6 text-left"
        >
          <h2 className="text-lg font-semibold text-slate-900">
            Practice Question: Prefix Conversion
          </h2>

          {/* Simple arrow indicator that rotates when expanded */}
          <span
            className={`transition-transform duration-300 ${
              isOpen ? "rotate-180" : ""
            }`}
          >
            ▼
          </span>
        </button>

        {/* =====================================================
            COLLAPSIBLE CONTENT WRAPPER (animated)
            =====================================================
            How animation works:
            - overflow-hidden hides content when collapsed
            - max-h controls the "height" transition
            - opacity makes it fade in/out smoothly
            IMPORTANT: This does NOT touch quiz state.
        */}
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            isOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          {/* Inner padding is here so header padding doesn't animate */}
          <div className="px-6 pb-6">
            {/* Question text */}
            <p className="mt-1 text-slate-800">{question}</p>

            {/* =====================================================
                OPTIONS SECTION (radio buttons)
                ===================================================== */}
            <fieldset className="mt-4 space-y-2">
              <legend className="sr-only">Multiple choice options</legend>

              {options.map((option) => (
                <label
                  key={option}
                  className={[
                    // Base styling for each option row
                    "flex items-center gap-3 rounded-xl border px-4 py-3 cursor-pointer",
                    "transition-colors",

                    // If selected, make it slightly darker so student sees their choice
                    selectedOption === option
                      ? "border-slate-400 bg-slate-50"
                      : "border-slate-200 bg-white hover:bg-slate-50",

                    // Highlight the correct option only when "Show Answer" is clicked
                    isOptionCorrectAndShouldHighlight(option)
                      ? "border-green-500 bg-green-50"
                      : "",
                  ].join(" ")}
                >
                  {/* Radio input is "controlled":
                      checked depends on selectedOption (state)
                      onChange updates selectedOption
                  */}
                  <input
                    type="radio"
                    name="prefix-conversion"
                    checked={selectedOption === option}
                    onChange={() => {
                      // Triggered when student selects an option.
                      // This updates state → React re-renders → UI updates.
                      setSelectedOption(option);
                    }}
                    className="h-4 w-4"
                  />

                  <span className="text-slate-900">{option}</span>
                </label>
              ))}
            </fieldset>

            {/* =====================================================
                SUBMIT BUTTON
                =====================================================
                - Disabled until student selects an option
                - On click: show feedback (hasSubmitted = true)
                - Do NOT show answer automatically (showAnswer = false)
            */}
            <button
              type="button"
              className="mt-5 rounded-xl bg-slate-900 px-4 py-2 text-white hover:bg-slate-800 disabled:opacity-50"
              disabled={selectedOption === null}
              onClick={() => {
                // Student commits their attempt:
                // 1) feedback becomes visible
                // 2) answer is not revealed unless they ask
                setHasSubmitted(true);
                setShowAnswer(false);
              }}
            >
              Submit Answer
            </button>

            {/* =====================================================
                FEEDBACK SECTION (only after submission)
                ===================================================== */}
            {hasSubmitted && (
              <div className="mt-5 rounded-xl border bg-slate-50 p-4">
                {/* If correct → show correct feedback */}
                {isCorrect ? (
                  <>
                    <p className="font-semibold text-green-700">✅ Correct!</p>

                    {/* Physics explanation (teach the method, not just the answer) */}
                    <p className="mt-2 text-slate-800">
                      <span className="font-medium">Why:</span> Use SI prefixes:
                      <br />
                      <span className="font-medium">kilo (k)</span> = 10³ and{" "}
                      <span className="font-medium">pico (p)</span> = 10⁻¹².
                      <br />
                      12.3 km = 12.3 × 10³ m.
                      <br />
                      1 m = 10¹² pm, so:
                      <br />
                      12.3 × 10³ m = 12.3 × 10³ × 10¹² pm = 12.3 × 10¹⁵ pm.
                      <br />
                      Convert to scientific form:
                      <br />
                      12.3 × 10¹⁵ = 1.23 × 10¹⁶ pm.
                    </p>
                  </>
                ) : (
                  <>
                    {/* If wrong → guide them, don’t punish */}
                    <p className="font-semibold text-red-700">
                      ❌ That’s not correct.
                    </p>

                    <p className="mt-2 text-slate-800">
                      Hint: Convert step-by-step:
                      <br />
                      <span className="font-medium">km → m → pm</span>
                      <br />
                      Remember: multiplying powers of ten means{" "}
                      <span className="font-medium">adding exponents</span>.
                    </p>

                    {/* Action buttons */}
                    <div className="mt-4 flex gap-3">
                      <button
                        className="rounded-xl border px-4 py-2"
                        onClick={() => {
                          // Try Again resets quiz progress (by design)
                          // This does NOT affect the toggle state.
                          setSelectedOption(null);
                          setHasSubmitted(false);
                          setShowAnswer(false);
                        }}
                      >
                        Try Again
                      </button>

                      <button
                        className="rounded-xl bg-blue-600 px-4 py-2 text-white"
                        onClick={() => {
                          // Student requests the answer:
                          // 1) highlight the correct option
                          // 2) show full explanation
                          setShowAnswer(true);
                        }}
                      >
                        Show Answer
                      </button>
                    </div>

                    {/* Explanation is shown only when requested */}
                    {showAnswer && (
                      <div className="mt-4 rounded-xl bg-blue-50 p-4">
                        <p className="font-semibold text-blue-900">
                          ✅ Answer: 1.23 × 10¹⁶ pm
                        </p>

                        <p className="mt-2 text-blue-900">
                          Step-by-step:
                          <br />
                          12.3 km = 12.3 × 10³ m
                          <br />
                          1 m = 10¹² pm
                          <br />
                          So:
                          <br />
                          <span className="font-mono">
                            12.3 × 10³ × 10¹² = 12.3 × 10¹⁵ pm
                          </span>
                          <br />
                          Scientific form:
                          <br />
                          <span className="font-mono">
                            12.3 × 10¹⁵ = 1.23 × 10¹⁶ pm
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
