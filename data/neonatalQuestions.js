/**
 * Neonatal Danger Sign Questions
 * Source: WHO Integrated Management of Newborn and Childhood Illness (IMNCI), 2014
 * Protocol: 8 clinical danger signs for infants aged 0–28 days
 * @sdgTarget 3.2 — End preventable deaths of newborns and children under 5
 */

export const NEONATAL_QUESTIONS = [
  {
    id: "nq_feeding",
    text: "Is the baby unable to feed or has stopped feeding?",
    hint: "Observe the baby attempting to breastfeed for at least 4 minutes. Unable to feed means the baby cannot suck at all.",
    severity: "critical",
    whoSign: "Unable to feed",
    whoReference: "IMNCI Danger Sign 1",
  },
  {
    id: "nq_convulsions",
    text: "Has the baby had convulsions (fits or seizures)?",
    hint: "Ask the caregiver if the baby has had episodes of stiffening, jerking, or rhythmic shaking of the limbs.",
    severity: "critical",
    whoSign: "Convulsions",
    whoReference: "IMNCI Danger Sign 2",
  },
  {
    id: "nq_breathing",
    text: "Is the baby breathing fast? (60 or more breaths per minute)",
    hint: "Count the breaths for one full minute. The baby must be calm and not crying. Count again if the result is 60 or more.",
    severity: "critical",
    whoSign: "Fast breathing ≥60/min",
    whoReference: "IMNCI Danger Sign 3",
  },
  {
    id: "nq_chest_indrawing",
    text: "Is there severe chest indrawing?",
    hint: "Look at the lower chest wall. Chest indrawing is when the lower chest wall goes IN when the baby breathes IN. It must be severe and present all the time.",
    severity: "critical",
    whoSign: "Severe chest indrawing",
    whoReference: "IMNCI Danger Sign 4",
  },
  {
    id: "nq_nasal",
    text: "Is there nasal flaring or grunting on breathing?",
    hint: "Nasal flaring: the nostrils widen with each breath. Grunting: a short, low sound made when the baby breathes out — different from crying.",
    severity: "critical",
    whoSign: "Nasal flaring / grunting",
    whoReference: "IMNCI Danger Sign 5",
  },
  {
    id: "nq_temperature",
    text: "Is the baby's temperature abnormal? (above 37.5°C or below 35.5°C)",
    hint: "Use a thermometer under the armpit for 3 minutes. If no thermometer: feel the baby's abdomen — hot means fever, cold and clammy may mean hypothermia.",
    severity: "moderate",
    whoSign: "Abnormal temperature",
    whoReference: "IMNCI Danger Sign 6",
  },
  {
    id: "nq_umbilicus",
    text: "Is the umbilical cord red, swollen, or draining pus?",
    hint: "Look at the cord stump. Redness spreading to the surrounding skin is a serious sign. A small amount of dried blood is normal.",
    severity: "moderate",
    whoSign: "Umbilical infection",
    whoReference: "IMNCI Danger Sign 7",
  },
  {
    id: "nq_jaundice",
    text: "Is the baby jaundiced (yellow skin) below the navel?",
    hint: "Press gently on the baby's skin on the abdomen or legs and release. If the skin looks yellow, jaundice extends below the navel — this is severe.",
    severity: "moderate",
    whoSign: "Severe jaundice",
    whoReference: "IMNCI Danger Sign 8",
  },
];

/** IDs of questions that, if answered Yes, trigger an URGENT result immediately */
export const NEONATAL_CRITICAL_SIGN_IDS = [
  "nq_feeding",
  "nq_convulsions",
  "nq_breathing",
  "nq_chest_indrawing",
  "nq_nasal",
];
