"use client"

import { createContext, useContext, useState } from "react"

import type { Plan } from "@/domain/plan"

import type { AskView } from "./ask-view"
import { AskSheet } from "./ask-sheet"

type AskActions = {
  openList: () => void
  openDocument: (documentId: string) => void
}

const AskContext = createContext<AskActions | null>(null)

/** Holds the one Magtanong sheet so the floating button and every "?" can open it. */
export function AskProvider({ plan, children }: { plan: Plan; children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  // Kept after closing so the content does not change while the sheet slides away.
  const [view, setView] = useState<AskView>({ kind: "list" })

  const actions: AskActions = {
    openList: () => {
      setView({ kind: "list" })
      setOpen(true)
    },
    openDocument: (documentId) => {
      setView({ kind: "document", documentId })
      setOpen(true)
    },
  }

  return (
    <AskContext value={actions}>
      {children}
      <AskSheet
        plan={plan}
        open={open}
        onOpenChange={setOpen}
        view={view}
        onViewChange={setView}
      />
    </AskContext>
  )
}

export const useAsk = (): AskActions => {
  const actions = useContext(AskContext)
  if (!actions) throw new Error("useAsk must be used inside AskProvider")
  return actions
}
