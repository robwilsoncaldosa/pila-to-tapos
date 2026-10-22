"use client"

import { MessageCircleQuestionIcon } from "lucide-react"

import { Button } from "@/components/ui"

import { useAsk } from "./ask-context"

/** The floating "Magtanong" button. Sits over the plan, clear of the phone's home bar. */
export function AskButton() {
  const { openList } = useAsk()
  return (
    <div className="fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-40 rounded-lg shadow-lg">
      <Button size="touch" onClick={openList}>
        <MessageCircleQuestionIcon />
        Magtanong
      </Button>
    </div>
  )
}
