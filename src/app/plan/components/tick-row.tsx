import { Checkbox, Inline, Label } from "@/components/ui"
import type { PlanDocument } from "@/domain/plan"

import { ExplainButton } from "./explain-button"

type TickRowProps = {
  document: PlanDocument
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}

/** Tick box, document name and the "?" button. */
export function TickRow({ document, checked, onCheckedChange }: TickRowProps) {
  const id = `tick-${document.id}`
  return (
    <Inline justify="between" gap={3}>
      <Inline gap={3} className="flex-1">
        <Checkbox
          id={id}
          size="lg"
          checked={checked}
          onCheckedChange={(value) => onCheckedChange(value === true)}
        />
        <Label htmlFor={id}>{document.name}</Label>
      </Inline>
      <ExplainButton documentName={document.name} />
    </Inline>
  )
}
