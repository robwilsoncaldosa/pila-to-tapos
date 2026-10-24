import { TvScreen } from "./components"
import { PlanUnavailable } from "@/components/plan-unavailable"
import { Container } from "@/components/ui"
import { getContainer } from "@/composition-root"
import { getLocale } from "@/i18n/server"

export const dynamic = "force-dynamic"

export default async function TvPage() {
  const result = await getContainer().planService.getPlan(await getLocale())
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
