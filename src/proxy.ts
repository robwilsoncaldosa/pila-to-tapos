import { NextResponse, type NextRequest } from "next/server"

import { isLocale } from "@/domain/locale"
import { LANG_COOKIE, LANG_COOKIE_MAX_AGE_SECONDS, LANG_PARAM } from "@/i18n/cookie"

/**
 * `?lang=en` or `?lang=fil` on any page sets the language cookie, then redirects to the same
 * address without the parameter. That lets a recorder start at `/?lang=en`.
 */
export function proxy(request: NextRequest) {
  const lang = request.nextUrl.searchParams.get(LANG_PARAM)
  if (lang === null) return NextResponse.next()

  const url = request.nextUrl.clone()
  url.searchParams.delete(LANG_PARAM)
  const response = NextResponse.redirect(url)
  if (isLocale(lang)) {
    response.cookies.set(LANG_COOKIE, lang, {
      path: "/",
      maxAge: LANG_COOKIE_MAX_AGE_SECONDS,
      sameSite: "lax",
    })
  }
  return response
}

export const config = {
  // Pages only: not Next's own files, API routes, or anything with a file extension.
  matcher: ["/((?!api|_next|.*\\..*).*)"],
}
