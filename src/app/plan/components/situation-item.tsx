import { CitationChip } from "@/components/citation-chip"
import {
  Card,
  CardContent,
  Inline,
  Label,
  RadioGroup,
  RadioGroupItem,
  Stack,
} from "@/components/ui"
import type { PlanDocument, SituationAnswer } from "@/domain/plan"

import { TickRow } from "./tick-row"

const OPTIONS: { value: SituationAnswer; label: string }[] = [
  { value: "oo", label: "Oo" },
  { value: "hindi", label: "Hindi" },
  { value: "hindi_ko_alam", label: "Hindi ko alam" },
]

type SituationItemProps = {
  document: PlanDocument
  answer: SituationAnswer | undefined
  checked: boolean
  onAnswer: (answer: SituationAnswer) => void
  onCheckedChange: (checked: boolean) => void
}

/** A document that depends on her situation: one question, then a tick box unless she says Hindi. */
export function SituationItem({
  document,
  answer,
  checked,
  onAnswer,
  onCheckedChange,
}: SituationItemProps) {
  const notNeeded = answer === "hindi"
  const unsure = answer === undefined || answer === "hindi_ko_alam"
  const groupId = `situation-${document.id}`
  return (
    <Card size="sm" tone={notNeeded ? "muted" : "default"}>
      <CardContent>
        <Stack gap={3}>
          <strong id={groupId}>{document.situationQuestion}</strong>
          <RadioGroup
            aria-labelledby={groupId}
            value={answer ?? ""}
            onValueChange={(value) => onAnswer(value as SituationAnswer)}
            layout="wrap"
          >
            {OPTIONS.map((option) => {
              const optionId = `${groupId}-${option.value}`
              return (
                <Inline key={option.value} gap={2}>
                  <RadioGroupItem id={optionId} size="lg" value={option.value} />
                  <Label htmlFor={optionId}>{option.label}</Label>
                </Inline>
              )
            })}
          </RadioGroup>
          {notNeeded ? (
            <Stack key="not-needed" gap={2} enter>
              <strong>Hindi kailangan sa iyo</strong>
              <p>
                <s>{document.name}</s>
              </p>
              <p>{document.notNeededReason}</p>
              <Inline wrap gap={2}>
                <CitationChip citation={document.citation} />
              </Inline>
            </Stack>
          ) : (
            <Stack key="needed" gap={2}>
              <TickRow
                document={document}
                checked={checked}
                onCheckedChange={onCheckedChange}
              />
              {unsure ? (
                <small data-tone="muted" className="enter-rise">
                  Hindi pa sigurado? Kailangan mo pa rin ito hangga&apos;t hindi mo
                  nasasagot nang Hindi. Pindutin ang ? para magtanong.
                </small>
              ) : null}
            </Stack>
          )}
        </Stack>
      </CardContent>
    </Card>
  )
}
