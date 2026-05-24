/**
 * Maternal Risk Scoring Engine
 * Screens for the three leading causes of preventable maternal death:
 *  1. Pre-eclampsia / eclampsia
 *  2. Postpartum hemorrhage (PPH)
 *  3. Maternal sepsis
 *
 * Sources:
 *  - WHO Recommendations for Prevention and Treatment of Pre-eclampsia
 *    and Eclampsia, WHO 2011
 *  - WHO recommendations for the prevention and treatment of postpartum
 *    haemorrhage, WHO 2012
 *  - WHO recommendations for Prevention and Treatment of Maternal Peripartum
 *    Infections, WHO 2015
 *
 * @module lib/maternalRisk
 * @sdgTarget 3.1 — Reduce global maternal mortality to < 70 per 100,000 live births
 */

import { RISK_LEVEL } from "./constants.js";

/**
 * Scores a completed maternal assessment against WHO guidelines.
 *
 * @param {Object} answers - Map of question ID → boolean (true = sign present)
 * @param {number|null} gestationalWeeks - Weeks of gestation (null if postpartum)
 * @returns {MaternalResult} Scored result with detected conditions and facility message
 */
export function scoreMaternel(answers, gestationalWeeks = null) {
  const preeclampsiaResult = assessPreeclampsia(answers);
  const hemorrhageResult = assessHemorrhage(answers);
  const sepsisResult = assessSepsis(answers);

  const detectedConditions = [
    preeclampsiaResult,
    hemorrhageResult,
    sepsisResult,
  ].filter((c) => c !== null);

  // Determine overall risk level — take the highest severity
  const overallLevel = determineOverallLevel(detectedConditions);

  return {
    level: overallLevel,
    detectedConditions,
    conditionCount: detectedConditions.length,
    gestationalWeeks,
    facilityMessage: generateMaternalFacilityMessage(
      overallLevel,
      detectedConditions,
      gestationalWeeks
    ),
    assessmentType: "maternal",
    whoProtocol: "WHO Maternal Care Guidelines, 2011–2015",
    sdgTarget: "SDG 3.1",
    timestamp: new Date().toISOString(),
  };
}

/**
 * Assesses pre-eclampsia risk.
 * Threshold: total weight ≥2 → URGENT; weight ≥1 → MODERATE
 *
 * @param {Object} answers
 * @returns {Condition|null}
 */
function assessPreeclampsia(answers) {
  const weightMap = {
    pe_headache: 1,
    pe_vision: 1,
    pe_swelling: 1,
    pe_epigastric: 2,
  };

  const totalWeight = Object.entries(weightMap).reduce((sum, [id, weight]) => {
    return answers[id] ? sum + weight : sum;
  }, 0);

  if (totalWeight >= 2) {
    return { name: "Pre-eclampsia", level: RISK_LEVEL.URGENT, weight: totalWeight };
  }
  if (totalWeight === 1) {
    return { name: "Pre-eclampsia (possible)", level: RISK_LEVEL.MODERATE, weight: totalWeight };
  }
  return null;
}

/**
 * Assesses postpartum hemorrhage risk.
 * Any high-weight sign alone → URGENT
 *
 * @param {Object} answers
 * @returns {Condition|null}
 */
function assessHemorrhage(answers) {
  if (answers["pph_bleeding"]) {
    return { name: "Postpartum hemorrhage", level: RISK_LEVEL.URGENT, weight: 3 };
  }
  if (answers["pph_faint"]) {
    return { name: "Hemorrhage (possible)", level: RISK_LEVEL.MODERATE, weight: 2 };
  }
  return null;
}

/**
 * Assesses maternal sepsis risk.
 * Protocol: fever is required; any additional sign → URGENT
 * Single sign without fever → MODERATE
 *
 * @param {Object} answers
 * @returns {Condition|null}
 */
function assessSepsis(answers) {
  const hasFever = answers["sep_fever"];
  const hasOtherSigns = answers["sep_discharge"] || answers["sep_tenderness"];

  if (hasFever && hasOtherSigns) {
    return { name: "Maternal sepsis", level: RISK_LEVEL.URGENT, weight: 2 };
  }
  if (hasFever || hasOtherSigns) {
    return { name: "Infection (possible)", level: RISK_LEVEL.MODERATE, weight: 1 };
  }
  return null;
}

/**
 * Resolves multiple conditions into a single risk level.
 * Any URGENT condition → overall URGENT.
 * Any MODERATE with no URGENT → overall MODERATE.
 * No conditions → NORMAL.
 *
 * @param {Condition[]} conditions
 * @returns {string} RISK_LEVEL constant
 */
function determineOverallLevel(conditions) {
  if (conditions.length === 0) return RISK_LEVEL.NORMAL;
  if (conditions.some((c) => c.level === RISK_LEVEL.URGENT)) return RISK_LEVEL.URGENT;
  return RISK_LEVEL.MODERATE;
}

/**
 * Generates a pre-written clinical handoff message for the receiving facility.
 *
 * @param {string} level - Overall risk level
 * @param {Condition[]} conditions - Detected conditions
 * @param {number|null} gestationalWeeks
 * @returns {string}
 */
function generateMaternalFacilityMessage(level, conditions, gestationalWeeks) {
  if (level === RISK_LEVEL.NORMAL) {
    return "Maternal assessment completed using WHO protocol. No danger signs detected.";
  }

  const conditionNames = conditions.map((c) => c.name).join(", ");
  const gestText = gestationalWeeks ? `${gestationalWeeks} weeks gestation.` : "Postpartum.";
  const urgency = level === RISK_LEVEL.URGENT ? "URGENT" : "NON-URGENT";

  return `[${urgency} — WHO Maternal] Patient referred. Suspected: ${conditionNames}. ${gestText} Assessed by CHW using WHO guidelines. SDG Target 3.1.`;
}
