import "server-only"

import { readFile } from "node:fs/promises"
import path from "node:path"

import type { Plan } from "@/domain/plan"
import { err, ok } from "@/domain/result"
import type { PlanRepository } from "@/ports/plan-repository"

import { contentDir } from "./paths"

/** Reads content/plan/bir-closure.json. Saving arrives in slice 5. */
export const createFilePlanRepository = (
  planFile: string = path.join(contentDir(), "plan", "bir-closure.json")
): PlanRepository => {
  const notImplemented = async () => err("not_implemented" as const)
  return {
    getPlan: async (transactionId) => {
      try {
        const plan = JSON.parse(await readFile(/*turbopackIgnore: true*/ planFile, "utf8")) as Plan
        return plan.transaction.id === transactionId ? ok(plan) : err("not_found")
      } catch {
        return err("not_found")
      }
    },
    saveStep: notImplemented,
    saveDocument: notImplemented,
    saveFee: notImplemented,
    saveMeta: notImplemented,
  }
}
