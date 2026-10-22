/** What the Magtanong sheet is showing. */
export type AskView =
  | { kind: "list" }
  | { kind: "question"; questionId: string }
  | { kind: "document"; documentId: string }
