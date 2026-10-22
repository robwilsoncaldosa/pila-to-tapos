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
import type { Citation, SourceId } from "@/domain/plan"

import { useSource } from "./sources-context"

const SHORT_LABEL: Record<SourceId, string> = {
  "rmc-47-2026": "RMC 47-2026",
  "cc-28a": "Citizen's Charter",
  "rmc-84-2026": "RMC 84-2026",
}

/** A small "where does this come from" chip. Tapping it shows the exact official quote. */
export function CitationChip({ citation }: { citation: Citation }) {
  const source = useSource(citation.sourceId)
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="chip">
          {SHORT_LABEL[citation.sourceId]} · {citation.locator}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <Stack gap={3}>
          <DialogTitle>{source?.title ?? SHORT_LABEL[citation.sourceId]}</DialogTitle>
          <DialogDescription>{citation.locator}</DialogDescription>
          <blockquote className="border-l-4 border-primary pl-3">
            {citation.quote}
          </blockquote>
          {source ? (
            <a href={source.url} target="_blank" rel="noreferrer">
              Buksan ang opisyal na source <ExternalLinkIcon className="inline size-4" />
            </a>
          ) : null}
        </Stack>
      </DialogContent>
    </Dialog>
  )
}
