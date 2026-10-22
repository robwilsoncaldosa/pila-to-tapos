import { Alert, AlertTitle } from "@/components/ui"

/** Stays on screen while her number is called, even after she taps "Sige". */
export function CalledBanner({ counterLabel }: { counterLabel: string }) {
  return (
    <Alert variant="turn" enter>
      <AlertTitle>Tinawag ka na sa {counterLabel}</AlertTitle>
    </Alert>
  )
}
