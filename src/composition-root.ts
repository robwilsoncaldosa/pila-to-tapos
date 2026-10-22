import "server-only"

import { createFilePlanRepository } from "@/adapters/file/plan-repository"
import { createFileSourceTexts } from "@/adapters/file/source-texts"
import { createSystemClock } from "@/adapters/system/clock"
import { createCryptoIds } from "@/adapters/system/ids"
import { createPlanService } from "@/services/plan-service"

const buildContainer = () => {
  const clock = createSystemClock()
  const ids = createCryptoIds()
  const plans = createFilePlanRepository()
  const sources = createFileSourceTexts()
  return {
    clock,
    ids,
    plans,
    sources,
    planService: createPlanService({ plans, sources }),
  }
}

export type Container = ReturnType<typeof buildContainer>

const globalForContainer = globalThis as unknown as { __pilaContainer?: Container }

/** The only place that decides which adapters the services get. Cached so dev HMR does not rebuild it. */
export const getContainer = (): Container => {
  globalForContainer.__pilaContainer ??= buildContainer()
  return globalForContainer.__pilaContainer
}
