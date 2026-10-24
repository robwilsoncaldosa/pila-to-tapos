"use client"

import { LocaleSwitch } from "@/components/locale-switch"
import { Inline, Stack } from "@/components/ui"
import { useT } from "@/i18n"

export function CounterHeader({ label }: { label: string }) {
  const { t } = useT()
  return (
    <Inline justify="between" gap={4} wrap>
      <Stack gap={1}>
        <small data-tone="muted">{t("counter.staff")}</small>
        <h1>{label}</h1>
      </Stack>
      <LocaleSwitch size="chip" />
    </Inline>
  )
}
