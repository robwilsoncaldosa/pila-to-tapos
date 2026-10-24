"use client"

import { saveMeta } from "@/app/actions/team"
import { Card, CardContent, Input, Stack } from "@/components/ui"
import type { SourceInfo, Transaction } from "@/domain/plan"
import { useT } from "@/i18n"

import { CitationFields } from "./citation-fields"
import { Field } from "./field"
import { SaveBar } from "./save-bar"
import { citationFrom, field, useSaveForm } from "./use-save-form"

type MetaEditorProps = { transaction: Transaction; sources: SourceInfo[] }

/** The processing time and the "last checked" date that customers see. */
export function MetaEditor({ transaction, sources }: MetaEditorProps) {
  const { t } = useT()
  const { pending, error, saved, onSubmit } = useSaveForm((data) =>
    saveMeta({
      processingTimeLabel: field(data, "processingTimeLabel"),
      lastCheckedOn: field(data, "lastCheckedOn"),
      citation: citationFrom(data),
    })
  )
  return (
    <Card>
      <CardContent>
        <Stack asChild gap={4}>
          <form onSubmit={onSubmit}>
            <Field htmlFor="meta-time" label={t("team.meta.time")}>
              <Input
                id="meta-time"
                name="processingTimeLabel"
                defaultValue={transaction.processingTimeLabel}
                required
              />
            </Field>
            <Field htmlFor="meta-checked" label={t("team.meta.checked")}>
              <Input
                id="meta-checked"
                name="lastCheckedOn"
                type="date"
                defaultValue={transaction.lastCheckedOn}
                required
              />
            </Field>
            <CitationFields
              idPrefix="meta"
              sources={sources}
              citation={transaction.processingCitation}
            />
            <SaveBar pending={pending} saved={saved} error={error} />
          </form>
        </Stack>
      </CardContent>
    </Card>
  )
}
