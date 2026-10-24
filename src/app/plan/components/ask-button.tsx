"use client"

import { Button } from "@/components/ui"
import { useT } from "@/i18n"

import { useAsk } from "./ask-context"

/** The secondary "Ask" button in the bottom bar. It opens the question sheet. */
export function AskButton() {
  const { t } = useT()
  const { openList } = useAsk()
  return (
    <Button variant="outline" size="bar" onClick={openList}>
      {t("bar.ask")}
    </Button>
  )
}
