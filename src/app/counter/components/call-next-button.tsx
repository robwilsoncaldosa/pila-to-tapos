import { Button, Stack } from "@/components/ui"
import { useT } from "@/i18n"

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
  const { t } = useT()
  return (
    <Stack gap={2}>
      <Button size="huge" disabled={!hasWaiting || busy || pending} onClick={onCall}>
        {t("counter.callNext")}
      </Button>
      {busy ? (
        <small data-tone="muted">{t("counter.busy")}</small>
      ) : null}
    </Stack>
  )
}
