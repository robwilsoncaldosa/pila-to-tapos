"use client"

import { Button, Stack } from "@/components/ui"
import { resetPhoneState } from "@/lib/phone-storage"

/** "I-reset" clears the ticks and answers saved on this phone. */
export function ResetLink() {
  return (
    <Stack gap={1} align="center">
      <Button variant="link" size="touch" onClick={resetPhoneState}>
        I-reset
      </Button>
      <small data-tone="muted">
        Buburahin nito ang mga tick at sagot na naka-save sa phone na ito.
      </small>
    </Stack>
  )
}
