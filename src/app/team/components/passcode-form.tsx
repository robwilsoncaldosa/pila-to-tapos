"use client"

import { useState, useTransition, type FormEvent } from "react"

import { unlockTeam } from "@/app/actions/team"
import {
  Alert,
  AlertDescription,
  Button,
  Input,
  Stack,
} from "@/components/ui"
import { useT } from "@/i18n"

import { Field } from "./field"

/** The only thing /team shows until the passcode is right. */
export function PasscodeForm() {
  const { t } = useT()
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const passcode = String(new FormData(event.currentTarget).get("passcode") ?? "")
    setError(null)
    startTransition(async () => {
      const result = await unlockTeam(passcode)
      if (!result.ok) {
        setError(
          result.error === "not_configured"
            ? t("team.notConfiguredTitle")
            : t("team.wrongPasscode")
        )
      }
    })
  }

  return (
    <Stack asChild gap={4}>
      <form onSubmit={onSubmit}>
        <h1>{t("team.title")}</h1>
        <Field htmlFor="passcode" label={t("team.passcode")}>
          <Input id="passcode" name="passcode" type="password" autoComplete="off" required />
        </Field>
        {error ? (
          <Alert variant="missing">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}
        <Button type="submit" size="touch" disabled={pending}>
          {t("team.open")}
        </Button>
      </form>
    </Stack>
  )
}
