import { Alert, AlertDescription, AlertTitle } from "@/components/ui"
import { getT } from "@/i18n/server"

export async function PlanUnavailable() {
  const { t } = await getT()
  return (
    <Alert variant="muted">
      <AlertTitle>{t("planUnavailable.title")}</AlertTitle>
      <AlertDescription>{t("planUnavailable.body")}</AlertDescription>
    </Alert>
  )
}
