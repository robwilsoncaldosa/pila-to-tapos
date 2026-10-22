/** What her phone remembers about the tickets she has taken. */
export type JourneyVisits = {
  1?: { ticketId: string }
  2?: { ticketId: string }
}

export type JoinDecision = "not_ready" | "issue_visit_1" | "go_to_line"

/**
 * What scanning the TV's QR code should do on her phone.
 * A ticket she already holds always wins, so a second scan never issues a second number.
 */
export const decideJoin = (visits: JourneyVisits, ready: boolean): JoinDecision => {
  if (visits[1]) return "go_to_line"
  return ready ? "issue_visit_1" : "not_ready"
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
