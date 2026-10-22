import "server-only"

import { readFile } from "node:fs/promises"
import path from "node:path"

import type { SourceInfo } from "@/domain/plan"
import type { SourceTexts } from "@/ports/source-texts"

import { contentDir } from "./paths"

/** Reads content/sources/<id>.txt and content/sources/sources.json. */
export const createFileSourceTexts = (
  sourcesDir: string = path.join(contentDir(), "sources")
): SourceTexts => ({
  get: async (sourceId) => {
    try {
      return await readFile(/*turbopackIgnore: true*/ path.join(sourcesDir, `${sourceId}.txt`), "utf8")
    } catch {
      return null
    }
  },
  list: async () => {
    try {
      return JSON.parse(
        await readFile(/*turbopackIgnore: true*/ path.join(sourcesDir, "sources.json"), "utf8")
      ) as SourceInfo[]
    } catch {
      return []
    }
  },
})
