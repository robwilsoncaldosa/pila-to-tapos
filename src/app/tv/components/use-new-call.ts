"use client"

import { useState } from "react"

/**
 * The key of the latest call that arrived after the first poll, or null until one does.
 * The first poll only sets a baseline, so opening the TV mid-call neither flashes nor speaks.
 * `currentKey` is null when nobody is called.
 */
export function useNewCall(loaded: boolean, currentKey: string | null): string | null {
  const [baseline, setBaseline] = useState<string | null | undefined>(undefined)
  const [newCall, setNewCall] = useState<string | null>(null)

  // Adjusting state while rendering is React's pattern for "state that follows a prop".
  if (loaded && baseline !== currentKey) {
    setBaseline(currentKey)
    if (baseline !== undefined && currentKey !== null) setNewCall(currentKey)
  }
  return newCall
}
