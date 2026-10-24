"use client"

import { Alert, AlertTitle } from "@/components/ui"
import { formatManilaTime } from "@/domain/queue"
import { useT } from "@/i18n"
import { useNow, useOnline } from "@/lib/use-now"

/** Polls come every 2 seconds, so a last success older than this means the connection is gone. */
const STALE_AFTER_MS = 6000

/** Her number stays on screen; this small banner says the info may be old. */
export function OfflineBanner({ lastUpdatedAt }: { lastUpdatedAt: Date | null }) {
  const { t } = useT()
  const online = useOnline()
  const now = useNow()
  const stale = lastUpdatedAt !== null && now - lastUpdatedAt.getTime() > STALE_AFTER_MS
  if (online && !stale) return null

  return (
    <Alert variant="muted" enter>
      <AlertTitle>
        {lastUpdatedAt
          ? t("line.offlineSince", { time: formatManilaTime(lastUpdatedAt) })
          : t("line.offline")}
      </AlertTitle>
    </Alert>
  )
}
