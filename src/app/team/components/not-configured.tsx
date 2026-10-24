import { Alert, AlertDescription, AlertTitle, Stack } from "@/components/ui"
import { getT } from "@/i18n/server"

/** TEAM_PASSCODE (or TEAM_COOKIE_SECRET) is missing, so nobody can unlock /team. */
export async function NotConfigured() {
  const { t } = await getT()
  return (
    <Stack gap={4}>
      <h1>{t("team.title")}</h1>
      <Alert variant="missing">
        <AlertTitle>{t("team.notConfiguredTitle")}</AlertTitle>
        <AlertDescription>{t("team.notConfiguredBody")}</AlertDescription>
      </Alert>
    </Stack>
  )
}
