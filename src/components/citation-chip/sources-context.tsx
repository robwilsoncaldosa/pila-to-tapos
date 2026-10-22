"use client"

import { createContext, useContext } from "react"

import type { SourceId, SourceInfo } from "@/domain/plan"

const SourcesContext = createContext<SourceInfo[]>([])

export function SourcesProvider({
  sources,
  children,
}: {
  sources: SourceInfo[]
  children: React.ReactNode
}) {
  return <SourcesContext value={sources}>{children}</SourcesContext>
}

export const useSource = (id: SourceId): SourceInfo | undefined =>
  useContext(SourcesContext).find((source) => source.id === id)

export const useSources = (): SourceInfo[] => useContext(SourcesContext)
