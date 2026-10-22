"use client"

import Link from "next/link"
import { useState } from "react"

import { ScanInstructions } from "@/components/scan-instructions"
import { Badge, Button, Stack } from "@/components/ui"
import { journeyStage, returnDateOf, visit2Unlocked } from "@/domain/journey"
import { manilaDay } from "@/domain/queue"
import { formatManilaDate } from "@/domain/working-days"
import type { PhoneState } from "@/lib/phone-storage"

type GetNumberButtonProps = {
  ready: boolean
  phone: PhoneState
}

/**
 * The bottom button follows her journey: locked until the checklist is done, a link to her
 * number while she is in line, then the visit 2 button (locked until the return date or the demo switch).
 */
export function GetNumberButton({ ready, phone }: GetNumberButtonProps) {
  const [open, setOpen] = useState(false)
  const stage = journeyStage(phone.visits)

  if (stage === "visit_1" || stage === "visit_2" || stage === "finished") {
    return (
      <Button asChild size="touch" className="w-full">
        <Link href="/line">Tingnan ang number mo</Link>
      </Button>
    )
  }

  if (stage === "between") {
    const unlocked = visit2Unlocked(phone.visits, manilaDay(new Date()), phone.demoSkip)
    const returnDate = returnDateOf(phone.visits)
    return (
      <Stack gap={3} align="center">
        <Button
          size="touch"
          className="w-full"
          disabled={!unlocked}
          onClick={() => setOpen(true)}
        >
          {unlocked || !returnDate
            ? "Kumuha ng number (Visit 2)"
            : `Balik ka sa ${formatManilaDate(returnDate)}`}
        </Button>
        <ScanInstructions open={open} onOpenChange={setOpen} />
      </Stack>
    )
  }

  return (
    <Stack gap={3} align="center">
      {ready ? (
        <Badge variant="ready" size="lg">
          All documents ready ✓
        </Badge>
      ) : (
        <small data-tone="muted">Naka-lock hanggang makumpleto ang checklist.</small>
      )}
      <Button
        size="touch"
        className="w-full"
        disabled={!ready}
        onClick={() => setOpen(true)}
      >
        Kumuha ng number
      </Button>
      <ScanInstructions open={open} onOpenChange={setOpen} />
    </Stack>
  )
}
