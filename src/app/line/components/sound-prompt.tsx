"use client"

import { Button, Card, CardContent, Stack } from "@/components/ui"
import { useT } from "@/i18n"
import { unlockAudio } from "@/lib/chime"
import { setSoundOn } from "@/lib/phone-storage"

/** One time: a tap that lets this phone make the "called" sound. Remembered on the phone. */
export function SoundPrompt() {
  const { t } = useT()
  return (
    <Card tone="muted" enter>
      <CardContent>
        <Stack gap={3}>
          <p>{t("line.soundQuestion")}</p>
          <Button
            size="touch"
            variant="outline"
            onClick={() => {
              void unlockAudio()
              setSoundOn(true)
            }}
          >
            {t("line.soundButton")}
          </Button>
        </Stack>
      </CardContent>
    </Card>
  )
}
