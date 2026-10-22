import { NotOfficialNote, TransactionChoice, Welcome } from "./components"
import { Container, Stack } from "@/components/ui"

export default function HomePage() {
  return (
    <Container asChild>
      <main>
        <Stack gap={8}>
          <Welcome />
          <TransactionChoice />
          <NotOfficialNote />
        </Stack>
      </main>
    </Container>
  )
}
