"use client"

import { Alert, AlertTitle } from "@/components/ui"
import { useT } from "@/i18n"

/** Stays on screen while her number is called, even after she taps "OK". */
export function CalledBanner({ counterLabel }: { counterLabel: string }) {
  const { t } = useT()
  return (
    <Alert variant="turn" enter>
      <AlertTitle>{t("line.calledBanner", { counter: counterLabel })}</AlertTitle>
    </Alert>
  )
}
