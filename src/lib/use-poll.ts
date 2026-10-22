"use client"

import { useCallback, useEffect, useRef, useState } from "react"

export type PollState<T> = {
  /** The latest successful result, kept while a later poll fails. */
  data: T | undefined
  /** When the latest poll succeeded. */
  lastUpdatedAt: Date | null
  /** True while the latest poll failed (offline, server down). Cleared by the next success. */
  error: boolean
  /** Polls right now (skipped while a request is already in flight). */
  refresh: () => Promise<void>
}

/**
 * Calls `fetcher` at once, then every `intervalMs`, and again straight away when the tab
 * gets focus, the network returns, or the page becomes visible. One request at a time.
 * Pass a stable `fetcher` (wrap it in useCallback): a new one restarts the polling.
 */
export function usePoll<T>(fetcher: () => Promise<T>, intervalMs = 2000): PollState<T> {
  const [data, setData] = useState<T | undefined>(undefined)
  const [lastUpdatedAt, setLastUpdatedAt] = useState<Date | null>(null)
  const [error, setError] = useState(false)
  const refreshRef = useRef<() => Promise<void>>(async () => {})

  useEffect(() => {
    let active = true
    let inFlight = false
    let pending = false

    /** `force` (an explicit refresh) queues one more poll when one is already in flight. */
    const run = async (force = false) => {
      if (inFlight) {
        if (force) pending = true
        return
      }
      inFlight = true
      try {
        const value = await fetcher()
        if (!active) return
        setData(value)
        setLastUpdatedAt(new Date())
        setError(false)
      } catch {
        if (active) setError(true)
      } finally {
        inFlight = false
        if (pending && active) {
          pending = false
          void run()
        }
      }
    }
    refreshRef.current = () => run(true)

    void run()
    const timer = window.setInterval(() => void run(), intervalMs)
    const onVisible = () => {
      if (document.visibilityState === "visible") void run()
    }
    const onWake = () => void run()
    window.addEventListener("focus", onWake)
    window.addEventListener("online", onWake)
    document.addEventListener("visibilitychange", onVisible)
    return () => {
      active = false
      window.clearInterval(timer)
      window.removeEventListener("focus", onWake)
      window.removeEventListener("online", onWake)
      document.removeEventListener("visibilitychange", onVisible)
    }
  }, [fetcher, intervalMs])

  const refresh = useCallback(() => refreshRef.current(), [])
  return { data, lastUpdatedAt, error, refresh }
}
