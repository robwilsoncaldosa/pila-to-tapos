"use client"

import { cva } from "class-variance-authority"

import { Button, Stack } from "@/components/ui"
import { useT } from "@/i18n"

const overlayVariants = cva(
  "fixed inset-0 z-50 flex items-center justify-center bg-tv/95 p-6 text-white"
)

/** The one tap a browser needs before the TV may speak or play sound. */
export function StartTvOverlay({ onStart }: { onStart: () => void }) {
  const { t } = useT()
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t("tv.start")}
      className={overlayVariants()}
    >
      <Stack gap={4} align="center" className="text-center">
        <p className="text-xl">{t("tv.startPrompt")}</p>
        <Button size="huge" variant="secondary" onClick={onStart}>
          {t("tv.start")}
        </Button>
      </Stack>
    </div>
  )
}
