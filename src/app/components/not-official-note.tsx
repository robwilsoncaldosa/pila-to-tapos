import { getT } from "@/i18n/server"

export async function NotOfficialNote() {
  const { t } = await getT()
  return <small data-tone="muted">{t("home.notOfficial")}</small>
}
