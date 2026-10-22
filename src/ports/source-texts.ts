import type { SourceId, SourceInfo } from "@/domain/plan"

export type SourceTexts = {
  /** The excerpt text of one official source. */
  get: (sourceId: SourceId) => Promise<string | null>
  /** Title, URL and effective date of every source. */
  list: () => Promise<SourceInfo[]>
}
