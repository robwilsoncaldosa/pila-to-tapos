"use client"

import { saveFee } from "@/app/actions/team"
import { Card, CardContent, Input, Stack } from "@/components/ui"
import type { Fee, SourceInfo } from "@/domain/plan"
import { useT } from "@/i18n"

import { CitationFields } from "./citation-fields"
import { Field } from "./field"
import { SaveBar } from "./save-bar"
import { citationFrom, field, useSaveForm } from "./use-save-form"

type FeeEditorProps = { fee: Fee; sources: SourceInfo[] }

/** A fee's label and amount. A blank amount means the official source lists none. */
export function FeeEditor({ fee, sources }: FeeEditorProps) {
  const { t } = useT()
  const { pending, error, saved, onSubmit } = useSaveForm((data) => {
    const amount = field(data, "amountPhp").trim()
    return saveFee({
      id: fee.id,
      label: field(data, "label"),
      amountPhp: amount === "" ? null : Number(amount),
      citation: citationFrom(data),
    })
  })
  const id = `fee-${fee.id}`
  return (
    <Card>
      <CardContent>
        <Stack asChild gap={4}>
          <form onSubmit={onSubmit}>
            <h3>{fee.label}</h3>
            <Field htmlFor={`${id}-label`} label={t("team.fee.label")}>
              <Input id={`${id}-label`} name="label" defaultValue={fee.label} required />
            </Field>
            <Field
              htmlFor={`${id}-amount`}
              label={t("team.fee.amount")}
              hint={t("team.fee.amountHint")}
            >
              <Input
                id={`${id}-amount`}
                name="amountPhp"
                type="number"
                min={0}
                step="any"
                defaultValue={fee.amountPhp ?? ""}
              />
            </Field>
            <CitationFields idPrefix={id} sources={sources} citation={fee.citation} />
            <SaveBar pending={pending} saved={saved} error={error} />
          </form>
        </Stack>
      </CardContent>
    </Card>
  )
}
