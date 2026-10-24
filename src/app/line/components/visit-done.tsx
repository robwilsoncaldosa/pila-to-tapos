"use client"

import { Card, CardContent, Stack } from "@/components/ui"
import { useT } from "@/i18n"

type VisitDoneProps = {
  /** "Tuesday, October 27" or "Martes, Oktubre 27". */
  returnDateLabel: string
  /** What she brings to visit 2, or null when the plan lists no official amount. */
  feePhp: number | null
}

/** Between the visits: when to come back and what to bring. */
export function VisitDone({ returnDateLabel, feePhp }: VisitDoneProps) {
  const { t } = useT()
  return (
    <Card enter>
      <CardContent>
        <Stack gap={2}>
          <h2>{t("line.visit1Done")}</h2>
          <p>{t("line.comeBack", { date: returnDateLabel })}</p>
          {feePhp === null ? null : <p className="font-bold">{t("line.bringFee", { fee: feePhp })}</p>}
        </Stack>
      </CardContent>
    </Card>
  )
}
