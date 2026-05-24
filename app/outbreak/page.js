"use client";
/**
 * Outbreak Surveillance Page
 * Module 3 — WHO Event-Based Surveillance
 * SDG Target 3.d: Strengthen early warning capacity for national health risks
 *
 * Displays a real-time cluster detection dashboard with:
 *  - Active cluster alerts (72-hour sliding window)
 *  - Regional case density heatmap
 *  - Recent assessment log
 */

import { useEffect, useState } from "react";
import { Map, RefreshCw, AlertTriangle, CheckCircle } from "lucide-react";
import { PageWrapper } from "../../components/layout/PageWrapper.jsx";
import { ClusterMap } from "../../components/cluster/ClusterMap.jsx";
import { AlertBanner } from "../../components/cluster/AlertBanner.jsx";
import { useClusterAlert } from "../../hooks/useClusterAlert.js";
import { getRecentAssessments } from "../../lib/storage.js";
import { RiskBadge } from "../../components/ui/RiskBadge.jsx";
import { CLUSTER_CONFIG } from "../../lib/constants.js";

export default function OutbreakPage() {
  const { alerts, regionCounts, hasAlerts, lastChecked, refresh } = useClusterAlert();
  const [recentLog, setRecentLog] = useState([]);

  useEffect(() => {
    setRecentLog(getRecentAssessments(10));
  }, []);

  const handleRefresh = () => {
    refresh();
    setRecentLog(getRecentAssessments(10));
  };

  return (
    <PageWrapper>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-teal-100 rounded-xl">
            <Map size={22} className="text-teal-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Outbreak surveillance</h1>
            <p className="text-sm text-slate-500">WHO Event-Based · SDG 3.d · 72h window</p>
          </div>
        </div>
        <button
          onClick={handleRefresh}
          className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
          aria-label="Refresh"
        >
          <RefreshCw size={16} className="text-slate-500" />
        </button>
      </div>

      {/* Detection parameters */}
      <div className="bg-teal-50 border border-teal-100 rounded-xl p-3 flex gap-4 mb-6 text-sm text-teal-800">
        <span>Threshold: <strong>{CLUSTER_CONFIG.CASE_THRESHOLD} cases</strong></span>
        <span>·</span>
        <span>Window: <strong>72 hours</strong></span>
        <span>·</span>
        <span className="text-teal-600">WHO EBS, 2008</span>
      </div>

      {/* Active alerts */}
      <div className="mb-6">
        <h2 className="text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wide">
          Active alerts
        </h2>
        {hasAlerts ? (
          <div className="flex flex-col gap-3">
            {alerts.map((alert) => (
              <AlertBanner key={alert.id} alert={alert} />
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-3 bg-green-50 border border-green-100 rounded-xl p-4">
            <CheckCircle size={18} className="text-green-500" />
            <p className="text-sm text-green-700 font-medium">
              No clusters detected in the current 72-hour window.
            </p>
          </div>
        )}
      </div>

      {/* Regional heatmap */}
      <div className="mb-6">
        <h2 className="text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wide">
          Regional case density (72h)
        </h2>
        <ClusterMap regionCounts={regionCounts} />
      </div>

      {/* Recent assessment log */}
      <div>
        <h2 className="text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wide">
          Recent assessments
        </h2>
        {recentLog.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-6">
            No assessments logged yet. Complete an assessment to see it here.
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {recentLog.map((record) => (
              <div
                key={record.id}
                className="flex items-center justify-between bg-white rounded-xl border border-slate-100 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium text-slate-700 capitalize">
                    {record.assessmentType} assessment
                  </p>
                  <p className="text-xs text-slate-400">
                    {record.region} ·{" "}
                    {new Date(record.timestamp).toLocaleString([], {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <RiskBadge level={record.result?.level} size="sm" />
              </div>
            ))}
          </div>
        )}
      </div>

      {lastChecked && (
        <p className="text-xs text-slate-400 text-center mt-6">
          Last refreshed: {lastChecked.toLocaleTimeString()}
        </p>
      )}
    </PageWrapper>
  );
}
