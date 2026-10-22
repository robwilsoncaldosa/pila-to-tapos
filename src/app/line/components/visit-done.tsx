import { Card, CardContent, Stack } from "@/components/ui"

type VisitDoneProps = {
  /** "Martes, Oktubre 27". */
  returnDateLabel: string
  /** What she brings to visit 2, or null when the plan lists no official amount. */
  feePhp: number | null
}

/** Between the visits: when to come back and what to bring. */
export function VisitDone({ returnDateLabel, feePhp }: VisitDoneProps) {
  return (
    <Card enter>
      <CardContent>
        <Stack gap={2}>
          <h2>Visit 1 done ✓</h2>
          <p>Balik ka sa {returnDateLabel} (3 working days).</p>
          {feePhp === null ? null : <p className="font-bold">Dalhin: ₱{feePhp}</p>}
        </Stack>
      </CardContent>
    </Card>
  )
}
