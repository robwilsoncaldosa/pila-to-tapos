import assert from "node:assert/strict"
import { test } from "node:test"

import {
  TICKET_LETTER,
  formatTicketNumber,
  inLineOrder,
  manilaDay,
  nextWaiting,
  type Ticket,
} from "@/domain/queue"
import type { QueueRepository } from "@/ports/queue-repository"

import { createQueueService, REGISTRATION_COUNTER_ID } from "./queue-service"

/** A plain-object queue repository: the contract, with no globalThis and no server. */
const fakeQueue = (): QueueRepository => {
  const tickets: Ticket[] = []
  const replace = (updated: Ticket) => {
    tickets[tickets.findIndex((t) => t.id === updated.id)] = updated
    return updated
  }
  return {
    issueTicket: async (input) => {
      const day = manilaDay(new Date(input.issuedAt))
      const seq = tickets.filter((t) => t.day === day).length + 1
      const ticket: Ticket = {
        ...input,
        day,
        seq,
        number: formatTicketNumber(TICKET_LETTER, seq),
        status: "waiting",
      }
      tickets.push(ticket)
      return ticket
    },
    findActive: async (journeyId, visitNo) =>
      tickets.find(
        (t) => t.journeyId === journeyId && t.visitNo === visitNo && t.status !== "done"
      ) ?? null,
    listWaiting: async (counterId) =>
      inLineOrder(tickets.filter((t) => t.counterId === counterId && t.status === "waiting")),
    getCurrent: async (counterId) =>
      tickets.find((t) => t.counterId === counterId && t.status === "called") ?? null,
    callNext: async (counterId, at) => {
      const next = nextWaiting(tickets, counterId)
      return next ? replace({ ...next, status: "called", calledAt: at }) : null
    },
    finish: async (id, at) => {
      const ticket = tickets.find((t) => t.id === id)
      return ticket ? replace({ ...ticket, status: "done", doneAt: at }) : null
    },
    getTicket: async (id) => tickets.find((t) => t.id === id) ?? null,
  }
}

const setup = () => {
  let minute = 0
  let nextId = 0
  const service = createQueueService({
    queue: fakeQueue(),
    // Each call to now() is a minute later, so line order is unambiguous.
    clock: { now: () => new Date(Date.UTC(2026, 9, 22, 2, minute++)) },
    ids: { uuid: () => `id-${++nextId}` },
  })
  const issue = (journeyId: string, visit: 1 | 2 = 1) =>
    service.issueTicket({ journeyId, visit, docsReady: true })
  return { service, issue }
}

test("numbers go B-001 then B-002", async () => {
  const { issue } = setup()
  const first = await issue("a")
  const second = await issue("b")
  assert.ok(first.ok && second.ok)
  assert.equal(first.value.number, "B-001")
  assert.equal(second.value.number, "B-002")
  assert.equal(first.value.status, "waiting")
  assert.equal(first.value.counterId, REGISTRATION_COUNTER_ID)
})

test("a journey that is not ready is rejected", async () => {
  const { service } = setup()
  const result = await service.issueTicket({ journeyId: "a", visit: 1, docsReady: false })
  assert.deepEqual(result, { ok: false, error: "not_ready" })
  assert.equal((await service.boardState(REGISTRATION_COUNTER_ID)).waiting.length, 0)
})

test("the same journey and visit is not issued twice while waiting or called", async () => {
  const { service, issue } = setup()
  const first = await issue("a")
  const again = await issue("a")
  assert.ok(first.ok && again.ok)
  assert.equal(again.value.id, first.value.id)

  await service.callNext(REGISTRATION_COUNTER_ID)
  const whileCalled = await issue("a")
  assert.ok(whileCalled.ok)
  assert.equal(whileCalled.value.id, first.value.id)
  assert.equal((await service.boardState(REGISTRATION_COUNTER_ID)).waiting.length, 0)
})

test("visit 2 is a separate ticket for the same journey", async () => {
  const { service, issue } = setup()
  const visit1 = await issue("a", 1)
  assert.ok(visit1.ok)
  await service.callNext(REGISTRATION_COUNTER_ID)
  await service.finishVisit(visit1.value.id)
  const visit2 = await issue("a", 2)
  assert.ok(visit2.ok)
  assert.notEqual(visit2.value.id, visit1.value.id)
  assert.equal(visit2.value.visitNo, 2)
})

test("call next with nobody waiting is empty", async () => {
  const { service } = setup()
  assert.deepEqual(await service.callNext(REGISTRATION_COUNTER_ID), {
    ok: false,
    error: "empty",
  })
})

test("call next calls the first waiting ticket, first in first out", async () => {
  const { service, issue } = setup()
  await issue("a")
  await issue("b")
  const called = await service.callNext(REGISTRATION_COUNTER_ID)
  assert.ok(called.ok)
  assert.equal(called.value.number, "B-001")
  assert.equal(called.value.status, "called")
  assert.ok(called.value.calledAt)
  const board = await service.boardState(REGISTRATION_COUNTER_ID)
  assert.equal(board.current?.number, "B-001")
  assert.deepEqual(
    board.waiting.map((t) => t.number),
    ["B-002"]
  )
})

test("call next is busy until the called ticket is finished", async () => {
  const { service, issue } = setup()
  await issue("a")
  await issue("b")
  const first = await service.callNext(REGISTRATION_COUNTER_ID)
  assert.ok(first.ok)
  assert.deepEqual(await service.callNext(REGISTRATION_COUNTER_ID), {
    ok: false,
    error: "busy",
  })
  await service.finishVisit(first.value.id)
  const second = await service.callNext(REGISTRATION_COUNTER_ID)
  assert.ok(second.ok)
  assert.equal(second.value.number, "B-002")
})

test("finishing marks the ticket done and clears the current ticket", async () => {
  const { service, issue } = setup()
  const issued = await issue("a")
  assert.ok(issued.ok)
  await service.callNext(REGISTRATION_COUNTER_ID)
  const finished = await service.finishVisit(issued.value.id)
  assert.ok(finished.ok)
  assert.equal(finished.value.status, "done")
  assert.ok(finished.value.doneAt)
  assert.equal((await service.boardState(REGISTRATION_COUNTER_ID)).current, null)
  const looked = await service.getTicket(issued.value.id)
  assert.ok(looked.ok)
  assert.equal(looked.value.status, "done")
})

test("a ticket that was never called cannot be finished, and unknown ids are not found", async () => {
  const { service, issue } = setup()
  const issued = await issue("a")
  assert.ok(issued.ok)
  assert.deepEqual(await service.finishVisit(issued.value.id), {
    ok: false,
    error: "not_called",
  })
  assert.deepEqual(await service.finishVisit("nope"), { ok: false, error: "not_found" })
  assert.deepEqual(await service.getTicket("nope"), { ok: false, error: "not_found" })
})
