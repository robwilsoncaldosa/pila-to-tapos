"use client"

import { useState } from "react"

import { CitationChip } from "@/components/citation-chip"
import {
  Button,
  Card,
  CardContent,
  Inline,
  RadioGroup,
  RadioGroupItem,
  Stack,
} from "@/components/ui"
import type { PlanDocument, SituationAnswer } from "@/domain/plan"
import { useT, type MessageKey } from "@/i18n"

import { ExplainButton } from "./explain-button"
import { TickRow } from "./tick-row"
import { UpdateBadge, type UpdateKind } from "./update-badge"

const OPTIONS = [
  { value: "oo", label: "answer.yes", outcome: "outcome.yes" },
  { value: "hindi", label: "answer.no", outcome: "outcome.no" },
  { value: "hindi_ko_alam", label: "answer.unsure", outcome: "outcome.unsure" },
] as const satisfies readonly { value: SituationAnswer; label: MessageKey; outcome: MessageKey }[]

type SituationItemProps = {
  document: PlanDocument
  answer: SituationAnswer | undefined
  checked: boolean
  onAnswer: (answer: SituationAnswer) => void
  onCheckedChange: (checked: boolean) => void
  updateKind?: UpdateKind
}

/**
 * A document that depends on her situation. Unanswered, it is one question with three big
 * buttons. Answered, it collapses to one line ("Yes — included in the checklist") with "Change".
 */
export function SituationItem({
  document,
  answer,
  checked,
  onAnswer,
  onCheckedChange,
  updateKind,
}: SituationItemProps) {
  const { t } = useT()
  const [editing, setEditing] = useState(false)
  const notNeeded = answer === "hindi"
  const groupId = `situation-${document.id}`
  const asking = answer === undefined || editing
  const selected = OPTIONS.find((option) => option.value === answer)
  return (
    <Card size="sm" tone={notNeeded ? "muted" : updateKind ? "updated" : "default"}>
      <CardContent>
        <Stack gap={3}>
          {updateKind ? <UpdateBadge kind={updateKind} /> : null}
          {asking ? (
            <Stack key="asking" gap={3} enter={editing}>
              <Inline justify="between" gap={3}>
                <strong id={groupId}>{document.situationQuestion}</strong>
                <ExplainButton documentId={document.id} documentName={document.name} />
              </Inline>
              <RadioGroup
                aria-labelledby={groupId}
                value={answer ?? ""}
                onValueChange={(value) => onAnswer(value as SituationAnswer)}
                layout="segmented"
              >
                {OPTIONS.map((option) => (
                  <RadioGroupItem
                    key={option.value}
                    id={`${groupId}-${option.value}`}
                    size="segment"
                    value={option.value}
                    onClick={() => setEditing(false)}
                  >
                    {t(option.label)}
                  </RadioGroupItem>
                ))}
              </RadioGroup>
            </Stack>
          ) : (
            <Stack key="answered" gap={3} enter>
              <Inline justify="between" gap={3}>
                <span>
                  <strong>{selected ? t(selected.label) : null}</strong> —{" "}
                  {selected ? t(selected.outcome) : null}
                </span>
                <Button
                  variant="outline"
                  size="touch"
                  aria-label={t("situation.changeAria", { question: document.situationQuestion ?? "" })}
                  onClick={() => setEditing(true)}
                >
                  {t("situation.change")}
                </Button>
              </Inline>
              {notNeeded ? (
                <Stack gap={2}>
                  <p>
                    <s>{document.name}</s>
                  </p>
                  <p>{document.notNeededReason}</p>
                  <Inline wrap gap={2}>
                    <CitationChip citation={document.citation} />
                  </Inline>
                </Stack>
              ) : (
                <Stack gap={2}>
                  <TickRow
                    document={document}
                    checked={checked}
                    onCheckedChange={onCheckedChange}
                  />
                  {answer === "hindi_ko_alam" ? (
                    <small data-tone="muted">{t("situation.unsureNote")}</small>
                  ) : null}
                </Stack>
              )}
            </Stack>
          )}
        </Stack>
      </CardContent>
    </Card>
  )
}
