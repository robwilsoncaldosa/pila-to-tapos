import type { TeamActionError } from "@/app/actions/team"
import type { MessageKey } from "@/i18n"

const KEYS: Record<TeamActionError, MessageKey> = {
  citation_required: "team.err.citation_required",
  quote_not_in_source: "team.err.quote_not_in_source",
  unauthorized: "team.err.unauthorized",
  invalid_input: "team.err.invalid_input",
  not_found: "team.err.not_found",
}

/** The dictionary key of the message for a failed team save. */
export const teamErrorKey = (error: TeamActionError): MessageKey => KEYS[error]
