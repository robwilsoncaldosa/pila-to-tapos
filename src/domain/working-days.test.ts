import assert from "node:assert/strict"
import { test } from "node:test"

import { addWorkingDays, formatManilaDate } from "./working-days"

test("Thursday plus 3 working days is the next Tuesday", () => {
  assert.equal(addWorkingDays("2026-10-22T04:00:00Z", 3), "2026-10-27")
})

test("Friday plus 3 working days is Wednesday", () => {
  assert.equal(addWorkingDays("2026-10-23T04:00:00Z", 3), "2026-10-28")
})

test("Monday plus 3 working days is Thursday", () => {
  assert.equal(addWorkingDays("2026-10-26T04:00:00Z", 3), "2026-10-29")
})

test("Saturday plus 3 working days is Wednesday", () => {
  assert.equal(addWorkingDays(new Date("2026-10-24T04:00:00Z"), 3), "2026-10-28")
})

test("the Manila day decides, not the UTC day", () => {
  // 16:30 UTC on Thursday is 00:30 on Friday 23 Oct in Manila.
  assert.equal(addWorkingDays("2026-10-22T16:30:00Z", 3), "2026-10-28")
})

test("zero working days stays on the same Manila day", () => {
  assert.equal(addWorkingDays("2026-10-22T16:30:00Z", 0), "2026-10-23")
})

test("the friendly date has the weekday and the day number", () => {
  const text = formatManilaDate("2026-10-27")
  assert.match(text, /27/)
  assert.ok(text.length > "27".length + 3)
  assert.notEqual(formatManilaDate("2026-10-28"), text)
})
