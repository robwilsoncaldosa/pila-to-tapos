import { Card, CardContent, Stack } from "@/components/ui"

type TicketStubProps = {
  number: string
  /** "Step 1 of 3: Submit". */
  stepLabel: string
  counterLabel: string
}

/** Her number big on a jeepney-yellow stub, a dashed tear line, then the step and counter. */
export function TicketStub({ number, stepLabel, counterLabel }: TicketStubProps) {
  return (
    <Card tone="turn" enter aria-label="Ang number mo">
      <CardContent>
        <Stack gap={1} align="center">
          <small>Ang number mo</small>
          <p className="text-6xl font-bold tabular-nums">{number}</p>
        </Stack>
      </CardContent>
      <div className="border-t-2 border-dashed border-foreground/40" aria-hidden />
      <CardContent>
        <Stack gap={0}>
          <strong>{stepLabel}</strong>
          <span>{counterLabel}</span>
        </Stack>
      </CardContent>
    </Card>
  )
}
