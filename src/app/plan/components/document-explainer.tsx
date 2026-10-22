import { Card, CardContent, Stack } from "@/components/ui"
import type { PlanDocument } from "@/domain/plan"

import { CitedPassages } from "./cited-passages"

/** What a document is and where to get it, with its citation. The name is the sheet's title. */
export function DocumentExplainer({ document }: { document: PlanDocument }) {
  return (
    <Card>
      <CardContent>
        <Stack gap={4}>
          <p className="text-lg font-bold">{document.explanation}</p>
          <p>
            <strong>Saan kukuha:</strong> {document.whereToGet}
          </p>
          <CitedPassages citations={[document.citation]} />
        </Stack>
      </CardContent>
    </Card>
  )
}
