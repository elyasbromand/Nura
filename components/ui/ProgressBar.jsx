"use client";
/**
 * ProgressBar
 * Displays assessment completion progress.
 * Shows current question number and a filled bar.
 */

export function ProgressBar({ current, total, progress }) {
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
          Question {current + 1} of {total}
        </span>
        <span className="text-xs text-slate-400">{progress}%</span>
      </div>
      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-teal-500 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
