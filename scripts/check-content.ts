import { readFile } from "node:fs/promises"
import path from "node:path"

import { countCitations, validateCitations } from "../src/domain/citations"
import { missingEnglish } from "../src/domain/localize"
import type { Plan, SourceId } from "../src/domain/plan"

const root = path.join(process.cwd(), "content")
const sourceIds: SourceId[] = ["rmc-47-2026", "cc-28a", "rmc-84-2026"]

const main = async () => {
  const plan = JSON.parse(
    await readFile(path.join(root, "plan", "bir-closure.json"), "utf8")
  ) as Plan
  const sourceTexts: Partial<Record<SourceId, string>> = {}
  for (const id of sourceIds) {
    sourceTexts[id] = await readFile(path.join(root, "sources", `${id}.txt`), "utf8")
  }
  const problems = [...validateCitations(plan, sourceTexts), ...missingEnglish(plan)]
  if (problems.length > 0) {
    console.error(`content check failed (${problems.length} problem${problems.length === 1 ? "" : "s"}):`)
    for (const problem of problems) console.error(`  - ${problem}`)
    process.exit(1)
  }
  console.log(`content OK (${countCitations(plan)} citations checked, English text complete)`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
