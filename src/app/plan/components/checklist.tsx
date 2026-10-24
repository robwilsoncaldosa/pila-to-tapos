import type { PlanDiff } from "@/domain/plan-diff"
import type { ChecklistStatus } from "@/domain/checklist"
import { sortByPosition, type Plan, type SituationAnswer } from "@/domain/plan"
import { Stack } from "@/components/ui"
import { useT } from "@/i18n"

import { ChecklistItem } from "./checklist-item"
import { MissingWarning } from "./missing-warning"
import { SituationItem } from "./situation-item"
import type { UpdateKind } from "./update-badge"

type ChecklistProps = {
  plan: Plan
  status: ChecklistStatus
  ticks: Record<string, true>
  answers: Record<string, SituationAnswer>
  updates: PlanDiff | null
  onTick: (documentId: string, ticked: boolean) => void
  onAnswer: (documentId: string, answer: SituationAnswer) => void
}

export function Checklist({ plan, status, ticks, answers, updates, onTick, onAnswer }: ChecklistProps) {
  const { t } = useT()
  const updateKind = (id: string): UpdateKind | undefined =>
    updates?.added.includes(id) ? "added" : updates?.changed.includes(id) ? "changed" : undefined
  const documents = sortByPosition(plan.documents)
  const required = documents.filter((doc) => doc.requirement === "required")
  const situational = documents.filter((doc) => doc.requirement === "situation")
  const unanswered = situational.filter((doc) => !answers[doc.id]).length
  return (
    <Stack gap={4}>
      <MissingWarning missing={status.missing} unanswered={unanswered} />
      {required.map((doc) => (
        <ChecklistItem
          key={doc.id}
          document={doc}
          checked={ticks[doc.id] === true}
          updateKind={updateKind(doc.id)}
          onCheckedChange={(ticked) => onTick(doc.id, ticked)}
        />
      ))}
      {situational.length > 0 ? <h3>{t("plan.situationHeading")}</h3> : null}
      {situational.map((doc) => (
        <SituationItem
          key={doc.id}
          document={doc}
          answer={answers[doc.id]}
          updateKind={updateKind(doc.id)}
          checked={ticks[doc.id] === true}
          onAnswer={(answer) => onAnswer(doc.id, answer)}
          onCheckedChange={(ticked) => onTick(doc.id, ticked)}
        />
      ))}
    </Stack>
  )
}
