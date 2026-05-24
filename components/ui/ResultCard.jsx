"use client";
/**
 * ResultCard
 * Displays the final risk assessment result with:
 *  - Color-coded risk level indicator
 *  - Specific action instruction
 *  - Pre-written facility handoff message (tap to copy)
 *  - Detected conditions list (for maternal assessments)
 */

import { CheckCircle, AlertTriangle, AlertCircle, Copy, Check, RefreshCw } from "lucide-react";
import { useState } from "react";
import { RISK_LEVEL, RISK_CONFIG } from "../../lib/constants.js";

const ICONS = {
  [RISK_LEVEL.URGENT]: AlertTriangle,
  [RISK_LEVEL.MODERATE]: AlertCircle,
  [RISK_LEVEL.NORMAL]: CheckCircle,
};

export function ResultCard({ result, onReset }) {
  const [copied, setCopied] = useState(false);
  const config = RISK_CONFIG[result.level];
  const Icon = ICONS[result.level];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(result.facilityMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API not available — silently skip
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Risk level header */}
      <div className={`rounded-2xl p-6 border-2 ${config.bgClass} ${config.borderClass}`}>
        <div className="flex items-center gap-3 mb-3">
          <Icon
            size={28}
            className={
              result.level === RISK_LEVEL.URGENT
                ? "text-red-600"
                : result.level === RISK_LEVEL.MODERATE
                ? "text-amber-600"
                : "text-green-600"
            }
          />
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-0.5">
              Assessment result
            </p>
            <h2 className={`text-2xl font-bold ${config.textClass}`}>
              {config.label}
            </h2>
          </div>
        </div>
        <p className={`text-base font-medium ${config.textClass}`}>
          {config.action}
        </p>
      </div>

      {/* Detected conditions — maternal only */}
      {result.detectedConditions && result.detectedConditions.length > 0 && (
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">
            Suspected conditions
          </p>
          <div className="flex flex-col gap-2">
            {result.detectedConditions.map((condition, i) => (
              <div
                key={i}
                className="flex items-center justify-between bg-slate-50 rounded-xl px-4 py-3 border border-slate-100"
              >
                <span className="text-sm font-medium text-slate-700">
                  {condition.name}
                </span>
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    condition.level === RISK_LEVEL.URGENT
                      ? "bg-red-100 text-red-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {condition.level === RISK_LEVEL.URGENT ? "Urgent" : "Monitor"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Facility message */}
      {result.level !== RISK_LEVEL.NORMAL && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              Handoff message for facility
            </p>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 text-xs text-teal-600 hover:text-teal-800 transition-colors"
            >
              {copied ? <Check size={12} /> : <Copy size={12} />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
          <div className="bg-slate-900 text-slate-100 rounded-xl p-4 text-sm font-mono leading-relaxed">
            {result.facilityMessage}
          </div>
        </div>
      )}

      {/* WHO protocol reference */}
      <div className="flex items-center gap-2 text-xs text-slate-400">
        <span className="font-mono">Protocol:</span>
        <span>{result.whoProtocol}</span>
        <span>·</span>
        <span className="font-medium text-teal-600">{result.sdgTarget}</span>
      </div>

      {/* Reset button */}
      <button
        onClick={onReset}
        className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl border-2 border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 active:scale-95 transition-all"
      >
        <RefreshCw size={16} />
        New assessment
      </button>
    </div>
  );
}
