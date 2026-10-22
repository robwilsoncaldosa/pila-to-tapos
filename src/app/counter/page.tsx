import { CounterScreen } from "./components"
import { PlanUnavailable } from "@/components/plan-unavailable"
import { Container } from "@/components/ui"
import { getContainer } from "@/composition-root"

export const dynamic = "force-dynamic"

export default async function CounterPage() {
  const result = await getContainer().planService.getPlan()
  return (
    <Container asChild size="wide">
      <main>
        {result.ok ? <CounterScreen counter={result.value.plan.counter} /> : <PlanUnavailable />}
      </main>
    </Container>
  )
}
