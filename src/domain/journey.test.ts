import assert from "node:assert/strict"
import { test } from "node:test"

import {
  currentStepId,
  decideJoin,
  formatDuration,
  journeyStage,
  returnDateOf,
  totalVisitTime,
  visit2Unlocked,
} from "./journey"

const TODAY = "2026-10-22"
const done1 = {
  1: { ticketId: "t1", issuedAt: "2026-10-22T02:00:00Z", doneAt: "2026-10-22T02:12:00Z" },
}

test("not ready and no ticket sends her back to Screen 1", () => {
  assert.equal(decideJoin({}, false, TODAY, false), "not_ready")
})

test("ready with no ticket issues visit 1", () => {
  assert.equal(decideJoin({}, true, TODAY, false), "issue_visit_1")
})

test("an unfinished visit 1 ticket goes to the line, ready or not", () => {
  assert.equal(decideJoin({ 1: { ticketId: "t1" } }, true, TODAY, false), "go_to_line")
  assert.equal(decideJoin({ 1: { ticketId: "t1" } }, false, TODAY, true), "go_to_line")
})

test("visit 1 done before the return date is locked", () => {
  assert.equal(decideJoin(done1, true, TODAY, false), "visit_2_locked")
})

test("visit 1 done with the demo switch issues visit 2", () => {
  assert.equal(decideJoin(done1, true, TODAY, true), "issue_visit_2")
})

test("visit 1 done on or after the return date issues visit 2", () => {
  assert.equal(returnDateOf(done1), "2026-10-27")
  assert.equal(decideJoin(done1, true, "2026-10-27", false), "issue_visit_2")
  assert.equal(decideJoin(done1, true, "2026-10-26", false), "visit_2_locked")
})

test("a visit 2 ticket goes to the line, finished or not", () => {
  const two = { ...done1, 2: { ticketId: "t2" } }
  assert.equal(decideJoin(two, true, TODAY, true), "go_to_line")
  assert.equal(
    decideJoin({ ...done1, 2: { ticketId: "t2", doneAt: "x" } }, true, TODAY, true),
    "go_to_line"
  )
})

test("visit 2 stays locked without a done visit 1", () => {
  assert.equal(visit2Unlocked({ 1: { ticketId: "t1" } }, "2030-01-01", true), false)
  assert.equal(visit2Unlocked(done1, TODAY, false), false)
  assert.equal(visit2Unlocked(done1, TODAY, true), true)
})

test("the stage follows the saved tickets", () => {
  assert.equal(journeyStage({}), "before")
  assert.equal(journeyStage({ 1: { ticketId: "t1" } }), "visit_1")
  assert.equal(journeyStage(done1), "between")
  assert.equal(journeyStage({ ...done1, 2: { ticketId: "t2" } }), "visit_2")
  assert.equal(journeyStage({ ...done1, 2: { ticketId: "t2", doneAt: "x" } }), "finished")
})

test("total visit time adds both visits", () => {
  const visits = {
    ...done1,
    2: { ticketId: "t2", issuedAt: "2026-10-27T02:00:00Z", doneAt: "2026-10-27T02:08:00Z" },
  }
  assert.equal(totalVisitTime(visits), 20)
  assert.equal(totalVisitTime({}), 0)
})

test("durations read per language", () => {
  assert.equal(formatDuration(12, "fil"), "12 min")
  assert.equal(formatDuration(65, "fil"), "1 oras 5 min")
  assert.equal(formatDuration(120, "fil"), "2 oras")
  assert.equal(formatDuration(0, "fil"), "0 min")
  assert.equal(formatDuration(12, "en"), "12 min")
  assert.equal(formatDuration(65, "en"), "1 hr 5 min")
  assert.equal(formatDuration(120, "en"), "2 hr")
  assert.equal(formatDuration(0, "en"), "0 min")
})

test("the current step follows her ticket", () => {
  const steps = [
    { id: "visit-1", kind: "visit" as const, visitNo: 1 as const },
    { id: "bir-checks", kind: "wait" as const },
    { id: "visit-2", kind: "visit" as const, visitNo: 2 as const },
  ]
  assert.equal(currentStepId(steps, { visitNo: 1, status: "waiting" }), "visit-1")
  assert.equal(currentStepId(steps, { visitNo: 1, status: "called" }), "visit-1")
  assert.equal(currentStepId(steps, { visitNo: 1, status: "done" }), "bir-checks")
  assert.equal(currentStepId(steps, { visitNo: 2, status: "waiting" }), "visit-2")
})

test("the current step in visit 2 and in between", () => {
  const steps = [
    { id: "visit-1", kind: "visit" as const, visitNo: 1 as const },
    { id: "bir-checks", kind: "wait" as const },
    { id: "visit-2", kind: "visit" as const, visitNo: 2 as const },
  ]
  assert.equal(currentStepId(steps, { visitNo: 2, status: "called" }), "visit-2")
})
