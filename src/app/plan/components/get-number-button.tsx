"use client"

import Link from "next/link"
import { useState } from "react"

import { ScanInstructions } from "@/components/scan-instructions"
import { Button } from "@/components/ui"
import { journeyStage, returnDateOf, visit2Unlocked } from "@/domain/journey"
import { manilaDay } from "@/domain/queue"
import { formatManilaDate } from "@/domain/working-days"
import { useT } from "@/i18n"
import type { PhoneState } from "@/lib/phone-storage"

type GetNumberButtonProps = {
  /** Applicable documents still not ticked. Zero unlocks the button. */
  missingCount: number
  phone: PhoneState
}

/**
 * The primary bar button follows her journey: locked until the checklist is done, a link to her
 * number while she is in line, then the visit 2 button (locked until the return date or the demo switch).
 */
export function GetNumberButton({ missingCount, phone }: GetNumberButtonProps) {
  const { t, locale } = useT()
  const [open, setOpen] = useState(false)
  const stage = journeyStage(phone.visits)

  if (stage === "visit_1" || stage === "visit_2" || stage === "finished") {
    return (
      <Button asChild size="bar" className="flex-1">
        <Link href="/line">{t("next.viewNumber")}</Link>
      </Button>
    )
  }

  if (stage === "between") {
    const unlocked = visit2Unlocked(phone.visits, manilaDay(new Date()), phone.demoSkip)
    const returnDate = returnDateOf(phone.visits)
    return (
      <>
        <Button
          size="bar"
          className="flex-1"
          disabled={!unlocked}
          onClick={() => setOpen(true)}
        >
          {unlocked || !returnDate
            ? t("bar.visit2")
            : t("next.comeBack", { date: formatManilaDate(returnDate, locale) })}
        </Button>
        <ScanInstructions open={open} onOpenChange={setOpen} />
      </>
    )
  }

  const locked = missingCount > 0
  return (
    <>
      <Button
        size="bar"
        className="flex-1"
        disabled={locked}
        onClick={() => setOpen(true)}
      >
        <span>
          {t("bar.get")}
          {locked ? <small className="block">{t("bar.missing", { n: missingCount })}</small> : null}
        </span>
      </Button>
      <ScanInstructions open={open} onOpenChange={setOpen} />
    </>
  )
}
