"use client"

import { useSyncExternalStore } from "react"

const subscribeEverySecond = (onChange: () => void) => {
  const timer = window.setInterval(onChange, 1000)
  return () => window.clearInterval(timer)
}

const secondNow = () => Math.floor(Date.now() / 1000) * 1000

/** The current time in ms, refreshed every second. 0 while rendering on the server. */
export const useNow = (): number =>
  useSyncExternalStore(subscribeEverySecond, secondNow, () => 0)

const subscribeOnline = (onChange: () => void) => {
  window.addEventListener("online", onChange)
  window.addEventListener("offline", onChange)
  return () => {
    window.removeEventListener("online", onChange)
    window.removeEventListener("offline", onChange)
  }
}

/** `navigator.onLine`, live. True on the server. */
export const useOnline = (): boolean =>
  useSyncExternalStore(
    subscribeOnline,
    () => navigator.onLine,
    () => true
  )
