import "server-only"

import { cookies } from "next/headers"

import { parseLocale, type Locale } from "@/domain/locale"

import { LANG_COOKIE } from "./cookie"
import { translatorFor, type Translator } from "./translator"

/** The language this request asked for: the cookie, else Filipino. */
export const getLocale = async (): Promise<Locale> =>
  parseLocale((await cookies()).get(LANG_COOKIE)?.value)

/** `t` and `tn` for server components. */
export const getT = async (): Promise<Translator> => translatorFor(await getLocale())
