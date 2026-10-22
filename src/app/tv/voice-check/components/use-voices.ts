import { useSyncExternalStore } from "react"

const NO_VOICES: SpeechSynthesisVoice[] = []
let cached: SpeechSynthesisVoice[] | null = null

const isSupported = () => typeof window !== "undefined" && "speechSynthesis" in window

// Voices often arrive late, after a "voiceschanged" event, so listen for it.
const subscribe = (onChange: () => void) => {
  if (!isSupported()) return () => {}
  const synth = window.speechSynthesis
  const onVoices = () => {
    cached = synth.getVoices()
    onChange()
  }
  synth.addEventListener("voiceschanged", onVoices)
  return () => synth.removeEventListener("voiceschanged", onVoices)
}

const getSnapshot = () => {
  if (!isSupported()) return NO_VOICES
  cached ??= window.speechSynthesis.getVoices()
  return cached
}

const noSubscribe = () => () => {}

export const useVoices = (): { supported: boolean; voices: SpeechSynthesisVoice[] } => ({
  supported: useSyncExternalStore(noSubscribe, isSupported, () => true),
  voices: useSyncExternalStore(subscribe, getSnapshot, () => NO_VOICES),
})
