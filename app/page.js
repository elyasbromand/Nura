"use client";
/**
 * Dashboard — Home Page
 * Entry point for community health workers.
 * Shows the three assessment modules and live assessment stats.
 * SDG 3 targets: 3.1, 3.2, 3.d
 */

import { useState, useEffect } from "react";
import { Baby, Heart, Map, Activity, Shield } from "lucide-react";
import { ModuleCard } from "../components/ui/ModuleCard.jsx";
import { PageWrapper } from "../components/layout/PageWrapper.jsx";
import { getAssessmentStats } from "../lib/storage.js";
import { useClusterAlert } from "../hooks/useClusterAlert.js";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    total: 0,
    urgent: 0,
    moderate: 0,
    normal: 0,
  });
  const { alertCount } = useClusterAlert();

  useEffect(() => {
    setStats(getAssessmentStats());
  }, []);

  return (
    <PageWrapper>
      {/* App intro */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-medium bg-teal-100 text-teal-700 px-2.5 py-1 rounded-full">
            WHO Protocol · Offline-ready
          </span>
          <span className="text-xs font-medium bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full">
            SDG 3
          </span>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight leading-tight mb-2">
          Community health triage
        </h1>
        <p className="text-slate-500 text-base leading-relaxed">
          Clinical decision support for community health workers based on WHO
          IMNCI protocols. Select a module to begin an assessment.
        </p>
      </div>

      {/* Stats bar */}
      {stats.total > 0 && (
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: "Total", value: stats.total, color: "text-slate-700" },
            { label: "Urgent", value: stats.urgent, color: "text-red-600" },
            {
              label: "Monitored",
              value: stats.moderate,
              color: "text-amber-600",
            },
          ].map(({ label, value, color }) => (
            <div
              key={label}
              className="bg-white rounded-xl p-3 border border-slate-100 text-center"
            >
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
              <p className="text-xs text-slate-400">{label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Cluster alert banner */}
      {alertCount > 0 && (
        <a href="/outbreak" className="block mb-6">
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-xl shrink-0">
              <Shield size={18} className="text-red-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-red-800">
                {alertCount} outbreak cluster{alertCount > 1 ? "s" : ""}{" "}
                detected
              </p>
              <p className="text-xs text-red-600">View outbreak dashboard →</p>
            </div>
          </div>
        </a>
      )}

      {/* Assessment modules */}
      <div className="flex flex-col gap-4">
        <ModuleCard
          title="Newborn assessment"
          subtitle="For infants 0–28 days old"
          sdgTarget="SDG 3.2 · Child mortality"
          whoProtocol="WHO IMNCI, 2014"
          path="/neonatal"
          colorScheme="blue"
          icon={Baby}
          stats={stats.total > 0 ? stats : null}
        />
        <ModuleCard
          title="Maternal triage"
          subtitle="For pregnant or postpartum women"
          sdgTarget="SDG 3.1 · Maternal mortality"
          whoProtocol="WHO Maternal Guidelines, 2011"
          path="/maternal"
          colorScheme="rose"
          icon={Heart}
        />
        <ModuleCard
          title="Outbreak surveillance"
          subtitle="Cluster detection dashboard"
          sdgTarget="SDG 3.d · Health security"
          whoProtocol="WHO Event-Based Surveillance, 2008"
          path="/outbreak"
          colorScheme="teal"
          icon={Map}
        />
      </div>

      {/* Footer reference */}
      <p className="text-xs text-slate-400 text-center mt-8 leading-relaxed">
        Nura implements WHO clinical protocols. This tool supports — not
        replaces — clinical judgment.
        <br />
        UN Sustainable Development Goal 3 · Targets 3.1, 3.2, 3.d
      </p>
    </PageWrapper>
  );
}
