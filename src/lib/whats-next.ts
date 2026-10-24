import { journeyStage, returnDateOf, visit2Unlocked, type JourneyVisits } from "@/domain/journey"
import { nextAction, type PlanProgress } from "@/domain/progress"
import { formatManilaDate } from "@/domain/working-days"
import type { Translator } from "@/i18n/translator"

type WhatsNextInput = {
  progress: PlanProgress
  visits: JourneyVisits
  demoSkip: boolean
  /** The Manila day today, "YYYY-MM-DD". */
  today: string
}

/** The one next step in plain words. Between visits and in line it mirrors the bottom button. */
export const whatsNextText = (
  { t, tn, locale }: Translator,
  { progress, visits, demoSkip, today }: WhatsNextInput
): string => {
  const stage = journeyStage(visits)
  if (stage === "visit_1" || stage === "visit_2" || stage === "finished") {
    return t("next.viewNumber")
  }
  if (stage === "between") {
    const returnDate = returnDateOf(visits)
    return visit2Unlocked(visits, today, demoSkip) || !returnDate
      ? t("next.visit2Ready")
      : t("next.comeBack", { date: formatManilaDate(returnDate, locale) })
  }
  const action = nextAction(progress)
  if (action.kind === "answer") return tn("next.answer", action.count)
  if (action.kind === "tick") return tn("next.tick", action.count)
  return t("next.ready")
}
