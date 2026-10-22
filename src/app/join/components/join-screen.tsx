"use client"

import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"

import { issueTicket } from "@/app/actions/queue"
import { Alert, AlertDescription, AlertTitle, Button, Stack } from "@/components/ui"
import { checklistStatus } from "@/domain/checklist"
import { decideJoin } from "@/domain/journey"
import type { Plan } from "@/domain/plan"
import { ensureJourney, getPhoneState, setVisitTicket } from "@/lib/phone-storage"
import { useHydrated } from "@/lib/use-phone-state"

/** The QR code's target: decides from this phone's saved checklist and sends her on. */
export function JoinScreen({ plan }: { plan: Plan }) {
  const router = useRouter()
  const hydrated = useHydrated()
  const started = useRef(false)
  const [failed, setFailed] = useState(false)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    if (!hydrated || started.current) return
    started.current = true

    const { ticks, answers, visits } = getPhoneState()
    const ready = checklistStatus(plan, ticks, answers).ready
    const decision = decideJoin(visits, ready)

    if (decision === "not_ready") return router.replace("/")
    if (decision === "go_to_line") return router.replace("/line")

    ensureJourney()
    const { journeyId } = getPhoneState()
    void issueTicket({ journeyId, visit: 1, docsReady: true })
      .then((result) => {
        if (!result.ok) {
          if (result.error === "not_ready") return router.replace("/")
          setFailed(true)
          return
        }
        setVisitTicket(1, result.value.id, result.value.issuedAt)
        router.replace("/line")
      })
      .catch(() => setFailed(true))
  }, [hydrated, attempt, plan, router])

  if (failed) {
    return (
      <Stack gap={4}>
        <Alert variant="missing">
          <AlertTitle>Hindi makakuha ng number ngayon.</AlertTitle>
          <AlertDescription>Tingnan ang koneksyon at subukan ulit.</AlertDescription>
        </Alert>
        <Button
          size="touch"
          onClick={() => {
            started.current = false
            setFailed(false)
            setAttempt((n) => n + 1)
          }}
        >
          Subukan ulit
        </Button>
      </Stack>
    )
  }

  return (
    <Stack gap={2} align="center" aria-live="polite">
      <h1>Kumukuha ng number…</h1>
      <p data-tone="muted">Sandali lang, tinitingnan ang checklist mo.</p>
    </Stack>
  )
}
