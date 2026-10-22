"use client"

import { useEffect, useSyncExternalStore } from "react"

import { SourcesProvider } from "@/components/citation-chip"
import { PathLine } from "@/components/path-line"
import { Stack } from "@/components/ui"
import { checklistStatus, showUnfiledReturnsWarning } from "@/domain/checklist"
import type { PlanBundle } from "@/services/plan-service"
import {
  ensureJourney,
  getPhoneState,
  getServerPhoneState,
  setAnswer,
  setTick,
  subscribePhoneState,
} from "@/lib/phone-storage"

import { AskButton } from "./ask-button"
import { AskProvider } from "./ask-context"
import { Checklist } from "./checklist"
import { GetNumberButton } from "./get-number-button"
import { LastChecked } from "./last-checked"
import { PlanSummary } from "./plan-summary"
import { ResetLink } from "./reset-link"

/** The whole "Your plan" screen. Her ticks and answers live in localStorage on this phone. */
export function PlanScreen({ plan, sources }: PlanBundle) {
  const phone = useSyncExternalStore(
    subscribePhoneState,
    getPhoneState,
    getServerPhoneState
  )
  useEffect(() => ensureJourney(), [])

  const status = checklistStatus(plan, phone.ticks, phone.answers)

  return (
    <SourcesProvider sources={sources}>
      <AskProvider plan={plan}>
        <Stack gap={8} className="mb-20">
          <Stack gap={2}>
            <h1>Your plan</h1>
            <p>{plan.transaction.title}</p>
            <LastChecked date={plan.transaction.lastCheckedOn} />
          </Stack>
          <PlanSummary plan={plan} />
          <Stack gap={4}>
            <h2>Ang path</h2>
            <PathLine
              steps={plan.steps}
              counterLabel={plan.counter.label}
              processingTimeLabel={plan.transaction.processingTimeLabel}
              showNotices={showUnfiledReturnsWarning(phone.answers)}
            />
          </Stack>
          <Stack gap={4}>
            <h2>Checklist ng mga dokumento</h2>
            <Checklist
              plan={plan}
              status={status}
              ticks={phone.ticks}
              answers={phone.answers}
              onTick={setTick}
              onAnswer={setAnswer}
            />
          </Stack>
          <GetNumberButton ready={status.ready} phone={phone} />
          <small data-tone="muted">
            Independent na gabay ito, hindi opisyal na BIR app. Gabay lang ito, hindi legal o tax
            advice.
          </small>
          <ResetLink />
        </Stack>
        <AskButton />
      </AskProvider>
    </SourcesProvider>
  )
}
