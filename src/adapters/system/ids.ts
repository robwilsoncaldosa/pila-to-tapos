import "server-only"

import type { Ids } from "@/ports/ids"

export const createCryptoIds = (): Ids => ({ uuid: () => crypto.randomUUID() })
