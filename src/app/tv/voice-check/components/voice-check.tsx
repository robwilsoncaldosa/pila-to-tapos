"use client"

import { Badge, Button, Card, CardContent, Inline, Stack } from "@/components/ui"
import { useT } from "@/i18n"
import { isFilipinoVoice, pickFilipinoVoice, speakLine } from "@/lib/speech"

import { useVoices } from "./use-voices"

const TEST_LINE = "Number B, zero, zero, one. Registration counter."

/** Lists the browser's voices and test-speaks the call, so we know how the TV will sound. */
export function VoiceCheck() {
  const { t } = useT()
  const { supported, voices } = useVoices()

  if (!supported) {
    return <p>{t("voice.unsupported")}</p>
  }

  const best = pickFilipinoVoice(voices)
  const filipinoCount = voices.filter(isFilipinoVoice).length

  return (
    <Stack gap={6}>
      <Stack gap={2}>
        <h1>{t("voice.title")}</h1>
        <p data-tone="muted">{t("voice.intro", { line: TEST_LINE })}</p>
      </Stack>
      <Stack gap={3}>
        <Button size="touch" disabled={!best} onClick={() => speakLine(TEST_LINE, best)}>
          {best
            ? t("voice.best", { name: best.name, lang: best.lang })
            : t("voice.noFilipino")}
        </Button>
        <Button size="touch" variant="outline" onClick={() => speakLine(TEST_LINE)}>
          {t("voice.default")}
        </Button>
      </Stack>
      <Stack gap={3}>
        <h2>
          {t("voice.count", { n: voices.length, filipino: filipinoCount })}
        </h2>
        {voices.length === 0 ? (
          <p data-tone="muted">{t("voice.empty")}</p>
        ) : null}
        <Stack asChild gap={2}>
          <ul>
            {voices.map((voice) => {
              const filipino = isFilipinoVoice(voice)
              return (
                <li key={`${voice.voiceURI}-${voice.lang}`}>
                  <Card size="sm" tone={filipino ? "signboard" : "default"}>
                    <CardContent>
                      <Inline justify="between" gap={3}>
                        <Stack gap={1}>
                          <strong>{voice.name}</strong>
                          <small>
                            {voice.lang}
                            {voice.localService ? ` · ${t("voice.local")}` : ` · ${t("voice.online")}`}
                            {voice.default ? ` · ${t("voice.defaultTag")}` : ""}
                          </small>
                        </Stack>
                        <Inline gap={2}>
                          {filipino ? (
                            <Badge variant="chip" size="md">
                              {t("voice.filipinoBadge")}
                            </Badge>
                          ) : null}
                          <Button
                            size="chip"
                            variant="outline"
                            onClick={() => speakLine(TEST_LINE, voice)}
                          >
                            {t("voice.try")}
                          </Button>
                        </Inline>
                      </Inline>
                    </CardContent>
                  </Card>
                </li>
              )
            })}
          </ul>
        </Stack>
      </Stack>
    </Stack>
  )
}
