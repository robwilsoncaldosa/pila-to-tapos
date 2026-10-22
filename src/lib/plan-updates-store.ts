import type { PlanDiff } from "@/domain/plan-diff"

// The banner must outlive the moment her phone saves the new snapshot, so what changed
// is held here until she taps "Sige". A tiny external store, read with useSyncExternalStore.

let pending: PlanDiff | null = null
const listeners = new Set<() => void>()

const emit = () => listeners.forEach((listener) => listener())

export const getPlanUpdates = (): PlanDiff | null => pending

export const getServerPlanUpdates = (): PlanDiff | null => null

export const subscribePlanUpdates = (listener: () => void): (() => void) => {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

/** Adds to what is waiting to be shown (a second change before she dismisses joins the first). */
export const addPlanUpdates = (diff: PlanDiff): void => {
  pending = {
    added: [...(pending?.added ?? []), ...diff.added],
    changed: [...(pending?.changed ?? []), ...diff.changed],
  }
  emit()
}

export const dismissPlanUpdates = (): void => {
  pending = null
  emit()
}
