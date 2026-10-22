/** Who may open /team: a shared passcode and a signed, expiring cookie value. No accounts. */
export type TeamAccess = {
  /** False when TEAM_PASSCODE or TEAM_COOKIE_SECRET is not set; nobody can unlock then. */
  isConfigured: () => boolean
  /** Timing-safe compare against the configured passcode. */
  matchesPasscode: (input: string) => boolean
  /** A fresh signed cookie value and how long it lasts. */
  issueToken: () => { token: string; maxAgeSeconds: number }
  /** True for an untampered, unexpired token. */
  verifyToken: (token: string | undefined) => boolean
}
