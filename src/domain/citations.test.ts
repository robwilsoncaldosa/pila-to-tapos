import assert from "node:assert/strict"
import { test } from "node:test"

import { validateCitations } from "./citations"
import type { Plan } from "./plan"

const good = (quote: string) => ({
  sourceId: "cc-28a" as const,
  locator: "x",
  quote,
})

const makePlan = (): Plan => ({
  transaction: {
    id: "t",
    title: "T",
    processingTimeLabel: "about 3 working days",
    processingCitation: good("TOTAL PROCESSING TIME: 3 Days"),
    lastCheckedOn: "2026-10-22",
    revision: 1,
  },
  counter: { id: "c", label: "C", speechLabel: "C" },
  steps: [
    {
      id: "s1",
      position: 1,
      name: "S",
      kind: "visit",
      visitNo: 1,
      citation: good("Get a queuing number"),
      revision: 1,
    },
  ],
  documents: [
    {
      id: "d1",
      position: 1,
      name: "D",
      whereToGet: "w",
      requirement: "required",
      explanation: "e",
      citation: good("TOTAL PROCESSING FEE: PHP 30.00"),
      revision: 1,
    },
  ],
  fees: [
    {
      id: "f1",
      label: "F",
      amountPhp: 30,
      visitNo: 2,
      citation: good("30.00 - DS"),
      revision: 1,
    },
  ],
  questions: [],
})

const sources = {
  "cc-28a":
    "1. Get a queuing number in the office\nentrance.\nTOTAL PROCESSING TIME:   3 Days\nTOTAL PROCESSING FEE: PHP 30.00\n30.00 - DS",
  "rmc-47-2026": "",
  "rmc-84-2026": "",
}

test("passes good data, ignoring only whitespace differences", () => {
  assert.deepEqual(validateCitations(makePlan(), sources), [])
})

test("catches a missing citation", () => {
  const plan = makePlan()
  // @ts-expect-error deliberately remove the citation
  plan.documents[0].citation = undefined
  const problems = validateCitations(plan, sources)
  assert.equal(problems.length, 1)
  assert.match(problems[0], /document "d1": missing citation/)
})

test("catches a blank quote", () => {
  const plan = makePlan()
  plan.fees[0].citation.quote = "   "
  assert.match(validateCitations(plan, sources)[0], /fee "f1": missing citation/)
})

test("catches a quote that is not verbatim", () => {
  const plan = makePlan()
  plan.steps[0].citation.quote = "Get a queueing number"
  const problems = validateCitations(plan, sources)
  assert.equal(problems.length, 1)
  assert.match(problems[0], /step "s1": quote not found/)
})

test("does not forgive case or punctuation differences", () => {
  const plan = makePlan()
  plan.transaction.processingCitation.quote = "total processing time: 3 days"
  assert.equal(validateCitations(plan, sources).length, 1)
})

test("flags a source with no text", () => {
  const plan = makePlan()
  plan.fees[0].citation = { sourceId: "rmc-84-2026", locator: "x", quote: "anything" }
  assert.match(validateCitations(plan, sources)[0], /quote not found/)
})

test("checks step notices and question citations", () => {
  const plan = makePlan()
  plan.steps[0].notices = [
    { id: "n", kind: "warning", text: "t", citations: [] },
  ]
  plan.questions = [
    {
      id: "q",
      question: "?",
      kind: "direct",
      answer: "a",
      citations: [],
    },
  ]
  const problems = validateCitations(plan, sources)
  assert.equal(problems.length, 2)
})

const notInSource = () => ({
  id: "q2",
  question: "?",
  kind: "not_in_source" as const,
  answer: "a",
  citations: [],
  related: [good("30.00 - DS")],
  whoToAsk: "RDO",
})

test("accepts a complete not-in-source question", () => {
  const plan = makePlan()
  plan.questions = [notInSource()]
  assert.deepEqual(validateCitations(plan, sources), [])
})

test("flags a not-in-source question with no related citation", () => {
  const plan = makePlan()
  plan.questions = [{ ...notInSource(), related: [] }]
  const problems = validateCitations(plan, sources)
  assert.equal(problems.length, 1)
  assert.match(problems[0], /question "q2": a not-in-source answer needs at least one related/)
})

test("flags a not-in-source question with no whoToAsk", () => {
  const plan = makePlan()
  plan.questions = [{ ...notInSource(), whoToAsk: "  " }]
  const problems = validateCitations(plan, sources)
  assert.equal(problems.length, 1)
  assert.match(problems[0], /needs whoToAsk/)
})

test("flags a question quote that is not verbatim, in citations and related", () => {
  const plan = makePlan()
  plan.questions = [
    {
      id: "q3",
      question: "?",
      kind: "direct",
      answer: "a",
      citations: [good("TOTAL PROCESSING TIME: 5 Days")],
    },
    { ...notInSource(), related: [good("made up penalty")] },
  ]
  const problems = validateCitations(plan, sources)
  assert.equal(problems.length, 2)
  assert.match(problems[0], /question "q3" citation #1: quote not found/)
  assert.match(problems[1], /question "q2" related #1: quote not found/)
})
