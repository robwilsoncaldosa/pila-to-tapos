import { SectionCitations } from "@/components/citation-chip"
import { Card, CardContent, Grid, Stack } from "@/components/ui"
import { journeyStage, returnDateOf, visit2Unlocked } from "@/domain/journey"
import type { Plan } from "@/domain/plan"
import { summarizeFees } from "@/domain/plan"
import { nextAction, type PlanProgress } from "@/domain/progress"
import { manilaDay } from "@/domain/queue"
import { formatManilaDate } from "@/domain/working-days"
import type { PhoneState } from "@/lib/phone-storage"

type WhatsNextCardProps = {
  plan: Plan
  progress: PlanProgress
  phone: PhoneState
}

/** The next action in plain Taglish. Between visits and in line it mirrors the bottom button. */
const actionText = (progress: PlanProgress, phone: PhoneState): string => {
  const stage = journeyStage(phone.visits)
  if (stage === "visit_1" || stage === "visit_2" || stage === "finished") {
    return "Tingnan ang number mo"
  }
  if (stage === "between") {
    const returnDate = returnDateOf(phone.visits)
    return visit2Unlocked(phone.visits, manilaDay(new Date()), phone.demoSkip) || !returnDate
      ? "Handa na ang visit 2: kumuha ng number sa TV"
      : `Balik ka sa ${formatManilaDate(returnDate)}`
  }
  const action = nextAction(progress)
  if (action.kind === "answer") return `Sagutin ang ${action.count} tanong sa ibaba`
  if (action.kind === "tick") return `I-tick ang ${action.count} dokumentong kulang`
  return "Handa ka na! Kumuha ng number sa TV"
}

/** The glanceable top card: how far along she is, what to do next, the money and the time. */
export function WhatsNextCard({ plan, progress, phone }: WhatsNextCardProps) {
  const fees = summarizeFees(plan.fees)
  return (
    <Card size="lg">
      <CardContent>
        <Stack gap={4}>
          <Stack gap={1}>
            <small data-tone="muted">
              {progress.ticked} sa {progress.total} dokumento, handa na
            </small>
            <p className="text-xl font-bold" aria-live="polite">
              {actionText(progress, phone)}
            </p>
          </Stack>
          <Grid columns={2} gap={4}>
            <Stack gap={0}>
              <small data-tone="muted">Ihanda</small>
              <strong>{fees.totalPhp === null ? "Walang opisyal na halaga" : `₱${fees.totalPhp}`}</strong>
            </Stack>
            <Stack gap={0}>
              <small data-tone="muted">Gaano katagal</small>
              <strong>{plan.transaction.processingTimeLabel}</strong>
            </Stack>
          </Grid>
          <SectionCitations
            title="halaga at tagal"
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
