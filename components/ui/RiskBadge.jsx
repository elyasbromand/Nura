"use client";
/**
 * RiskBadge
 * Displays a color-coded risk level badge.
 * Renders Red (Urgent) / Amber (Moderate) / Green (Normal)
 * consistent with WHO IMNCI visual classification standards.
 */

import { RISK_LEVEL, RISK_CONFIG } from "../../lib/constants.js";

export function RiskBadge({ level, size = "md" }) {
  const config = RISK_CONFIG[level] ?? RISK_CONFIG[RISK_LEVEL.NORMAL];

  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-3 py-1",
    lg: "text-base px-4 py-1.5",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium ${config.badgeClass} ${sizeClasses[size]}`}
    >
      <span className="relative flex h-2 w-2">
        {level === RISK_LEVEL.URGENT && (
          <span
            className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 bg-red-400`}
          />
        )}
        <span
          className={`relative inline-flex h-2 w-2 rounded-full ${
            level === RISK_LEVEL.URGENT
              ? "bg-red-500"
              : level === RISK_LEVEL.MODERATE
              ? "bg-amber-500"
              : "bg-green-500"
          }`}
        />
      </span>
      {config.shortLabel}
    </span>
  );
}
