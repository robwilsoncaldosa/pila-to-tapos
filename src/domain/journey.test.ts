import assert from "node:assert/strict"
import { test } from "node:test"

import { currentStepId, decideJoin } from "./journey"

test("not ready and no ticket sends her back to Screen 1", () => {
  assert.equal(decideJoin({}, false), "not_ready")
})

test("ready with no ticket issues visit 1", () => {
  assert.equal(decideJoin({}, true), "issue_visit_1")
})

test("an existing visit 1 ticket goes to the line, ready or not", () => {
  assert.equal(decideJoin({ 1: { ticketId: "t1" } }, true), "go_to_line")
  assert.equal(decideJoin({ 1: { ticketId: "t1" } }, false), "go_to_line")
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
