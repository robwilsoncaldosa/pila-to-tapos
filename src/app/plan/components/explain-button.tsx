"use client"

import { Button } from "@/components/ui"
import { useT } from "@/i18n"

import { useAsk } from "./ask-context"

type ExplainButtonProps = {
  documentId: string
  documentName: string
}

/** The small "?" beside a document. It opens that document's explanation in the Ask sheet. */
export function ExplainButton({ documentId, documentName }: ExplainButtonProps) {
  const { t } = useT()
  const { openDocument } = useAsk()
  return (
    <Button
      variant="outline"
      size="icon-touch"
      aria-label={t("docs.explainAria", { name: documentName })}
      onClick={() => openDocument(documentId)}
    >
      ?
    </Button>
  )
}
