import { Card, CardContent } from "@/components/ui"
import type { PlanDocument } from "@/domain/plan"

import { TickRow } from "./tick-row"

type ChecklistItemProps = {
  document: PlanDocument
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}

/** A document that is always required. */
export function ChecklistItem({ document, checked, onCheckedChange }: ChecklistItemProps) {
  return (
    <Card size="sm">
      <CardContent>
        <TickRow document={document} checked={checked} onCheckedChange={onCheckedChange} />
      </CardContent>
    </Card>
  )
}
