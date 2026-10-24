/** The two languages of the customer app. Filipino (Taglish) is the default. */
export type Locale = "fil" | "en"

export const LOCALES: readonly Locale[] = ["fil", "en"]

export const DEFAULT_LOCALE: Locale = "fil"

export const isLocale = (value: unknown): value is Locale =>
  value === "fil" || value === "en"

/** Anything that is not a known locale (a missing or tampered cookie) falls back to Filipino. */
export const parseLocale = (value: unknown): Locale =>
  isLocale(value) ? value : DEFAULT_LOCALE
