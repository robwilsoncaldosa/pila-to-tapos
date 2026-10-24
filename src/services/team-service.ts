import { citationError } from "@/domain/citations"
import type { Citation, Fee, Plan, PlanDocument, Step } from "@/domain/plan"
import { err, ok, type Result } from "@/domain/result"
import type { Ids } from "@/ports/ids"
import type { PlanRepository } from "@/ports/plan-repository"
import type { SourceTexts } from "@/ports/source-texts"
import type { TeamAccess } from "@/ports/team-access"

import { BIR_CLOSURE_TRANSACTION_ID } from "./plan-service"

export type TeamSaveError =
  | "invalid_input"
  | "not_found"
  | "citation_required"
  | "quote_not_in_source"

export type UnlockError = "not_configured" | "wrong_passcode"

export type StepEdit = {
  id: string
  name: string
  position: number
  /** Only the waiting step has one. */
  waitWorkingDays?: number
  /** Only a visit step shows it; it renames the counter every visit uses. */
  counterLabel?: string
  citation: Citation
}

export type DocumentFields = {
  name: string
  whereToGet: string
  requirement: PlanDocument["requirement"]
  situationQuestion?: string
  notNeededReason?: string
  explanation: string
  citation: Citation
}

export type DocumentEdit = DocumentFields & { id: string }

export type FeeEdit = { id: string; label: string; amountPhp: number | null; citation: Citation }

export type MetaEdit = { processingTimeLabel: string; lastCheckedOn: string; citation: Citation }

const DATE = /^\d{4}-\d{2}-\d{2}$/

const filled = (text: string | undefined): text is string => !!text && text.trim().length > 0

const whole = (n: number): boolean => Number.isInteger(n) && n >= 0

export const createTeamService = (deps: {
  plans: PlanRepository
  sources: SourceTexts
  access: TeamAccess
  ids: Ids
}) => {
  const transactionId = BIR_CLOSURE_TRANSACTION_ID

  /** "No citation, no save": present, and quoted word for word from the cited source. */
  const checkCitation = async (citation: Citation | undefined): Promise<TeamSaveError | null> => {
    const text = citation?.sourceId ? await deps.sources.get(citation.sourceId) : null
    return citationError(citation, text)
  }

  const currentPlan = async (): Promise<Plan | null> => {
    const result = await deps.plans.getPlan(transactionId)
    return result.ok ? result.value : null
  }

  /** Validates the document fields shared by edit and add; returns the document without id/position/revision. */
  const documentFields = (edit: DocumentFields) => {
    if (!filled(edit.name) || !filled(edit.whereToGet) || !filled(edit.explanation)) return null
    const situation = edit.requirement === "situation"
    if (situation && (!filled(edit.situationQuestion) || !filled(edit.notNeededReason))) return null
    return {
      name: edit.name.trim(),
      whereToGet: edit.whereToGet.trim(),
      requirement: edit.requirement,
      ...(situation
        ? {
            situationQuestion: edit.situationQuestion?.trim(),
            notNeededReason: edit.notNeededReason?.trim(),
          }
        : {}),
      explanation: edit.explanation.trim(),
      citation: edit.citation,
    }
  }

  return {
    isConfigured: () => deps.access.isConfigured(),
    isAuthorized: (token: string | undefined) => deps.access.verifyToken(token),

    checkPasscode: (input: string): Result<{ token: string; maxAgeSeconds: number }, UnlockError> => {
      if (!deps.access.isConfigured()) return err("not_configured")
      if (!deps.access.matchesPasscode(input)) return err("wrong_passcode")
      return ok(deps.access.issueToken())
    },

    saveStep: async (edit: StepEdit): Promise<Result<Plan, TeamSaveError>> => {
      if (!filled(edit.name) || !whole(edit.position)) return err("invalid_input")
      const plan = await currentPlan()
      const step = plan?.steps.find((s) => s.id === edit.id)
      if (!plan || !step) return err("not_found")
      if (step.kind === "wait" && !(Number.isInteger(edit.waitWorkingDays) && edit.waitWorkingDays! > 0)) {
        return err("invalid_input")
      }
      if (edit.counterLabel !== undefined && !filled(edit.counterLabel)) return err("invalid_input")
      const failure = await checkCitation(edit.citation)
      if (failure) return err(failure)
      const next: Step = {
        ...step,
        name: edit.name.trim(),
        position: edit.position,
        ...(step.kind === "wait" ? { waitWorkingDays: edit.waitWorkingDays } : {}),
        citation: edit.citation,
      }
      return deps.plans.saveStep(transactionId, next, edit.counterLabel?.trim())
    },

    saveDocument: async (edit: DocumentEdit): Promise<Result<Plan, TeamSaveError>> => {
      const fields = documentFields(edit)
      if (!fields) return err("invalid_input")
      const plan = await currentPlan()
      const existing = plan?.documents.find((d) => d.id === edit.id)
      if (!existing) return err("not_found")
      const failure = await checkCitation(edit.citation)
      if (failure) return err(failure)
      return deps.plans.saveDocument(transactionId, {
        id: existing.id,
        position: existing.position,
        revision: existing.revision,
        ...(existing.en ? { en: existing.en } : {}),
        ...fields,
      })
    },

    saveFee: async (edit: FeeEdit): Promise<Result<Plan, TeamSaveError>> => {
      if (!filled(edit.label)) return err("invalid_input")
      if (edit.amountPhp !== null && !(Number.isFinite(edit.amountPhp) && edit.amountPhp >= 0)) {
        return err("invalid_input")
      }
      const plan = await currentPlan()
      const fee = plan?.fees.find((f) => f.id === edit.id)
      if (!fee) return err("not_found")
      const failure = await checkCitation(edit.citation)
      if (failure) return err(failure)
      const next: Fee = {
        ...fee,
        label: edit.label.trim(),
        amountPhp: edit.amountPhp,
        citation: edit.citation,
      }
      return deps.plans.saveFee(transactionId, next)
    },

    saveMeta: async (edit: MetaEdit): Promise<Result<Plan, TeamSaveError>> => {
      if (!filled(edit.processingTimeLabel) || !DATE.test(edit.lastCheckedOn)) {
        return err("invalid_input")
      }
      const failure = await checkCitation(edit.citation)
      if (failure) return err(failure)
      return deps.plans.saveMeta(transactionId, {
        processingTimeLabel: edit.processingTimeLabel.trim(),
        lastCheckedOn: edit.lastCheckedOn,
        processingCitation: edit.citation,
      })
    },

    addDocument: async (edit: DocumentFields): Promise<Result<Plan, TeamSaveError>> => {
      const fields = documentFields(edit)
      if (!fields) return err("invalid_input")
      const plan = await currentPlan()
      if (!plan) return err("not_found")
      const failure = await checkCitation(edit.citation)
      if (failure) return err(failure)
      const last = plan.documents.reduce((max, d) => Math.max(max, d.position), 0)
      return deps.plans.addDocument(transactionId, {
        id: `doc-${deps.ids.uuid().slice(0, 8)}`,
        position: last + 1,
        revision: 1,
        ...fields,
      })
    },

    removeDocument: async (documentId: string): Promise<Result<Plan, TeamSaveError>> =>
      deps.plans.removeDocument(transactionId, documentId),
  }
}

export type TeamService = ReturnType<typeof createTeamService>
