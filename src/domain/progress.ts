import { sortByPosition, type Plan } from "./plan"
import { isDocumentNeeded, type Answers, type Ticks } from "./checklist"

export type PlanProgress = {
  /** Documents that apply so far. A situation document with no answer yet counts as applying. */
  total: number
  /** Applying documents she has ticked. */
  ticked: number
  /** Situation questions with no answer yet. "Hindi ko alam" counts as answered. */
  unanswered: number
}

export const planProgress = (plan: Plan, ticks: Ticks, answers: Answers): PlanProgress => {
  const docs = sortByPosition(plan.documents)
  const needed = docs.filter((doc) => isDocumentNeeded(doc, answers))
  return {
    total: needed.length,
    ticked: needed.filter((doc) => ticks[doc.id]).length,
    unanswered: docs.filter((doc) => doc.requirement === "situation" && !answers[doc.id]).length,
  }
}

export type NextAction =
  | { kind: "answer"; count: number }
  | { kind: "tick"; count: number }
  | { kind: "ready" }

/** The one thing to do next: answer the open questions, then tick what is missing, then go. */
export const nextAction = (progress: PlanProgress): NextAction => {
  if (progress.unanswered > 0) return { kind: "answer", count: progress.unanswered }
  const missing = progress.total - progress.ticked
  if (missing > 0) return { kind: "tick", count: missing }
  return { kind: "ready" }
}
