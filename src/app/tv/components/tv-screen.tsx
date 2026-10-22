"use client"

import { useCallback, useState } from "react"

import { boardState } from "@/app/actions/queue"
import { Inline, Stack } from "@/components/ui"
import type { Counter } from "@/domain/plan"
import { unlockAudio } from "@/lib/chime"
import { usePoll } from "@/lib/use-poll"

import { Announcer } from "./announcer"
import { CounterPanel } from "./counter-panel"
import { JoinQr } from "./join-qr"
import { StartTvOverlay } from "./start-tv-overlay"
import { useNewCall } from "./use-new-call"

/** The waiting-room TV: the counter's number, the spoken call, and the QR code. Numbers only. */
export function TvScreen({ counter }: { counter: Counter }) {
  const [started, setStarted] = useState(false)
  const fetchBoard = useCallback(() => boardState(counter.id), [counter.id])
  const { data } = usePoll(fetchBoard)

  const current = data?.ok ? data.value.current : null
  const currentKey = current ? `${current.id}:${current.calledAt}` : null
  const newCall = useNewCall(Boolean(data?.ok), currentKey)

  const start = () => {
    // Speaking an empty line inside the tap is what lets later calls be heard.
    if ("speechSynthesis" in window) {
      window.speechSynthesis.speak(new SpeechSynthesisUtterance(""))
    }
    void unlockAudio()
    setStarted(true)
  }

  return (
    <main className="min-h-svh bg-tv p-8 text-white">
      {started ? null : <StartTvOverlay onStart={start} />}
      <Stack gap={8} align="center" className="min-h-[calc(100svh-4rem)] justify-between">
        <Stack gap={0} className="w-full flex-1 justify-center">
          <CounterPanel
            key={newCall ?? "idle"}
            label={counter.label}
            number={current?.number ?? null}
            pulse={newCall !== null && newCall === currentKey}
          />
        </Stack>
        <Inline justify="end" className="w-full">
          <JoinQr counterId={counter.id} />
        </Inline>
      </Stack>
      {started && newCall !== null && newCall === currentKey ? (
        <Announcer
          number={current?.number ?? null}
          callKey={newCall}
          speechLabel={counter.speechLabel}
        />
      ) : null}
    </main>
  )
}
