"use server"

import type { Ticket, VisitNo } from "@/domain/queue"
import type { Result } from "@/domain/result"
import { getContainer } from "@/composition-root"
import type { BoardState } from "@/services/queue-service"

// Server actions are adapters: parse the input, call one service method, return plain data.

const COUNTER_ID = /^[a-z0-9-]{1,40}$/
const ID = /^[A-Za-z0-9-]{1,64}$/

const parseCounterId = (value: unknown): string | null =>
  typeof value === "string" && COUNTER_ID.test(value) ? value : null

const parseId = (value: unknown): string | null =>
  typeof value === "string" && ID.test(value) ? value : null

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value)

export async function issueTicket(
  input: unknown
): Promise<Result<Ticket, "invalid_input" | "not_ready">> {
  if (!isRecord(input)) return { ok: false, error: "invalid_input" }
  const journeyId = parseId(input.journeyId)
  const visit = input.visit
  if (!journeyId || (visit !== 1 && visit !== 2) || typeof input.docsReady !== "boolean") {
    return { ok: false, error: "invalid_input" }
  }
  return getContainer().queueService.issueTicket({
    journeyId,
    visit: visit as VisitNo,
    docsReady: input.docsReady,
  })
}

export async function callNext(
  counterId: unknown
): Promise<Result<Ticket, "invalid_input" | "empty" | "busy">> {
  const id = parseCounterId(counterId)
  if (!id) return { ok: false, error: "invalid_input" }
  return getContainer().queueService.callNext(id)
}

export async function finishVisit(
  ticketId: unknown
): Promise<Result<Ticket, "invalid_input" | "not_found" | "not_called">> {
  const id = parseId(ticketId)
  if (!id) return { ok: false, error: "invalid_input" }
  return getContainer().queueService.finishVisit(id)
}

export async function getTicket(
  ticketId: unknown
): Promise<Result<Ticket, "invalid_input" | "not_found">> {
  const id = parseId(ticketId)
  if (!id) return { ok: false, error: "invalid_input" }
  return getContainer().queueService.getTicket(id)
}

export async function boardState(
  counterId: unknown
): Promise<Result<BoardState, "invalid_input">> {
  const id = parseCounterId(counterId)
  if (!id) return { ok: false, error: "invalid_input" }
  return { ok: true, value: await getContainer().queueService.boardState(id) }
}
