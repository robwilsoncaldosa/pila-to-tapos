import type { Locale } from "./locale"
import { manilaDay } from "./queue"

const toUtcDate = (day: string): Date => new Date(`${day}T00:00:00Z`)

/**
 * The Asia/Manila calendar day `n` working days after `date`, "YYYY-MM-DD".
 * Saturdays and Sundays are skipped; holidays are not modelled.
 */
export const addWorkingDays = (date: Date | string, n: number): string => {
  const cursor = toUtcDate(manilaDay(typeof date === "string" ? new Date(date) : date))
  let remaining = n
  while (remaining > 0) {
    cursor.setUTCDate(cursor.getUTCDate() + 1)
    const weekday = cursor.getUTCDay()
    if (weekday !== 0 && weekday !== 6) remaining -= 1
  }
  return cursor.toISOString().slice(0, 10)
}

/** A Manila calendar day as a friendly date: "Martes, Oktubre 27" or "Tuesday, October 27". */
export const formatManilaDate = (day: string, locale: Locale): string =>
  new Intl.DateTimeFormat(locale === "en" ? "en-PH" : "fil-PH", {
    timeZone: "Asia/Manila",
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(new Date(`${day}T12:00:00+08:00`))
