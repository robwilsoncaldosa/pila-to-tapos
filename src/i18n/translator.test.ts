import assert from "node:assert/strict"
import { test } from "node:test"

import { en } from "./en"
import { fil } from "./fil"
import { translatorFor } from "./translator"

test("variables are filled in, and unknown ones are left as they are", () => {
  assert.equal(
    translatorFor("en").t("next.progress", { n: 2, m: 5 }),
    "2 of 5 documents ready"
  )
  assert.equal(translatorFor("fil").t("next.progress", { n: 2, m: 5 }), "2 sa 5 dokumento, handa na")
  assert.equal(translatorFor("en").t("next.comeBack"), "Come back on {date}")
})

test("tn picks the singular for exactly one", () => {
  const { tn } = translatorFor("en")
  assert.equal(tn("missing.answerFirst", 1), "Answer the 1 question first to see the full list.")
  assert.equal(tn("missing.answerFirst", 3), "Answer the 3 questions first to see the full list.")
})

test("both dictionaries use the same {placeholders} for every key", () => {
  const names = (text: string) => [...text.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort()
  for (const key of Object.keys(fil) as (keyof typeof fil)[]) {
    assert.deepEqual(names(en[key]), names(fil[key]), key)
  }
})

test("the English messages hold no common Filipino words", () => {
  const leaks = /\b(ang|ng|sa|mo|na|kulang|tapos|ikaw|balik|dalhin|hindi|kunin|saan|kailangan)\b/i
  for (const [key, text] of Object.entries(en)) {
    // Proper names that are Filipino words: none are allowed here.
    assert.equal(leaks.test(text), false, `${key}: ${text}`)
  }
})
