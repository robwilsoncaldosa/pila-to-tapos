import { PlanScreen } from "./components"
import { PlanUnavailable } from "@/components/plan-unavailable"
import { Container } from "@/components/ui"
import { getContainer } from "@/composition-root"
import { getLocale } from "@/i18n/server"

// The plan file can change between requests, so never freeze it at build time.
export const dynamic = "force-dynamic"

export default async function PlanPage() {
  const result = await getContainer().planService.getPlan(await getLocale())
  return (
    <Container asChild>
      <main>
        {result.ok ? <PlanScreen {...result.value} /> : <PlanUnavailable />}
      </main>
    </Container>
  )
}
