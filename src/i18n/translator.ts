import type { Locale } from "@/domain/locale"

import { en } from "./en"
import { fil, type MessageKey } from "./fil"

export type { MessageKey }

const DICTIONARIES: Record<Locale, Record<MessageKey, string>> = { fil, en }

export type Vars = Record<string, string | number>

/** Keys that have a ".one" singular next to them. */
export type PluralKey = {
  [K in MessageKey]: K extends `${infer Base}.one` ? Base : never
}[MessageKey]

export type Translator = {
  locale: Locale
  /** The message for `key` with each `{name}` filled from `vars`. */
  t: (key: MessageKey, vars?: Vars) => string
  /** Like `t`, using the key's ".one" singular when `count` is 1. `{n}` is the count. */
  tn: (key: PluralKey, count: number, vars?: Vars) => string
}

const fill = (text: string, vars: Vars | undefined): string =>
  vars
    ? text.replace(/\{(\w+)\}/g, (placeholder, name: string) =>
        name in vars ? String(vars[name]) : placeholder
      )
    : text

const makeTranslator = (locale: Locale): Translator => {
  const messages = DICTIONARIES[locale]
  const t: Translator["t"] = (key, vars) => fill(messages[key], vars)
  return {
    locale,
    t,
    tn: (key, count, vars) =>
      t(count === 1 ? (`${key}.one` as MessageKey) : key, { n: count, ...vars }),
  }
}

const TRANSLATORS: Record<Locale, Translator> = {
  fil: makeTranslator("fil"),
  en: makeTranslator("en"),
}

/** One shared translator per language, so its identity is stable between renders. */
export const translatorFor = (locale: Locale): Translator => TRANSLATORS[locale]
