import { ArrowRightIcon } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui"

/** The one choice for the proof of concept. One tap opens Your plan. */
export function TransactionChoice() {
  return (
    <Button asChild size="choice" className="w-full">
      <Link href="/plan">
        BIR: Close my freelancer registration
        <ArrowRightIcon aria-hidden />
      </Link>
    </Button>
  )
}
