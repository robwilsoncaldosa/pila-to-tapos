import { TriangleAlertIcon } from "lucide-react"

import { CitationChip } from "@/components/citation-chip"
import { Alert, AlertDescription, AlertTitle, Inline, Stack } from "@/components/ui"
import type { PlanDocument } from "@/domain/plan"
import { useT } from "@/i18n"

type MissingWarningProps = {
  missing: PlanDocument[]
  /** Situation questions she has not answered yet. */
  unanswered: number
}

/**
 * "Still missing": while questions are open it only says how many to answer. Once they are all
 * answered it names each missing document, where to get it, and its citation.
 */
export function MissingWarning({ missing, unanswered }: MissingWarningProps) {
  const { t, tn } = useT()
  if (missing.length === 0) return null
  if (unanswered > 0) {
    return (
      <Alert variant="missing" enter>
        <TriangleAlertIcon />
        <AlertTitle>{t("missing.title")}</AlertTitle>
        <AlertDescription>{tn("missing.answerFirst", unanswered)}</AlertDescription>
      </Alert>
    )
  }
  return (
    <Alert variant="missing" enter>
      <TriangleAlertIcon />
      <AlertTitle>{t("missing.title")}</AlertTitle>
      <AlertDescription>
        <Stack asChild gap={4}>
          <ul>
            {missing.map((doc) => (
              <li key={doc.id}>
                <Stack gap={1}>
                  <strong>{doc.name}</strong>
                  <span>
                    {t("docs.whereToGet")}: {doc.whereToGet}
                  </span>
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
