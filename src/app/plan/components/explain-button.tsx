import { Button } from "@/components/ui"

/** The small "?" beside a document. It opens the Magtanong explanation in slice 2. */
export function ExplainButton({ documentName }: { documentName: string }) {
  return (
    <Button
      variant="outline"
      size="icon-touch"
      disabled
      aria-label={`Magtanong tungkol sa ${documentName} (malapit na)`}
    >
      ?
    </Button>
  )
}
