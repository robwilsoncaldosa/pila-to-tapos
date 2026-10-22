import assert from "node:assert/strict"
import { test } from "node:test"

import { checklistStatus, showUnfiledReturnsWarning } from "./checklist"
import { summarizeFees, type Fee, type Plan, type PlanDocument } from "./plan"

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

const plan: Plan = {
  transaction: {
    id: "t",
    title: "T",
    processingTimeLabel: "about 3 working days",
    processingCitation: citation,
    lastCheckedOn: "2026-10-22",
    revision: 1,
  },
  counter: { id: "c", label: "C", speechLabel: "C" },
  steps: [],
  documents: [
    doc("form", 1, "required"),
    doc("vat-inventory", 2, "situation"),
    doc("final-returns", 3, "situation"),
  ],
  fees: [],
  questions: [],
}

test("first use: everything is missing and not ready", () => {
  const status = checklistStatus(plan, {}, {})
  assert.deepEqual(
    status.missing.map((d) => d.id),
    ["form", "vat-inventory", "final-returns"]
  )
  assert.equal(status.ready, false)
})

test("required ticked + one situation answered hindi, other still unanswered: not ready", () => {
  const status = checklistStatus(plan, { form: true }, { "vat-inventory": "hindi" })
  assert.deepEqual(status.missing.map((d) => d.id), ["final-returns"])
  assert.deepEqual(status.notNeeded.map((d) => d.id), ["vat-inventory"])
  assert.equal(status.ready, false)
})

test("all required ticked + situations answered hindi: ready", () => {
  const status = checklistStatus(
    plan,
    { form: true },
    { "vat-inventory": "hindi", "final-returns": "hindi" }
  )
  assert.equal(status.ready, true)
  assert.equal(status.missing.length, 0)
  assert.equal(status.notNeeded.length, 2)
})

test("a situation question left unanswered stays required", () => {
  const status = checklistStatus(
    plan,
    { form: true, "final-returns": true },
    { "final-returns": "oo" }
  )
  assert.deepEqual(status.missing.map((d) => d.id), ["vat-inventory"])
  assert.equal(status.ready, false)
})

test("hindi ko alam unticked is missing", () => {
  const status = checklistStatus(
    plan,
    { form: true },
    { "vat-inventory": "hindi", "final-returns": "hindi_ko_alam" }
  )
  assert.deepEqual(status.missing.map((d) => d.id), ["final-returns"])
  assert.equal(status.ready, false)
})

test("hindi ko alam ticked is ready", () => {
  const status = checklistStatus(
    plan,
    { form: true, "final-returns": true },
    { "vat-inventory": "hindi", "final-returns": "hindi_ko_alam" }
  )
  assert.equal(status.ready, true)
})

test("oo ticked is ready; oo unticked is missing", () => {
  const answers = { "vat-inventory": "oo", "final-returns": "hindi" } as const
  assert.equal(
    checklistStatus(plan, { form: true, "vat-inventory": true }, answers).ready,
    true
  )
  assert.deepEqual(
    checklistStatus(plan, { form: true }, answers).missing.map((d) => d.id),
    ["vat-inventory"]
  )
})

test("a tick on a not-needed document does not matter", () => {
  const status = checklistStatus(
    plan,
    { form: true, "vat-inventory": true },
    { "vat-inventory": "hindi", "final-returns": "hindi" }
  )
  assert.equal(status.ready, true)
})

test("showUnfiledReturnsWarning is true only for oo and hindi ko alam", () => {
  assert.equal(showUnfiledReturnsWarning({}), false)
  assert.equal(showUnfiledReturnsWarning({ "final-returns": "hindi" }), false)
  assert.equal(showUnfiledReturnsWarning({ "final-returns": "oo" }), true)
  assert.equal(showUnfiledReturnsWarning({ "final-returns": "hindi_ko_alam" }), true)
  assert.equal(showUnfiledReturnsWarning({ "vat-inventory": "oo" }), false)
})

const fee = (id: string, amountPhp: number | null): Fee => ({
  id,
  label: id,
  amountPhp,
  visitNo: 2,
  citation,
  revision: 1,
})

test("summarizeFees sums official amounts and lists the unlisted ones", () => {
  const summary = summarizeFees([fee("a", 30), fee("b", null)])
  assert.equal(summary.totalPhp, 30)
  assert.deepEqual(summary.unlisted.map((f) => f.id), ["b"])
})

test("summarizeFees returns no number when no fee has an official amount", () => {
  assert.equal(summarizeFees([fee("b", null)]).totalPhp, null)
  assert.equal(summarizeFees([]).totalPhp, null)
})
