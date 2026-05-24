"use client";
/**
 * Maternal Triage Page
 * Module 2 — WHO Maternal Complication Screening
 * SDG Target 3.1: Reduce global maternal mortality to < 70 per 100,000 live births
 *
 * Screens for pre-eclampsia, postpartum hemorrhage, and maternal sepsis.
 * Multi-condition scorer — each condition assessed independently.
 */

import { useState } from "react";
import { Heart, Info } from "lucide-react";
import { PageWrapper } from "../../components/layout/PageWrapper.jsx";
import { AssessmentFlow } from "../../components/assessment/AssessmentFlow.jsx";
import { ALL_MATERNAL_QUESTIONS } from "../../data/maternalQuestions.js";
import { REGIONS, DEFAULT_REGION } from "../../data/regions.js";
import { scoreMaternel } from "../../lib/maternalRisk.js";

export default function MaternalPage() {
  const [region, setRegion] = useState(DEFAULT_REGION.id);
  const [gestationalWeeks, setGestationalWeeks] = useState("");
  const [isPostpartum, setIsPostpartum] = useState(false);

  const scorer = (answers) =>
    scoreMaternel(answers, isPostpartum ? null : Number(gestationalWeeks) || null);

  return (
    <PageWrapper>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-rose-100 rounded-xl">
          <Heart size={22} className="text-rose-600" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900">Maternal triage</h1>
          <p className="text-sm text-slate-500">WHO Guidelines · SDG 3.1</p>
        </div>
      </div>

      <div className="bg-rose-50 border border-rose-100 rounded-xl p-4 flex gap-3 mb-6">
        <Info size={16} className="text-rose-500 mt-0.5 shrink-0" />
        <p className="text-sm text-rose-800 leading-relaxed">
          Screens for the three leading causes of preventable maternal death:
          <strong> pre-eclampsia, postpartum hemorrhage, and maternal sepsis</strong>.
          Based on WHO 2011–2015 guidelines.
        </p>
      </div>

      {/* Patient context */}
      <div className="flex flex-col gap-4 mb-6">
        <div>
          <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">
            Your region
          </label>
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-teal-300"
          >
            {REGIONS.map((r) => (
              <option key={r.id} value={r.id}>{r.label}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="postpartum"
            checked={isPostpartum}
            onChange={(e) => setIsPostpartum(e.target.checked)}
            className="w-4 h-4 accent-rose-500"
          />
          <label htmlFor="postpartum" className="text-sm text-slate-700">
            Patient has already delivered (postpartum)
          </label>
        </div>

        {!isPostpartum && (
          <div>
            <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">
              Gestational age (weeks) — optional
            </label>
            <input
              type="number"
              min="4"
              max="42"
              placeholder="e.g. 32"
              value={gestationalWeeks}
              onChange={(e) => setGestationalWeeks(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-teal-300"
            />
          </div>
        )}
      </div>

      <AssessmentFlow
        questions={ALL_MATERNAL_QUESTIONS}
        scorer={scorer}
        region={region}
        assessmentType="maternal"
        gestationalWeeks={isPostpartum ? null : Number(gestationalWeeks) || null}
      />
    </PageWrapper>
  );
}
