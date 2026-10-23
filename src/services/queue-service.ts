import type { Ticket, VisitNo } from "@/domain/queue"
import { err, ok, type Result } from "@/domain/result"
import type { Clock } from "@/ports/clock"
import type { Ids } from "@/ports/ids"
import type { QueueRepository } from "@/ports/queue-repository"

/** The one counter in this proof of concept. */
export const REGISTRATION_COUNTER_ID = "registration"

export type IssueTicketInput = {
  journeyId: string
  visit: VisitNo
  docsReady: boolean
  counterId?: string
}

export type BoardState = {
  counterId: string
  /** The ticket being served right now, or null. */
  current: Ticket | null
  /** Waiting tickets in line order. */
  waiting: Ticket[]
}

export const createQueueService = (deps: {
  queue: QueueRepository
  clock: Clock
  ids: Ids
}) => ({
  /**
   * One number per journey and visit: while that ticket is still waiting or called,
   * asking again returns it instead of issuing a second one.
   */
  issueTicket: async (
    input: IssueTicketInput
  ): Promise<Result<Ticket, "not_ready">> => {
    if (!input.docsReady) return err("not_ready")
    const existing = await deps.queue.findActive(input.journeyId, input.visit)
    if (existing) return ok(existing)
    return ok(
      await deps.queue.issueTicket({
        id: deps.ids.uuid(),
        journeyId: input.journeyId,
        visitNo: input.visit,
        counterId: input.counterId ?? REGISTRATION_COUNTER_ID,
        docsReady: true,
        issuedAt: deps.clock.now().toISOString(),
      })
    )
  },

  /**
   * Calls the first waiting ticket (first in, first out). A called ticket stays called until
   * staff tap Done, so while one is being served this returns "busy"; with nobody waiting it
   * returns "empty".
   */
  callNext: async (
    counterId: string
  ): Promise<Result<Ticket, "empty" | "busy">> => {
    if (await deps.queue.getCurrent(counterId)) return err("busy")
    const called = await deps.queue.callNext(counterId, deps.clock.now().toISOString())
    return called ? ok(called) : err("empty")
  },

  /** Finishing twice is harmless; a ticket that was never called cannot be finished. */
  finishVisit: async (
    ticketId: string
  ): Promise<Result<Ticket, "not_found" | "not_called">> => {
    const ticket = await deps.queue.getTicket(ticketId)
    if (!ticket) return err("not_found")
    if (ticket.status === "waiting") return err("not_called")
    const finished = await deps.queue.finish(ticketId, deps.clock.now().toISOString())
    return finished ? ok(finished) : err("not_found")
  },

  getTicket: async (id: string): Promise<Result<Ticket, "not_found">> => {
    const ticket = await deps.queue.getTicket(id)
    return ticket ? ok(ticket) : err("not_found")
  },

  boardState: async (counterId: string): Promise<BoardState> => ({
    counterId,
    current: await deps.queue.getCurrent(counterId),
    waiting: await deps.queue.listWaiting(counterId),
  }),

  /** Empties the queue so the video recorder can start a clean demo. Gated at the route, not here. */
  resetDemo: async (): Promise<void> => {
    await deps.queue.clear()
  },
})

export type QueueService = ReturnType<typeof createQueueService>
