import { RefreshCwIcon } from "lucide-react"

import { Alert, AlertDescription, AlertTitle, Button, Stack } from "@/components/ui"
import type { Plan } from "@/domain/plan"
import { itemNames, type PlanDiff } from "@/domain/plan-diff"
import { useT } from "@/i18n"

type UpdatedBannerProps = { plan: Plan; updates: PlanDiff; onDismiss: () => void }

/** "The requirements were updated": what the team added or changed since her last visit. */
export function UpdatedBanner({ plan, updates, onDismiss }: UpdatedBannerProps) {
  const { t } = useT()
  const names = itemNames(plan, t("update.meta"))
  const rows = [
    ...updates.added.map((id) => ({ id, label: t("update.added"), name: names[id] })),
    ...updates.changed.map((id) => ({ id, label: t("update.changed"), name: names[id] })),
  ].filter((row) => row.name)
  return (
    <Alert variant="notice" enter>
      <RefreshCwIcon />
      <AlertTitle>{t("update.title")}</AlertTitle>
      <AlertDescription>
        <Stack gap={3}>
          <ul>
            {rows.map((row) => (
              <li key={`${row.label}-${row.id}`}>
                <strong>{row.label}:</strong> {row.name}
              </li>
            ))}
          </ul>
          <p>{t("update.note")}</p>
          <Button size="touch" onClick={onDismiss}>
            {t("common.ok")}
          </Button>
        </Stack>
      </AlertDescription>
    </Alert>
  )
}
