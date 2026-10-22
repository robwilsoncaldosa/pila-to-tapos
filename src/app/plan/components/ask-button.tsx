"use client"

import { Button } from "@/components/ui"

import { useAsk } from "./ask-context"

/** The secondary "Magtanong" button in the bottom bar. It opens the question sheet. */
export function AskButton() {
  const { openList } = useAsk()
  return (
    <Button variant="outline" size="bar" onClick={openList}>
      Magtanong
    </Button>
  )
}
