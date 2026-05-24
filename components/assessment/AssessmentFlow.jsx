"use client";
/**
 * AssessmentFlow
 * The reusable assessment engine. Drives the full question → result
 * lifecycle for any module. Accepts questions and scorer as props —
 * completely module-agnostic.
 *
 * Used by: NeonatalPage, MaternalPage
 *
 * @param {Question[]} questions - Ordered question array
 * @param {Function} scorer - Pure function: answers → result
 * @param {string} region - Selected region ID for logging
 * @param {Function} [onSaved] - Called after result is saved to storage
 */

import { useAssessment } from "../../hooks/useAssessment.js";
import { saveAssessment } from "../../lib/storage.js";
import { ProgressBar } from "../ui/ProgressBar.jsx";
import { QuestionCard } from "../ui/QuestionCard.jsx";
import { ResultCard } from "../ui/ResultCard.jsx";

export function AssessmentFlow({ questions, scorer, region, assessmentType, gestationalWeeks, onSaved }) {
  const assessment = useAssessment({
    questions,
    scorer,
    onComplete: (result, answers) => {
      saveAssessment({ assessmentType, result, answers, region, gestationalWeeks });
      onSaved?.(result);
    },
  });

  if (assessment.phase === "idle") {
    return (
      <button
        onClick={assessment.start}
        className="w-full py-5 rounded-2xl bg-teal-500 hover:bg-teal-600 active:scale-95 text-white font-semibold text-lg transition-all shadow-sm"
      >
        Start assessment
      </button>
    );
  }

  if (assessment.phase === "result") {
    return (
      <ResultCard
        result={assessment.result}
        onReset={assessment.reset}
      />
    );
  }

  // questioning phase
  return (
    <div className="flex flex-col gap-8">
      <ProgressBar
        current={assessment.currentIndex}
        total={assessment.totalQuestions}
        progress={assessment.progress}
      />
      <QuestionCard
        question={assessment.currentQuestion}
        onAnswer={assessment.answerCurrent}
        onBack={assessment.goBack}
        showBack={assessment.currentIndex > 0}
      />
    </div>
  );
}
