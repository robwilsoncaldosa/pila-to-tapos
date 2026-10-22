import "server-only"

import { readFile, rename, writeFile } from "node:fs/promises"
import path from "node:path"

import type { Citation, Plan } from "@/domain/plan"
import { err, ok, type Result } from "@/domain/result"
import type { PlanRepository, PlanWriteError } from "@/ports/plan-repository"

import { contentDir } from "./paths"

const hasCitation = (citation: Citation | undefined): boolean =>
  !!citation?.sourceId && !!citation.locator?.trim() && !!citation.quote?.trim()

/**
 * Reads and writes content/plan/bir-closure.json. Reads are never cached, so /plan sees a save on its
 * next load. Writes go to a temp file in the same folder and are renamed into place, so a crash cannot
 * leave half a file, and they run one at a time so two saves cannot overwrite each other.
 */
export const createFilePlanRepository = (
  planFile: string = path.join(contentDir(), "plan", "bir-closure.json")
): PlanRepository => {
  const readPlan = async (): Promise<Plan | null> => {
    try {
      return JSON.parse(await readFile(/*turbopackIgnore: true*/ planFile, "utf8")) as Plan
    } catch {
      return null
    }
  }

  const writePlan = async (plan: Plan): Promise<void> => {
    const temp = `${planFile}.${process.pid}.${Date.now()}.tmp`
    await writeFile(/*turbopackIgnore: true*/ temp, `${JSON.stringify(plan, null, 2)}\n`, "utf8")
    await rename(/*turbopackIgnore: true*/ temp, /*turbopackIgnore: true*/ planFile)
  }

  let queue: Promise<unknown> = Promise.resolve()

  /** Applies one change to the stored plan, bumps the transaction revision, writes it atomically. */
  const update = (
    transactionId: string,
    change: (plan: Plan) => PlanWriteError | null
  ): Promise<Result<Plan, PlanWriteError>> => {
    const run = async (): Promise<Result<Plan, PlanWriteError>> => {
      const plan = await readPlan()
      if (!plan || plan.transaction.id !== transactionId) return err("not_found")
      const failure = change(plan)
      if (failure) return err(failure)
      plan.transaction.revision += 1
      await writePlan(plan)
      return ok(plan)
    }
    const result = queue.then(run, run)
    queue = result.catch(() => undefined)
    return result
  }

  return {
    getPlan: async (transactionId) => {
      const plan = await readPlan()
      return plan && plan.transaction.id === transactionId ? ok(plan) : err("not_found")
    },
    saveStep: (transactionId, step, counterLabel) =>
      update(transactionId, (plan) => {
        const i = plan.steps.findIndex((s) => s.id === step.id)
        if (i < 0) return "not_found"
        if (!hasCitation(step.citation)) return "citation_required"
        plan.steps[i] = { ...step, revision: plan.steps[i].revision + 1 }
        if (counterLabel) plan.counter.label = counterLabel
        return null
      }),
    saveDocument: (transactionId, document) =>
      update(transactionId, (plan) => {
        const i = plan.documents.findIndex((d) => d.id === document.id)
        if (i < 0) return "not_found"
        if (!hasCitation(document.citation)) return "citation_required"
        plan.documents[i] = { ...document, revision: plan.documents[i].revision + 1 }
        return null
      }),
    saveFee: (transactionId, fee) =>
      update(transactionId, (plan) => {
        const i = plan.fees.findIndex((f) => f.id === fee.id)
        if (i < 0) return "not_found"
        if (!hasCitation(fee.citation)) return "citation_required"
        plan.fees[i] = { ...fee, revision: plan.fees[i].revision + 1 }
        return null
      }),
    saveMeta: (transactionId, meta) =>
      update(transactionId, (plan) => {
        if (!hasCitation(meta.processingCitation)) return "citation_required"
        plan.transaction = {
          ...plan.transaction,
          ...meta,
          metaRevision: (plan.transaction.metaRevision ?? 1) + 1,
        }
        return null
      }),
    addDocument: (transactionId, document) =>
      update(transactionId, (plan) => {
        if (!hasCitation(document.citation)) return "citation_required"
        plan.documents.push({ ...document, revision: 1 })
        return null
      }),
    removeDocument: (transactionId, documentId) =>
      update(transactionId, (plan) => {
        if (!plan.documents.some((d) => d.id === documentId)) return "not_found"
        plan.documents = plan.documents.filter((d) => d.id !== documentId)
        return null
      }),
  }
}
