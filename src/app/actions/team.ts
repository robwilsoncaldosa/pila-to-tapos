"use server"

import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"

import { err, ok, type Result } from "@/domain/result"
import { getContainer } from "@/composition-root"
import type { TeamSaveError, UnlockError } from "@/services/team-service"

import { TEAM_COOKIE, TEAM_COOKIE_PATH } from "./team-cookie"
import {
  isRecord,
  parseDocumentFields,
  parseFeeEdit,
  parseId,
  parseMetaEdit,
  parseStepEdit,
} from "./team-input"

// Server actions are adapters: authorize, parse the input, call one service method, return plain data.

export type TeamActionError = TeamSaveError | "unauthorized"

const authorized = async (): Promise<boolean> =>
  getContainer().teamService.isAuthorized((await cookies()).get(TEAM_COOKIE)?.value)

/** Runs one save when the cookie is valid, then refreshes /team. The plan itself is re-read on each /plan load. */
const guarded = async (
  run: () => Promise<Result<unknown, TeamSaveError>> | Result<unknown, TeamSaveError>
): Promise<Result<null, TeamActionError>> => {
  if (!(await authorized())) return err("unauthorized")
  const result = await run()
  if (!result.ok) return err(result.error)
  revalidatePath("/team")
  return ok(null)
}

export async function unlockTeam(
  passcode: unknown
): Promise<Result<null, UnlockError | "invalid_input">> {
  if (typeof passcode !== "string" || passcode.length === 0 || passcode.length > 200) {
    return err("invalid_input")
  }
  const result = getContainer().teamService.checkPasscode(passcode)
  if (!result.ok) return err(result.error)
  const { token, maxAgeSeconds } = result.value
  ;(await cookies()).set(TEAM_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: TEAM_COOKIE_PATH,
    maxAge: maxAgeSeconds,
  })
  revalidatePath("/team")
  return ok(null)
}

export async function saveStep(input: unknown): Promise<Result<null, TeamActionError>> {
  const edit = parseStepEdit(input)
  if (!edit) return err("invalid_input")
  return guarded(() => getContainer().teamService.saveStep(edit))
}

export async function saveDocument(input: unknown): Promise<Result<null, TeamActionError>> {
  if (!isRecord(input)) return err("invalid_input")
  const id = parseId(input.id)
  const fields = parseDocumentFields(input)
  if (!id || !fields) return err("invalid_input")
  return guarded(() => getContainer().teamService.saveDocument({ id, ...fields }))
}

export async function saveFee(input: unknown): Promise<Result<null, TeamActionError>> {
  const edit = parseFeeEdit(input)
  if (!edit) return err("invalid_input")
  return guarded(() => getContainer().teamService.saveFee(edit))
}

export async function saveMeta(input: unknown): Promise<Result<null, TeamActionError>> {
  const edit = parseMetaEdit(input)
  if (!edit) return err("invalid_input")
  return guarded(() => getContainer().teamService.saveMeta(edit))
}

export async function addDocument(input: unknown): Promise<Result<null, TeamActionError>> {
  const fields = parseDocumentFields(input)
  if (!fields) return err("invalid_input")
  return guarded(() => getContainer().teamService.addDocument(fields))
}

export async function removeDocument(documentId: unknown): Promise<Result<null, TeamActionError>> {
  const id = parseId(documentId)
  if (!id) return err("invalid_input")
  return guarded(() => getContainer().teamService.removeDocument(id))
}
