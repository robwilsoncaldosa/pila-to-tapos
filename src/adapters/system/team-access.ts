import "server-only"

import { createHash, createHmac, timingSafeEqual } from "node:crypto"

import type { Clock } from "@/ports/clock"
import type { TeamAccess } from "@/ports/team-access"

const EIGHT_HOURS_SECONDS = 8 * 60 * 60

/** Hashing first gives equal-length buffers, so the compare cannot leak the passcode's length. */
const sameText = (a: string, b: string): boolean =>
  timingSafeEqual(createHash("sha256").update(a).digest(), createHash("sha256").update(b).digest())

const sign = (secret: string, expiresAt: string): string =>
  createHmac("sha256", secret).update(expiresAt).digest("hex")

/** The team passcode from the environment, and cookie values signed with HMAC-SHA256 that expire after 8 hours. */
export const createTeamAccess = (deps: {
  passcode: string | undefined
  secret: string | undefined
  clock: Clock
}): TeamAccess => {
  const { passcode, secret, clock } = deps
  if (!passcode || !secret) {
    return {
      isConfigured: () => false,
      matchesPasscode: () => false,
      issueToken: () => ({ token: "", maxAgeSeconds: 0 }),
      verifyToken: () => false,
    }
  }
  return {
    isConfigured: () => true,
    matchesPasscode: (input) => sameText(input, passcode),
    issueToken: () => {
      const expiresAt = String(clock.now().getTime() + EIGHT_HOURS_SECONDS * 1000)
      return {
        token: `${expiresAt}.${sign(secret, expiresAt)}`,
        maxAgeSeconds: EIGHT_HOURS_SECONDS,
      }
    },
    verifyToken: (token) => {
      if (!token) return false
      const [expiresAt, signature, ...rest] = token.split(".")
      if (!expiresAt || !signature || rest.length > 0) return false
      if (!/^\d+$/.test(expiresAt) || Number(expiresAt) <= clock.now().getTime()) return false
      return sameText(signature, sign(secret, expiresAt))
    },
  }
}
