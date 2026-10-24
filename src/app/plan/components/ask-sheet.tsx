"use client"

import { ChevronLeftIcon } from "lucide-react"

import {
  Button,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  Stack,
} from "@/components/ui"
import type { Plan } from "@/domain/plan"
import { useT } from "@/i18n"

import { AnswerCard } from "./answer-card"
import type { AskView } from "./ask-view"
import { DocumentExplainer } from "./document-explainer"
import { NotInSourceCard } from "./not-in-source-card"
import { QuestionList } from "./question-list"

type AskSheetProps = {
  plan: Plan
  open: boolean
  onOpenChange: (open: boolean) => void
  view: AskView
  onViewChange: (view: AskView) => void
}

/** The Ask sheet. It overlays the plan, so closing it leaves her where she was. */
export function AskSheet({ plan, open, onOpenChange, view, onViewChange }: AskSheetProps) {
  const { t } = useT()
  const question =
    view.kind === "question"
      ? plan.questions.find((item) => item.id === view.questionId)
      : undefined
  const document =
    view.kind === "document"
      ? plan.documents.find((item) => item.id === view.documentId)
      : undefined

  const title = question?.question ?? document?.name ?? t("ask.title")

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="max-h-[85dvh]">
        <SheetHeader className="mr-16">
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription className="sr-only">
            {t("ask.description")}
          </SheetDescription>
        </SheetHeader>
        <div
          key={title}
          className="overflow-y-auto px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]"
        >
          <Stack gap={4}>
            {question ? (
              <>
                <Button
                  variant="outline"
                  size="touch"
                  className="self-start"
                  onClick={() => onViewChange({ kind: "list" })}
                >
                  <ChevronLeftIcon />
                  {t("ask.list")}
                </Button>
                {question.kind === "direct" ? (
                  <AnswerCard question={question} />
                ) : (
                  <NotInSourceCard question={question} />
                )}
              </>
            ) : null}
            {document ? <DocumentExplainer document={document} /> : null}
            {view.kind === "list" ? (
              <QuestionList
                questions={plan.questions}
                onSelect={(questionId) => onViewChange({ kind: "question", questionId })}
              />
            ) : null}
          </Stack>
        </div>
      </SheetContent>
    </Sheet>
  )
}
