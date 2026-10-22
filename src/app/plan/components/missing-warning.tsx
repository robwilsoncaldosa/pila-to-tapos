import { TriangleAlertIcon } from "lucide-react"

import { CitationChip } from "@/components/citation-chip"
import { Alert, AlertDescription, AlertTitle, Inline, Stack } from "@/components/ui"
import type { PlanDocument } from "@/domain/plan"

/** "Kulang pa": names each missing document, where to get it, and its citation. */
export function MissingWarning({ missing }: { missing: PlanDocument[] }) {
  if (missing.length === 0) return null
  return (
    <Alert variant="missing" enter>
      <TriangleAlertIcon />
      <AlertTitle>Kulang pa:</AlertTitle>
      <AlertDescription>
        <Stack asChild gap={4}>
          <ul>
            {missing.map((doc) => (
              <li key={doc.id}>
                <Stack gap={1}>
                  <strong>{doc.name}</strong>
                  <span>Saan kukuha: {doc.whereToGet}</span>
                  <Inline wrap gap={2}>
                    <CitationChip citation={doc.citation} />
                  </Inline>
                </Stack>
              </li>
            ))}
          </ul>
        </Stack>
      </AlertDescription>
    </Alert>
  )
}
