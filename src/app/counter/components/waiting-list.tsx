import { Badge, Card, CardContent, Inline, Stack } from "@/components/ui"
import { minutesBetween, visitLabel, type Ticket } from "@/domain/queue"
import { useT } from "@/i18n"

type WaitingListProps = {
  tickets: Ticket[]
  /** The time the list was fetched, so every row measures the wait against the same moment. */
  asOf: Date
}

/** The line in order. Numbers only, never names. */
export function WaitingList({ tickets, asOf }: WaitingListProps) {
  const { t } = useT()
  return (
    <Stack gap={3}>
      <h2>{t("counter.waiting", { n: tickets.length })}</h2>
      {tickets.length === 0 ? (
        <p data-tone="muted">{t("counter.nobody")}</p>
      ) : (
        <Stack asChild gap={2}>
          <ul>
            {tickets.map((ticket) => (
              <li key={ticket.id}>
                <Card size="sm">
                  <CardContent>
                    <Inline justify="between" gap={3} wrap>
                      <Inline gap={4}>
                        <strong className="text-3xl tabular-nums">{ticket.number}</strong>
                        <span data-tone="muted">
                          {t("counter.minutes", { n: minutesBetween(ticket.issuedAt, asOf) })}
                        </span>
                      </Inline>
                      <Inline gap={2} wrap>
                        <Badge variant="chip" size="md">
                          {visitLabel(ticket.visitNo)}
                        </Badge>
                        {ticket.docsReady ? (
                          <Badge variant="ready" size="md">
                            {t("counter.docsReady")}
                          </Badge>
                        ) : null}
                      </Inline>
                    </Inline>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        </Stack>
      )}
    </Stack>
  )
}
