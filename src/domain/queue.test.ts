import assert from "node:assert/strict"
import { test } from "node:test"

import {
  formatTicketNumber,
  inLineOrder,
  manilaDay,
  minutesBetween,
  nextWaiting,
  visitLabel,
  type Ticket,
} from "./queue"

const ticket = (seq: number, overrides: Partial<Ticket> = {}): Ticket => ({
  id: `t${seq}`,
  day: "2026-10-22",
  seq,
  number: formatTicketNumber("B", seq),
  journeyId: `j${seq}`,
  visitNo: 1,
  counterId: "registration",
  docsReady: true,
  status: "waiting",
  issuedAt: `2026-10-22T02:0${seq}:00.000Z`,
  ...overrides,
})

test("formats a number as a letter and three digits", () => {
  assert.equal(formatTicketNumber("B", 1), "B-001")
  assert.equal(formatTicketNumber("B", 42), "B-042")
  assert.equal(formatTicketNumber("B", 1234), "B-1234")
})

test("manilaDay uses Asia/Manila, not UTC", () => {
  // 17:00 UTC on the 21st is already 01:00 on the 22nd in Manila.
  assert.equal(manilaDay(new Date("2026-10-21T17:00:00Z")), "2026-10-22")
  assert.equal(manilaDay(new Date("2026-10-21T15:59:00Z")), "2026-10-21")
})

test("the line is oldest first", () => {
  const line = inLineOrder([ticket(3), ticket(1), ticket(2)])
  assert.deepEqual(
    line.map((t) => t.number),
    ["B-001", "B-002", "B-003"]
  )
})

test("nextWaiting skips called and done tickets and other counters", () => {
  const tickets = [
    ticket(1, { status: "done" }),
    ticket(2, { status: "called" }),
    ticket(3, { counterId: "other" }),
    ticket(4),
    ticket(5),
  ]
  assert.equal(nextWaiting(tickets, "registration")?.number, "B-004")
  assert.equal(nextWaiting([ticket(1, { status: "done" })], "registration"), undefined)
})

test("minutesBetween floors to whole minutes and never goes negative", () => {
  const issued = "2026-10-22T02:00:00.000Z"
  assert.equal(minutesBetween(issued, new Date("2026-10-22T02:03:59Z")), 3)
  assert.equal(minutesBetween(issued, new Date("2026-10-22T01:59:00Z")), 0)
})

test("visit labels", () => {
  assert.equal(visitLabel(1), "Submit")
  assert.equal(visitLabel(2), "Pay & claim")
})
