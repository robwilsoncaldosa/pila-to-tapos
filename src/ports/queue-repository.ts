import type { Ticket, VisitNo } from "@/domain/queue"

export type NewTicket = {
  id: string
  journeyId: string
  visitNo: VisitNo
  counterId: string
  docsReady: boolean
  /** ISO time. Its Asia/Manila day decides the number's day and where the sequence restarts. */
  issuedAt: string
}

export type QueueRepository = {
  /** Adds a waiting ticket with the next number of its day at that counter. */
  issueTicket: (input: NewTicket) => Promise<Ticket>
  /** The waiting or called ticket this journey holds for a visit, if any. */
  findActive: (journeyId: string, visitNo: VisitNo) => Promise<Ticket | null>
  /** Waiting tickets in line order. */
  listWaiting: (counterId: string) => Promise<Ticket[]>
  /** The ticket currently called at this counter, if any. */
  getCurrent: (counterId: string) => Promise<Ticket | null>
  /** Marks the first waiting ticket called, or returns null when nobody is waiting. */
  callNext: (counterId: string, at: string) => Promise<Ticket | null>
  /** Marks a called ticket done. Returns null when the ticket does not exist. */
  finish: (ticketId: string, at: string) => Promise<Ticket | null>
  getTicket: (id: string) => Promise<Ticket | null>
  /** Removes every ticket. Only the demo reset calls this. */
  clear: () => Promise<void>
}
