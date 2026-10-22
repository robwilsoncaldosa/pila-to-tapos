import assert from "node:assert/strict"
import { test } from "node:test"

import {
  announcementText,
  clipSequence,
  isFilipinoVoice,
  parseSpeechMode,
  pickFilipinoVoice,
  spellTicketNumber,
} from "./speech"

test("recognises fil and tl voices, with dash or underscore", () => {
  assert.equal(isFilipinoVoice({ lang: "fil-PH" }), true)
  assert.equal(isFilipinoVoice({ lang: "fil_PH" }), true)
  assert.equal(isFilipinoVoice({ lang: "tl-PH" }), true)
  assert.equal(isFilipinoVoice({ lang: "en-US" }), false)
})

test("prefers fil over tl and a local voice over a remote one", () => {
  const voices = [
    { name: "a", lang: "tl-PH", localService: true },
    { name: "b", lang: "fil-PH", localService: false },
    { name: "c", lang: "fil-PH", localService: true },
    { name: "d", lang: "en-US", localService: true },
  ]
  assert.equal(pickFilipinoVoice(voices)?.name, "c")
  assert.equal(pickFilipinoVoice([{ lang: "en-US" }]), undefined)
})

test("spells the number with the letter as is and digits in Filipino", () => {
  assert.equal(spellTicketNumber("B-001"), "Numero B, zero, zero, isa")
  assert.equal(spellTicketNumber("B-014"), "Numero B, zero, isa, apat")
  assert.equal(
    spellTicketNumber("B-1234"),
    "Numero B, isa, dalawa, tatlo, apat"
  )
  assert.equal(
    spellTicketNumber("B-567"),
    "Numero B, lima, anim, pito"
  )
  assert.equal(spellTicketNumber("B-089"), "Numero B, zero, walo, siyam")
})

test("an unrecognised number is read as is", () => {
  assert.equal(spellTicketNumber("???"), "Numero ???")
})

test("the announcement ends with the counter's speech label", () => {
  assert.equal(
    announcementText("B-001", "Registration counter"),
    "Numero B, zero, zero, isa, Registration counter"
  )
})

test("clips play in order: numero, letter, each digit, counter", () => {
  assert.deepEqual(clipSequence("B-014"), [
    "/audio/numero.mp3",
    "/audio/letter-b.mp3",
    "/audio/digit-0.mp3",
    "/audio/digit-1.mp3",
    "/audio/digit-4.mp3",
    "/audio/counter.mp3",
  ])
  assert.equal(clipSequence("nonsense"), null)
})

test("speech mode defaults to auto", () => {
  assert.equal(parseSpeechMode(undefined), "auto")
  assert.equal(parseSpeechMode("voice"), "voice")
  assert.equal(parseSpeechMode("clips"), "clips")
  assert.equal(parseSpeechMode("loud"), "auto")
})
