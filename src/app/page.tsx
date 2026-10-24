import { NotOfficialNote, TransactionChoice, Welcome } from "./components"
import { LocaleSwitch } from "@/components/locale-switch"
import { Container, Inline, Stack } from "@/components/ui"

export default function HomePage() {
  return (
    <Container asChild>
      <main>
        <Stack gap={8}>
          <Inline justify="end">
            <LocaleSwitch />
          </Inline>
          <Welcome />
          <TransactionChoice />
          <NotOfficialNote />
        </Stack>
      </main>
    </Container>
  )
}
