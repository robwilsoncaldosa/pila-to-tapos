import { Button, Stack } from "@/components/ui"

type CallNextButtonProps = {
  /** True when somebody is waiting. */
  hasWaiting: boolean
  /** True while a called ticket has not been marked Done yet. */
  busy: boolean
  pending: boolean
  onCall: () => void
}

/** Big, and off whenever there is nobody to call or the current number is not finished. */
export function CallNextButton({ hasWaiting, busy, pending, onCall }: CallNextButtonProps) {
  return (
    <Stack gap={2}>
      <Button size="huge" disabled={!hasWaiting || busy || pending} onClick={onCall}>
        Call next
      </Button>
      {busy ? (
        <small data-tone="muted">Pindutin muna ang Done sa kasalukuyang number.</small>
      ) : null}
    </Stack>
  )
}
