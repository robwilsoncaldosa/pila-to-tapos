"use client"

import { useState, useTransition } from "react"

import { removeDocument } from "@/app/actions/team"
import { Button, Stack } from "@/components/ui"

import { teamErrorMessage } from "./team-errors"

type RemoveDocumentButtonProps = { documentId: string; documentName: string }

/** Takes a document out of the plan. Her ticks for it simply stop mattering. */
export function RemoveDocumentButton({ documentId, documentName }: RemoveDocumentButtonProps) {
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const onClick = () =>
    startTransition(async () => {
      setError(null)
      const result = await removeDocument(documentId)
      if (!result.ok) setError(teamErrorMessage(result.error))
    })

  return (
    <Stack gap={2} align="start">
      <Button
        type="button"
        variant="destructive"
        size="touch"
        disabled={pending}
        onClick={onClick}
        aria-label={`Tanggalin ang ${documentName}`}
      >
        {pending ? "Tinatanggal..." : "Tanggalin ang dokumento"}
      </Button>
      {error ? <small role="alert">{error}</small> : null}
    </Stack>
  )
}
