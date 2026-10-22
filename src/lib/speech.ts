export type VoiceLike = { lang: string }

/** Filipino voices report "fil-PH", "fil_PH" or the older "tl-PH". */
export const isFilipinoVoice = (voice: VoiceLike): boolean => {
  const lang = voice.lang.toLowerCase()
  return lang.startsWith("fil") || lang.startsWith("tl")
}

/** The best Filipino match: a "fil" voice first, then "tl", preferring a local (offline) voice. */
export const pickFilipinoVoice = <T extends VoiceLike & { localService?: boolean }>(
  voices: T[]
): T | undefined => {
  const rank = (voice: T) =>
    (voice.lang.toLowerCase().startsWith("fil") ? 0 : 2) + (voice.localService ? 0 : 1)
  return voices
    .filter(isFilipinoVoice)
    .sort((a, b) => rank(a) - rank(b))[0]
}

/** Speaks a line with the given voice, or the browser default when none is given. */
export const speakLine = (text: string, voice?: SpeechSynthesisVoice): void => {
  const synth = window.speechSynthesis
  synth.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  if (voice) {
    utterance.voice = voice
    utterance.lang = voice.lang
  }
  synth.speak(utterance)
}
