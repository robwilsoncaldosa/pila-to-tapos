"use client"

import { PathLine } from "@/components/path-line"
import { Stack } from "@/components/ui"
import { currentStepId, returnDateOf, visit2Unlocked } from "@/domain/journey"
import { feeForVisit, type Plan } from "@/domain/plan"
import { manilaDay } from "@/domain/queue"
import { formatManilaDate } from "@/domain/working-days"
import { useT } from "@/i18n"
import type { PhoneState } from "@/lib/phone-storage"

import { DemoSkipSwitch } from "./demo-skip-switch"
import { VisitDone } from "./visit-done"
import { VisitTwoCta } from "./visit-two-cta"

/** After visit 1: "Come back on [date]", the demo switch, and visit 2's button once it is open. */
export function BetweenVisits({ plan, phone }: { plan: Plan; phone: PhoneState }) {
  const { t, locale } = useT()
  const returnDate = returnDateOf(phone.visits)
  const unlocked = visit2Unlocked(phone.visits, manilaDay(new Date()), phone.demoSkip)

  return (
    <Stack gap={6}>
      <VisitDone
        returnDateLabel={returnDate ? formatManilaDate(returnDate, locale) : ""}
        feePhp={feeForVisit(plan.fees, 2)}
      />
      <DemoSkipSwitch checked={phone.demoSkip} />
      {unlocked ? <VisitTwoCta /> : null}
      <Stack gap={4}>
        <h2>{t("path.heading")}</h2>
        <PathLine
          steps={plan.steps}
          counterLabel={plan.counter.label}
          processingTimeLabel={plan.transaction.processingTimeLabel}
          currentStepId={currentStepId(plan.steps, { visitNo: 1, status: "done" })}
        />
      </Stack>
    </Stack>
  )
}
