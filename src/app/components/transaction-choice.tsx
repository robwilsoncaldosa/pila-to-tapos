import { ArrowRightIcon } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui"
import { getT } from "@/i18n/server"

/** The one choice for the proof of concept. One tap opens the plan. */
export async function TransactionChoice() {
  const { t } = await getT()
  return (
    <Button asChild size="choice" className="w-full">
      <Link href="/plan">
        {t("home.transaction")}
        <ArrowRightIcon aria-hidden />
      </Link>
    </Button>
  )
}
