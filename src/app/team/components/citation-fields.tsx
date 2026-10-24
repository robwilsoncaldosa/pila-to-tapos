import {
  Input,
  NativeSelect,
  NativeSelectOption,
  Stack,
  Textarea,
} from "@/components/ui"
import type { Citation, SourceInfo } from "@/domain/plan"
import { useT } from "@/i18n"

import { Field } from "./field"

type CitationFieldsProps = {
  /** Makes the control ids unique on the page. */
  idPrefix: string
  sources: SourceInfo[]
  citation?: Citation
}

/** The required citation block: which official source, which part, and the exact words. */
export function CitationFields({ idPrefix, sources, citation }: CitationFieldsProps) {
  const { t } = useT()
  return (
    <Stack asChild gap={4}>
      <fieldset>
        <legend>
          <strong>{t("team.cite.legend")}</strong>
        </legend>
        <Field htmlFor={`${idPrefix}-source`} label={t("team.cite.source")}>
          <NativeSelect
            id={`${idPrefix}-source`}
            name="sourceId"
            defaultValue={citation?.sourceId ?? sources[0]?.id}
          >
            {sources.map((source) => (
              <NativeSelectOption key={source.id} value={source.id}>
                {source.id}: {source.title}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </Field>
        <Field
          htmlFor={`${idPrefix}-locator`}
          label={t("team.cite.locator")}
          hint={t("team.cite.locatorHint")}
        >
          <Input
            id={`${idPrefix}-locator`}
            name="locator"
            defaultValue={citation?.locator ?? ""}
          />
        </Field>
        <Field
          htmlFor={`${idPrefix}-quote`}
          label={t("team.cite.quote")}
          hint={t("team.cite.quoteHint")}
        >
          <Textarea
            id={`${idPrefix}-quote`}
            name="quote"
            defaultValue={citation?.quote ?? ""}
          />
        </Field>
      </fieldset>
    </Stack>
  )
}
