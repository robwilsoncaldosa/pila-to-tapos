export type SourceId = "rmc-47-2026" | "cc-28a" | "rmc-84-2026"

export type Citation = {
  sourceId: SourceId
  locator: string
  /** Must appear word for word in content/sources/<sourceId>.txt. */
  quote: string
}

export type SituationAnswer = "oo" | "hindi" | "hindi_ko_alam"

export type SourceInfo = {
  id: SourceId
  title: string
  url: string
  effectiveDate: string
  note: string
}

export type Transaction = {
  id: string
  title: string
  processingTimeLabel: string
  processingCitation: Citation
  lastCheckedOn: string
  /** Bumps on every saved edit; her phone compares it with what she last saw. */
  revision: number
  /** The processing time and "last checked" date as one item; absent until first edited (counts as 1). */
  metaRevision?: number
  /** English versions of the user-facing text. Citation quotes are never translated. */
  en?: { title?: string; processingTimeLabel?: string }
}

export type Counter = {
  id: string
  label: string
  speechLabel: string
}

/** A note shown on a step only when the situation calls for it (e.g. unfiled returns). */
export type StepNotice = {
  id: string
  kind: "warning" | "related"
  text: string
  citations: Citation[]
  en?: { text?: string }
}

export type Step = {
  id: string
  position: number
  name: string
  kind: "visit" | "wait"
  visitNo?: 1 | 2
  waitWorkingDays?: number
  citation: Citation
  /** Shown when the unfiled-returns answer is Oo or Hindi ko alam. */
  notices?: StepNotice[]
  revision: number
  en?: { name?: string }
}

export type PlanDocument = {
  id: string
  position: number
  name: string
  whereToGet: string
  requirement: "required" | "situation"
  situationQuestion?: string
  notNeededReason?: string
  explanation: string
  citation: Citation
  revision: number
  en?: Partial<
    Pick<
      PlanDocument,
      "name" | "whereToGet" | "situationQuestion" | "notNeededReason" | "explanation"
    >
  >
}

export type Fee = {
  id: string
  label: string
  amountPhp: number | null
  visitNo: 1 | 2
  citation: Citation
  revision: number
  en?: { label?: string }
}

export type Question = {
  id: string
  question: string
  kind: "direct" | "not_in_source"
  answer: string
  citations: Citation[]
  related?: Citation[]
  whoToAsk?: string
  en?: { question?: string; answer?: string; whoToAsk?: string }
}

export type Plan = {
  transaction: Transaction
  counter: Counter
  steps: Step[]
  documents: PlanDocument[]
  fees: Fee[]
  questions: Question[]
}

/** The situation document whose answer drives the path warning. */
export const UNFILED_RETURNS_DOC_ID = "final-returns"

export type FeeSummary = {
  /** Sum of the fees that have an official amount, or null when none has one. */
  totalPhp: number | null
  /** Fees with no official amount (shown as "no official amount listed"). */
  unlisted: Fee[]
}

export const summarizeFees = (fees: Fee[]): FeeSummary => {
  const known = fees.filter((fee) => fee.amountPhp !== null)
  return {
    totalPhp:
      known.length === 0
        ? null
        : known.reduce((sum, fee) => sum + (fee.amountPhp ?? 0), 0),
    unlisted: fees.filter((fee) => fee.amountPhp === null),
  }
}

export const sortByPosition = <T extends { position: number }>(items: T[]): T[] =>
  [...items].sort((a, b) => a.position - b.position)

/** What she brings for a visit: the sum of its fees with an official amount, or null when none has one. */
export const feeForVisit = (fees: Fee[], visitNo: 1 | 2): number | null =>
  summarizeFees(fees.filter((fee) => fee.visitNo === visitNo)).totalPhp
