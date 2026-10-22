import type { Ticks } from "./checklist"
import type { Plan } from "./plan"

/** What her phone remembers of the plan: each item's revision at her last visit. */
export type SeenSnapshot = { revision: number; items: Record<string, number> }

export type PlanDiff = { added: string[]; changed: string[] }

/** The id the processing time and "last checked" date share in a snapshot. */
export const META_ITEM_ID = "meta"

export const EMPTY_SEEN: SeenSnapshot = { revision: 0, items: {} }

/** Every item's current revision, keyed by id (steps, documents, fees, and the transaction meta). */
export const snapshotOf = (plan: Plan): SeenSnapshot => {
  const items: Record<string, number> = {
    [META_ITEM_ID]: plan.transaction.metaRevision ?? 1,
  }
  for (const step of plan.steps) items[step.id] = step.revision
  for (const doc of plan.documents) items[doc.id] = doc.revision
  for (const fee of plan.fees) items[fee.id] = fee.revision
  return { revision: plan.transaction.revision, items }
}

/** True when her phone has never recorded the plan, so the first visit is not an "update". */
export const isFirstVisit = (seen: SeenSnapshot): boolean =>
  seen.revision === 0 && Object.keys(seen.items).length === 0

/** Items that are new, or whose revision moved, since her last visit. Removed items are not listed. */
export const diffPlan = (seen: SeenSnapshot, plan: Plan): PlanDiff => {
  if (isFirstVisit(seen)) return { added: [], changed: [] }
  const added: string[] = []
  const changed: string[] = []
  for (const [id, revision] of Object.entries(snapshotOf(plan).items)) {
    const before = seen.items[id]
    if (before === undefined) added.push(id)
    else if (before !== revision) changed.push(id)
  }
  return { added, changed }
}

/** Her ticks without the documents that changed; new documents were never ticked, so they stay open. */
export const dropChangedTicks = (ticks: Ticks, changed: string[]): Ticks => {
  const kept: Ticks = {}
  for (const [id, ticked] of Object.entries(ticks)) {
    if (!changed.includes(id)) kept[id] = ticked
  }
  return kept
}

/** True when the snapshot already records exactly these revisions. */
export const sameSnapshot = (a: SeenSnapshot, b: SeenSnapshot): boolean => {
  const ids = Object.keys(a.items)
  return (
    a.revision === b.revision &&
    ids.length === Object.keys(b.items).length &&
    ids.every((id) => a.items[id] === b.items[id])
  )
}

/** What to call each item in the "Na-update" banner. */
export const itemNames = (plan: Plan): Record<string, string> => {
  const names: Record<string, string> = { [META_ITEM_ID]: "Oras ng proseso at petsa ng huling check" }
  for (const step of plan.steps) names[step.id] = step.name
  for (const doc of plan.documents) names[doc.id] = doc.name
  for (const fee of plan.fees) names[fee.id] = fee.label
  return names
}
