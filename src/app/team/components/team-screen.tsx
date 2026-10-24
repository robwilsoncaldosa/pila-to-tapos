import { Stack } from "@/components/ui"
import { sortByPosition } from "@/domain/plan"
import { getT } from "@/i18n/server"
import type { PlanBundle } from "@/services/plan-service"

import { AddDocument } from "./add-document"
import { DocumentEditor } from "./document-editor"
import { FeeEditor } from "./fee-editor"
import { MetaEditor } from "./meta-editor"
import { StepEditor } from "./step-editor"

/**
 * Every editable part of the one plan, each with its own citation and Save. The team edits the
 * Filipino text; the English versions are edited in the plan's data file.
 */
export async function TeamScreen({ plan, sources }: PlanBundle) {
  const { t } = await getT()
  return (
    <Stack gap={10}>
      <Stack gap={2}>
        <h1>{t("team.heading")}</h1>
        <p>{t("team.intro")}</p>
      </Stack>
      <Stack gap={4}>
        <h2>{t("team.metaHeading")}</h2>
        <MetaEditor transaction={plan.transaction} sources={sources} />
      </Stack>
      <Stack gap={4}>
        <h2>{t("team.stepsHeading")}</h2>
        {sortByPosition(plan.steps).map((step) => (
          <StepEditor key={step.id} step={step} counter={plan.counter} sources={sources} />
        ))}
      </Stack>
      <Stack gap={4}>
        <h2>{t("team.docsHeading")}</h2>
        {sortByPosition(plan.documents).map((document) => (
          <DocumentEditor key={document.id} document={document} sources={sources} />
        ))}
        <AddDocument sources={sources} />
      </Stack>
      <Stack gap={4}>
        <h2>{t("team.feesHeading")}</h2>
        {plan.fees.map((fee) => (
          <FeeEditor key={fee.id} fee={fee} sources={sources} />
        ))}
      </Stack>
      <Stack gap={1}>
        <small data-tone="muted">{t("team.questionsNote")}</small>
        <small data-tone="muted">{t("team.englishNote")}</small>
      </Stack>
    </Stack>
  )
}
