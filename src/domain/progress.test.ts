import assert from "node:assert/strict"
import { test } from "node:test"

import type { Plan, PlanDocument } from "./plan"
import { nextAction, planProgress } from "./progress"

const citation = { sourceId: "cc-28a" as const, locator: "x", quote: "q" }

const doc = (
  id: string,
  position: number,
  requirement: PlanDocument["requirement"]
): PlanDocument => ({
  id,
  position,
  name: id,
  whereToGet: "somewhere",
  requirement,
  explanation: "e",
  citation,
  revision: 1,
})

const plan = {
  documents: [doc("form", 1, "required"), doc("a", 2, "situation"), doc("b", 3, "situation")],
} as unknown as Plan

test("first use: every document applies, two questions are open", () => {
  const progress = planProgress(plan, {}, {})
  assert.deepEqual(progress, { total: 3, ticked: 0, unanswered: 2 })
  assert.deepEqual(nextAction(progress), { kind: "answer", count: 2 })
})

test("hindi removes a document from the total, hindi ko alam counts as answered", () => {
  const progress = planProgress(plan, { form: true }, { a: "hindi", b: "hindi_ko_alam" })
  assert.deepEqual(progress, { total: 2, ticked: 1, unanswered: 0 })
  assert.deepEqual(nextAction(progress), { kind: "tick", count: 1 })
})

test("a tick on a document answered hindi does not count", () => {
  const progress = planProgress(plan, { a: true }, { a: "hindi", b: "oo" })
  assert.equal(progress.ticked, 0)
})

test("everything ticked: ready", () => {
  const progress = planProgress(plan, { form: true, b: true }, { a: "hindi", b: "oo" })
  assert.deepEqual(nextAction(progress), { kind: "ready" })
})
