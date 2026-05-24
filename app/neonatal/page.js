"use client";
/**
 * Neonatal Assessment Page
 * Module 1 — WHO IMNCI Danger Signs Protocol
 * SDG Target 3.2: End preventable deaths of newborns and children under 5
 *
 * Screens for 8 WHO-defined danger signs in infants aged 0–28 days.
 * Result classifies into: Urgent Referral / Treat & Monitor / Normal
 */

import { useState } from "react";
import { Baby, Info } from "lucide-react";
import { PageWrapper } from "../../components/layout/PageWrapper.jsx";
import { AssessmentFlow } from "../../components/assessment/AssessmentFlow.jsx";
import { NEONATAL_QUESTIONS } from "../../data/neonatalQuestions.js";
import { REGIONS, DEFAULT_REGION } from "../../data/regions.js";
import { scoreNeonatal } from "../../lib/neonatalRisk.js";

export default function NeonatalPage() {
  const [region, setRegion] = useState(DEFAULT_REGION.id);

  return (
    <PageWrapper>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-blue-100 rounded-xl">
          <Baby size={22} className="text-blue-600" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900">Newborn assessment</h1>
          <p className="text-sm text-slate-500">WHO IMNCI · SDG 3.2 · Ages 0–28 days</p>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3 mb-6">
        <Info size={16} className="text-blue-500 mt-0.5 shrink-0" />
        <p className="text-sm text-blue-800 leading-relaxed">
          Implements the <strong>WHO IMNCI 8 danger signs protocol</strong> for infants aged 0–28 days.
          Any critical sign triggers an urgent referral recommendation.
        </p>
      </div>

      <div className="mb-6">
        <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">
          Your region
        </label>
        <select
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-teal-300"
        >
          {REGIONS.map((r) => (
            <option key={r.id} value={r.id}>
              {r.label}
            </option>
          ))}
        </select>
      </div>

      <AssessmentFlow
        questions={NEONATAL_QUESTIONS}
        scorer={scoreNeonatal}
        region={region}
        assessmentType="neonatal"
      />
    </PageWrapper>
  );
}
