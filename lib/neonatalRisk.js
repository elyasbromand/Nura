/**
 * Neonatal Risk Scoring Engine
 * Implements the WHO Integrated Management of Newborn and Childhood Illness
 * (IMNCI) danger sign classification protocol, 2014 edition.
 *
 * Classification logic:
 *  - Any of the 5 critical signs → URGENT REFERRAL
 *  - Any of the 3 moderate signs → TREAT & MONITOR
 *  - All signs absent → NORMAL
 *
 * @module lib/neonatalRisk
 * @sdgTarget 3.2 — End preventable deaths of newborns and children under 5
 * @whoProtocol IMNCI Pocket Book of Hospital Care for Children, WHO 2014
 */

import { RISK_LEVEL } from "./constants.js";
import { NEONATAL_CRITICAL_SIGN_IDS } from "../data/neonatalQuestions.js";

/**
 * Scores a completed neonatal assessment against the WHO IMNCI protocol.
 *
 * @param {Object} answers - Map of question ID → boolean (true = sign present)
 * @returns {NeonatalResult} Scored result with risk level, action, and facility message
 */
export function scoreNeonatal(answers) {
  const presentSigns = Object.entries(answers)
    .filter(([, value]) => value === true)
    .map(([id]) => id);

  const hasCriticalSign = presentSigns.some((id) =>
    NEONATAL_CRITICAL_SIGN_IDS.includes(id)
  );

  const hasModerateSign =
    answers["nq_temperature"] ||
    answers["nq_umbilicus"] ||
    answers["nq_jaundice"];

  if (hasCriticalSign) {
    return buildNeonatalResult(RISK_LEVEL.URGENT, presentSigns, answers);
  }

  if (hasModerateSign) {
    return buildNeonatalResult(RISK_LEVEL.MODERATE, presentSigns, answers);
  }

  return buildNeonatalResult(RISK_LEVEL.NORMAL, [], answers);
}

/**
 * Builds a structured result object with clinical guidance.
 *
 * @param {string} level - RISK_LEVEL constant
 * @param {string[]} presentSignIds - IDs of signs that were positive
 * @param {Object} answers - Full answers map
 * @returns {NeonatalResult}
 */
function buildNeonatalResult(level, presentSignIds, answers) {
  const facilityMessage = generateNeonatalFacilityMessage(level, presentSignIds, answers);

  return {
    level,
    presentSignIds,
    signCount: presentSignIds.length,
    facilityMessage,
    assessmentType: "neonatal",
    whoProtocol: "WHO IMNCI, 2014",
    sdgTarget: "SDG 3.2",
    timestamp: new Date().toISOString(),
  };
}

/**
 * Generates a pre-written clinical handoff message for the receiving facility.
 * This message is intended to be read by the CHW to the receiving nurse or doctor.
 *
 * @param {string} level - Risk level
 * @param {string[]} presentSignIds - Positive sign IDs
 * @param {Object} answers - Full answers
 * @returns {string} Ready-to-read clinical handoff message
 */
function generateNeonatalFacilityMessage(level, presentSignIds, answers) {
  if (level === RISK_LEVEL.NORMAL) {
    return "Newborn assessed using WHO IMNCI protocol. No danger signs detected. Routine monitoring continues.";
  }

  const signs = [];
  if (answers["nq_feeding"]) signs.push("unable to feed");
  if (answers["nq_convulsions"]) signs.push("convulsions reported");
  if (answers["nq_breathing"]) signs.push("fast breathing (≥60/min)");
  if (answers["nq_chest_indrawing"]) signs.push("severe chest indrawing");
  if (answers["nq_nasal"]) signs.push("nasal flaring / grunting");
  if (answers["nq_temperature"]) signs.push("abnormal temperature");
  if (answers["nq_umbilicus"]) signs.push("umbilical infection signs");
  if (answers["nq_jaundice"]) signs.push("jaundice below navel");

  const signsText = signs.join(", ");
  const urgency = level === RISK_LEVEL.URGENT ? "URGENT" : "NON-URGENT";

  return `[${urgency} — WHO IMNCI] Neonate referred with the following danger signs: ${signsText}. Assessed by community health worker using WHO IMNCI protocol. SDG Target 3.2.`;
}
