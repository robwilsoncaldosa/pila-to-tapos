"use client"

import { useEffect, useRef } from "react"

import { speak } from "@/lib/speech"

type AnnouncerProps = {
  /** The number just called, or null. */
  number: string | null
  /** Changes with every call, so calling the same number twice still speaks twice. */
  callKey: string | null
  speechLabel: string
}

/** Says each new call out loud. Renders nothing. */
export function Announcer({ number, callKey, speechLabel }: AnnouncerProps) {
  const spoken = useRef<string | null>(null)
  useEffect(() => {
    if (!number || !callKey || spoken.current === callKey) return
    spoken.current = callKey
    void speak(number, speechLabel)
  }, [number, callKey, speechLabel])
  return null
}
