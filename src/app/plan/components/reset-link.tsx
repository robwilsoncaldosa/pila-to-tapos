"use client"

import { Button, Stack } from "@/components/ui"
import { useT } from "@/i18n"
import { resetPhoneState } from "@/lib/phone-storage"

/** "Reset" clears the ticks and answers saved on this phone. */
export function ResetLink() {
  const { t } = useT()
  return (
    <Stack gap={1} align="center">
      <Button variant="link" size="touch" onClick={resetPhoneState}>
        {t("plan.reset")}
      </Button>
      <small data-tone="muted">{t("plan.resetNote")}</small>
    </Stack>
  )
}
