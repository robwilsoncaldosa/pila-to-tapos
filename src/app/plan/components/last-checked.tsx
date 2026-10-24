"use client"

import { useT } from "@/i18n"

export function LastChecked({ date }: { date: string }) {
  const { t } = useT()
  return <p data-tone="muted">{t("plan.lastChecked", { date })}</p>
}
