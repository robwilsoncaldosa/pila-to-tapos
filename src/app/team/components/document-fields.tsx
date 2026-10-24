import {
  Input,
  NativeSelect,
  NativeSelectOption,
  Stack,
  Textarea,
} from "@/components/ui"
import type { PlanDocument, SourceInfo } from "@/domain/plan"
import { useT } from "@/i18n"

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
  const { t } = useT()
  return (
    <Stack gap={4}>
      <Field htmlFor={`${idPrefix}-name`} label={t("team.doc.name")}>
        <Input id={`${idPrefix}-name`} name="name" defaultValue={document?.name} required />
      </Field>
      <Field htmlFor={`${idPrefix}-where`} label={t("team.doc.where")}>
        <Input
          id={`${idPrefix}-where`}
          name="whereToGet"
          defaultValue={document?.whereToGet}
          required
        />
      </Field>
      <Field htmlFor={`${idPrefix}-requirement`} label={t("team.doc.requirement")}>
        <NativeSelect
          id={`${idPrefix}-requirement`}
          name="requirement"
          defaultValue={document?.requirement ?? "required"}
        >
          <NativeSelectOption value="required">{t("team.doc.required")}</NativeSelectOption>
          <NativeSelectOption value="situation">{t("team.doc.situation")}</NativeSelectOption>
        </NativeSelect>
      </Field>
      <Field
        htmlFor={`${idPrefix}-question`}
        label={t("team.doc.question")}
        hint={t("team.doc.questionHint")}
      >
        <Input
          id={`${idPrefix}-question`}
          name="situationQuestion"
          defaultValue={document?.situationQuestion}
        />
      </Field>
      <Field
        htmlFor={`${idPrefix}-reason`}
        label={t("team.doc.reason")}
      >
        <Textarea
          id={`${idPrefix}-reason`}
          name="notNeededReason"
          defaultValue={document?.notNeededReason}
        />
      </Field>
      <Field htmlFor={`${idPrefix}-explanation`} label={t("team.doc.explanation")}>
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
