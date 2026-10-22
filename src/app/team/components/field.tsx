import type { ReactNode } from "react"

import { Label, Stack } from "@/components/ui"

type FieldProps = { htmlFor: string; label: string; hint?: string; children: ReactNode }

/** A label (and an optional hint) above one form control. */
export function Field({ htmlFor, label, hint, children }: FieldProps) {
  return (
    <Stack gap={2}>
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {hint ? <small data-tone="muted">{hint}</small> : null}
    </Stack>
  )
}
