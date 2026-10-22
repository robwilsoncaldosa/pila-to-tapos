import {
  UNFILED_RETURNS_DOC_ID,
  sortByPosition,
  type Plan,
  type PlanDocument,
  type SituationAnswer,
} from "./plan"

export type Ticks = Record<string, true>
export type Answers = Record<string, SituationAnswer>

export type ChecklistStatus = {
  /** Applicable documents that are not ticked yet. */
  missing: PlanDocument[]
  /** Situation documents she answered "hindi" to. */
  notNeeded: PlanDocument[]
  ready: boolean
}

/** Hindi frees a situation document. Oo, Hindi ko alam, or no answer keep it required. */
export const isDocumentNeeded = (
  doc: PlanDocument,
  answers: Answers
): boolean => doc.requirement === "required" || answers[doc.id] !== "hindi"

export const checklistStatus = (
  plan: Plan,
  ticks: Ticks,
  answers: Answers
): ChecklistStatus => {
  const docs = sortByPosition(plan.documents)
  const missing = docs.filter(
    (doc) => isDocumentNeeded(doc, answers) && !ticks[doc.id]
  )
  const notNeeded = docs.filter((doc) => !isDocumentNeeded(doc, answers))
  return { missing, notNeeded, ready: missing.length === 0 }
}

/** True when she answered Oo or Hindi ko alam to the unfiled-returns question. */
export const showUnfiledReturnsWarning = (answers: Answers): boolean => {
  const answer = answers[UNFILED_RETURNS_DOC_ID]
  return answer === "oo" || answer === "hindi_ko_alam"
}
