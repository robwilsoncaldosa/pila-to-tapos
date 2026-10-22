import type { TeamActionError } from "@/app/actions/team"

const MESSAGES: Record<TeamActionError, string> = {
  citation_required: "Walang citation, hindi mase-save.",
  quote_not_in_source: "Wala sa opisyal na source ang quote na ito.",
  unauthorized: "Naka-lock na ulit ang page. I-refresh ito at ilagay muli ang passcode.",
  invalid_input: "May kulang o maling laman ang form. Tingnan ang mga field.",
  not_found: "Hindi na nahanap ang item na ito. I-refresh ang page.",
}

export const teamErrorMessage = (error: TeamActionError): string => MESSAGES[error]
