import { cva } from "class-variance-authority"

import { Button, Stack } from "@/components/ui"

const overlayVariants = cva(
  "fixed inset-0 z-50 flex items-center justify-center bg-tv/95 p-6 text-white"
)

/** The one tap a browser needs before the TV may speak or play sound. */
export function StartTvOverlay({ onStart }: { onStart: () => void }) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Simulan ang TV"
      className={overlayVariants()}
    >
      <Stack gap={4} align="center" className="text-center">
        <p className="text-xl">Kailangan ng isang tap bago makapagsalita ang TV.</p>
        <Button size="huge" variant="secondary" onClick={onStart}>
          Simulan ang TV
        </Button>
      </Stack>
    </div>
  )
}
