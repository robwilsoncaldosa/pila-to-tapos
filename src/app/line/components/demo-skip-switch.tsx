"use client"

import { Badge, Inline, Label, Switch } from "@/components/ui"
import { setDemoSkip } from "@/lib/phone-storage"

/** Demo only: pretends the 3 working days have passed so visit 2 can be shown right away. */
export function DemoSkipSwitch({ checked }: { checked: boolean }) {
  return (
    <Inline gap={3}>
      <Badge variant="outline">Demo</Badge>
      <Switch id="demo-skip" checked={checked} onCheckedChange={setDemoSkip} />
      <Label htmlFor="demo-skip">Demo: lumipas ang 3 working days</Label>
    </Inline>
  )
}
