"use client";
/**
 * useAssessment — Assessment State Machine
 * Controls the full lifecycle of a step-by-step clinical assessment.
 *
 * States:
 *  idle        → not started
 *  questioning → stepping through questions one by one
 *  result      → scoring complete, result available
 *
 * @param {Object} params
 * @param {Question[]} params.questions - Ordered array of question objects
 * @param {Function} params.scorer - Pure scoring function (answers) → result
 * @param {Function} [params.onComplete] - Called with (result, answers) when done
 */

import { useState, useCallback } from "react";

export function useAssessment({ questions, scorer, onComplete }) {
  const [phase, setPhase] = useState("idle"); // "idle" | "questioning" | "result"
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  /** Starts the assessment from the beginning */
  const start = useCallback(() => {
    setAnswers({});
    setCurrentIndex(0);
    setResult(null);
    setPhase("questioning");
  }, []);

  /**
   * Records the answer for the current question and advances.
   * If this is the last question, runs the scorer and transitions to result.
   *
   * @param {boolean} answer - true = sign present / yes, false = absent / no
   */
  const answerCurrent = useCallback(
    (answer) => {
      const question = questions[currentIndex];
      const updatedAnswers = { ...answers, [question.id]: answer };
      setAnswers(updatedAnswers);

      const isLast = currentIndex === questions.length - 1;

      if (isLast) {
        const scored = scorer(updatedAnswers);
        setResult(scored);
        setPhase("result");
        onComplete?.(scored, updatedAnswers);
      } else {
        setCurrentIndex((i) => i + 1);
      }
    },
    [answers, currentIndex, questions, scorer, onComplete]
  );

  /** Goes back one question */
  const goBack = useCallback(() => {
    if (currentIndex === 0) {
      setPhase("idle");
      return;
    }
    const prevQuestion = questions[currentIndex - 1];
    const updatedAnswers = { ...answers };
    delete updatedAnswers[prevQuestion.id];
    setAnswers(updatedAnswers);
    setCurrentIndex((i) => i - 1);
  }, [answers, currentIndex, questions]);

  /** Resets back to idle */
  const reset = useCallback(() => {
    setPhase("idle");
    setCurrentIndex(0);
    setAnswers({});
    setResult(null);
  }, []);

  const progress =
    questions.length > 0
      ? Math.round((currentIndex / questions.length) * 100)
      : 0;

  return {
    phase,
    currentIndex,
    currentQuestion: questions[currentIndex] ?? null,
    answers,
    result,
    progress,
    totalQuestions: questions.length,
    start,
    answerCurrent,
    goBack,
    reset,
  };
}
