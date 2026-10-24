"use client"

import { createContext, useContext } from "react"

import type { Locale } from "@/domain/locale"

import { translatorFor, type Translator } from "./translator"

const LocaleContext = createContext<Locale>("fil")

/** Gives every client component the language the server rendered with, so both sides agree. */
export function LocaleProvider({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  return <LocaleContext value={locale}>{children}</LocaleContext>
}

export const useLocale = (): Locale => useContext(LocaleContext)

/** `t` and `tn` for the current language. */
export const useT = (): Translator => translatorFor(useLocale())
