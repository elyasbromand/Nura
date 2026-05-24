"use client";
/**
 * ClusterMap
 * Visual heatmap of case density by region over the 72-hour detection window.
 * Color intensity reflects case count — green (low) → amber → red (high/cluster).
 * No external map library required.
 *
 * @sdgTarget 3.d
 */

import { REGIONS } from "../../data/regions.js";
import { CLUSTER_CONFIG } from "../../lib/constants.js";

function getHeatColor(counts) {
  if (!counts) return { bg: "bg-slate-50", border: "border-slate-100", text: "text-slate-400", label: "No reports" };
  const { urgent, moderate, total } = counts;
  if (urgent >= CLUSTER_CONFIG.CASE_THRESHOLD) {
    return { bg: "bg-red-100", border: "border-red-300", text: "text-red-700", label: "Cluster alert" };
  }
  if (urgent > 0 || total >= CLUSTER_CONFIG.CASE_THRESHOLD) {
    return { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700", label: "Elevated" };
  }
  if (total > 0) {
    return { bg: "bg-green-50", border: "border-green-200", text: "text-green-700", label: "Reports" };
  }
  return { bg: "bg-slate-50", border: "border-slate-100", text: "text-slate-400", label: "Clear" };
}

export function ClusterMap({ regionCounts }) {
  return (
    <div>
      <div className="grid grid-cols-3 gap-3">
        {REGIONS.map((region) => {
          const counts = regionCounts[region.id];
          const colors = getHeatColor(counts);
          return (
            <div
              key={region.id}
              className={`rounded-xl border-2 p-3 ${colors.bg} ${colors.border} transition-all`}
            >
              <p className="text-xs font-semibold text-slate-700 leading-tight mb-1">
                {region.label}
              </p>
              <p className={`text-xl font-bold ${colors.text}`}>
                {counts?.total ?? 0}
              </p>
              <p className={`text-xs ${colors.text}`}>{colors.label}</p>
              {counts?.urgent > 0 && (
                <p className="text-xs text-red-600 font-medium mt-1">
                  {counts.urgent} urgent
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-4 text-xs text-slate-500">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-slate-200" />
          Clear
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-green-400" />
          Reports
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-amber-400" />
          Elevated
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          Cluster
        </div>
      </div>
    </div>
  );
}
