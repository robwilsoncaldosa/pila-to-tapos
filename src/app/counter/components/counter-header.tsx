import { Stack } from "@/components/ui"

export function CounterHeader({ label }: { label: string }) {
  return (
    <Stack gap={1}>
      <small data-tone="muted">Staff counter</small>
      <h1>{label}</h1>
    </Stack>
  )
}
