/**
 * Maternal Risk Assessment Questions
 * Source: WHO Recommendations for Prevention and Treatment of Pre-eclampsia
 *         and Eclampsia, 2011. WHO Maternal Sepsis guidelines, 2017.
 * Protocol: Symptom-based screening grouped by the three leading causes
 *           of preventable maternal death.
 * @sdgTarget 3.1 — Reduce global maternal mortality to < 70 per 100,000 live births
 */

/**
 * Pre-eclampsia screening questions
 * Threshold: ≥2 positive responses → URGENT referral
 */
export const PREECLAMPSIA_QUESTIONS = [
  {
    id: "pe_headache",
    text: "Does she have a severe headache that will not go away?",
    hint: "Ask if painkillers have been tried. A persistent headache that doesn't respond to paracetamol is a warning sign.",
    condition: "preeclampsia",
    weight: 1,
    whoReference: "WHO Pre-eclampsia Symptom 1",
  },
  {
    id: "pe_vision",
    text: "Does she have blurred vision or see flashing lights / spots?",
    hint: "Visual disturbances like blurring, seeing spots, or temporary loss of vision are serious neurological warning signs.",
    condition: "preeclampsia",
    weight: 1,
    whoReference: "WHO Pre-eclampsia Symptom 2",
  },
  {
    id: "pe_swelling",
    text: "Is there swelling of the face or hands? (not just feet)",
    hint: "Some ankle swelling is normal in pregnancy. Swelling of the face, around the eyes, or of the hands is abnormal.",
    condition: "preeclampsia",
    weight: 1,
    whoReference: "WHO Pre-eclampsia Symptom 3",
  },
  {
    id: "pe_epigastric",
    text: "Does she have severe pain in the upper abdomen or under the ribs?",
    hint: "Epigastric pain (upper-middle abdomen) or right upper quadrant pain can indicate liver involvement — a severe sign.",
    condition: "preeclampsia",
    weight: 2,
    whoReference: "WHO Pre-eclampsia Symptom 4 — high weight",
  },
];

/**
 * Postpartum hemorrhage screening questions (for women who have delivered)
 * Any single positive response → URGENT referral
 */
export const HEMORRHAGE_QUESTIONS = [
  {
    id: "pph_bleeding",
    text: "Is she soaking more than one pad per hour with blood?",
    hint: "Estimate blood loss by asking about pad usage. Soaking through 1 pad per hour for 2+ hours is abnormal and dangerous.",
    condition: "hemorrhage",
    weight: 3,
    whoReference: "WHO PPH Indicator — primary",
  },
  {
    id: "pph_faint",
    text: "Does she feel faint, dizzy, or like she might pass out?",
    hint: "Dizziness and fainting can indicate significant blood loss and hemodynamic compromise.",
    condition: "hemorrhage",
    weight: 2,
    whoReference: "WHO PPH Indicator — secondary",
  },
];

/**
 * Maternal sepsis screening questions
 * Threshold: fever + any 1 other sign → URGENT referral
 */
export const SEPSIS_QUESTIONS = [
  {
    id: "sep_fever",
    text: "Does she have a fever above 38°C?",
    hint: "Feel the abdomen or use a thermometer. A temperature of 38°C or above in a pregnant or postpartum woman requires urgent attention.",
    condition: "sepsis",
    weight: 1,
    isFeverFlag: true,
    whoReference: "WHO Maternal Sepsis Criterion 1",
  },
  {
    id: "sep_discharge",
    text: "Is there foul-smelling vaginal discharge?",
    hint: "A strong or offensive odor from vaginal discharge, particularly after delivery, suggests infection.",
    condition: "sepsis",
    weight: 1,
    whoReference: "WHO Maternal Sepsis Criterion 2",
  },
  {
    id: "sep_tenderness",
    text: "Is the abdomen or uterus tender to gentle touch?",
    hint: "Gently press on the lower abdomen. Significant pain or tenderness, especially with a fever, indicates possible uterine infection.",
    condition: "sepsis",
    weight: 1,
    whoReference: "WHO Maternal Sepsis Criterion 3",
  },
];

/** All maternal questions in assessment order */
export const ALL_MATERNAL_QUESTIONS = [
  ...PREECLAMPSIA_QUESTIONS,
  ...HEMORRHAGE_QUESTIONS,
  ...SEPSIS_QUESTIONS,
];
