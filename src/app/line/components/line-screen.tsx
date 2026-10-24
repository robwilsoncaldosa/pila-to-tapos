"use client"

import { useCallback, useEffect, useRef, useState } from "react"

import { getTicket } from "@/app/actions/queue"
import { PathLine } from "@/components/path-line"
import { Badge, Stack } from "@/components/ui"
import { currentStepId, journeyStage } from "@/domain/journey"
import { feeForVisit, type Plan } from "@/domain/plan"
import { visitLabel, type Ticket } from "@/domain/queue"
import { useT, type Translator } from "@/i18n"
import { playChime, unlockAudio } from "@/lib/chime"
import { finishJourney, setVisitDone } from "@/lib/phone-storage"
import { useHydrated, usePhoneState } from "@/lib/use-phone-state"
import { usePoll } from "@/lib/use-poll"

import { BetweenVisits } from "./between-visits"
import { CalledBanner } from "./called-banner"
import { CalledOverlay } from "./called-overlay"
import { NoTicket } from "./no-ticket"
import { OfflineBanner } from "./offline-banner"
import { SoundPrompt } from "./sound-prompt"
import { TaposNa } from "./tapos-na"
import { TicketMissing } from "./ticket-missing"
import { TicketStub } from "./ticket-stub"

/**
 * Her phone while she is in line: reads the tickets it saved, then asks the server every 2 seconds
 * about the active one (visit 2 if she has it, else visit 1). Between the visits and at the end
 * there is nothing to poll, so those screens come from what the phone saved.
 */
export function LineScreen({ plan }: { plan: Plan }) {
  const phone = usePhoneState()
  const hydrated = useHydrated()

  if (!hydrated) return null
  const stage = journeyStage(phone.visits)
  if (stage === "before") return <NoTicket />
  if (stage === "between") return <BetweenVisits plan={plan} phone={phone} />
  if (stage === "finished") return <TaposNa visits={phone.visits} />

  const visitNo = stage === "visit_2" ? 2 : 1
  const ticketId = phone.visits[visitNo]?.ticketId ?? ""
  return (
    <TicketView
      key={ticketId}
      ticketId={ticketId}
      visitNo={visitNo}
      plan={plan}
      soundOn={phone.soundOn}
    />
  )
}

type TicketViewProps = { ticketId: string; visitNo: 1 | 2; plan: Plan; soundOn: boolean }

function TicketView({ ticketId, visitNo, plan, soundOn }: TicketViewProps) {
  const { t } = useT()
  const fetchTicket = useCallback(() => getTicket(ticketId), [ticketId])
  const { data, error, lastUpdatedAt } = usePoll(fetchTicket)

  const ticket = data?.ok ? data.value : undefined
  const status = ticket?.status
  const [dismissedId, setDismissedId] = useState<string | null>(null)

  // Chime once, when the status turns from waiting to called.
  const previous = useRef<Ticket["status"] | undefined>(undefined)
  useEffect(() => {
    if (previous.current === "waiting" && status === "called" && soundOn) playChime()
    previous.current = status
  }, [status, soundOn])

  // After a reload the browser has forgotten the unlock, so the next touch restores it.
  useEffect(() => {
    if (!soundOn) return
    const unlock = () => void unlockAudio()
    window.addEventListener("pointerdown", unlock, { once: true })
    return () => window.removeEventListener("pointerdown", unlock)
  }, [soundOn])

  // A done ticket moves the phone on: the saved doneAt switches the screen to the next stage.
  const doneAt = ticket?.doneAt
  useEffect(() => {
    if (status !== "done") return
    setVisitDone(visitNo, doneAt ?? new Date().toISOString())
    if (visitNo === 2) finishJourney()
  }, [status, doneAt, visitNo])

  if (data && !data.ok) return <TicketMissing visitNo={visitNo} />
  if (!ticket) {
    return (
      <p data-tone="muted" aria-live="polite">
        {error ? t("line.noConnection") : t("line.fetching")}
      </p>
    )
  }

  const { counter } = plan
  if (ticket.status === "done") return null

  const stepName =
    ticket.visitNo === 1
      ? visitLabel(1)
      : payAndClaimLabel(t, feeForVisit(plan.fees, 2))
  const called = ticket.status === "called"

  return (
    <Stack gap={6}>
      <OfflineBanner lastUpdatedAt={lastUpdatedAt} />
      {called && dismissedId !== ticket.id ? (
        <CalledOverlay
          number={ticket.number}
          counterLabel={counter.label}
          onDismiss={() => setDismissedId(ticket.id)}
        />
      ) : null}
      {called ? <CalledBanner counterLabel={counter.label} /> : null}
      <TicketStub
        number={ticket.number}
        stepLabel={t("line.stepLabel", { n: ticket.visitNo === 1 ? 1 : 3, step: stepName })}
        counterLabel={counter.label}
        badge={ticket.visitNo === 2 ? visitLabel(2) : undefined}
      />
      {ticket.docsReady ? (
        <Badge variant="ready" size="lg">
          {t("line.docsReady")}
        </Badge>
      ) : null}
      {soundOn ? null : <SoundPrompt />}
      <Stack gap={4}>
        <h2>{t("path.heading")}</h2>
        <PathLine
          steps={plan.steps}
          counterLabel={counter.label}
          processingTimeLabel={plan.transaction.processingTimeLabel}
          currentStepId={currentStepId(plan.steps, ticket)}
        />
      </Stack>
    </Stack>
  )
}

const payAndClaimLabel = (t: Translator["t"], feePhp: number | null): string =>
  feePhp === null ? visitLabel(2) : t("line.pay", { fee: feePhp })
