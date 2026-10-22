import Link from "next/link"

import { Button, Stack } from "@/components/ui"

/** She opened /line without taking a number first. */
export function NoTicket() {
  return (
    <Stack gap={4}>
      <h1>Wala ka pang number</h1>
      <p data-tone="muted">Ihanda muna ang mga dokumento mo sa plano, tapos kumuha ng number.</p>
      <Button asChild size="touch">
        <Link href="/plan">Pumunta sa plano</Link>
      </Button>
    </Stack>
  )
}
