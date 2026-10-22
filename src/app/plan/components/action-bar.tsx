import { Container, Inline } from "@/components/ui"
import type { PhoneState } from "@/lib/phone-storage"

import { AskButton } from "./ask-button"
import { GetNumberButton } from "./get-number-button"

type ActionBarProps = {
  missingCount: number
  phone: PhoneState
}

/** The sticky bottom bar: the main "Kumuha ng number" action plus "Magtanong". */
export function ActionBar({ missingCount, phone }: ActionBarProps) {
  return (
    <div className="action-bar">
      <Container padY="none">
        <Inline gap={2}>
          <GetNumberButton missingCount={missingCount} phone={phone} />
          <AskButton />
        </Inline>
      </Container>
    </div>
  )
}
