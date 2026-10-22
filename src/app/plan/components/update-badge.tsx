import { Badge } from "@/components/ui"

export type UpdateKind = "added" | "changed"

const LABELS: Record<UpdateKind, string> = { added: "Bago", changed: "Binago" }

/** Tags a checklist item that is new or changed since her last visit. */
export function UpdateBadge({ kind }: { kind: UpdateKind }) {
  return (
    <Badge variant="default" size="md">
      {LABELS[kind]}
    </Badge>
  )
}
