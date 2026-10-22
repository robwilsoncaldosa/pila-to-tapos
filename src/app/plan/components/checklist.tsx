import type { ChecklistStatus } from "@/domain/checklist"
import { sortByPosition, type Plan, type SituationAnswer } from "@/domain/plan"
import { Stack } from "@/components/ui"

import { ChecklistItem } from "./checklist-item"
import { MissingWarning } from "./missing-warning"
import { SituationItem } from "./situation-item"

type ChecklistProps = {
  plan: Plan
  status: ChecklistStatus
  ticks: Record<string, true>
  answers: Record<string, SituationAnswer>
  onTick: (documentId: string, ticked: boolean) => void
  onAnswer: (documentId: string, answer: SituationAnswer) => void
}

export function Checklist({ plan, status, ticks, answers, onTick, onAnswer }: ChecklistProps) {
  const documents = sortByPosition(plan.documents)
  const required = documents.filter((doc) => doc.requirement === "required")
  const situational = documents.filter((doc) => doc.requirement === "situation")
  return (
    <Stack gap={4}>
      <MissingWarning missing={status.missing} />
      {required.map((doc) => (
        <ChecklistItem
          key={doc.id}
          document={doc}
          checked={ticks[doc.id] === true}
          onCheckedChange={(ticked) => onTick(doc.id, ticked)}
        />
      ))}
      {situational.length > 0 ? <h3>Kung naaangkop sa iyo</h3> : null}
      {situational.map((doc) => (
        <SituationItem
          key={doc.id}
          document={doc}
          answer={answers[doc.id]}
          checked={ticks[doc.id] === true}
          onAnswer={(answer) => onAnswer(doc.id, answer)}
          onCheckedChange={(ticked) => onTick(doc.id, ticked)}
        />
      ))}
    </Stack>
  )
}
