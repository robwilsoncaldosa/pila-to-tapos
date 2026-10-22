import { dropChangedTicks, type SeenSnapshot } from "@/domain/plan-diff"
import type { SituationAnswer } from "@/domain/plan"

export const STORAGE_KEY = "pila:v1"

type VisitRecord = { ticketId: string; issuedAt: string; doneAt?: string }

/** Everything her phone remembers. There is no login: this is a sticky note the browser keeps. */
export type PhoneState = {
  journeyId: string
  ticks: Record<string, true>
  answers: Record<string, SituationAnswer>
  seen: { revision: number; items: Record<string, number> }
  visits: { 1?: VisitRecord; 2?: VisitRecord }
  demoSkip: boolean
  soundOn: boolean
}

export const EMPTY_PHONE_STATE: PhoneState = Object.freeze({
  journeyId: "",
  ticks: Object.freeze({}) as Record<string, true>,
  answers: Object.freeze({}) as Record<string, SituationAnswer>,
  seen: Object.freeze({ revision: 0, items: Object.freeze({}) }) as PhoneState["seen"],
  visits: Object.freeze({}) as PhoneState["visits"],
  demoSkip: false,
  soundOn: false,
}) as PhoneState

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value)

const ANSWERS: readonly string[] = ["oo", "hindi", "hindi_ko_alam"]

/** Reads untrusted stored JSON into a well-formed state, dropping anything that does not fit. */
export const parsePhoneState = (raw: string | null): PhoneState => {
  if (!raw) return EMPTY_PHONE_STATE
  try {
    const data: unknown = JSON.parse(raw)
    if (!isRecord(data)) return EMPTY_PHONE_STATE
    const ticks: Record<string, true> = {}
    if (isRecord(data.ticks)) {
      for (const [id, v] of Object.entries(data.ticks)) if (v === true) ticks[id] = true
    }
    const answers: Record<string, SituationAnswer> = {}
    if (isRecord(data.answers)) {
      for (const [id, v] of Object.entries(data.answers)) {
        if (typeof v === "string" && ANSWERS.includes(v)) answers[id] = v as SituationAnswer
      }
    }
    const seen = isRecord(data.seen) ? data.seen : {}
    const items: Record<string, number> = {}
    if (isRecord(seen.items)) {
      for (const [id, v] of Object.entries(seen.items)) if (typeof v === "number") items[id] = v
    }
    return {
      journeyId: typeof data.journeyId === "string" ? data.journeyId : "",
      ticks,
      answers,
      seen: { revision: typeof seen.revision === "number" ? seen.revision : 0, items },
      visits: isRecord(data.visits) ? (data.visits as PhoneState["visits"]) : {},
      demoSkip: data.demoSkip === true,
      soundOn: data.soundOn === true,
    }
  } catch {
    return EMPTY_PHONE_STATE
  }
}

// ---- A tiny external store, so React can read it with useSyncExternalStore. ----

let cache: PhoneState | null = null
let storageWorks = true
const listeners = new Set<() => void>()

const readRaw = (): string | null => {
  try {
    return window.localStorage.getItem(STORAGE_KEY)
  } catch {
    storageWorks = false
    return null
  }
}

const persist = (state: PhoneState): void => {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Private mode or blocked storage: the in-memory copy still works for this session.
    storageWorks = false
  }
}

const emit = () => listeners.forEach((listener) => listener())

/** The current state (in-memory fallback when storage is blocked). Stable between changes. */
export const getPhoneState = (): PhoneState => {
  if (cache === null) cache = parsePhoneState(readRaw())
  return cache
}

export const getServerPhoneState = (): PhoneState => EMPTY_PHONE_STATE

export const subscribePhoneState = (listener: () => void): (() => void) => {
  listeners.add(listener)
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY || event.key === null) {
      cache = parsePhoneState(readRaw())
      emit()
    }
  }
  window.addEventListener("storage", onStorage)
  return () => {
    listeners.delete(listener)
    window.removeEventListener("storage", onStorage)
  }
}

export const updatePhoneState = (change: (state: PhoneState) => PhoneState): void => {
  cache = change(getPhoneState())
  persist(cache)
  emit()
}

/** False when the browser blocked storage, so ticks will not survive a reload. */
export const isStoragePersistent = (): boolean => storageWorks

// ---- Intent-level helpers used by the plan screen. ----

/** Creates the journey id on her first plan visit. */
export const ensureJourney = (): void => {
  if (getPhoneState().journeyId) return
  updatePhoneState((state) => ({ ...state, journeyId: crypto.randomUUID() }))
}

export const setTick = (docId: string, ticked: boolean): void =>
  updatePhoneState((state) => {
    const ticks = { ...state.ticks }
    if (ticked) ticks[docId] = true
    else delete ticks[docId]
    return { ...state, ticks }
  })

export const setAnswer = (docId: string, answer: SituationAnswer): void =>
  updatePhoneState((state) => ({
    ...state,
    answers: { ...state.answers, [docId]: answer },
  }))

/** "I-reset": clears this device's saved progress (and starts a fresh journey). */
export const resetPhoneState = (): void => {
  cache = EMPTY_PHONE_STATE
  try {
    window.localStorage.removeItem(STORAGE_KEY)
  } catch {
    storageWorks = false
  }
  emit()
  ensureJourney()
}

/** Remembers the ticket she took for a visit. */
export const setVisitTicket = (visit: 1 | 2, ticketId: string, issuedAt: string): void =>
  updatePhoneState((state) => ({
    ...state,
    visits: { ...state.visits, [visit]: { ticketId, issuedAt } },
  }))

/** Forgets her tickets (the server no longer knows them), keeping her ticks and answers. */
export const clearVisits = (): void =>
  updatePhoneState((state) => ({ ...state, visits: {} }))

/** Forgets one visit's ticket (the server no longer knows it), keeping the other visit. */
export const clearVisit = (visit: 1 | 2): void =>
  updatePhoneState((state) => {
    const visits = { ...state.visits }
    delete visits[visit]
    return { ...state, visits }
  })

export const setSoundOn = (soundOn: boolean): void =>
  updatePhoneState((state) => ({ ...state, soundOn }))

/** Remembers when a visit's ticket was marked done, if her phone knows that ticket. */
export const setVisitDone = (visit: 1 | 2, doneAt: string): void =>
  updatePhoneState((state) => {
    const record = state.visits[visit]
    if (!record || record.doneAt) return state
    return { ...state, visits: { ...state.visits, [visit]: { ...record, doneAt } } }
  })

/** The labeled demo switch: pretends the 3 working days have passed. */
export const setDemoSkip = (demoSkip: boolean): void =>
  updatePhoneState((state) => ({ ...state, demoSkip }))

/** "Tapos na!": clears her ticks and answers but keeps the visits, so a reload still shows it. */
export const finishJourney = (): void =>
  updatePhoneState((state) => ({ ...state, ticks: {}, answers: {} }))

/**
 * Remembers which plan revisions she has now seen. Documents that changed lose their tick
 * (new ones were never ticked); everything else, including her tickets, stays as it was.
 */
export const recordSeenPlan = (snapshot: SeenSnapshot, changedDocuments: string[]): void =>
  updatePhoneState((state) => ({
    ...state,
    ticks: dropChangedTicks(state.ticks, changedDocuments),
    seen: snapshot,
  }))
