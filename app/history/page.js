"use client";
/**
 * History Page
 * Displays the full assessment log stored in localStorage.
 * CHWs and supervisors can review past assessments, filter by type,
 * and see result distribution at a glance.
 */

import { useEffect, useState } from "react";
import { History, Trash2, Baby, Heart, Filter } from "lucide-react";
import { PageWrapper } from "../../components/layout/PageWrapper.jsx";
import { RiskBadge } from "../../components/ui/RiskBadge.jsx";
import { getAllAssessments, clearHistory, getAssessmentStats } from "../../lib/storage.js";

const TYPE_ICONS = {
  neonatal: Baby,
  maternal: Heart,
};

export default function HistoryPage() {
  const [assessments, setAssessments] = useState([]);
  const [stats, setStats] = useState({ total: 0, urgent: 0, moderate: 0, normal: 0 });
  const [filter, setFilter] = useState("all"); // "all" | "neonatal" | "maternal"
  const [confirmClear, setConfirmClear] = useState(false);

  useEffect(() => {
    setAssessments(getAllAssessments());
    setStats(getAssessmentStats());
  }, []);

  const filtered = assessments.filter(
    (a) => filter === "all" || a.assessmentType === filter
  );

  const handleClear = () => {
    if (confirmClear) {
      clearHistory();
      setAssessments([]);
      setStats({ total: 0, urgent: 0, moderate: 0, normal: 0 });
      setConfirmClear(false);
    } else {
      setConfirmClear(true);
      setTimeout(() => setConfirmClear(false), 3000);
    }
  };

  return (
    <PageWrapper>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-slate-100 rounded-xl">
            <History size={22} className="text-slate-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Assessment history</h1>
            <p className="text-sm text-slate-500">{stats.total} records · stored locally</p>
          </div>
        </div>
        {stats.total > 0 && (
          <button
            onClick={handleClear}
            className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-colors ${
              confirmClear
                ? "bg-red-50 border-red-200 text-red-700"
                : "border-slate-200 text-slate-400 hover:text-slate-600"
            }`}
          >
            <Trash2 size={12} />
            {confirmClear ? "Confirm clear" : "Clear"}
          </button>
        )}
      </div>

      {/* Stats summary */}
      {stats.total > 0 && (
        <div className="grid grid-cols-4 gap-2 mb-6">
          {[
            { label: "Total", value: stats.total, color: "text-slate-800" },
            { label: "Urgent", value: stats.urgent, color: "text-red-600" },
            { label: "Monitor", value: stats.moderate, color: "text-amber-600" },
            { label: "Normal", value: stats.normal, color: "text-green-600" },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-white rounded-xl border border-slate-100 p-3 text-center">
              <p className={`text-xl font-bold ${color}`}>{value}</p>
              <p className="text-xs text-slate-400">{label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex gap-2 mb-4">
        {["all", "neonatal", "maternal"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors capitalize ${
              filter === f
                ? "bg-slate-900 text-white"
                : "bg-white border border-slate-200 text-slate-500 hover:text-slate-700"
            }`}
          >
            {f === "neonatal" && <Baby size={12} />}
            {f === "maternal" && <Heart size={12} />}
            {f === "all" && <Filter size={12} />}
            {f}
          </button>
        ))}
      </div>

      {/* Assessment list */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <History size={36} className="text-slate-200 mx-auto mb-3" />
          <p className="text-slate-400 text-sm">
            {stats.total === 0
              ? "No assessments yet. Complete an assessment to see it here."
              : "No assessments match this filter."}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map((record) => {
            const Icon = TYPE_ICONS[record.assessmentType] ?? Baby;
            const conditions = record.result?.detectedConditions;
            return (
              <div
                key={record.id}
                className="bg-white rounded-2xl border border-slate-100 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-50 rounded-xl">
                      <Icon size={16} className="text-slate-500" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800 capitalize">
                        {record.assessmentType} assessment
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {record.region} ·{" "}
                        {new Date(record.timestamp).toLocaleString([], {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                  <RiskBadge level={record.result?.level} size="sm" />
                </div>

                {/* Detected conditions for maternal */}
                {conditions && conditions.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {conditions.map((c, i) => (
                      <span
                        key={i}
                        className="text-xs bg-slate-50 border border-slate-100 text-slate-600 px-2 py-0.5 rounded-full"
                      >
                        {c.name}
                      </span>
                    ))}
                  </div>
                )}

                {/* SDG + WHO tag */}
                <p className="text-xs text-slate-300 mt-2 font-mono">
                  {record.result?.sdgTarget} · {record.result?.whoProtocol}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </PageWrapper>
  );
}
