import { ArrowDownIcon, TriangleAlertIcon } from "lucide-react"

import { CitationChip } from "@/components/citation-chip"
import {
  Alert,
  AlertDescription,
  Badge,
  Card,
  CardContent,
  Inline,
  Stack,
} from "@/components/ui"
import type { Step } from "@/domain/plan"
import { sortByPosition } from "@/domain/plan"

type PathLineProps = {
  steps: Step[]
  counterLabel: string
  processingTimeLabel: string
  /** Highlights one step (used on the line screen). With none, every step is shown in full. */
  currentStepId?: string
  /** Show the waiting step's conditional notices (unfiled-returns warning and relief note). */
  showNotices?: boolean
}

/** The route signboard: bold chips joined by arrows, like a jeepney route. */
export function PathLine({
  steps,
  counterLabel,
  processingTimeLabel,
  currentStepId,
  showNotices = false,
}: PathLineProps) {
  const ordered = sortByPosition(steps)
  return (
    <Stack asChild gap={2}>
      <ol aria-label="Ang path mo">
        {ordered.map((step, index) => {
          const active = !currentStepId || step.id === currentStepId
          return (
            <Stack asChild key={step.id} gap={2} align="center">
              <li>
                {index > 0 ? <ArrowDownIcon aria-hidden className="size-8" /> : null}
                <Card tone={active ? "signboard" : "default"} className="w-full">
                  <CardContent>
                    <Inline gap={3}>
                      <Badge variant="chip" size="lg">
                        {index + 1}
                      </Badge>
                      <Stack gap={0}>
                        <strong>
                          {step.kind === "wait"
                            ? `${step.name} (${processingTimeLabel})`
                            : step.name}
                        </strong>
                        {step.kind === "visit" ? <small>{counterLabel}</small> : null}
                      </Stack>
                    </Inline>
                  </CardContent>
                </Card>
                {showNotices
                  ? (step.notices ?? []).map((notice) => (
                      <Alert
                        key={notice.id}
                        enter
                        variant={notice.kind === "warning" ? "default" : "muted"}
                      >
                        {notice.kind === "warning" ? <TriangleAlertIcon /> : null}
                        <AlertDescription>
                          <Stack gap={2}>
                            <p>{notice.text}</p>
                            <Inline wrap gap={2}>
                              {notice.citations.map((citation) => (
                                <CitationChip
                                  key={citation.locator}
                                  citation={citation}
                                />
                              ))}
                            </Inline>
                          </Stack>
                        </AlertDescription>
                      </Alert>
                    ))
                  : null}
              </li>
            </Stack>
          )
        })}
      </ol>
    </Stack>
  )
}
