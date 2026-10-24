import assert from "node:assert/strict"
import { test } from "node:test"

import { localizePlan, missingEnglish } from "./localize"
import { parseLocale } from "./locale"
import type { Citation, Plan } from "./plan"

const cite: Citation = { sourceId: "cc-28a", locator: "x", quote: "Official English quote." }

const makePlan = (): Plan => ({
  transaction: {
    id: "t",
    title: "BIR: Close my freelancer registration",
    processingTimeLabel: "mga 3 working days",
    processingCitation: cite,
    lastCheckedOn: "2026-10-22",
    revision: 1,
    en: { title: "BIR: Close my freelancer registration", processingTimeLabel: "about 3 working days" },
  },
  counter: { id: "c", label: "Registration Officer counter", speechLabel: "Registration counter" },
  steps: [
    {
      id: "s1",
      position: 1,
      name: "BIR checks your records",
      kind: "wait",
      waitWorkingDays: 3,
      citation: cite,
      revision: 1,
      en: { name: "BIR checks your records" },
      notices: [
        {
          id: "n1",
          kind: "warning",
          text: "Ayusin sa loob ng 30 araw.",
          citations: [cite],
          en: { text: "Settle within 30 days." },
        },
      ],
    },
  ],
  documents: [
    {
      id: "d1",
      position: 1,
      name: "Listahan ng inventory",
      whereToGet: "Ikaw ang maghahanda.",
      requirement: "situation",
      situationQuestion: "VAT-registered ka ba?",
      notNeededReason: "Para lang sa VAT.",
      explanation: "Isang original copy.",
      citation: cite,
      revision: 1,
      en: {
        name: "Ending inventory list",
        whereToGet: "You prepare it yourself.",
        situationQuestion: "Are you VAT-registered?",
        notNeededReason: "Only for VAT-registered taxpayers.",
        explanation: "One original copy.",
      },
    },
    {
      id: "d2",
      position: 2,
      name: "Bagong dokumento",
      whereToGet: "Kunin sa RDO.",
      requirement: "required",
      explanation: "Idinagdag ng team.",
      citation: cite,
      revision: 1,
    },
  ],
  fees: [{ id: "f1", label: "Documentary stamp", amountPhp: 30, visitNo: 2, citation: cite, revision: 1, en: { label: "Documentary stamp" } }],
  questions: [
    {
      id: "q1",
      question: "Magkano ang babayaran ko?",
      kind: "not_in_source",
      answer: "Hindi namin hinuhulaan.",
      citations: [],
      related: [cite],
      whoToAsk: "Ang RDO.",
      en: { question: "How much will I pay?", answer: "We don't guess.", whoToAsk: "The RDO." },
    },
  ],
})

test("parseLocale accepts the two languages and defaults to Filipino", () => {
  assert.equal(parseLocale("en"), "en")
  assert.equal(parseLocale("fil"), "fil")
  assert.equal(parseLocale("tl"), "fil")
  assert.equal(parseLocale(undefined), "fil")
})

test("Filipino returns the plan untouched", () => {
  const plan = makePlan()
  assert.equal(localizePlan(plan, "fil"), plan)
})

test("English swaps in the English text of every item", () => {
  const plan = localizePlan(makePlan(), "en")
  assert.equal(plan.transaction.processingTimeLabel, "about 3 working days")
  assert.equal(plan.steps[0].notices?.[0].text, "Settle within 30 days.")
  assert.equal(plan.documents[0].name, "Ending inventory list")
  assert.equal(plan.documents[0].situationQuestion, "Are you VAT-registered?")
  assert.equal(plan.questions[0].question, "How much will I pay?")
  assert.equal(plan.questions[0].whoToAsk, "The RDO.")
})

test("a field without an English text falls back to Filipino", () => {
  const plan = localizePlan(makePlan(), "en")
  assert.equal(plan.documents[1].name, "Bagong dokumento")
  assert.equal(plan.documents[1].explanation, "Idinagdag ng team.")
})

test("an empty English text also falls back, and citations are never changed", () => {
  const source = makePlan()
  source.documents[0].en = { ...source.documents[0].en, explanation: "  " }
  const plan = localizePlan(source, "en")
  assert.equal(plan.documents[0].explanation, "Isang original copy.")
  assert.deepEqual(plan.documents[0].citation, cite)
  assert.deepEqual(plan.questions[0].related, [cite])
})

test("localizing does not change the stored plan", () => {
  const source = makePlan()
  localizePlan(source, "en")
  assert.equal(source.documents[0].name, "Listahan ng inventory")
})

test("missingEnglish lists every field that has no English version", () => {
  assert.deepEqual(
    missingEnglish(makePlan()),
    [
      'document "d2" name: missing English text',
      'document "d2" whereToGet: missing English text',
      'document "d2" explanation: missing English text',
    ]
  )
})

test("missingEnglish is empty when everything is translated", () => {
  const plan = makePlan()
  plan.documents[1].en = { name: "New document", whereToGet: "Get it at the RDO.", explanation: "Added by the team." }
  assert.deepEqual(missingEnglish(plan), [])
})
