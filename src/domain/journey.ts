import type { Locale } from "./locale"
import { addWorkingDays } from "./working-days"

/** What her phone remembers about one ticket. */
export type JourneyVisit = { ticketId: string; issuedAt?: string; doneAt?: string }

/** What her phone remembers about the tickets she has taken. */
export type JourneyVisits = { 1?: JourneyVisit; 2?: JourneyVisit }

/** The working days BIR needs between the two visits. */
export const WAIT_WORKING_DAYS = 3

export type JoinDecision =
  | "not_ready"
  | "issue_visit_1"
  | "go_to_line"
  | "issue_visit_2"
  | "visit_2_locked"

/** The Manila day visit 2 opens: the working days after visit 1 was done. Undefined until it is done. */
export const returnDateOf = (visits: JourneyVisits): string | undefined => {
  const doneAt = visits[1]?.doneAt
  return doneAt ? addWorkingDays(doneAt, WAIT_WORKING_DAYS) : undefined
}

/** True once visit 1 is done and the return date has arrived (or the demo switch is on). */
export const visit2Unlocked = (
  visits: JourneyVisits,
  today: string,
  demoSkip: boolean
): boolean => {
  const returnDate = returnDateOf(visits)
  if (!returnDate) return false
  return demoSkip || today >= returnDate
}

/**
 * What scanning the TV's QR code should do on her phone.
 * A ticket she holds and has not finished always wins, so a second scan never issues a second number.
 */
export const decideJoin = (
  visits: JourneyVisits,
  ready: boolean,
  today: string,
  demoSkip: boolean
): JoinDecision => {
  if (visits[2]) return "go_to_line"
  if (visits[1]) {
    if (!visits[1].doneAt) return "go_to_line"
    return visit2Unlocked(visits, today, demoSkip) ? "issue_visit_2" : "visit_2_locked"
  }
  return ready ? "issue_visit_1" : "not_ready"
}

export type JourneyStage = "before" | "visit_1" | "between" | "visit_2" | "finished"

/** Where her saved tickets put her on the path. */
export const journeyStage = (visits: JourneyVisits): JourneyStage => {
  if (visits[2]) return visits[2].doneAt ? "finished" : "visit_2"
  if (visits[1]) return visits[1].doneAt ? "between" : "visit_1"
  return "before"
}

const minutesOf = (visit: JourneyVisit | undefined): number => {
  if (!visit?.issuedAt || !visit.doneAt) return 0
  const ms = new Date(visit.doneAt).getTime() - new Date(visit.issuedAt).getTime()
  return Math.max(0, Math.round(ms / 60000))
}

/** Minutes at the office: visit 1 (number to Done) plus visit 2 (number to Done). */
export const totalVisitTime = (visits: JourneyVisits): number =>
  minutesOf(visits[1]) + minutesOf(visits[2])

/** Filipino: "12 min", "1 oras", "1 oras 5 min". English: "12 min", "1 hr", "1 hr 5 min". */
export const formatDuration = (minutes: number, locale: Locale): string => {
  const whole = Math.max(0, Math.round(minutes))
  const hours = Math.floor(whole / 60)
  const rest = whole % 60
  const hourUnit = locale === "en" ? "hr" : "oras"
  if (hours === 0) return `${rest} min`
  return rest === 0 ? `${hours} ${hourUnit}` : `${hours} ${hourUnit} ${rest} min`
}

type StepLike = { id: string; kind: "visit" | "wait"; visitNo?: 1 | 2 }

/**
 * Which step of the path her ticket puts her on: the visit's own step while she waits or is
 * served, and the waiting step once visit 1 is done.
 */
export const currentStepId = (
  steps: StepLike[],
  ticket: { visitNo: 1 | 2; status: "waiting" | "called" | "done" }
): string | undefined => {
  if (ticket.visitNo === 1 && ticket.status === "done") {
    return steps.find((step) => step.kind === "wait")?.id
  }
  return steps.find((step) => step.kind === "visit" && step.visitNo === ticket.visitNo)?.id
}
