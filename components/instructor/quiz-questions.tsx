"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Pencil, Trash2, Plus, GripVertical } from "lucide-react"
import { deleteQuestion } from "@/lib/quiz-service"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

interface QuizQuestionsProps {
  quizId: string
  questions: any[]
}

export function QuizQuestions({ quizId, questions }: QuizQuestionsProps) {
  const { toast } = useToast()
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  const handleDeleteQuestion = async (questionId: string) => {
    try {
      setIsDeleting(questionId)
      await deleteQuestion(questionId)
      toast({
        title: "Question deleted",
        description: "The question has been successfully deleted.",
      })
      router.refresh()
    } catch (error) {
      console.error("Error deleting question:", error)
      toast({
        title: "Error",
        description: "Failed to delete the question. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">
          {questions.length} {questions.length === 1 ? "Question" : "Questions"}
        </h3>
        <Button size="sm" asChild>
          <a href={`/instructor/quizzes/${quizId}/create`}>
            <Plus className="mr-2 h-4 w-4" /> Add Question
          </a>
        </Button>
      </div>

      {questions.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
          <h3 className="mb-2 text-lg font-medium">No questions yet</h3>
          <p className="mb-4 text-sm text-muted-foreground">Get started by adding your first question.</p>
          <Button asChild>
            <a href={`/instructor/quizzes/${quizId}/create`}>
              <Plus className="mr-2 h-4 w-4" /> Add Question
            </a>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {questions.map((question, index) => (
            <Card key={question.id} className="relative">
              <CardContent className="flex items-start gap-4 p-4">
                <div className="flex h-full items-center text-muted-foreground">
                  <GripVertical className="h-5 w-5 cursor-grab" />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="font-normal">
                      {question.question_type}
                    </Badge>
                    <Badge variant="outline" className="font-normal">
                      {question.points} {question.points === 1 ? "point" : "points"}
                    </Badge>
                  </div>
                  <p className="font-medium">{question.question_text}</p>
                  {question.explanation && (
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium">Explanation:</span> {question.explanation}
                    </p>
                  )}
                  {question.options && question.options.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {question.options.map((option: any) => (
                        <div key={option.id} className="flex items-center gap-2">
                          <div
                            className={`h-2 w-2 rounded-full ${option.is_correct ? "bg-green-500" : "bg-gray-300"}`}
                          />
                          <p className="text-sm">{option.option_text}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" asChild>
                    <a href={`/instructor/quizzes/${quizId}/edit`}>
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </a>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    disabled={isDeleting === question.id}
                    onClick={() => handleDeleteQuestion(question.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
