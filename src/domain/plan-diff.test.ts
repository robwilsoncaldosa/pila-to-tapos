import assert from "node:assert/strict"
import { test } from "node:test"

import type { Plan, PlanDocument } from "./plan"
import { diffPlan, dropChangedTicks, itemNames, sameSnapshot, snapshotOf } from "./plan-diff"

const citation = { sourceId: "cc-28a" as const, locator: "x", quote: "q" }

const doc = (id: string, revision: number): PlanDocument => ({
  id,
  position: 1,
  name: id,
  whereToGet: "somewhere",
  requirement: "required",
  explanation: "e",
  citation,
  revision,
})

const makePlan = (documents: PlanDocument[], revision = 1): Plan => ({
  transaction: {
    id: "t",
    title: "T",
    processingTimeLabel: "about 3 working days",
    processingCitation: citation,
    lastCheckedOn: "2026-10-22",
    revision,
  },
  counter: { id: "c", label: "C", speechLabel: "C" },
  steps: [
    { id: "s1", position: 1, name: "S1", kind: "visit", visitNo: 1, citation, revision: 1 },
  ],
  documents,
  fees: [{ id: "f1", label: "F", amountPhp: 30, visitNo: 2, citation, revision: 1 }],
  questions: [],
})

test("the first visit (nothing seen yet) is not an update", () => {
  const plan = makePlan([doc("a", 1)])
  assert.deepEqual(diffPlan({ revision: 0, items: {} }, plan), { added: [], changed: [] })
})

test("an unchanged plan has no differences", () => {
  const plan = makePlan([doc("a", 1)])
  assert.deepEqual(diffPlan(snapshotOf(plan), plan), { added: [], changed: [] })
})

test("a new document is added", () => {
  const before = makePlan([doc("a", 1)])
  const after = makePlan([doc("a", 1), doc("b", 1)], 2)
  assert.deepEqual(diffPlan(snapshotOf(before), after), { added: ["b"], changed: [] })
})

test("a revision bump marks the document changed", () => {
  const before = makePlan([doc("a", 1), doc("b", 1)])
  const after = makePlan([doc("a", 2), doc("b", 1)], 2)
  assert.deepEqual(diffPlan(snapshotOf(before), after), { added: [], changed: ["a"] })
})

test("the meta item changes when its revision moves", () => {
  const before = makePlan([doc("a", 1)])
  const after = makePlan([doc("a", 1)], 2)
  after.transaction.metaRevision = 2
  assert.deepEqual(diffPlan(snapshotOf(before), after), { added: [], changed: ["meta"] })
})

test("a removed document is not reported", () => {
  const before = makePlan([doc("a", 1), doc("b", 1)])
  const after = makePlan([doc("a", 1)], 2)
  assert.deepEqual(diffPlan(snapshotOf(before), after), { added: [], changed: [] })
})

test("changed documents lose their ticks, the rest keep them", () => {
  assert.deepEqual(dropChangedTicks({ a: true, b: true }, ["a"]), { b: true })
})

test("snapshots compare by revision and items, and items get readable names", () => {
  const plan = makePlan([doc("a", 1)])
  assert.equal(sameSnapshot(snapshotOf(plan), snapshotOf(plan)), true)
  assert.equal(sameSnapshot(snapshotOf(plan), snapshotOf(makePlan([doc("a", 2)], 2))), false)
  assert.equal(itemNames(plan).a, "a")
  assert.equal(itemNames(plan).f1, "F")
})
