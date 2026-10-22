import { cookies } from "next/headers"

import { TEAM_COOKIE } from "@/app/actions/team-cookie"
import { PlanUnavailable } from "@/components/plan-unavailable"
import { Container } from "@/components/ui"
import { getContainer } from "@/composition-root"

import { NotConfigured, PasscodeForm, TeamScreen } from "./components"

// Reads the cookie and the plan file on every request.
export const dynamic = "force-dynamic"

// Not linked from anywhere in the customer app; the team opens this address directly.
export default async function TeamPage() {
  const { teamService, planService } = getContainer()
  const unlocked = teamService.isAuthorized((await cookies()).get(TEAM_COOKIE)?.value)
  const plan = unlocked ? await planService.getPlan() : null
  return (
    <Container asChild size="wide">
      <main>
        {!teamService.isConfigured() ? (
          <NotConfigured />
        ) : plan === null ? (
          <PasscodeForm />
        ) : plan.ok ? (
          <TeamScreen {...plan.value} />
        ) : (
          <PlanUnavailable />
        )}
      </main>
    </Container>
  )
}
