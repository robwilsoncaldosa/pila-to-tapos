"use client"

import { Badge, Button, Card, CardContent, Inline, Stack } from "@/components/ui"
import { isFilipinoVoice, pickFilipinoVoice, speakLine } from "@/lib/speech"

import { useVoices } from "./use-voices"

const TEST_LINE = "Numero B-001, Registration counter"

/** Lists the browser's voices and test-speaks the call, so we know how the TV will sound. */
export function VoiceCheck() {
  const { supported, voices } = useVoices()

  if (!supported) {
    return (
      <p>
        Walang speech sa browser na ito. Gagamit ang TV ng mga recorded na clip (slice 3).
      </p>
    )
  }

  const best = pickFilipinoVoice(voices)
  const filipinoCount = voices.filter(isFilipinoVoice).length

  return (
    <Stack gap={6}>
      <Stack gap={2}>
        <h1>Voice check</h1>
        <p data-tone="muted">
          Buksan ito sa browser na gagamitin bilang TV. Pindutin ang button at pakinggan kung
          tama ang tunog ng: &ldquo;{TEST_LINE}&rdquo;
        </p>
      </Stack>
      <Stack gap={3}>
        <Button size="touch" disabled={!best} onClick={() => speakLine(TEST_LINE, best)}>
          {best
            ? `Subukan ang pinakamalapit na Filipino: ${best.name} (${best.lang})`
            : "Walang Filipino voice na nakita"}
        </Button>
        <Button size="touch" variant="outline" onClick={() => speakLine(TEST_LINE)}>
          Subukan ang default voice (pang-kumpara)
        </Button>
      </Stack>
      <Stack gap={3}>
        <h2>
          {voices.length} voices, {filipinoCount} Filipino (fil o tl)
        </h2>
        {voices.length === 0 ? (
          <p data-tone="muted">
            Wala pang nakalistang voice. Maaaring hindi pa tapos mag-load ang browser; i-refresh
            kung walang lumabas.
          </p>
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
                            {voice.localService ? " · local" : " · online"}
                            {voice.default ? " · default" : ""}
                          </small>
                        </Stack>
                        <Inline gap={2}>
                          {filipino ? (
                            <Badge variant="chip" size="md">
                              Filipino
                            </Badge>
                          ) : null}
                          <Button
                            size="chip"
                            variant="outline"
                            onClick={() => speakLine(TEST_LINE, voice)}
                          >
                            Subukan
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
