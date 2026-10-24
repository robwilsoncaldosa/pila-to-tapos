import { InfoIcon } from "lucide-react"

import { Card, CardContent, Inline, Stack } from "@/components/ui"
import type { Question } from "@/domain/plan"
import { useT } from "@/i18n"

import { CitedPassages } from "./cited-passages"

/** A question the source does not answer: plain grey, never a guess, with who to ask. */
export function NotInSourceCard({ question }: { question: Question }) {
  const { t } = useT()
  return (
    <Card tone="muted">
      <CardContent>
        <Stack gap={4}>
          <Inline align="start" gap={2}>
            <InfoIcon className="mt-1 size-5 shrink-0" />
            <h3>{t("notInSource.title")}</h3>
          </Inline>
          <p>{question.answer}</p>
          <Stack gap={2}>
            <strong>{t("notInSource.related")}</strong>
            <CitedPassages citations={question.related ?? []} />
          </Stack>
          <p>
            <strong>{t("notInSource.whoToAsk")}:</strong> {question.whoToAsk}
          </p>
          <small>{t("notInSource.disclaimer")}</small>
        </Stack>
      </CardContent>
    </Card>
  )
}
