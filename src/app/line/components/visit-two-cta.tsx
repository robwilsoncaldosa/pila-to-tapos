"use client"

import { useState } from "react"

import { ScanInstructions } from "@/components/scan-instructions"
import { Button } from "@/components/ui"
import { useT } from "@/i18n"

/** Shown once visit 2 is open: the phone's camera scans the TV's QR code, which issues the number. */
export function VisitTwoCta() {
  const { t } = useT()
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button size="touch" className="w-full" onClick={() => setOpen(true)}>
        {t("bar.visit2")}
      </Button>
      <ScanInstructions open={open} onOpenChange={setOpen} />
    </>
  )
}
