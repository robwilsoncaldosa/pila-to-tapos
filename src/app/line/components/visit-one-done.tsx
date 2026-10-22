import { Card, CardContent, Stack } from "@/components/ui"

/** Interim end of visit 1 for slice 3. The "Balik ka sa [date]" card replaces it in slice 4. */
export function VisitOneDone() {
  return (
    <Card enter>
      <CardContent>
        <Stack gap={2}>
          <h2>Tapos na ang Visit 1 ✓</h2>
          <p data-tone="muted">Salamat! Hintayin ang susunod na hakbang sa path sa ibaba.</p>
        </Stack>
      </CardContent>
    </Card>
  )
}
