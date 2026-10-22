import { TvScreen } from "./components"
import { PlanUnavailable } from "@/components/plan-unavailable"
import { Container } from "@/components/ui"
import { getContainer } from "@/composition-root"

export const dynamic = "force-dynamic"

export default async function TvPage() {
  const result = await getContainer().planService.getPlan()
  return result.ok ? (
    <TvScreen counter={result.value.plan.counter} />
  ) : (
    <Container asChild>
      <main>
        <PlanUnavailable />
      </main>
    </Container>
  )
}
