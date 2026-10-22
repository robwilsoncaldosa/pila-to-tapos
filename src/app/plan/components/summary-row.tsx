import { Stack } from "@/components/ui"

type SummaryRowProps = {
  label: string
  value: string
  children?: React.ReactNode
}

export function SummaryRow({ label, value, children }: SummaryRowProps) {
  return (
    <Stack gap={1}>
      <small data-tone="muted">{label}</small>
      <p className="text-2xl font-bold">{value}</p>
      {children}
    </Stack>
  )
}
