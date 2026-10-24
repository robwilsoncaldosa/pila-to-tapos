import type { Locale } from "./locale"
import type { Plan } from "./plan"

type WithEnglish = { en?: Partial<Record<string, string>> }

/** The item with its English strings swapped in; any field without an English text stays Filipino. */
const english = <T extends WithEnglish>(item: T): T => {
  if (!item.en) return item
  const swapped: Record<string, unknown> = { ...item }
  for (const [field, text] of Object.entries(item.en)) {
    if (typeof text === "string" && text.trim()) swapped[field] = text
  }
  return swapped as T
}

/**
 * The plan in the reader's language. Filipino returns the plan as stored; English swaps in each
 * item's `en` strings, field by field. Citations are official English text and are never touched.
 */
export const localizePlan = (plan: Plan, locale: Locale): Plan => {
  if (locale !== "en") return plan
  return {
    ...plan,
    transaction: english(plan.transaction),
    steps: plan.steps.map((step) => ({
      ...english(step),
      ...(step.notices ? { notices: step.notices.map(english) } : {}),
    })),
    documents: plan.documents.map(english),
    fees: plan.fees.map(english),
    questions: plan.questions.map(english),
  }
}

const filled = (text: string | undefined): boolean => !!text && text.trim().length > 0

/** Every user-facing field that has Filipino text but no English version, one line each. */
export const missingEnglish = (plan: Plan): string[] => {
  const problems: string[] = []
  const need = (label: string, fil: string | undefined, en: string | undefined) => {
    if (filled(fil) && !filled(en)) problems.push(`${label}: missing English text`)
  }
  const { transaction } = plan
  need("transaction title", transaction.title, transaction.en?.title)
  need("transaction processingTimeLabel", transaction.processingTimeLabel, transaction.en?.processingTimeLabel)
  for (const step of plan.steps) {
    need(`step "${step.id}" name`, step.name, step.en?.name)
    for (const notice of step.notices ?? []) {
      need(`step "${step.id}" notice "${notice.id}" text`, notice.text, notice.en?.text)
    }
  }
  for (const doc of plan.documents) {
    need(`document "${doc.id}" name`, doc.name, doc.en?.name)
    need(`document "${doc.id}" whereToGet`, doc.whereToGet, doc.en?.whereToGet)
    need(`document "${doc.id}" situationQuestion`, doc.situationQuestion, doc.en?.situationQuestion)
    need(`document "${doc.id}" notNeededReason`, doc.notNeededReason, doc.en?.notNeededReason)
    need(`document "${doc.id}" explanation`, doc.explanation, doc.en?.explanation)
  }
  for (const fee of plan.fees) need(`fee "${fee.id}" label`, fee.label, fee.en?.label)
  for (const q of plan.questions) {
    need(`question "${q.id}" question`, q.question, q.en?.question)
    need(`question "${q.id}" answer`, q.answer, q.en?.answer)
    need(`question "${q.id}" whoToAsk`, q.whoToAsk, q.en?.whoToAsk)
  }
  return problems
}
