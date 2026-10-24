import assert from "node:assert/strict"
import { test } from "node:test"

import type { Citation, Plan, PlanDocument } from "@/domain/plan"
import type { PlanRepository } from "@/ports/plan-repository"
import type { TeamAccess } from "@/ports/team-access"

import { createTeamService } from "./team-service"

const SOURCE = "TOTAL PROCESSING TIME: 3 Days. Bring the Certificate of Registration."
const good: Citation = { sourceId: "cc-28a", locator: "x", quote: "TOTAL PROCESSING TIME: 3 Days" }

const makePlan = (): Plan => ({
  transaction: {
    id: "bir-closure-freelancer",
    title: "T",
    processingTimeLabel: "about 3 working days",
    processingCitation: good,
    lastCheckedOn: "2026-10-22",
    revision: 1,
  },
  counter: { id: "c", label: "C", speechLabel: "C" },
  steps: [
    { id: "s1", position: 1, name: "S1", kind: "visit", visitNo: 1, citation: good, revision: 1 },
    { id: "s2", position: 2, name: "S2", kind: "wait", waitWorkingDays: 3, citation: good, revision: 1 },
  ],
  documents: [
    {
      id: "a",
      position: 1,
      name: "A",
      whereToGet: "BIR",
      requirement: "required",
      explanation: "e",
      citation: good,
      revision: 1,
      en: { name: "A in English" },
    },
  ],
  fees: [{ id: "f1", label: "F", amountPhp: 30, visitNo: 2, citation: good, revision: 1 }],
  questions: [],
})

/** A plain-object repository that bumps revisions the way the real one must. */
const fakePlans = (): { repo: PlanRepository; plan: () => Plan } => {
  let plan = makePlan()
  const touch = (change: (p: Plan) => void) => {
    const next = structuredClone(plan)
    change(next)
    next.transaction.revision += 1
    plan = next
    return { ok: true as const, value: plan }
  }
  const repo: PlanRepository = {
    getPlan: async () => ({ ok: true, value: plan }),
    saveStep: async (_t, step) =>
      touch((p) => {
        const i = p.steps.findIndex((s) => s.id === step.id)
        p.steps[i] = { ...step, revision: p.steps[i].revision + 1 }
      }),
    saveDocument: async (_t, doc) =>
      touch((p) => {
        const i = p.documents.findIndex((d) => d.id === doc.id)
        p.documents[i] = { ...doc, revision: p.documents[i].revision + 1 }
      }),
    saveFee: async (_t, fee) =>
      touch((p) => {
        const i = p.fees.findIndex((f) => f.id === fee.id)
        p.fees[i] = { ...fee, revision: p.fees[i].revision + 1 }
      }),
    saveMeta: async (_t, meta) =>
      touch((p) => {
        p.transaction = {
          ...p.transaction,
          ...meta,
          metaRevision: (p.transaction.metaRevision ?? 1) + 1,
        }
      }),
    addDocument: async (_t, doc: PlanDocument) => touch((p) => void p.documents.push(doc)),
    removeDocument: async (_t, id) =>
      touch((p) => {
        p.documents = p.documents.filter((d) => d.id !== id)
      }),
  }
  return { repo, plan: () => plan }
}

const access: TeamAccess = {
  isConfigured: () => true,
  matchesPasscode: (input) => input === "open sesame",
  issueToken: () => ({ token: "tok", maxAgeSeconds: 60 }),
  verifyToken: (token) => token === "tok",
}

const setup = (teamAccess: TeamAccess = access) => {
  const { repo, plan } = fakePlans()
  const service = createTeamService({
    plans: repo,
    sources: { get: async () => SOURCE, list: async () => [] },
    access: teamAccess,
    ids: { uuid: () => "abcdef12-0000" },
  })
  return { service, plan }
}

const docEdit = (citation: Citation = good) => ({
  name: "A2",
  whereToGet: "Anywhere",
  requirement: "required" as const,
  explanation: "e2",
  citation,
})

test("a save without a citation is refused and nothing changes", async () => {
  const { service, plan } = setup()
  const missing = { sourceId: "cc-28a" as const, locator: "x", quote: "  " }
  const result = await service.saveDocument({ id: "a", ...docEdit(missing) })
  assert.deepEqual(result, { ok: false, error: "citation_required" })
  assert.equal(plan().documents[0].revision, 1)
  assert.equal(plan().transaction.revision, 1)
})

test("a quote that is not in the cited source is refused", async () => {
  const { service, plan } = setup()
  const made = { ...good, quote: "bring a pony" }
  assert.deepEqual(await service.saveFee({ id: "f1", label: "F", amountPhp: 30, citation: made }), {
    ok: false,
    error: "quote_not_in_source",
  })
  assert.deepEqual(
    await service.saveMeta({ processingTimeLabel: "x", lastCheckedOn: "2026-10-23", citation: made }),
    { ok: false, error: "quote_not_in_source" }
  )
  assert.equal(plan().transaction.revision, 1)
})

test("a valid save bumps the item's revision and the transaction's", async () => {
  const { service, plan } = setup()
  const result = await service.saveDocument({ id: "a", ...docEdit() })
  assert.equal(result.ok, true)
  assert.equal(plan().documents[0].name, "A2")
  assert.equal(plan().documents[0].revision, 2)
  assert.equal(plan().transaction.revision, 2)
})

test("saving a document keeps its English text", async () => {
  const { service, plan } = setup()
  await service.saveDocument({ id: "a", ...docEdit() })
  assert.equal(plan().documents[0].name, "A2")
  assert.equal(plan().documents[0].en?.name, "A in English")
})

test("a step save keeps its kind and only the waiting step takes working days", async () => {
  const { service, plan } = setup()
  const wait = await service.saveStep({
    id: "s2",
    name: "Wait",
    position: 2,
    waitWorkingDays: 4,
    citation: good,
  })
  assert.equal(wait.ok, true)
  assert.equal(plan().steps[1].waitWorkingDays, 4)
  assert.equal(plan().steps[1].kind, "wait")
  assert.deepEqual(
    await service.saveStep({ id: "s2", name: "Wait", position: 2, waitWorkingDays: 0, citation: good }),
    { ok: false, error: "invalid_input" }
  )
})

test("a meta save bumps the meta revision", async () => {
  const { service, plan } = setup()
  await service.saveMeta({ processingTimeLabel: "about 4 days", lastCheckedOn: "2026-10-23", citation: good })
  assert.equal(plan().transaction.processingTimeLabel, "about 4 days")
  assert.equal(plan().transaction.metaRevision, 2)
})

test("a document can be added and then removed", async () => {
  const { service, plan } = setup()
  const added = await service.addDocument(docEdit())
  assert.equal(added.ok, true)
  assert.equal(plan().documents.length, 2)
  assert.equal(plan().documents[1].id, "doc-abcdef12")
  assert.equal(plan().documents[1].position, 2)
  const removed = await service.removeDocument("doc-abcdef12")
  assert.equal(removed.ok, true)
  assert.deepEqual(plan().documents.map((d) => d.id), ["a"])
})

test("a situation document needs its question and reason", async () => {
  const { service } = setup()
  const result = await service.addDocument({ ...docEdit(), requirement: "situation" })
  assert.deepEqual(result, { ok: false, error: "invalid_input" })
})

test("the passcode unlocks only when configured and correct", () => {
  assert.deepEqual(setup().service.checkPasscode("open sesame"), {
    ok: true,
    value: { token: "tok", maxAgeSeconds: 60 },
  })
  assert.deepEqual(setup().service.checkPasscode("nope"), { ok: false, error: "wrong_passcode" })
  const unset = setup({ ...access, isConfigured: () => false }).service
  assert.deepEqual(unset.checkPasscode("open sesame"), { ok: false, error: "not_configured" })
})
