import type { Fee, Plan, PlanDocument, Step, Transaction } from "@/domain/plan"
import type { Result } from "@/domain/result"

export type PlanReadError = "not_found"
export type PlanWriteError = "not_found" | "citation_required"

export type PlanMeta = Pick<
  Transaction,
  "processingTimeLabel" | "processingCitation" | "lastCheckedOn"
>

/**
 * Every save replaces one item, bumps that item's revision and the transaction's revision,
 * and returns the whole plan as stored.
 */
export type PlanRepository = {
  getPlan: (transactionId: string) => Promise<Result<Plan, PlanReadError>>
  /** `counterLabel`, when given, also renames the counter the visit steps use. */
  saveStep: (
    transactionId: string,
    step: Step,
    counterLabel?: string
  ) => Promise<Result<Plan, PlanWriteError>>
  saveDocument: (
    transactionId: string,
    document: PlanDocument
  ) => Promise<Result<Plan, PlanWriteError>>
  saveFee: (transactionId: string, fee: Fee) => Promise<Result<Plan, PlanWriteError>>
  saveMeta: (transactionId: string, meta: PlanMeta) => Promise<Result<Plan, PlanWriteError>>
  /** Appends a new document (its revision starts at 1). */
  addDocument: (
    transactionId: string,
    document: PlanDocument
  ) => Promise<Result<Plan, PlanWriteError>>
  removeDocument: (
    transactionId: string,
    documentId: string
  ) => Promise<Result<Plan, PlanWriteError>>
}
