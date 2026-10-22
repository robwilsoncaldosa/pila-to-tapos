"use client"

import { cva } from "class-variance-authority"
import { useEffect, useRef } from "react"

import { Button, Stack } from "@/components/ui"

const overlayVariants = cva(
  "enter-pop fixed inset-0 z-50 flex items-center justify-center bg-turn p-6 text-foreground"
)

type CalledOverlayProps = {
  counterLabel: string
  number: string
  onDismiss: () => void
}

/** Full-screen "Ikaw na!" the moment her number is called. "Sige" puts it away. */
export function CalledOverlay({ counterLabel, number, onDismiss }: CalledOverlayProps) {
  const dismissRef = useRef<HTMLButtonElement>(null)
  useEffect(() => dismissRef.current?.focus(), [])

  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="called-title"
      className={overlayVariants()}
    >
      <Stack gap={6} align="center" className="w-full max-w-lg text-center">
        <h1 id="called-title" className="text-6xl">
          Ikaw na!
        </h1>
        <p className="text-7xl font-bold tabular-nums">{number}</p>
        <p className="text-2xl font-bold">{counterLabel}</p>
        <Button ref={dismissRef} size="touch" className="w-full" onClick={onDismiss}>
          Sige
        </Button>
      </Stack>
    </div>
  )
}
