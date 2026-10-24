"use client"

import { useState, useTransition, type FormEvent } from "react"

import type { TeamActionError } from "@/app/actions/team"
import type { Result } from "@/domain/result"
import { useT } from "@/i18n"

import { teamErrorKey } from "./team-errors"

type SaveOptions = { resetOnSuccess?: boolean }

/** Submits a form's fields to a team server action and tracks pending, saved and the inline error. */
export function useSaveForm(
  save: (data: FormData) => Promise<Result<null, TeamActionError>>,
  { resetOnSuccess = false }: SaveOptions = {}
) {
  const { t } = useT()
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    setSaved(false)
    setError(null)
    startTransition(async () => {
      const result = await save(data)
      if (result.ok) {
        setSaved(true)
        if (resetOnSuccess) form.reset()
      } else {
        setError(t(teamErrorKey(result.error)))
      }
    })
  }

  return { pending, error, saved, onSubmit }
}

export const field = (data: FormData, name: string): string => {
  const value = data.get(name)
  return typeof value === "string" ? value : ""
}

export const citationFrom = (data: FormData) => ({
  sourceId: field(data, "sourceId"),
  locator: field(data, "locator"),
  quote: field(data, "quote"),
})
