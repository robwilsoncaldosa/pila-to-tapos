import "server-only"

import path from "node:path"

export const contentDir = (): string => path.join(process.cwd(), "content")
