import { TriangleAlertIcon } from "lucide-react"

import { CitationChip } from "@/components/citation-chip"
import { Alert, AlertDescription, AlertTitle, Inline, Stack } from "@/components/ui"
import type { PlanDocument } from "@/domain/plan"

type MissingWarningProps = {
  missing: PlanDocument[]
  /** Situation questions she has not answered yet. */
  unanswered: number
}

/**
 * "Kulang pa": while questions are open it only says how many to answer. Once they are all
 * answered it names each missing document, where to get it, and its citation.
 */
export function MissingWarning({ missing, unanswered }: MissingWarningProps) {
  if (missing.length === 0) return null
  if (unanswered > 0) {
    return (
      <Alert variant="missing" enter>
        <TriangleAlertIcon />
        <AlertTitle>Kulang pa:</AlertTitle>
        <AlertDescription>
          Sagutin muna ang {unanswered} tanong para makita ang kumpletong listahan.
        </AlertDescription>
      </Alert>
    )
  }
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
