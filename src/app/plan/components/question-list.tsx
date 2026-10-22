import { ChevronRightIcon } from "lucide-react"

import { Button, Stack } from "@/components/ui"
import type { Question } from "@/domain/plan"

type QuestionListProps = {
  questions: Question[]
  onSelect: (questionId: string) => void
}

/** The common questions, each a large tappable row. */
export function QuestionList({ questions, onSelect }: QuestionListProps) {
  return (
    <Stack asChild gap={3}>
      <ul>
        {questions.map((question) => (
          <li key={question.id}>
            <Button
              variant="outline"
              size="choice"
              className="w-full"
              onClick={() => onSelect(question.id)}
            >
              {question.question}
              <ChevronRightIcon />
            </Button>
          </li>
        ))}
      </ul>
    </Stack>
  )
}
