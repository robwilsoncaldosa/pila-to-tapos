import assert from "node:assert/strict"
import { test } from "node:test"

import {
  announcementText,
  clipSequences,
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

test("spells the number with the letter as is and each digit as an English word", () => {
  assert.equal(spellTicketNumber("B-001"), "Number B, zero, zero, one")
  assert.equal(spellTicketNumber("B-014"), "Number B, zero, one, four")
  assert.equal(spellTicketNumber("B-1234"), "Number B, one, two, three, four")
  assert.equal(spellTicketNumber("B-567"), "Number B, five, six, seven")
  assert.equal(spellTicketNumber("B-089"), "Number B, zero, eight, nine")
})

test("an unrecognised number is read as is", () => {
  assert.equal(spellTicketNumber("???"), "Number ???")
})

test("the announcement ends with the counter's speech label", () => {
  assert.equal(
    announcementText("B-001", "Registration counter"),
    "Number B, zero, zero, one. Registration counter."
  )
})

test("clips try the whole-call clip first, then number, letter, each digit, counter", () => {
  assert.deepEqual(clipSequences("B-014"), [
    ["/audio/call-b-014.m4a"],
    [
      "/audio/word-number.m4a",
      "/audio/letter-b.m4a",
      "/audio/digit-0.m4a",
      "/audio/digit-1.m4a",
      "/audio/digit-4.m4a",
      "/audio/counter.m4a",
    ],
  ])
  assert.equal(clipSequences("nonsense"), null)
})

test("speech mode defaults to auto", () => {
  assert.equal(parseSpeechMode(undefined), "auto")
  assert.equal(parseSpeechMode("voice"), "voice")
  assert.equal(parseSpeechMode("clips"), "clips")
  assert.equal(parseSpeechMode("loud"), "auto")
})
