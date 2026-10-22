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

import { ExplainButton } from "./explain-button"
import { TickRow } from "./tick-row"
import { UpdateBadge, type UpdateKind } from "./update-badge"

const OPTIONS: { value: SituationAnswer; label: string }[] = [
  { value: "oo", label: "Oo" },
  { value: "hindi", label: "Hindi" },
  { value: "hindi_ko_alam", label: "Hindi ko alam" },
]

const OUTCOME: Record<SituationAnswer, string> = {
  oo: "kasama sa checklist",
  hindi: "Hindi kailangan sa iyo",
  hindi_ko_alam: "kasama pa rin sa checklist",
}

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
 * buttons. Answered, it collapses to one line ("Oo — kasama sa checklist") with "Baguhin".
 */
export function SituationItem({
  document,
  answer,
  checked,
  onAnswer,
  onCheckedChange,
  updateKind,
}: SituationItemProps) {
  const [editing, setEditing] = useState(false)
  const notNeeded = answer === "hindi"
  const groupId = `situation-${document.id}`
  const asking = answer === undefined || editing
  const answerLabel = OPTIONS.find((option) => option.value === answer)?.label
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
                    {option.label}
                  </RadioGroupItem>
                ))}
              </RadioGroup>
            </Stack>
          ) : (
            <Stack key="answered" gap={3} enter>
              <Inline justify="between" gap={3}>
                <span>
                  <strong>{answerLabel}</strong> — {OUTCOME[answer]}
                </span>
                <Button
                  variant="outline"
                  size="touch"
                  aria-label={`Baguhin ang sagot: ${document.situationQuestion}`}
                  onClick={() => setEditing(true)}
                >
                  Baguhin
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
                    <small data-tone="muted">
                      Kailangan mo pa rin ito hangga&apos;t hindi mo nasasagot nang Hindi.
                      Pindutin ang ? para magtanong.
                    </small>
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
