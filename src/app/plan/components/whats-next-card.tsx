"use client"

import { SectionCitations } from "@/components/citation-chip"
import { Card, CardContent, Grid, Stack } from "@/components/ui"
import type { Plan } from "@/domain/plan"
import { summarizeFees } from "@/domain/plan"
import type { PlanProgress } from "@/domain/progress"
import { manilaDay } from "@/domain/queue"
import { useT } from "@/i18n"
import type { PhoneState } from "@/lib/phone-storage"
import { whatsNextText } from "@/lib/whats-next"

type WhatsNextCardProps = {
  plan: Plan
  progress: PlanProgress
  phone: PhoneState
}

/** The glanceable top card: how far along she is, what to do next, the money and the time. */
export function WhatsNextCard({ plan, progress, phone }: WhatsNextCardProps) {
  const translator = useT()
  const { t } = translator
  const fees = summarizeFees(plan.fees)
  const action = whatsNextText(translator, {
    progress,
    visits: phone.visits,
    demoSkip: phone.demoSkip,
    today: manilaDay(new Date()),
  })
  return (
    <Card size="lg">
      <CardContent>
        <Stack gap={4}>
          <Stack gap={1}>
            <small data-tone="muted">
              {t("next.progress", { n: progress.ticked, m: progress.total })}
            </small>
            <p className="text-xl font-bold" aria-live="polite">
              {action}
            </p>
          </Stack>
          <Grid columns={2} gap={4}>
            <Stack gap={0}>
              <small data-tone="muted">{t("next.bring")}</small>
              <strong>{fees.totalPhp === null ? t("next.noAmount") : `₱${fees.totalPhp}`}</strong>
            </Stack>
            <Stack gap={0}>
              <small data-tone="muted">{t("next.howLong")}</small>
              <strong>{plan.transaction.processingTimeLabel}</strong>
            </Stack>
          </Grid>
          <SectionCitations
            title={t("next.costSection")}
            citations={[
              ...plan.fees.map((fee) => fee.citation),
              plan.transaction.processingCitation,
            ]}
          />
        </Stack>
      </CardContent>
    </Card>
  )
}
