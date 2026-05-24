"use client";
/**
 * QuestionCard
 * Renders a single WHO danger sign question with clinical hint.
 * Designed for one-handed use in the field — large tap targets.
 */

import { HelpCircle } from "lucide-react";
import { useState } from "react";

export function QuestionCard({ question, onAnswer, onBack, showBack }) {
  const [showHint, setShowHint] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      {/* WHO reference tag */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-mono text-slate-400 bg-slate-50 border border-slate-100 rounded px-2 py-0.5">
          {question.whoReference}
        </span>
        {question.severity === "critical" && (
          <span className="text-xs font-medium text-red-600 bg-red-50 border border-red-100 rounded px-2 py-0.5">
            Critical sign
          </span>
        )}
      </div>

      {/* Question text */}
      <div>
        <h2 className="text-2xl font-semibold text-slate-900 leading-snug tracking-tight">
          {question.text}
        </h2>
      </div>

      {/* Clinical hint toggle */}
      <button
        onClick={() => setShowHint((v) => !v)}
        className="flex items-start gap-2 text-left text-sm text-teal-700 hover:text-teal-900 transition-colors"
      >
        <HelpCircle size={16} className="mt-0.5 shrink-0" />
        <span>{showHint ? "Hide" : "Show"} clinical guidance</span>
      </button>

      {showHint && (
        <div className="bg-teal-50 border border-teal-100 rounded-xl p-4 text-sm text-teal-900 leading-relaxed">
          {question.hint}
        </div>
      )}

      {/* Answer buttons */}
      <div className="grid grid-cols-2 gap-4 mt-2">
        <button
          onClick={() => onAnswer(false)}
          className="h-16 rounded-2xl border-2 border-slate-200 bg-white text-slate-700 font-semibold text-lg hover:border-slate-300 hover:bg-slate-50 active:scale-95 transition-all"
        >
          No
        </button>
        <button
          onClick={() => onAnswer(true)}
          className="h-16 rounded-2xl border-2 border-red-200 bg-red-50 text-red-700 font-semibold text-lg hover:border-red-300 hover:bg-red-100 active:scale-95 transition-all"
        >
          Yes
        </button>
      </div>

      {/* Back navigation */}
      {showBack && (
        <button
          onClick={onBack}
          className="text-sm text-slate-400 hover:text-slate-600 transition-colors mt-2 text-center"
        >
          ← Back
        </button>
      )}
    </div>
  );
}
