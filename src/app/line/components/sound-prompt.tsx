"use client"

import { Button, Card, CardContent, Stack } from "@/components/ui"
import { unlockAudio } from "@/lib/chime"
import { setSoundOn } from "@/lib/phone-storage"

/** One time: a tap that lets this phone make the "called" sound. Remembered on the phone. */
export function SoundPrompt() {
  return (
    <Card tone="muted" enter>
      <CardContent>
        <Stack gap={3}>
          <p>Gusto mo bang may tunog kapag tinawag ang number mo?</p>
          <Button
            size="touch"
            variant="outline"
            onClick={() => {
              void unlockAudio()
              setSoundOn(true)
            }}
          >
            Tap to turn on sound alerts
          </Button>
        </Stack>
      </CardContent>
    </Card>
  )
}
