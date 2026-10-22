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

/**
 * Speaks a line with the given voice, or the browser default voice when none is given
 * (`fallbackLang` then tells the browser which language the text is in).
 */
export const speakLine = (
  text: string,
  voice?: SpeechSynthesisVoice,
  fallbackLang?: string
): void => {
  const synth = window.speechSynthesis
  synth.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  if (voice) {
    utterance.voice = voice
    utterance.lang = voice.lang
  } else if (fallbackLang) {
    utterance.lang = fallbackLang
  }
  synth.speak(utterance)
}

// ---- The spoken call: "Numero B, zero, zero, isa, Registration counter". ----

const FILIPINO_DIGITS = [
  "zero",
  "isa",
  "dalawa",
  "tatlo",
  "apat",
  "lima",
  "anim",
  "pito",
  "walo",
  "siyam",
] as const

/** Splits "B-014" into its letter and digits. Returns null when it does not look like a ticket number. */
export const parseTicketNumber = (
  ticketNumber: string
): { letter: string; digits: string[] } | null => {
  const match = /^([A-Za-z])-(\d+)$/.exec(ticketNumber.trim())
  return match ? { letter: match[1].toUpperCase(), digits: match[2].split("") } : null
}

/** "B-001" becomes "Numero B, zero, zero, isa": the letter as is, each digit as a Filipino word. */
export const spellTicketNumber = (ticketNumber: string): string => {
  const parts = parseTicketNumber(ticketNumber)
  if (!parts) return `Numero ${ticketNumber}`
  const words = parts.digits.map((digit) => FILIPINO_DIGITS[Number(digit)])
  return `Numero ${parts.letter}, ${words.join(", ")}`
}

/** The whole spoken line: the spelled number, then the counter's speech label. */
export const announcementText = (ticketNumber: string, speechLabel: string): string =>
  `${spellTicketNumber(ticketNumber)}, ${speechLabel}`

/** The recorded clips that read a number out, in order. Null when the number has no clip form. */
export const clipSequence = (ticketNumber: string): string[] | null => {
  const parts = parseTicketNumber(ticketNumber)
  if (!parts) return null
  return [
    "/audio/numero.mp3",
    `/audio/letter-${parts.letter.toLowerCase()}.mp3`,
    ...parts.digits.map((digit) => `/audio/digit-${digit}.mp3`),
    "/audio/counter.mp3",
  ]
}

export type SpeechMode = "auto" | "voice" | "clips"

export const parseSpeechMode = (value: string | undefined): SpeechMode =>
  value === "voice" || value === "clips" ? value : "auto"

const playClip = (url: string): Promise<void> =>
  new Promise((resolve, reject) => {
    const audio = new Audio(url)
    audio.onended = () => resolve()
    audio.onerror = () => reject(new Error(`clip failed: ${url}`))
    audio.play().catch(reject)
  })

/** Plays the clips one after another. Returns false (quietly) if any is missing or blocked. */
const playClips = async (urls: string[]): Promise<boolean> => {
  try {
    for (const url of urls) await playClip(url)
    return true
  } catch {
    return false
  }
}

const speakWithVoice = (text: string): void => {
  const voice = pickFilipinoVoice(window.speechSynthesis.getVoices())
  speakLine(text, voice, "fil-PH")
}

/**
 * Announces a call out loud. NEXT_PUBLIC_SPEECH_MODE picks how: "auto" and "voice" use the
 * browser's voice (a Filipino one if it has one, else the default voice told it is fil-PH);
 * "clips" plays the recorded clips and falls back to the voice if they are missing.
 */
export const speak = async (
  ticketNumber: string,
  speechLabel: string
): Promise<void> => {
  const text = announcementText(ticketNumber, speechLabel)
  const mode = parseSpeechMode(process.env.NEXT_PUBLIC_SPEECH_MODE)
  try {
    if (mode === "clips") {
      const clips = clipSequence(ticketNumber)
      if (clips && (await playClips(clips))) return
    }
    if ("speechSynthesis" in window) speakWithVoice(text)
  } catch {
    // Speech is best effort: the panel and the phone still show the call.
  }
}
