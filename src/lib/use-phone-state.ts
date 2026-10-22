"use client"

import { useSyncExternalStore } from "react"

import {
  getPhoneState,
  getServerPhoneState,
  subscribePhoneState,
  type PhoneState,
} from "./phone-storage"

/** What her phone remembers. On the server and during hydration this is the empty state. */
export const usePhoneState = (): PhoneState =>
  useSyncExternalStore(subscribePhoneState, getPhoneState, getServerPhoneState)

const noopSubscribe = () => () => {}

/** False while the page is rendering on the server or hydrating, true once the phone's storage can be trusted. */
export const useHydrated = (): boolean =>
  useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false
  )
