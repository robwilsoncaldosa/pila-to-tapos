"use client"

import { useSources } from "@/components/citation-chip"
import { Stack } from "@/components/ui"
import type { Citation } from "@/domain/plan"

import { QuotedCitation } from "./quoted-citation"

/** A list of quoted passages, each looked up against the official source list. */
export function CitedPassages({ citations }: { citations: Citation[] }) {
  const sources = useSources()
  return (
    <Stack gap={4}>
      {citations.map((citation, i) => (
        <QuotedCitation
          key={`${citation.sourceId}-${i}`}
          citation={citation}
          source={sources.find((source) => source.id === citation.sourceId)}
        />
      ))}
    </Stack>
  )
}
