let context: AudioContext | null = null

const getContext = (): AudioContext | null => {
  if (typeof window === "undefined") return null
  if (!context) {
    const Ctor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!Ctor) return null
    context = new Ctor()
  }
  return context
}

const tone = (ctx: AudioContext, frequency: number, start: number, length: number): void => {
  const oscillator = ctx.createOscillator()
  const gain = ctx.createGain()
  oscillator.type = "sine"
  oscillator.frequency.value = frequency
  gain.gain.setValueAtTime(0.0001, start)
  gain.gain.exponentialRampToValueAtTime(0.4, start + 0.02)
  gain.gain.exponentialRampToValueAtTime(0.0001, start + length)
  oscillator.connect(gain).connect(ctx.destination)
  oscillator.start(start)
  oscillator.stop(start + length + 0.05)
}

/** Call from a tap: browsers only let a page make sound after the person has touched it. */
export const unlockAudio = async (): Promise<boolean> => {
  const ctx = getContext()
  if (!ctx) return false
  try {
    await ctx.resume()
    // A near-silent blip, so the browser counts this tap as unlocking audio.
    tone(ctx, 440, ctx.currentTime, 0.05)
    return ctx.state === "running"
  } catch {
    return false
  }
}

/** A short two-note chime made with the Web Audio API (no audio file). Quiet failure if locked. */
export const playChime = (): void => {
  const ctx = getContext()
  if (!ctx || ctx.state !== "running") return
  const now = ctx.currentTime
  tone(ctx, 880, now, 0.5)
  tone(ctx, 1175, now + 0.22, 0.7)
}
