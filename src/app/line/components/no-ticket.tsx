"use client"

import Link from "next/link"

import { Button, Stack } from "@/components/ui"
import { useT } from "@/i18n"

/** She opened /line without taking a number first. */
export function NoTicket() {
  const { t } = useT()
  return (
    <Stack gap={4}>
      <h1>{t("line.noTicketTitle")}</h1>
      <p data-tone="muted">{t("line.noTicketBody")}</p>
      <Button asChild size="touch">
        <Link href="/plan">{t("line.toPlan")}</Link>
      </Button>
    </Stack>
  )
}
