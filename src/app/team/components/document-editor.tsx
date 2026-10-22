"use client"

import { saveDocument } from "@/app/actions/team"
import { Card, CardContent, Stack } from "@/components/ui"
import type { PlanDocument, SourceInfo } from "@/domain/plan"

import { DocumentFields, documentInput } from "./document-fields"
import { RemoveDocumentButton } from "./remove-document-button"
import { SaveBar } from "./save-bar"
import { useSaveForm } from "./use-save-form"

type DocumentEditorProps = { document: PlanDocument; sources: SourceInfo[] }

/** Everything about one document: what it is, where to get it, whether it depends on her situation. */
export function DocumentEditor({ document, sources }: DocumentEditorProps) {
  const { pending, error, saved, onSubmit } = useSaveForm((data) =>
    saveDocument({ id: document.id, ...documentInput(data) })
  )
  return (
    <Card>
      <CardContent>
        <Stack gap={6}>
          <Stack asChild gap={4}>
            <form onSubmit={onSubmit}>
              <h3>{document.name}</h3>
              <DocumentFields idPrefix={`doc-${document.id}`} sources={sources} document={document} />
              <SaveBar pending={pending} saved={saved} error={error} />
            </form>
          </Stack>
          <RemoveDocumentButton documentId={document.id} documentName={document.name} />
        </Stack>
      </CardContent>
    </Card>
  )
}
