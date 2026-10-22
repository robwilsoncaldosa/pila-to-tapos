import { Card, CardContent, Stack } from "@/components/ui"
import type { Question } from "@/domain/plan"

import { CitedPassages } from "./cited-passages"

/** A question the official source answers: the answer, then the quoted source underneath. */
export function AnswerCard({ question }: { question: Question }) {
  return (
    <Card>
      <CardContent>
        <Stack gap={4}>
          <p className="text-lg font-bold">{question.answer}</p>
          <CitedPassages citations={question.citations} />
        </Stack>
      </CardContent>
    </Card>
  )
}
