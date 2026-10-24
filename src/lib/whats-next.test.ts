import assert from "node:assert/strict"
import { test } from "node:test"

import { translatorFor } from "@/i18n/translator"

import { whatsNextText } from "./whats-next"

const EN = translatorFor("en")
const FIL = translatorFor("fil")

const base = { visits: {}, demoSkip: false, today: "2026-10-22" }
const progress = (unanswered: number, total: number, ticked: number) => ({ unanswered, total, ticked })

test("open questions come first, in both languages", () => {
  const input = { ...base, progress: progress(5, 7, 0) }
  assert.equal(whatsNextText(EN, input), "Answer the 5 questions below")
  assert.equal(whatsNextText(FIL, input), "Sagutin ang 5 tanong sa ibaba")
})

test("one open question uses the singular in English", () => {
  const input = { ...base, progress: progress(1, 7, 0) }
  assert.equal(whatsNextText(EN, input), "Answer the 1 question below")
})

test("then the missing documents", () => {
  const input = { ...base, progress: progress(0, 5, 2) }
  assert.equal(whatsNextText(EN, input), "Tick the 3 missing documents")
  assert.equal(whatsNextText(FIL, input), "I-tick ang 3 dokumentong kulang")
  assert.equal(whatsNextText(EN, { ...base, progress: progress(0, 5, 4) }), "Tick the 1 missing document")
})

test("a finished checklist says go to the TV", () => {
  const input = { ...base, progress: progress(0, 5, 5) }
  assert.equal(whatsNextText(EN, input), "You're ready! Get your number at the TV")
  assert.equal(whatsNextText(FIL, input), "Handa ka na! Kumuha ng number sa TV")
})

test("in line, it points to her number", () => {
  const input = { ...base, progress: progress(0, 5, 5), visits: { 1: { ticketId: "t1" } } }
  assert.equal(whatsNextText(EN, input), "See your number")
  assert.equal(whatsNextText(FIL, input), "Tingnan ang number mo")
})

test("between visits it names the return date in the reader's language", () => {
  const visits = {
    1: { ticketId: "t1", issuedAt: "2026-10-22T02:00:00Z", doneAt: "2026-10-22T02:12:00Z" },
  }
  const input = { ...base, progress: progress(0, 5, 5), visits }
  assert.equal(whatsNextText(EN, input), "Come back on Tuesday, October 27")
  assert.equal(whatsNextText(FIL, input), "Balik ka sa Martes, Oktubre 27")
})

test("the demo switch opens visit 2 right away", () => {
  const visits = {
    1: { ticketId: "t1", issuedAt: "2026-10-22T02:00:00Z", doneAt: "2026-10-22T02:12:00Z" },
  }
  const input = { ...base, progress: progress(0, 5, 5), visits, demoSkip: true }
  assert.equal(whatsNextText(EN, input), "Visit 2 is open: get your number at the TV")
})
