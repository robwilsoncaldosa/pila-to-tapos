import "server-only"

import {
  TICKET_LETTER,
  formatTicketNumber,
  inLineOrder,
  manilaDay,
  nextWaiting,
  type Ticket,
} from "@/domain/queue"
import type { QueueRepository } from "@/ports/queue-repository"

const globalForQueue = globalThis as unknown as { __pilaTickets?: Ticket[] }

/** The in-memory queue. The array lives on globalThis so hot reload keeps it; a restart clears it. */
export const createMemoryQueueRepository = (): QueueRepository => {
  const tickets = (globalForQueue.__pilaTickets ??= [])

  const replace = (updated: Ticket): Ticket => {
    const index = tickets.findIndex((ticket) => ticket.id === updated.id)
    tickets[index] = updated
    return updated
  }

  return {
    issueTicket: async (input) => {
      const day = manilaDay(new Date(input.issuedAt))
      const sameDay = tickets.filter(
        (ticket) => ticket.day === day && ticket.counterId === input.counterId
      )
      const seq = sameDay.reduce((max, ticket) => Math.max(max, ticket.seq), 0) + 1
      const ticket: Ticket = {
        id: input.id,
        day,
        seq,
        number: formatTicketNumber(TICKET_LETTER, seq),
        journeyId: input.journeyId,
        visitNo: input.visitNo,
        counterId: input.counterId,
        docsReady: input.docsReady,
        status: "waiting",
        issuedAt: input.issuedAt,
      }
      tickets.push(ticket)
      return ticket
    },
    findActive: async (journeyId, visitNo) =>
      tickets.find(
        (ticket) =>
          ticket.journeyId === journeyId &&
          ticket.visitNo === visitNo &&
          ticket.status !== "done"
      ) ?? null,
    listWaiting: async (counterId) =>
      inLineOrder(
        tickets.filter(
          (ticket) => ticket.counterId === counterId && ticket.status === "waiting"
        )
      ),
    getCurrent: async (counterId) =>
      tickets.find(
        (ticket) => ticket.counterId === counterId && ticket.status === "called"
      ) ?? null,
    callNext: async (counterId, at) => {
      const next = nextWaiting(tickets, counterId)
      if (!next) return null
      return replace({ ...next, status: "called", calledAt: at })
    },
    finish: async (ticketId, at) => {
      const ticket = tickets.find((item) => item.id === ticketId)
      if (!ticket) return null
      if (ticket.status === "done") return ticket
      return replace({ ...ticket, status: "done", doneAt: at })
    },
    getTicket: async (id) => tickets.find((ticket) => ticket.id === id) ?? null,
  }
}
