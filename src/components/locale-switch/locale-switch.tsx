"use client"

import { useRouter } from "next/navigation"
import { useTransition } from "react"

import { Button, Inline } from "@/components/ui"
import type { Locale } from "@/domain/locale"
import { LANG_COOKIE, LANG_COOKIE_MAX_AGE_SECONDS, useLocale, useT } from "@/i18n"

/** Each language is named in itself, so the switch reads the same whichever language is on. */
const OPTIONS: { value: Locale; label: string }[] = [
  { value: "en", label: "English" },
  { value: "fil", label: "Filipino" },
]

const rememberLocale = (locale: Locale) => {
  document.cookie = `${LANG_COOKIE}=${locale}; path=/; max-age=${LANG_COOKIE_MAX_AGE_SECONDS}; samesite=lax`
}

type LocaleSwitchProps = {
  /** "touch" is the 48px phone size; "chip" is the small one for the staff and TV screens. */
  size?: "touch" | "chip"
}

/** "English | Filipino": saves the choice in a cookie, then asks the server to render again. */
export function LocaleSwitch({ size = "touch" }: LocaleSwitchProps) {
  const locale = useLocale()
  const { t } = useT()
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  const choose = (next: Locale) => {
    if (next === locale) return
    rememberLocale(next)
    startTransition(() => router.refresh())
  }

  return (
    <Inline role="group" aria-label={t("lang.group")} gap={1}>
      {OPTIONS.map((option) => (
        <Button
          key={option.value}
          type="button"
          lang={option.value}
          size={size}
          variant={option.value === locale ? "default" : "outline"}
          aria-pressed={option.value === locale}
          disabled={pending}
          onClick={() => choose(option.value)}
        >
          {option.label}
        </Button>
      ))}
    </Inline>
  )
}
