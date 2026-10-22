import { CitationChip } from "@/components/citation-chip"
import { Card, CardContent, Inline, Separator, Stack } from "@/components/ui"
import { sortByPosition, summarizeFees, type Plan } from "@/domain/plan"

import { SummaryRow } from "./summary-row"

/** How many steps, how much money to prepare, and roughly how long: each with its source. */
export function PlanSummary({ plan }: { plan: Plan }) {
  const steps = sortByPosition(plan.steps)
  const fees = summarizeFees(plan.fees)
  const feeCitations = plan.fees.filter((fee) => fee.amountPhp !== null)
  return (
    <Card size="lg">
      <CardContent>
        <Stack gap={4}>
          <SummaryRow label="Mga hakbang" value={`${steps.length} steps`}>
            <Inline wrap gap={2}>
              {steps.map((step) => (
                <CitationChip key={step.id} citation={step.citation} />
              ))}
            </Inline>
          </SummaryRow>
          <Separator />
          <SummaryRow
            label="Ihahanda mong pera"
            value={fees.totalPhp === null ? "No official amount listed" : `₱${fees.totalPhp}`}
          >
            {fees.unlisted.map((fee) => (
              <p key={fee.id}>
                + {fee.label}: no official amount listed
              </p>
            ))}
            <Inline wrap gap={2}>
              {feeCitations.concat(fees.unlisted).map((fee) => (
                <CitationChip key={fee.id} citation={fee.citation} />
              ))}
            </Inline>
          </SummaryRow>
          <Separator />
          <SummaryRow label="Gaano katagal" value={plan.transaction.processingTimeLabel}>
            <Inline wrap gap={2}>
              <CitationChip citation={plan.transaction.processingCitation} />
            </Inline>
          </SummaryRow>
        </Stack>
      </CardContent>
    </Card>
  )
}
