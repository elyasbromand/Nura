/**
 * Nura Storage Layer
 * Thin wrapper around localStorage for persistent assessment logging.
 * All data remains on-device — no server, no network dependency.
 * This enables fully offline operation, critical for low-connectivity field use.
 *
 * @module lib/storage
 */

import { STORAGE_KEYS } from "./constants.js";

/**
 * Saves a completed assessment to the local log.
 *
 * @param {Object} params
 * @param {string} params.assessmentType - "neonatal" | "maternal"
 * @param {Object} params.result - Scored result from risk engine
 * @param {Object} params.answers - Raw answers map
 * @param {string} params.region - Selected region ID
 * @param {number|null} [params.gestationalWeeks] - For maternal assessments
 * @returns {SavedAssessment} The saved record
 */
export function saveAssessment({
  assessmentType,
  result,
  answers,
  region,
  gestationalWeeks,
}) {
  const record = {
    id: `assessment_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    assessmentType,
    result,
    answers,
    region,
    gestationalWeeks: gestationalWeeks ?? null,
    timestamp: result.timestamp ?? new Date().toISOString(),
  };

  const existing = getAllAssessments();
  const updated = [record, ...existing];
  localStorage.setItem(STORAGE_KEYS.ASSESSMENTS, JSON.stringify(updated));
  return record;
}

/**
 * Retrieves all saved assessments from local storage, newest first.
 *
 * @returns {SavedAssessment[]} Array of saved assessment records
 */
export function getAllAssessments() {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ASSESSMENTS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Returns only the most recent N assessments.
 *
 * @param {number} limit
 * @returns {SavedAssessment[]}
 */
export function getRecentAssessments(limit = 20) {
  return getAllAssessments().slice(0, limit);
}

/**
 * Returns summary statistics across all saved assessments.
 *
 * @returns {{ total: number, urgent: number, moderate: number, normal: number }}
 */
export function getAssessmentStats() {
  const all = getAllAssessments();
  return {
    total: all.length,
    urgent: all.filter((a) => a.result?.level === "URGENT").length,
    moderate: all.filter((a) => a.result?.level === "MODERATE").length,
    normal: all.filter((a) => a.result?.level === "NORMAL").length,
  };
}

/**
 * Clears all saved assessments. Intended for testing and reset flows.
 */
export function clearHistory() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEYS.ASSESSMENTS);
}
