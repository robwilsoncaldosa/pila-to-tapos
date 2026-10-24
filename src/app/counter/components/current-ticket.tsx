import { Button, Card, CardContent, Inline, Stack } from "@/components/ui"
import { visitLabel, type Ticket } from "@/domain/queue"
import { useT } from "@/i18n"

type CurrentTicketProps = {
  ticket: Ticket
  pending: boolean
  onDone: () => void
}

/** The number being served, with the one button that finishes the visit. */
export function CurrentTicket({ ticket, pending, onDone }: CurrentTicketProps) {
  const { t } = useT()
  return (
    <Card tone="turn">
      <CardContent>
        <Inline justify="between" gap={4} wrap>
          <Stack gap={0}>
            <small>
              {t("counter.current")} · {visitLabel(ticket.visitNo)}
            </small>
            <p className="text-6xl font-bold tabular-nums">{ticket.number}</p>
          </Stack>
          <Button size="huge" variant="outline" disabled={pending} onClick={onDone}>
            {t("counter.done")}
          </Button>
        </Inline>
      </CardContent>
    </Card>
  )
}
