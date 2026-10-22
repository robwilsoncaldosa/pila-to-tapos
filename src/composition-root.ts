import "server-only"

import { createFilePlanRepository } from "@/adapters/file/plan-repository"
import { createFileSourceTexts } from "@/adapters/file/source-texts"
import { createMemoryQueueRepository } from "@/adapters/memory/queue-repository"
import { createSystemClock } from "@/adapters/system/clock"
import { createCryptoIds } from "@/adapters/system/ids"
import { createTeamAccess } from "@/adapters/system/team-access"
import { createPlanService } from "@/services/plan-service"
import { createQueueService } from "@/services/queue-service"
import { createTeamService } from "@/services/team-service"

const buildContainer = () => {
  const clock = createSystemClock()
  const ids = createCryptoIds()
  const plans = createFilePlanRepository()
  const sources = createFileSourceTexts()
  const queue = createMemoryQueueRepository()
  const access = createTeamAccess({
    passcode: process.env.TEAM_PASSCODE,
    secret: process.env.TEAM_COOKIE_SECRET,
    clock,
  })
  return {
    clock,
    ids,
    plans,
    sources,
    queue,
    planService: createPlanService({ plans, sources }),
    queueService: createQueueService({ queue, clock, ids }),
    teamService: createTeamService({ plans, sources, access, ids }),
  }
}

export type Container = ReturnType<typeof buildContainer>

const globalForContainer = globalThis as unknown as { __pilaContainer?: Container }

/** The only place that decides which adapters the services get. Cached so dev HMR does not rebuild it. */
export const getContainer = (): Container => {
  globalForContainer.__pilaContainer ??= buildContainer()
  return globalForContainer.__pilaContainer
}
