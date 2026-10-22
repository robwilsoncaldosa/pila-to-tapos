"use client"

import { useEffect, useSyncExternalStore } from "react"

import type { Plan } from "@/domain/plan"
import { diffPlan, isFirstVisit, sameSnapshot, snapshotOf } from "@/domain/plan-diff"
import { getPhoneState, recordSeenPlan } from "@/lib/phone-storage"
import {
  addPlanUpdates,
  dismissPlanUpdates,
  getPlanUpdates,
  getServerPlanUpdates,
  subscribePlanUpdates,
} from "@/lib/plan-updates-store"

/**
 * Compares the plan she is looking at with the revisions her phone last saw. Once per change it
 * queues what is new or changed (so the banner can show it), drops the ticks of changed documents,
 * and saves the new snapshot. Her first visit just saves the snapshot, quietly.
 */
export function usePlanUpdates(plan: Plan) {
  const updates = useSyncExternalStore(subscribePlanUpdates, getPlanUpdates, getServerPlanUpdates)

  useEffect(() => {
    const { seen } = getPhoneState()
    const snapshot = snapshotOf(plan)
    if (sameSnapshot(seen, snapshot)) return
    const diff = diffPlan(seen, plan)
    const changedDocuments = [...diff.added, ...diff.changed].filter((id) =>
      plan.documents.some((doc) => doc.id === id)
    )
    recordSeenPlan(snapshot, changedDocuments)
    if (!isFirstVisit(seen) && (diff.added.length > 0 || diff.changed.length > 0)) {
      addPlanUpdates(diff)
    }
  }, [plan])

  return { updates, dismiss: dismissPlanUpdates }
}
