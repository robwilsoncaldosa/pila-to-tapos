export type TicketStatus = "waiting" | "called" | "done"
export type VisitNo = 1 | 2

export type Ticket = {
  id: string
  /** The Asia/Manila calendar day the number is good for, "YYYY-MM-DD". */
  day: string
  seq: number
  /** "B-001". */
  number: string
  journeyId: string
  visitNo: VisitNo
  counterId: string
  docsReady: boolean
  status: TicketStatus
  /** ISO timestamps, so a ticket is plain JSON all the way to her phone. */
  issuedAt: string
  calledAt?: string
  doneAt?: string
}

/** The one counter's letter. Numbers read "B-001", "B-002", ... */
export const TICKET_LETTER = "B"

export const formatTicketNumber = (letter: string, seq: number): string =>
  `${letter}-${String(seq).padStart(3, "0")}`

/** The Asia/Manila calendar day of an instant, "YYYY-MM-DD". */
export const manilaDay = (date: Date): string =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Manila",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date)

/** The line in order: oldest first, then by number within the same instant. */
export const inLineOrder = (tickets: Ticket[]): Ticket[] =>
  [...tickets].sort(
    (a, b) => a.issuedAt.localeCompare(b.issuedAt) || a.seq - b.seq
  )

/** The first ticket still waiting at a counter, or undefined when nobody is. */
export const nextWaiting = (
  tickets: Ticket[],
  counterId: string
): Ticket | undefined =>
  inLineOrder(tickets).find(
    (ticket) => ticket.counterId === counterId && ticket.status === "waiting"
  )

/** Whole minutes between two ISO times, never negative. */
export const minutesBetween = (fromIso: string, to: Date): number =>
  Math.max(0, Math.floor((to.getTime() - new Date(fromIso).getTime()) / 60000))

/** The visit badge on the counter's list and the step name on her stub. */
export const visitLabel = (visitNo: VisitNo): string =>
  visitNo === 1 ? "Submit" : "Pay & claim"
