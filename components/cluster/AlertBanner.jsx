"use client";
/**
 * AlertBanner
 * Displays an active outbreak cluster alert with case count,
 * region, symptom category, and time window.
 * Designed to be prominent — a CHW supervisor cannot miss it.
 */

import { AlertTriangle, Clock } from "lucide-react";

export function AlertBanner({ alert }) {
  const formattedTime = new Date(alert.latestCase).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-red-100 rounded-xl shrink-0">
          <AlertTriangle size={18} className="text-red-600" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-bold text-red-800">Cluster alert</span>
            <span className="text-xs font-medium bg-red-200 text-red-800 px-2 py-0.5 rounded-full">
              {alert.severity}
            </span>
          </div>
          <p className="text-sm text-red-700 font-medium mb-1">{alert.category}</p>
          <p className="text-sm text-red-600">{alert.region}</p>
          <div className="flex items-center gap-3 mt-2 text-xs text-red-500">
            <span className="font-semibold">{alert.caseCount} cases</span>
            <span>·</span>
            <span>within {alert.windowHours}h window</span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Clock size={11} />
              Last: {formattedTime}
            </span>
          </div>
          <p className="text-xs text-red-400 mt-1">{alert.whoReference} · {alert.sdgTarget}</p>
        </div>
      </div>
    </div>
  );
}
