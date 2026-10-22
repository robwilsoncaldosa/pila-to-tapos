import type { Citation, PlanDocument, SourceId } from "@/domain/plan"
import type { DocumentFields, FeeEdit, MetaEdit, StepEdit } from "@/services/team-service"

// Parsers for what the browser sends: untrusted, so each returns null for anything that does not fit.

const SOURCE_IDS: readonly string[] = ["rmc-47-2026", "cc-28a", "rmc-84-2026"]
const ID = /^[A-Za-z0-9-]{1,64}$/

export const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value)

const text = (value: unknown, max = 4000): string | null =>
  typeof value === "string" && value.length <= max ? value : null

const optionalText = (value: unknown, max = 4000): string | undefined | null =>
  value === undefined || value === null || value === "" ? undefined : text(value, max)

export const parseId = (value: unknown): string | null =>
  typeof value === "string" && ID.test(value) ? value : null

const parseNumber = (value: unknown): number | null =>
  typeof value === "number" && Number.isFinite(value) ? value : null

const parseCitation = (value: unknown): Citation | null => {
  if (!isRecord(value)) return null
  const sourceId = text(value.sourceId, 40)
  const locator = text(value.locator, 300)
  const quote = text(value.quote, 4000)
  if (sourceId === null || !SOURCE_IDS.includes(sourceId) || locator === null || quote === null) {
    return null
  }
  return { sourceId: sourceId as SourceId, locator, quote }
}

export const parseStepEdit = (input: unknown): StepEdit | null => {
  if (!isRecord(input)) return null
  const id = parseId(input.id)
  const name = text(input.name, 300)
  const position = parseNumber(input.position)
  const citation = parseCitation(input.citation)
  const waitWorkingDays = input.waitWorkingDays === undefined ? undefined : parseNumber(input.waitWorkingDays)
  const counterLabel = optionalText(input.counterLabel, 300)
  if (!id || name === null || position === null || !citation) return null
  if (waitWorkingDays === null || counterLabel === null) return null
  return { id, name, position, waitWorkingDays, counterLabel, citation }
}

export const parseDocumentFields = (input: unknown): DocumentFields | null => {
  if (!isRecord(input)) return null
  const name = text(input.name, 300)
  const whereToGet = text(input.whereToGet, 1000)
  const explanation = text(input.explanation)
  const situationQuestion = optionalText(input.situationQuestion, 500)
  const notNeededReason = optionalText(input.notNeededReason, 1000)
  const citation = parseCitation(input.citation)
  const requirement: PlanDocument["requirement"] | null =
    input.requirement === "required" || input.requirement === "situation" ? input.requirement : null
  if (name === null || whereToGet === null || explanation === null || !citation || !requirement) {
    return null
  }
  if (situationQuestion === null || notNeededReason === null) return null
  return { name, whereToGet, requirement, situationQuestion, notNeededReason, explanation, citation }
}

export const parseFeeEdit = (input: unknown): FeeEdit | null => {
  if (!isRecord(input)) return null
  const id = parseId(input.id)
  const label = text(input.label, 300)
  const citation = parseCitation(input.citation)
  const amountPhp = input.amountPhp === null ? null : parseNumber(input.amountPhp)
  if (!id || label === null || !citation) return null
  if (input.amountPhp !== null && amountPhp === null) return null
  return { id, label, amountPhp, citation }
}

export const parseMetaEdit = (input: unknown): MetaEdit | null => {
  if (!isRecord(input)) return null
  const processingTimeLabel = text(input.processingTimeLabel, 300)
  const lastCheckedOn = text(input.lastCheckedOn, 10)
  const citation = parseCitation(input.citation)
  if (processingTimeLabel === null || lastCheckedOn === null || !citation) return null
  return { processingTimeLabel, lastCheckedOn, citation }
}
