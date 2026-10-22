import { Card, CardContent, Stack } from "@/components/ui"
import type { PlanDocument } from "@/domain/plan"

import { TickRow } from "./tick-row"
import { UpdateBadge, type UpdateKind } from "./update-badge"

type ChecklistItemProps = {
  document: PlanDocument
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  updateKind?: UpdateKind
}

/** A document that is always required. */
export function ChecklistItem({ document, checked, onCheckedChange, updateKind }: ChecklistItemProps) {
  return (
    <Card size="sm" tone={updateKind ? "updated" : "default"}>
      <CardContent>
        <Stack gap={2} align="start">
          {updateKind ? <UpdateBadge kind={updateKind} /> : null}
          <TickRow document={document} checked={checked} onCheckedChange={onCheckedChange} />
        </Stack>
      </CardContent>
    </Card>
  )
}
