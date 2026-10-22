import type { Fee, Plan, PlanDocument, Step, Transaction } from "@/domain/plan"
import type { Result } from "@/domain/result"

export type PlanReadError = "not_found"
export type PlanWriteError =
  | "not_found"
  | "citation_required"
  | "quote_not_in_source"
  | "not_implemented"

export type PlanRepository = {
  getPlan: (transactionId: string) => Promise<Result<Plan, PlanReadError>>
  saveStep: (transactionId: string, step: Step) => Promise<Result<Plan, PlanWriteError>>
  saveDocument: (
    transactionId: string,
    document: PlanDocument
  ) => Promise<Result<Plan, PlanWriteError>>
  saveFee: (transactionId: string, fee: Fee) => Promise<Result<Plan, PlanWriteError>>
  saveMeta: (
    transactionId: string,
    meta: Pick<Transaction, "processingTimeLabel" | "processingCitation" | "lastCheckedOn">
  ) => Promise<Result<Plan, PlanWriteError>>
}
