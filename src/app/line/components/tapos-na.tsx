"use client"

import { cva } from "class-variance-authority"

import { Button, Card, CardContent, Stack } from "@/components/ui"
import { formatDuration, totalVisitTime } from "@/domain/journey"
import { useT } from "@/i18n"
import { resetPhoneState, type PhoneState } from "@/lib/phone-storage"

const popVariants = cva("enter-pop")

/** The end of visit 2. A rare moment, so it pops in once; no confetti. */
export function TaposNa({ visits }: { visits: PhoneState["visits"] }) {
  const { t, locale } = useT()
  return (
    <Stack gap={4}>
      <div className={popVariants()}>
        <Card>
          <CardContent>
            <Stack gap={2}>
              <h1>{t("line.doneTitle")}</h1>
              <p>{t("line.doneBody")}</p>
              <p className="font-bold">
                {t("line.totalTime", { time: formatDuration(totalVisitTime(visits), locale) })}
              </p>
            </Stack>
          </CardContent>
        </Card>
      </div>
      <Button variant="link" size="touch" onClick={resetPhoneState}>
        {t("line.startOver")}
      </Button>
    </Stack>
  )
}
