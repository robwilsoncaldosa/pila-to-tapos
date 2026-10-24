"use client"

import { useEffect, useSyncExternalStore } from "react"

import { SectionCitations, SourcesProvider } from "@/components/citation-chip"
import { PathLine } from "@/components/path-line"
import { LocaleSwitch } from "@/components/locale-switch"
import { Inline, Stack } from "@/components/ui"
import { checklistStatus, showUnfiledReturnsWarning } from "@/domain/checklist"
import { sortByPosition } from "@/domain/plan"
import { planProgress } from "@/domain/progress"
import { useT } from "@/i18n"
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

/** The whole "Your plan" screen. Her ticks and answers live in localStorage on this phone. */
export function PlanScreen({ plan, sources }: PlanBundle) {
  const { t } = useT()
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
          <Inline justify="end">
            <LocaleSwitch />
          </Inline>
          {updates ? <UpdatedBanner plan={plan} updates={updates} onDismiss={dismiss} /> : null}
          <Stack gap={2}>
            <h1>{t("plan.title")}</h1>
            <p>{plan.transaction.title}</p>
            <LastChecked date={plan.transaction.lastCheckedOn} />
          </Stack>
          <WhatsNextCard plan={plan} progress={progress} phone={phone} />
          <Stack gap={4}>
            <h2>{t("plan.pathHeading")}</h2>
            <PathLine
              steps={plan.steps}
              counterLabel={plan.counter.label}
              processingTimeLabel={plan.transaction.processingTimeLabel}
              showNotices={showNotices}
            />
            <SectionCitations
              title={t("plan.pathSection")}
              citations={[
                ...steps.map((step) => step.citation),
                ...(showNotices ? steps.flatMap((step) => step.notices ?? []) : []).flatMap(
                  (notice) => notice.citations
                ),
              ]}
            />
          </Stack>
          <Stack gap={4}>
            <h2>{t("plan.checklistHeading")}</h2>
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
              title={t("plan.checklistSection")}
              citations={sortByPosition(plan.documents).map((doc) => doc.citation)}
            />
          </Stack>
          <small data-tone="muted">{t("plan.disclaimer")}</small>
          <ResetLink />
        </Stack>
        <ActionBar missingCount={status.missing.length} phone={phone} />
      </AskProvider>
    </SourcesProvider>
  )
}
