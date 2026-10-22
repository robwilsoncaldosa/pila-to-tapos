"use client"

import { Button } from "@/components/ui"

import { useAsk } from "./ask-context"

type ExplainButtonProps = {
  documentId: string
  documentName: string
}

/** The small "?" beside a document. It opens that document's explanation in the Magtanong sheet. */
export function ExplainButton({ documentId, documentName }: ExplainButtonProps) {
  const { openDocument } = useAsk()
  return (
    <Button
      variant="outline"
      size="icon-touch"
      aria-label={`Magtanong tungkol sa ${documentName}`}
      onClick={() => openDocument(documentId)}
    >
      ?
    </Button>
  )
}
