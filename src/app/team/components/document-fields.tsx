import {
  Input,
  NativeSelect,
  NativeSelectOption,
  Stack,
  Textarea,
} from "@/components/ui"
import type { PlanDocument, SourceInfo } from "@/domain/plan"

import { CitationFields } from "./citation-fields"
import { Field } from "./field"
import { citationFrom, field } from "./use-save-form"

type DocumentFieldsProps = {
  idPrefix: string
  sources: SourceInfo[]
  document?: PlanDocument
}

/** Reads the document form into what the document actions expect. */
export const documentInput = (data: FormData) => ({
  name: field(data, "name"),
  whereToGet: field(data, "whereToGet"),
  requirement: field(data, "requirement"),
  situationQuestion: field(data, "situationQuestion"),
  notNeededReason: field(data, "notNeededReason"),
  explanation: field(data, "explanation"),
  citation: citationFrom(data),
})

/** The fields shared by editing a document and adding a new one. */
export function DocumentFields({ idPrefix, sources, document }: DocumentFieldsProps) {
  return (
    <Stack gap={4}>
      <Field htmlFor={`${idPrefix}-name`} label="Pangalan ng dokumento">
        <Input id={`${idPrefix}-name`} name="name" defaultValue={document?.name} required />
      </Field>
      <Field htmlFor={`${idPrefix}-where`} label="Saan kukuha">
        <Input
          id={`${idPrefix}-where`}
          name="whereToGet"
          defaultValue={document?.whereToGet}
          required
        />
      </Field>
      <Field htmlFor={`${idPrefix}-requirement`} label="Kailangan ba ito ng lahat?">
        <NativeSelect
          id={`${idPrefix}-requirement`}
          name="requirement"
          defaultValue={document?.requirement ?? "required"}
        >
          <NativeSelectOption value="required">Required: kailangan ng lahat</NativeSelectOption>
          <NativeSelectOption value="situation">
            Situation: depende sa sitwasyon niya
          </NativeSelectOption>
        </NativeSelect>
      </Field>
      <Field
        htmlFor={`${idPrefix}-question`}
        label="Tanong sa kanya (para sa situation lang)"
        hint="Isang tanong na sinasagot niya ng Oo, Hindi, o Hindi ko alam."
      >
        <Input
          id={`${idPrefix}-question`}
          name="situationQuestion"
          defaultValue={document?.situationQuestion}
        />
      </Field>
      <Field
        htmlFor={`${idPrefix}-reason`}
        label="Bakit hindi kailangan kapag Hindi ang sagot (para sa situation lang)"
      >
        <Textarea
          id={`${idPrefix}-reason`}
          name="notNeededReason"
          defaultValue={document?.notNeededReason}
        />
      </Field>
      <Field htmlFor={`${idPrefix}-explanation`} label="Paliwanag (lumalabas sa ?)">
        <Textarea
          id={`${idPrefix}-explanation`}
          name="explanation"
          defaultValue={document?.explanation}
          required
        />
      </Field>
      <CitationFields idPrefix={idPrefix} sources={sources} citation={document?.citation} />
    </Stack>
  )
}
