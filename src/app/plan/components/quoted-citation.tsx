"use client"

import { ExternalLinkIcon } from "lucide-react"

import { Stack } from "@/components/ui"
import type { Citation, SourceInfo } from "@/domain/plan"
import { useT } from "@/i18n"

type QuotedCitationProps = {
  citation: Citation
  source: SourceInfo | undefined
}

/** The exact official quote, then its source title and locator, linking to the official PDF. */
export function QuotedCitation({ citation, source }: QuotedCitationProps) {
  const { t } = useT()
  return (
    <Stack gap={1}>
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
}
