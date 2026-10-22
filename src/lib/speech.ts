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

// ---- The spoken call: "Number B, zero, zero, one. Registration counter." ----

const ENGLISH_DIGITS = [
  "zero",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
] as const

/** Splits "B-014" into its letter and digits. Returns null when it does not look like a ticket number. */
export const parseTicketNumber = (
  ticketNumber: string
): { letter: string; digits: string[] } | null => {
  const match = /^([A-Za-z])-(\d+)$/.exec(ticketNumber.trim())
  return match ? { letter: match[1].toUpperCase(), digits: match[2].split("") } : null
}

/** "B-001" becomes "Number B, zero, zero, one": the letter as is, each digit as a word. */
export const spellTicketNumber = (ticketNumber: string): string => {
  const parts = parseTicketNumber(ticketNumber)
  if (!parts) return `Number ${ticketNumber}`
  const words = parts.digits.map((digit) => ENGLISH_DIGITS[Number(digit)])
  return `Number ${parts.letter}, ${words.join(", ")}`
}

/** The whole spoken line: the spelled number, then the counter's speech label. */
export const announcementText = (ticketNumber: string, speechLabel: string): string =>
  `${spellTicketNumber(ticketNumber)}. ${speechLabel}.`

/**
 * The recorded Heart-voice clips for a number, best first: the whole call as one clip
 * (generated for the demo range), then the word-by-word clips. Null when it has no clip form.
 */
export const clipSequences = (ticketNumber: string): string[][] | null => {
  const parts = parseTicketNumber(ticketNumber)
  if (!parts) return null
  const whole = [`/audio/call-${parts.letter.toLowerCase()}-${parts.digits.join("")}.m4a`]
  const words = [
    "/audio/word-number.m4a",
    `/audio/letter-${parts.letter.toLowerCase()}.m4a`,
    ...parts.digits.map((digit) => `/audio/digit-${digit}.m4a`),
    "/audio/counter.m4a",
  ]
  return [whole, words]
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

/**
 * Announces a call out loud in English. NEXT_PUBLIC_SPEECH_MODE picks how: "auto" (the default)
 * and "clips" play the recorded Heart-voice clips and fall back to the browser's voice;
 * "voice" always uses the browser's voice.
 */
export const speak = async (
  ticketNumber: string,
  speechLabel: string
): Promise<void> => {
  const text = announcementText(ticketNumber, speechLabel)
  const mode = parseSpeechMode(process.env.NEXT_PUBLIC_SPEECH_MODE)
  try {
    if (mode !== "voice") {
      for (const clips of clipSequences(ticketNumber) ?? []) {
        if (await playClips(clips)) return
      }
    }
    if ("speechSynthesis" in window) speakLine(text, undefined, "en-US")
  } catch {
    // Speech is best effort: the panel and the phone still show the call.
  }
}
