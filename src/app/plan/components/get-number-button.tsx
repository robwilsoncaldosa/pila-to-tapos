"use client"

import { useState } from "react"

import { Badge, Button, Stack } from "@/components/ui"

import { ScanInstructions } from "./scan-instructions"

/** Locked until everything that applies to her is ticked. */
export function GetNumberButton({ ready }: { ready: boolean }) {
  const [open, setOpen] = useState(false)
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
