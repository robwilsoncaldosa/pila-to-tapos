"use client"

import { useCallback, useState } from "react"

import { boardState, callNext, finishVisit } from "@/app/actions/queue"
import { Stack } from "@/components/ui"
import type { Counter } from "@/domain/plan"
import { usePoll } from "@/lib/use-poll"

import { CallNextButton } from "./call-next-button"
import { CounterHeader } from "./counter-header"
import { CurrentTicket } from "./current-ticket"
import { WaitingList } from "./waiting-list"

/** The staff screen: polls the board every 2 seconds and refreshes at once after each tap. */
export function CounterScreen({ counter }: { counter: Counter }) {
  const fetchBoard = useCallback(() => boardState(counter.id), [counter.id])
  const { data, lastUpdatedAt, refresh } = usePoll(fetchBoard)
  const [pending, setPending] = useState(false)

  const board = data?.ok ? data.value : undefined
  const current = board?.current ?? null
  const waiting = board?.waiting ?? []

  const act = async (action: () => Promise<unknown>) => {
    setPending(true)
    try {
      await action()
    } finally {
      setPending(false)
      await refresh()
    }
  }

  return (
    <Stack gap={8}>
      <CounterHeader label={counter.label} />
      <CallNextButton
        hasWaiting={waiting.length > 0}
        busy={current !== null}
        pending={pending}
        onCall={() => void act(() => callNext(counter.id))}
      />
      {current ? (
        <CurrentTicket
          ticket={current}
          pending={pending}
          onDone={() => void act(() => finishVisit(current.id))}
        />
      ) : null}
      <WaitingList tickets={waiting} asOf={lastUpdatedAt ?? new Date(0)} />
    </Stack>
  )
}
