"use client"

import Link from "next/link"

import { Alert, AlertDescription, AlertTitle, Button, Stack } from "@/components/ui"
import { useT } from "@/i18n"
import { clearVisit, clearVisits } from "@/lib/phone-storage"

/** The server forgot her number (it was restarted). She starts over from the plan; visit 1 stays done. */
export function TicketMissing({ visitNo }: { visitNo: 1 | 2 }) {
  const { t } = useT()
  return (
    <Stack gap={4}>
      <Alert variant="missing" enter>
        <AlertTitle>{t("line.missingTitle")}</AlertTitle>
        <AlertDescription>{t("line.missingBody")}</AlertDescription>
      </Alert>
      <Button asChild size="touch">
        <Link href="/plan" onClick={() => (visitNo === 2 ? clearVisit(2) : clearVisits())}>
          {t("line.backToPlan")}
        </Link>
      </Button>
    </Stack>
  )
}
