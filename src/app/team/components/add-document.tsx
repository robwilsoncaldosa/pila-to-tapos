"use client"

import { addDocument } from "@/app/actions/team"
import { Card, CardContent, Stack } from "@/components/ui"
import type { SourceInfo } from "@/domain/plan"

import { DocumentFields, documentInput } from "./document-fields"
import { SaveBar } from "./save-bar"
import { useSaveForm } from "./use-save-form"

/** A new document, added to the end of the checklist. It needs its own citation like any other item. */
export function AddDocument({ sources }: { sources: SourceInfo[] }) {
  const { pending, error, saved, onSubmit } = useSaveForm((data) => addDocument(documentInput(data)), {
    resetOnSuccess: true,
  })
  return (
    <Card tone="muted">
      <CardContent>
        <Stack asChild gap={4}>
          <form onSubmit={onSubmit}>
            <h3>Magdagdag ng dokumento</h3>
            <DocumentFields idPrefix="doc-new" sources={sources} />
            <SaveBar pending={pending} saved={saved} error={error} label="Idagdag" />
          </form>
        </Stack>
      </CardContent>
    </Card>
  )
}
