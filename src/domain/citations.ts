import type { Citation, Plan, SourceId } from "./plan"

export type SourceTextMap = Record<SourceId, string>

const normalize = (text: string): string => text.replace(/\s+/g, " ").trim()

export type CitationError = "citation_required" | "quote_not_in_source"

/**
 * "No citation, no save": the citation must name a source, a locator and a quote,
 * and the quote must appear word for word in that source's text (null when the source is unknown).
 */
export const citationError = (
  citation: Citation | undefined,
  sourceText: string | null
): CitationError | null => {
  if (
    !citation ||
    !citation.sourceId ||
    !citation.locator?.trim() ||
    !citation.quote?.trim()
  ) {
    return "citation_required"
  }
  if (sourceText === null || !normalize(sourceText).includes(normalize(citation.quote))) {
    return "quote_not_in_source"
  }
  return null
}

const checkCitation = (
  label: string,
  citation: Citation | undefined,
  sourceTexts: Partial<Record<SourceId, string>>
): string[] => {
  if (
    !citation ||
    !citation.sourceId ||
    !citation.locator?.trim() ||
    !citation.quote?.trim()
  ) {
    return [`${label}: missing citation (source, locator and quote are all required)`]
  }
  const text = sourceTexts[citation.sourceId]
  if (text === undefined) {
    return [`${label}: unknown source "${citation.sourceId}"`]
  }
  if (!normalize(text).includes(normalize(citation.quote))) {
    return [
      `${label}: quote not found word for word in ${citation.sourceId} (${citation.locator}): "${citation.quote}"`,
    ]
  }
  return []
}

/** Lists every problem; an empty list means every citation is present and quoted verbatim. */
export const validateCitations = (
  plan: Plan,
  sourceTexts: Partial<Record<SourceId, string>>
): string[] => {
  const problems: string[] = []
  const check = (label: string, citation: Citation | undefined) =>
    problems.push(...checkCitation(label, citation, sourceTexts))

  check("transaction processing time", plan.transaction.processingCitation)
  for (const step of plan.steps) {
    check(`step "${step.id}"`, step.citation)
    for (const notice of step.notices ?? []) {
      if (notice.citations.length === 0) {
        problems.push(`step "${step.id}" notice "${notice.id}": missing citation`)
      }
      notice.citations.forEach((citation, i) =>
        check(`step "${step.id}" notice "${notice.id}" #${i + 1}`, citation)
      )
    }
  }
  for (const doc of plan.documents) check(`document "${doc.id}"`, doc.citation)
  for (const fee of plan.fees) check(`fee "${fee.id}"`, fee.citation)
  for (const q of plan.questions) {
    if (q.kind === "direct" && q.citations.length === 0) {
      problems.push(`question "${q.id}": a direct answer needs at least one citation`)
    }
    if (q.kind === "not_in_source") {
      if ((q.related ?? []).length === 0) {
        problems.push(`question "${q.id}": a not-in-source answer needs at least one related citation`)
      }
      if (!q.whoToAsk?.trim()) {
        problems.push(`question "${q.id}": a not-in-source answer needs whoToAsk`)
      }
    }
    q.citations.forEach((citation, i) =>
      check(`question "${q.id}" citation #${i + 1}`, citation)
    )
    ;(q.related ?? []).forEach((citation, i) =>
      check(`question "${q.id}" related #${i + 1}`, citation)
    )
  }
  return problems
}

export const countCitations = (plan: Plan): number =>
  1 +
  plan.steps.reduce(
    (n, s) =>
      n + 1 + (s.notices ?? []).reduce((m, notice) => m + notice.citations.length, 0),
    0
  ) +
  plan.documents.length +
  plan.fees.length +
  plan.questions.reduce(
    (n, q) => n + q.citations.length + (q.related?.length ?? 0),
    0
  )
