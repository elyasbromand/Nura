/**
 * Outbreak Cluster Detection Engine
 * Implements a 72-hour sliding time window to detect geographic
 * clustering of similar health events — modeled on WHO event-based
 * surveillance methodology (WHO, 2008).
 *
 * Algorithm:
 *  For each unique (symptomCategory × region) pair:
 *    Count assessments within the last TIME_WINDOW_MS milliseconds
 *    If count ≥ CASE_THRESHOLD → emit ClusterAlert
 *
 * @module lib/clusterDetection
 * @sdgTarget 3.d — Strengthen capacity for early warning of national health risks
 * @whoProtocol WHO Event-Based Surveillance, 2008
 */

import { CLUSTER_CONFIG } from "./constants.js";

/**
 * Categorizes an assessment type/result into a broad symptom category
 * for cluster grouping purposes.
 *
 * @param {SavedAssessment} assessment
 * @returns {string} Symptom category label
 */
export function getSymptomCategory(assessment) {
  if (assessment.assessmentType === "neonatal") {
    if (assessment.result?.level === "URGENT") return "Neonatal — serious illness";
    return "Neonatal — illness signs";
  }

  const conditions = assessment.result?.detectedConditions ?? [];
  if (conditions.some((c) => c.name.toLowerCase().includes("sepsis"))) {
    return "Maternal — sepsis";
  }
  if (conditions.some((c) => c.name.toLowerCase().includes("hemorrhage"))) {
    return "Maternal — hemorrhage";
  }
  if (conditions.some((c) => c.name.toLowerCase().includes("eclampsia"))) {
    return "Maternal — pre-eclampsia";
  }
  return "Maternal — illness signs";
}

/**
 * Scans the full assessment log and returns any active cluster alerts.
 * Only assessments with a non-NORMAL result are included in cluster analysis.
 *
 * @param {SavedAssessment[]} assessmentLog - Full array from localStorage
 * @returns {ClusterAlert[]} Array of active cluster alerts (empty if none)
 */
export function detectClusters(assessmentLog) {
  const now = Date.now();
  const windowStart = now - CLUSTER_CONFIG.TIME_WINDOW_MS;

  // Filter to assessments within the time window that are not NORMAL
  const recentCases = assessmentLog.filter((a) => {
    const ts = new Date(a.timestamp).getTime();
    return ts >= windowStart && a.result?.level !== "NORMAL";
  });

  if (recentCases.length === 0) return [];

  // Group by symptom category + region
  const groups = {};
  for (const assessment of recentCases) {
    const category = getSymptomCategory(assessment);
    const region = assessment.region ?? "Unknown region";
    const key = `${category}||${region}`;

    if (!groups[key]) {
      groups[key] = { category, region, cases: [] };
    }
    groups[key].cases.push(assessment);
  }

  // Emit an alert for any group that hits the threshold
  const alerts = [];
  for (const group of Object.values(groups)) {
    if (group.cases.length >= CLUSTER_CONFIG.CASE_THRESHOLD) {
      alerts.push(buildClusterAlert(group));
    }
  }

  return alerts;
}

/**
 * Builds a structured cluster alert object from a case group.
 *
 * @param {{ category: string, region: string, cases: SavedAssessment[] }} group
 * @returns {ClusterAlert}
 */
function buildClusterAlert(group) {
  const timestamps = group.cases.map((c) => new Date(c.timestamp).getTime());
  const earliest = new Date(Math.min(...timestamps));
  const latest = new Date(Math.max(...timestamps));

  return {
    id: `cluster_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    category: group.category,
    region: group.region,
    caseCount: group.cases.length,
    threshold: CLUSTER_CONFIG.CASE_THRESHOLD,
    windowHours: CLUSTER_CONFIG.TIME_WINDOW_MS / (60 * 60 * 1000),
    firstCase: earliest.toISOString(),
    latestCase: latest.toISOString(),
    severity: group.cases.length >= CLUSTER_CONFIG.CASE_THRESHOLD * 2 ? "HIGH" : "MODERATE",
    sdgTarget: "SDG 3.d",
    whoReference: "WHO Event-Based Surveillance, 2008",
  };
}

/**
 * Returns a per-region summary of case counts for the cluster map.
 *
 * @param {SavedAssessment[]} assessmentLog
 * @returns {Object} Map of regionId → { total, urgent, moderate }
 */
export function getRegionCounts(assessmentLog) {
  const now = Date.now();
  const windowStart = now - CLUSTER_CONFIG.TIME_WINDOW_MS;

  const summary = {};
  for (const assessment of assessmentLog) {
    const ts = new Date(assessment.timestamp).getTime();
    if (ts < windowStart) continue;

    const region = assessment.region ?? "unknown";
    if (!summary[region]) {
      summary[region] = { total: 0, urgent: 0, moderate: 0, normal: 0 };
    }

    summary[region].total += 1;
    const level = assessment.result?.level ?? "NORMAL";
    if (level === "URGENT") summary[region].urgent += 1;
    else if (level === "MODERATE") summary[region].moderate += 1;
    else summary[region].normal += 1;
  }

  return summary;
}
