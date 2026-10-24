"use client"

import { Badge } from "@/components/ui"
import { useT } from "@/i18n"

export type UpdateKind = "added" | "changed"

const LABEL_KEYS = { added: "update.added", changed: "update.changed" } as const

/** Tags a checklist item that is new or changed since her last visit. */
export function UpdateBadge({ kind }: { kind: UpdateKind }) {
  const { t } = useT()
  return (
    <Badge variant="default" size="md">
      {t(LABEL_KEYS[kind])}
    </Badge>
  )
}
