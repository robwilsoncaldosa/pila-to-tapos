import assert from "node:assert/strict"
import { test } from "node:test"

import { isFilipinoVoice, pickFilipinoVoice } from "./speech"

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
