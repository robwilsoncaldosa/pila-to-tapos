"use client"

import { ExternalLinkIcon } from "lucide-react"

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
  Stack,
} from "@/components/ui"
import type { Citation } from "@/domain/plan"
import { useT } from "@/i18n"

import { useSources } from "./sources-context"

type SectionCitationsProps = {
  /** What the section is about, e.g. "your path". Used as the dialog title. */
  title: string
  citations: Citation[]
}

/** One "Where is this from?" button per section. It lists every quote the section rests on. */
export function SectionCitations({ title, citations }: SectionCitationsProps) {
  const { t } = useT()
  const sources = useSources()
  const unique = citations.filter(
    (citation, i) =>
      citations.findIndex(
        (other) => other.sourceId === citation.sourceId && other.locator === citation.locator
      ) === i
  )
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link" size="link-touch" className="self-start">
          {t("cite.where")}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[85dvh] overflow-y-auto">
        <Stack gap={4}>
          <DialogTitle>{t("cite.whereTitle", { title })}</DialogTitle>
          <DialogDescription>{t("cite.exact")}</DialogDescription>
          {unique.map((citation) => {
            const source = sources.find((item) => item.id === citation.sourceId)
            return (
              <Stack key={`${citation.sourceId}-${citation.locator}`} gap={1}>
                <blockquote className="border-l-4 border-primary pl-3">
                  &ldquo;{citation.quote}&rdquo;
                </blockquote>
                <small data-tone="muted">
                  {source?.title ?? citation.sourceId} · {citation.locator}
                </small>
                {source ? (
                  <a href={source.url} target="_blank" rel="noopener noreferrer">
                    {t("cite.open")} <ExternalLinkIcon className="inline size-4" />
                  </a>
                ) : null}
              </Stack>
            )
          })}
        </Stack>
      </DialogContent>
    </Dialog>
  )
}
