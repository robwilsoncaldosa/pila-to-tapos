import "server-only"

import type { Clock } from "@/ports/clock"

export const createSystemClock = (): Clock => ({ now: () => new Date() })
