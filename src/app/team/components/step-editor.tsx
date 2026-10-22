"use client"

import { saveStep } from "@/app/actions/team"
import { Card, CardContent, Input, Stack } from "@/components/ui"
import type { Counter, SourceInfo, Step } from "@/domain/plan"

import { CitationFields } from "./citation-fields"
import { Field } from "./field"
import { SaveBar } from "./save-bar"
import { citationFrom, field, useSaveForm } from "./use-save-form"

type StepEditorProps = { step: Step; counter: Counter; sources: SourceInfo[] }

/** Name, order and counter of one step, plus the working days of the waiting step. */
export function StepEditor({ step, counter, sources }: StepEditorProps) {
  const { pending, error, saved, onSubmit } = useSaveForm((data) =>
    saveStep({
      id: step.id,
      name: field(data, "name"),
      position: Number(field(data, "position")),
      ...(step.kind === "wait" ? { waitWorkingDays: Number(field(data, "waitWorkingDays")) } : {}),
      ...(step.kind === "visit" ? { counterLabel: field(data, "counterLabel") } : {}),
      citation: citationFrom(data),
    })
  )
  const id = `step-${step.id}`
  return (
    <Card>
      <CardContent>
        <Stack asChild gap={4}>
          <form onSubmit={onSubmit}>
            <h3>{step.name}</h3>
            <Field htmlFor={`${id}-name`} label="Pangalan ng hakbang">
              <Input id={`${id}-name`} name="name" defaultValue={step.name} required />
            </Field>
            <Field htmlFor={`${id}-position`} label="Pagkakasunod-sunod (1, 2, 3...)">
              <Input
                id={`${id}-position`}
                name="position"
                type="number"
                min={0}
                defaultValue={step.position}
                required
              />
            </Field>
            {step.kind === "visit" ? (
              <Field
                htmlFor={`${id}-counter`}
                label="Pangalan ng counter"
                hint="Iisang counter ito para sa lahat ng visit."
              >
                <Input
                  id={`${id}-counter`}
                  name="counterLabel"
                  defaultValue={counter.label}
                  required
                />
              </Field>
            ) : (
              <Field htmlFor={`${id}-days`} label="Ilang working days ang hintay">
                <Input
                  id={`${id}-days`}
                  name="waitWorkingDays"
                  type="number"
                  min={1}
                  defaultValue={step.waitWorkingDays}
                  required
                />
              </Field>
            )}
            <CitationFields idPrefix={id} sources={sources} citation={step.citation} />
            <SaveBar pending={pending} saved={saved} error={error} />
          </form>
        </Stack>
      </CardContent>
    </Card>
  )
}
