import type { Plan, SourceInfo } from "@/domain/plan"
import { err, ok, type Result } from "@/domain/result"
import type { PlanRepository } from "@/ports/plan-repository"
import type { SourceTexts } from "@/ports/source-texts"

export const BIR_CLOSURE_TRANSACTION_ID = "bir-closure-freelancer"

export type PlanBundle = {
  plan: Plan
  sources: SourceInfo[]
}

export const createPlanService = (deps: {
  plans: PlanRepository
  sources: SourceTexts
}) => ({
  getPlan: async (): Promise<Result<PlanBundle, "plan_not_found">> => {
    const result = await deps.plans.getPlan(BIR_CLOSURE_TRANSACTION_ID)
    if (!result.ok) return err("plan_not_found")
    return ok({ plan: result.value, sources: await deps.sources.list() })
  },
})

export type PlanService = ReturnType<typeof createPlanService>
