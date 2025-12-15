"use client";

import React, { useMemo, useState } from "react";

/**
 * PracticeMCQ_Homogeneity
 *
 * Topic: Homogeneity of physical equations
 *
 * Physics idea:
 * An equation is homogeneous if every term has the SAME unit.
 * You can only add/subtract quantities with the same unit.
 *
 * UI features (same style as your other components):
 * ✅ Expand/collapse toggle (collapsed by default)
 * ✅ MCQ selection + submit
 * ✅ Correct/Wrong feedback
 * ✅ Try Again + Show Answer
 * ✅ Correct option highlighted ONLY when "Show Answer" is clicked
 * ✅ Toggle does NOT reset quiz progress
 */
export default function PracticeMCQ_Homogeneity() {
  // =========================================================
  // 0️⃣ TOGGLE UI STATE (expand/collapse only)
  // =========================================================
  /**
   * isOpen controls whether the card content is visible.
   * - This is UI-only state: it must NOT change quiz progress.
   */
  const [isOpen, setIsOpen] = useState(false);

  // =========================================================
  // 1️⃣ QUIZ STATE (learning logic)
  // =========================================================
  /**
   * selectedOption: which MCQ option the student selected.
   * - null means no selection yet (we disable Submit).
   */
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  /**
   * hasSubmitted: whether the student clicked Submit Answer.
   * - controls whether feedback is shown.
   */
  const [hasSubmitted, setHasSubmitted] = useState(false);

  /**
   * showAnswer: reveals the correct answer + full explanation after wrong attempt.
   * - also triggers highlighting of the correct option.
   */
  const [showAnswer, setShowAnswer] = useState(false);

  // =========================================================
  // 2️⃣ QUESTION DATA (physics content)
  // =========================================================
  /**
   * High-quality homogeneity question:
   * Students must compare units term-by-term.
   *
   * We use a common misconception:
   * - mixing "distance" and "speed" as if they can be added
   * - mixing "velocity" and "acceleration"
   *
   * Question style: "Which equation could be physically correct?"
   */
  const title = "Practice Question: Homogeneity (Units Must Match)";
  const question = "Which of the following equations could be physically correct (homogeneous in SI units)?";

  /**
   * Options are written to look plausible, but only one is homogeneous.
   *
   * Option A: s = ut + 1/2 at^2  ✅ (distance = distance + distance)
   * Option B: v = u + at^2       ❌ (m/s = m/s + m)  (because a t^2 has unit m)
   * Option C: F = mv + at        ❌ (N = kg·m/s + m/s)  (units mismatch + missing mass)
   * Option D: P = F + v          ❌ (W = N + m/s) (cannot add power with force or speed)
   */
  const options = [
    "A) s = ut + 1/2 at²",
    "B) v = u + at²",
    "C) F = mv + at",
    "D) P = F + v",
  ];

  const correctAnswer = "A) s = ut + 1/2 at²";

  // =========================================================
  // 3️⃣ ANSWER CHECKING LOGIC (React logic)
  // =========================================================
  /**
   * isCorrect is a derived value:
   * - it depends only on selectedOption.
   * - useMemo makes the “derived from state” idea explicit and readable.
   */
  const isCorrect = useMemo(() => {
    return selectedOption === correctAnswer;
  }, [selectedOption, correctAnswer]);

  /**
   * We highlight the correct option ONLY when showAnswer is true.
   * This prevents “revealing” the answer too early.
   */
  const isOptionCorrectAndShouldHighlight = (option: string) =>
    showAnswer && option === correctAnswer;

  // =========================================================
  // 4️⃣ UI RENDERING
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
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>

          {/* Small arrow that rotates to show open/closed state */}
          <span
            className={`transition-transform duration-300 ${
              isOpen ? "rotate-180" : ""
            }`}
          >
            ▼
          </span>
        </button>

        {/* =====================================================
            COLLAPSIBLE CONTENT WRAPPER (smooth animation)
            ===================================================== */}
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            isOpen ? "max-h-[2200px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="px-6 pb-6">
            {/* Question text */}
            <p className="mt-1 text-slate-800">{question}</p>

            {/* =====================================================
                OPTIONS SECTION
                ===================================================== */}
            <fieldset className="mt-4 space-y-2">
              <legend className="sr-only">Multiple choice options</legend>

              {options.map((option) => (
                <label
                  key={option}
                  className={[
                    "flex items-center gap-3 rounded-xl border px-4 py-3 cursor-pointer",
                    "transition-colors",

                    // Selected option styling (so students see their choice)
                    selectedOption === option
                      ? "border-slate-400 bg-slate-50"
                      : "border-slate-200 bg-white hover:bg-slate-50",

                    // Correct option highlight only when "Show Answer" is clicked
                    isOptionCorrectAndShouldHighlight(option)
                      ? "border-green-500 bg-green-50"
                      : "",
                  ].join(" ")}
                >
                  <input
                    type="radio"
                    name="homogeneity-question"
                    checked={selectedOption === option}
                    onChange={() => {
                      // Triggered when student selects an option.
                      // Updates selectedOption → React re-renders → checked/highlight updates.
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
                ===================================================== */}
            <button
              type="button"
              className="mt-5 rounded-xl bg-slate-900 px-4 py-2 text-white hover:bg-slate-800 disabled:opacity-50"
              disabled={selectedOption === null}
              onClick={() => {
                // Student commits their attempt:
                // - show feedback
                // - do not auto-reveal answer
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
                {isCorrect ? (
                  <>
                    <p className="font-semibold text-green-700">✅ Correct!</p>

                    {/* Physics explanation: show unit checking clearly */}
                    <div className="mt-2 text-slate-800 space-y-2">
                      <p>
                        <span className="font-medium">Why A works:</span> Every
                        term has the unit of <span className="font-medium">distance (m)</span>.
                      </p>

                      <p>
                        Check each term:
                        <br />
                        <span className="font-mono">s</span> has unit{" "}
                        <span className="font-medium">m</span>.
                      </p>

                      <p>
                        <span className="font-mono">ut</span>:
                        <br />
                        <span className="font-mono">u</span> is velocity →{" "}
                        <span className="font-medium">m s⁻¹</span>
                        <br />
                        <span className="font-mono">t</span> is time →{" "}
                        <span className="font-medium">s</span>
                        <br />
                        So <span className="font-mono">ut</span> →{" "}
                        <span className="font-medium">m</span>
                      </p>

                      <p>
                        <span className="font-mono">1/2 at²</span>:
                        <br />
                        <span className="font-mono">a</span> is acceleration →{" "}
                        <span className="font-medium">m s⁻²</span>
                        <br />
                        <span className="font-mono">t²</span> is{" "}
                        <span className="font-medium">s²</span>
                        <br />
                        So <span className="font-mono">at²</span> →{" "}
                        <span className="font-medium">m</span>
                      </p>

                      <p>
                        Therefore, the right-hand side is{" "}
                        <span className="font-medium">m + m</span>, which is allowed,
                        and it matches the left-hand side{" "}
                        <span className="font-medium">m</span>.
                        ✅ Homogeneous!
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="font-semibold text-red-700">
                      ❌ That’s not correct.
                    </p>

                    <p className="mt-2 text-slate-800">
                      Hint: For homogeneity, you must check the{" "}
                      <span className="font-medium">units of every term</span>.
                      You can only add terms with the same unit.
                    </p>

                    <div className="mt-4 flex gap-3">
                      <button
                        className="rounded-xl border px-4 py-2"
                        onClick={() => {
                          // Resets quiz attempt (not toggle state)
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
                      <div className="mt-4 rounded-xl bg-blue-50 p-4 text-blue-900 space-y-3">
                        <p className="font-semibold">
                          ✅ Correct Answer: A) s = ut + 1/2 at²
                        </p>

                        <p>
                          <span className="font-medium">Why A is homogeneous:</span>{" "}
                          all terms are in metres (m).
                        </p>

                        <p>
                          <span className="font-medium">Example of why B is not homogeneous:</span>
                          <br />
                          <span className="font-mono">v</span> and{" "}
                          <span className="font-mono">u</span> are velocities →{" "}
                          <span className="font-medium">m s⁻¹</span>
                          <br />
                          But <span className="font-mono">at²</span> has unit:
                          <br />
                          <span className="font-mono">
                            (m s⁻²) × (s²) = m
                          </span>
                          <br />
                          You cannot add <span className="font-medium">m s⁻¹</span>{" "}
                          and <span className="font-medium">m</span>.
                        </p>

                        <p>
                          <span className="font-medium">Unit-thinking rule:</span>{" "}
                          Before accepting any equation, quickly check that every term
                          matches in unit. This prevents many mistakes in physics.
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
