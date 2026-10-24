"use client"

import { Badge, Inline, Label, Switch } from "@/components/ui"
import { useT } from "@/i18n"
import { setDemoSkip } from "@/lib/phone-storage"

/** Demo only: pretends the 3 working days have passed so visit 2 can be shown right away. */
export function DemoSkipSwitch({ checked }: { checked: boolean }) {
  const { t } = useT()
  return (
    <Inline gap={3}>
      <Badge variant="outline">{t("line.demoBadge")}</Badge>
      <Switch id="demo-skip" checked={checked} onCheckedChange={setDemoSkip} />
      <Label htmlFor="demo-skip">{t("line.demoSwitch")}</Label>
    </Inline>
  )
}
