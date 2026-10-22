"use client"

import { useCallback, useEffect, useRef, useState } from "react"

import { getTicket } from "@/app/actions/queue"
import { PathLine } from "@/components/path-line"
import { Badge, Stack } from "@/components/ui"
import { currentStepId } from "@/domain/journey"
import type { Plan } from "@/domain/plan"
import { visitLabel, type Ticket } from "@/domain/queue"
import { playChime, unlockAudio } from "@/lib/chime"
import { useHydrated, usePhoneState } from "@/lib/use-phone-state"
import { usePoll } from "@/lib/use-poll"

import { CalledBanner } from "./called-banner"
import { CalledOverlay } from "./called-overlay"
import { NoTicket } from "./no-ticket"
import { SoundPrompt } from "./sound-prompt"
import { TicketMissing } from "./ticket-missing"
import { TicketStub } from "./ticket-stub"
import { VisitOneDone } from "./visit-one-done"

/** Her phone while she is in line: reads the ticket id it saved, then asks the server every 2 seconds. */
export function LineScreen({ plan }: { plan: Plan }) {
  const phone = usePhoneState()
  const hydrated = useHydrated()
  const ticketId = phone.visits[1]?.ticketId

  if (!hydrated) return null
  if (!ticketId) return <NoTicket />
  return <TicketView key={ticketId} ticketId={ticketId} plan={plan} soundOn={phone.soundOn} />
}

type TicketViewProps = { ticketId: string; plan: Plan; soundOn: boolean }

function TicketView({ ticketId, plan, soundOn }: TicketViewProps) {
  const fetchTicket = useCallback(() => getTicket(ticketId), [ticketId])
  const { data, error } = usePoll(fetchTicket)

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

  if (data && !data.ok) return <TicketMissing />
  if (!ticket) {
    return (
      <p data-tone="muted" aria-live="polite">
        {error ? "Walang koneksyon. Susubukan ulit…" : "Kinukuha ang number mo…"}
      </p>
    )
  }

  const { counter } = plan
  const stepName = visitLabel(ticket.visitNo)
  const called = ticket.status === "called"

  return (
    <Stack gap={6}>
      {called && dismissedId !== ticket.id ? (
        <CalledOverlay
          number={ticket.number}
          counterLabel={counter.label}
          onDismiss={() => setDismissedId(ticket.id)}
        />
      ) : null}
      {called ? <CalledBanner counterLabel={counter.label} /> : null}
      {ticket.status === "done" ? (
        <VisitOneDone />
      ) : (
        <TicketStub
          number={ticket.number}
          stepLabel={`Step ${ticket.visitNo === 1 ? 1 : 3} of 3: ${stepName}`}
          counterLabel={counter.label}
        />
      )}
      {ticket.docsReady ? (
        <Badge variant="ready" size="lg">
          All documents ready ✓
        </Badge>
      ) : null}
      {soundOn ? null : <SoundPrompt />}
      <Stack gap={4}>
        <h2>Ang path mo</h2>
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
