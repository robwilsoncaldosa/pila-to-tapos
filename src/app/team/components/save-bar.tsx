import { Alert, AlertDescription, Button, Inline, Stack } from "@/components/ui"

type SaveBarProps = { pending: boolean; saved: boolean; error: string | null; label?: string }

/** The Save button, with "Na-save" or the inline error beside it. */
export function SaveBar({ pending, saved, error, label = "I-save" }: SaveBarProps) {
  return (
    <Stack gap={3}>
      {error ? (
        <Alert variant="missing">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}
      <Inline gap={4}>
        <Button type="submit" size="touch" disabled={pending}>
          {pending ? "Sine-save..." : label}
        </Button>
        {saved && !error ? <strong role="status">Na-save ✓</strong> : null}
      </Inline>
    </Stack>
  )
}
