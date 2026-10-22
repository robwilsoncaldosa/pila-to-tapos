"use client"

import { useEffect, useSyncExternalStore } from "react"

import { SectionCitations, SourcesProvider } from "@/components/citation-chip"
import { PathLine } from "@/components/path-line"
import { Stack } from "@/components/ui"
import { checklistStatus, showUnfiledReturnsWarning } from "@/domain/checklist"
import { sortByPosition } from "@/domain/plan"
import { planProgress } from "@/domain/progress"
import type { PlanBundle } from "@/services/plan-service"
import {
  ensureJourney,
  getPhoneState,
  getServerPhoneState,
  setAnswer,
  setTick,
  subscribePhoneState,
} from "@/lib/phone-storage"

import { ActionBar } from "./action-bar"
import { AskProvider } from "./ask-context"
import { Checklist } from "./checklist"
import { LastChecked } from "./last-checked"
import { UpdatedBanner } from "./updated-banner"
import { usePlanUpdates } from "./use-plan-updates"
import { ResetLink } from "./reset-link"
import { WhatsNextCard } from "./whats-next-card"

/** The whole "Ang plano mo" screen. Her ticks and answers live in localStorage on this phone. */
export function PlanScreen({ plan, sources }: PlanBundle) {
  const phone = useSyncExternalStore(
    subscribePhoneState,
    getPhoneState,
    getServerPhoneState
  )
  useEffect(() => ensureJourney(), [])
  const { updates, dismiss } = usePlanUpdates(plan)

  const status = checklistStatus(plan, phone.ticks, phone.answers)
  const progress = planProgress(plan, phone.ticks, phone.answers)
  const showNotices = showUnfiledReturnsWarning(phone.answers)
  const steps = sortByPosition(plan.steps)

  return (
    <SourcesProvider sources={sources}>
      <AskProvider plan={plan}>
        <Stack gap={8} className="mb-32">
          {updates ? <UpdatedBanner plan={plan} updates={updates} onDismiss={dismiss} /> : null}
          <Stack gap={2}>
            <h1>Ang plano mo</h1>
            <p>{plan.transaction.title}</p>
            <LastChecked date={plan.transaction.lastCheckedOn} />
          </Stack>
          <WhatsNextCard plan={plan} progress={progress} phone={phone} />
          <Stack gap={4}>
            <h2>Ang path</h2>
            <PathLine
              steps={plan.steps}
              counterLabel={plan.counter.label}
              processingTimeLabel={plan.transaction.processingTimeLabel}
              showNotices={showNotices}
            />
            <SectionCitations
              title="ang path"
              citations={[
                ...steps.map((step) => step.citation),
                ...(showNotices ? steps.flatMap((step) => step.notices ?? []) : []).flatMap(
                  (notice) => notice.citations
                ),
              ]}
            />
          </Stack>
          <Stack gap={4}>
            <h2>Checklist ng mga dokumento</h2>
            <Checklist
              plan={plan}
              status={status}
              ticks={phone.ticks}
              answers={phone.answers}
              updates={updates}
              onTick={setTick}
              onAnswer={setAnswer}
            />
            <SectionCitations
              title="checklist ng mga dokumento"
              citations={sortByPosition(plan.documents).map((doc) => doc.citation)}
            />
          </Stack>
          <small data-tone="muted">
            Independent na gabay ito, hindi opisyal na BIR app. Gabay lang ito, hindi legal o tax
            advice.
          </small>
          <ResetLink />
        </Stack>
        <ActionBar missingCount={status.missing.length} phone={phone} />
      </AskProvider>
    </SourcesProvider>
  )
}
