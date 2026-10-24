import { Alert, AlertDescription, Button, Inline, Stack } from "@/components/ui"
import { useT } from "@/i18n"

type SaveBarProps = { pending: boolean; saved: boolean; error: string | null; label?: string }

/** The Save button, with "Saved" or the inline error beside it. */
export function SaveBar({ pending, saved, error, label }: SaveBarProps) {
  const { t } = useT()
  return (
    <Stack gap={3}>
      {error ? (
        <Alert variant="missing">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}
      <Inline gap={4}>
        <Button type="submit" size="touch" disabled={pending}>
          {pending ? t("team.saving") : (label ?? t("team.save"))}
        </Button>
        {saved && !error ? <strong role="status">{t("team.saved")}</strong> : null}
      </Inline>
    </Stack>
  )
}
