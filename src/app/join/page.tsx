import { JoinScreen } from "./components"
import { PlanUnavailable } from "@/components/plan-unavailable"
import { Container } from "@/components/ui"
import { getContainer } from "@/composition-root"
import { getLocale } from "@/i18n/server"

export const dynamic = "force-dynamic"

export default async function JoinPage() {
  const result = await getContainer().planService.getPlan(await getLocale())
  return (
    <Container asChild>
      <main>
        {result.ok ? <JoinScreen plan={result.value.plan} /> : <PlanUnavailable />}
      </main>
    </Container>
  )
}
