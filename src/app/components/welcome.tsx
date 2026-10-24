import { Stack } from "@/components/ui"
import { getT } from "@/i18n/server"

export async function Welcome() {
  const { t } = await getT()
  return (
    <Stack gap={3}>
      <h1>{t("home.title")}</h1>
      <p data-tone="muted">{t("home.intro")}</p>
    </Stack>
  )
}
