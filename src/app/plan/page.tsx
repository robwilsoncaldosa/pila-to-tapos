import { PlanScreen, PlanUnavailable } from "./components"
import { Container } from "@/components/ui"
import { getContainer } from "@/composition-root"

// The plan file can change between requests, so never freeze it at build time.
export const dynamic = "force-dynamic"

export default async function PlanPage() {
  const result = await getContainer().planService.getPlan()
  return (
    <Container asChild>
      <main>
        {result.ok ? <PlanScreen {...result.value} /> : <PlanUnavailable />}
      </main>
    </Container>
  )
}
