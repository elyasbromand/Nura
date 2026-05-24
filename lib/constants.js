/**
 * Nura — Core Constants
 * WHO clinical protocol references and SDG 3 target mappings.
 *
 * SDG Target 3.1: Reduce global maternal mortality ratio to < 70 per 100,000 live births
 * SDG Target 3.2: End preventable deaths of newborns and under-5 children
 * SDG Target 3.d: Strengthen capacity for early warning of national and global health risks
 *
 * WHO References:
 *  - IMNCI (Integrated Management of Newborn and Childhood Illness), WHO 2014
 *  - WHO recommendations for prevention and treatment of pre-eclampsia and eclampsia, 2011
 *  - WHO event-based surveillance, 2008
 */

// ─── Risk Levels ────────────────────────────────────────────────────────────

export const RISK_LEVEL = {
  URGENT: "URGENT",
  MODERATE: "MODERATE",
  NORMAL: "NORMAL",
};

export const RISK_CONFIG = {
  [RISK_LEVEL.URGENT]: {
    label: "Urgent referral",
    shortLabel: "Urgent",
    color: "red",
    bgClass: "bg-red-50",
    borderClass: "border-red-200",
    textClass: "text-red-800",
    badgeClass: "bg-red-100 text-red-800",
    icon: "AlertTriangle",
    action: "Refer to the nearest health facility immediately. Do not delay.",
  },
  [RISK_LEVEL.MODERATE]: {
    label: "Treat & monitor",
    shortLabel: "Monitor",
    color: "amber",
    bgClass: "bg-amber-50",
    borderClass: "border-amber-200",
    textClass: "text-amber-800",
    badgeClass: "bg-amber-100 text-amber-800",
    icon: "AlertCircle",
    action: "Initiate treatment. Schedule a follow-up visit in 48 hours.",
  },
  [RISK_LEVEL.NORMAL]: {
    label: "No danger signs",
    shortLabel: "Well",
    color: "green",
    bgClass: "bg-green-50",
    borderClass: "border-green-200",
    textClass: "text-green-800",
    badgeClass: "bg-green-100 text-green-800",
    icon: "CheckCircle",
    action: "Continue routine home visits. Reassess if condition changes.",
  },
};

// ─── Cluster Detection ───────────────────────────────────────────────────────

/**
 * Outbreak cluster detection thresholds.
 * Based on WHO event-based surveillance methodology.
 * @sdgTarget 3.d
 */
export const CLUSTER_CONFIG = {
  /** Time window in milliseconds (72 hours) */
  TIME_WINDOW_MS: 72 * 60 * 60 * 1000,
  /** Minimum cases in window to trigger cluster alert */
  CASE_THRESHOLD: 3,
};

// ─── Assessment Types ────────────────────────────────────────────────────────

export const ASSESSMENT_TYPE = {
  NEONATAL: "neonatal",
  MATERNAL: "maternal",
};

export const ASSESSMENT_CONFIG = {
  [ASSESSMENT_TYPE.NEONATAL]: {
    title: "Newborn assessment",
    subtitle: "For infants 0–28 days old",
    sdgTarget: "SDG 3.2",
    whoProtocol: "WHO IMNCI Danger Signs Protocol, 2014",
    icon: "Baby",
    color: "blue",
    path: "/neonatal",
  },
  [ASSESSMENT_TYPE.MATERNAL]: {
    title: "Maternal triage",
    subtitle: "For pregnant or postpartum women",
    sdgTarget: "SDG 3.1",
    whoProtocol: "WHO Pre-eclampsia & Maternal Complication Guidelines, 2011",
    icon: "Heart",
    color: "rose",
    path: "/maternal",
  },
};

// ─── Storage Keys ────────────────────────────────────────────────────────────

export const STORAGE_KEYS = {
  ASSESSMENTS: "Nura_assessments",
  SETTINGS: "Nura_settings",
};

// ─── App Metadata ─────────────────────────────────────────────────────────────

export const APP_META = {
  name: "Nura",
  tagline:
    "WHO-protocol clinical decision support for community health workers",
  version: "1.0.0",
  sdgTargets: ["3.1", "3.2", "3.d"],
  whoReference:
    "Integrated Management of Newborn and Childhood Illness (IMNCI), WHO 2014",
};
