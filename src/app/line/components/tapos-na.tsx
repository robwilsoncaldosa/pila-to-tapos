"use client"

import { cva } from "class-variance-authority"

import { Button, Card, CardContent, Stack } from "@/components/ui"
import { formatDuration, totalVisitTime } from "@/domain/journey"
import { resetPhoneState, type PhoneState } from "@/lib/phone-storage"

const popVariants = cva("enter-pop")

/** The end of visit 2. A rare moment, so it pops in once; no confetti. */
export function TaposNa({ visits }: { visits: PhoneState["visits"] }) {
  return (
    <Stack gap={4}>
      <div className={popVariants()}>
        <Card>
          <CardContent>
            <Stack gap={2}>
              <h1>Tapos na!</h1>
              <p>Nakuha mo na ang tax clearance mo.</p>
              <p className="font-bold">
                Kabuuang oras sa opisina: {formatDuration(totalVisitTime(visits))}
              </p>
            </Stack>
          </CardContent>
        </Card>
      </div>
      <Button variant="link" size="touch" onClick={resetPhoneState}>
        Magsimula ulit
      </Button>
    </Stack>
  )
}
