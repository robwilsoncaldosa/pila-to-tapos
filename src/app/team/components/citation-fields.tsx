import {
  Input,
  NativeSelect,
  NativeSelectOption,
  Stack,
  Textarea,
} from "@/components/ui"
import type { Citation, SourceInfo } from "@/domain/plan"

import { Field } from "./field"

type CitationFieldsProps = {
  /** Makes the control ids unique on the page. */
  idPrefix: string
  sources: SourceInfo[]
  citation?: Citation
}

/** The required citation block: which official source, which part, and the exact words. */
export function CitationFields({ idPrefix, sources, citation }: CitationFieldsProps) {
  return (
    <Stack asChild gap={4}>
      <fieldset>
        <legend>
          <strong>Citation (kailangan, hindi mase-save kung wala)</strong>
        </legend>
        <Field htmlFor={`${idPrefix}-source`} label="Source">
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
          label="Aling bahagi"
          hint='Halimbawa: "Sec. 4(1)" o "28-A, Client step 1".'
        >
          <Input
            id={`${idPrefix}-locator`}
            name="locator"
            defaultValue={citation?.locator ?? ""}
          />
        </Field>
        <Field
          htmlFor={`${idPrefix}-quote`}
          label="Quote"
          hint="Dapat salita-por-salita itong nasa opisyal na source."
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
