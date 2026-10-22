import { RefreshCwIcon } from "lucide-react"

import { Alert, AlertDescription, AlertTitle, Button, Stack } from "@/components/ui"
import type { Plan } from "@/domain/plan"
import { itemNames, type PlanDiff } from "@/domain/plan-diff"

type UpdatedBannerProps = { plan: Plan; updates: PlanDiff; onDismiss: () => void }

/** "Na-update ang requirements": what the team added or changed since her last visit. */
export function UpdatedBanner({ plan, updates, onDismiss }: UpdatedBannerProps) {
  const names = itemNames(plan)
  const rows = [
    ...updates.added.map((id) => ({ id, label: "Bago", name: names[id] })),
    ...updates.changed.map((id) => ({ id, label: "Binago", name: names[id] })),
  ].filter((row) => row.name)
  return (
    <Alert variant="notice" enter>
      <RefreshCwIcon />
      <AlertTitle>Na-update ang requirements</AlertTitle>
      <AlertDescription>
        <Stack gap={3}>
          <ul>
            {rows.map((row) => (
              <li key={`${row.label}-${row.id}`}>
                <strong>{row.label}:</strong> {row.name}
              </li>
            ))}
          </ul>
          <p>
            Naka-highlight ang mga ito sa checklist. Binura ang tick sa mga dokumentong nagbago, kaya
            i-tick ulit kapag handa na.
          </p>
          <Button size="touch" onClick={onDismiss}>
            Sige
          </Button>
        </Stack>
      </AlertDescription>
    </Alert>
  )
}
