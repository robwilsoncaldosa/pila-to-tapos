import { Stack } from "@/components/ui"
import { sortByPosition } from "@/domain/plan"
import type { PlanBundle } from "@/services/plan-service"

import { AddDocument } from "./add-document"
import { DocumentEditor } from "./document-editor"
import { FeeEditor } from "./fee-editor"
import { MetaEditor } from "./meta-editor"
import { StepEditor } from "./step-editor"

/** Every editable part of the one plan, each with its own citation and Save. */
export function TeamScreen({ plan, sources }: PlanBundle) {
  return (
    <Stack gap={10}>
      <Stack gap={2}>
        <h1>Team: i-edit ang plan</h1>
        <p>
          Hindi ito makikita ng customer. Bawat save ay kailangan ng citation: ang source, ang
          bahagi, at ang quote na salita-por-salita mula sa opisyal na source. Lalabas ang mga
          pagbabago sa susunod na bukas ng plan nila.
        </p>
      </Stack>
      <Stack gap={4}>
        <h2>Oras at petsa</h2>
        <MetaEditor transaction={plan.transaction} sources={sources} />
      </Stack>
      <Stack gap={4}>
        <h2>Mga hakbang</h2>
        {sortByPosition(plan.steps).map((step) => (
          <StepEditor key={step.id} step={step} counter={plan.counter} sources={sources} />
        ))}
      </Stack>
      <Stack gap={4}>
        <h2>Mga dokumento</h2>
        {sortByPosition(plan.documents).map((document) => (
          <DocumentEditor key={document.id} document={document} sources={sources} />
        ))}
        <AddDocument sources={sources} />
      </Stack>
      <Stack gap={4}>
        <h2>Mga bayad</h2>
        {plan.fees.map((fee) => (
          <FeeEditor key={fee.id} fee={fee} sources={sources} />
        ))}
      </Stack>
      <small data-tone="muted">
        Ang mga tanong at sagot ay sa data file pa rin inieedit, hindi dito.
      </small>
    </Stack>
  )
}
