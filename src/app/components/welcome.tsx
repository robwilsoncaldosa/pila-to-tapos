import { Stack } from "@/components/ui"

export function Welcome() {
  return (
    <Stack gap={3}>
      <h1>Ano&apos;ng kailangan mong gawin?</h1>
      <p data-tone="muted">
        Piliin ang gagawin mo, at ipapakita namin ang buong plano bago ka pumunta.
      </p>
    </Stack>
  )
}
