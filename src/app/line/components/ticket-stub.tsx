"use client"

import { Badge, Card, CardContent, Stack } from "@/components/ui"
import { useT } from "@/i18n"

type TicketStubProps = {
  number: string
  /** "Step 1 of 3: Submit". */
  stepLabel: string
  counterLabel: string
  /** "Pay & claim" on the visit 2 stub. */
  badge?: string
}

/** Her number big on a jeepney-yellow stub, a dashed tear line, then the step and counter. */
export function TicketStub({ number, stepLabel, counterLabel, badge }: TicketStubProps) {
  const { t } = useT()
  return (
    <Card tone="turn" enter aria-label={t("line.numberLabel")}>
      <CardContent>
        <Stack gap={1} align="center">
          <small>{t("line.numberLabel")}</small>
          <p className="text-6xl font-bold tabular-nums">{number}</p>
        </Stack>
      </CardContent>
      <div className="border-t-2 border-dashed border-foreground/40" aria-hidden />
      <CardContent>
        <Stack gap={2} align="start">
          <Stack gap={0}>
            <strong>{stepLabel}</strong>
            <span>{counterLabel}</span>
          </Stack>
          {badge ? (
            <Badge variant="chip" size="md">
              {badge}
            </Badge>
          ) : null}
        </Stack>
      </CardContent>
    </Card>
  )
}
