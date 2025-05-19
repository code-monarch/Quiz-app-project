"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "sonner"
import { ArrowLeft, ArrowRight, Clock, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form } from "@/components/ui/form"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import type { QuizWithQuestions } from "@/types/quiz"
import { startQuizAttempt, submitQuizAttempt, submitQuizResponse } from "@/lib/quiz-service"

interface QuizAttemptProps {
  quiz: QuizWithQuestions
}

export function QuizAttempt({ quiz }: QuizAttemptProps) {
  const router = useRouter()
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [attemptId, setAttemptId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState<number | null>(quiz.time_limit ? quiz.time_limit * 60 : null)
  const [responses, setResponses] = useState<Record<string, any>>({})

  const currentQuestion = quiz.questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100

  // Start quiz attempt when component mounts
  useEffect(() => {
    const startAttempt = async () => {
      setIsLoading(true)
      try {
        const id = await startQuizAttempt(quiz.id)
        setAttemptId(id)
      } catch (error) {
        console.error("Error starting quiz attempt:", error)
        toast.error("Failed to start quiz. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    startAttempt()
  }, [quiz.id])

  // Timer countdown
  useEffect(() => {
    if (!timeRemaining) return

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (!prev || prev <= 0) {
          clearInterval(timer)
          handleSubmitQuiz()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [timeRemaining])

  // Format time remaining
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  // Create form schema based on question type
  const getFormSchema = () => {
    if (!currentQuestion) return z.object({})

    switch (currentQuestion.question_type) {
      case "multiple-choice":
        return z.object({
          selectedOptionId: z.string().min(1, "Please select an answer"),
        })
      case "true-false":
        return z.object({
          selectedOptionId: z.string().min(1, "Please select an answer"),
        })
      case "short-answer":
        return z.object({
          textResponse: z.string().min(1, "Please enter your answer"),
        })
      case "fill-blank":
        return z.object({
          textResponse: z.string().min(1, "Please enter your answer"),
        })
      case "matching":
        // For matching, we'd need a more complex schema
        return z.object({})
      default:
        return z.object({})
    }
  }

  const form = useForm({
    resolver: zodResolver(getFormSchema()),
    defaultValues: {
      selectedOptionId: responses[currentQuestion?.id]?.selectedOptionId || "",
      textResponse: responses[currentQuestion?.id]?.textResponse || "",
    },
  })

  // Reset form when question changes
  useEffect(() => {
    if (currentQuestion) {
      form.reset({
        selectedOptionId: responses[currentQuestion.id]?.selectedOptionId || "",
        textResponse: responses[currentQuestion.id]?.textResponse || "",
      })
    }
  }, [currentQuestion, responses, form])

  const handleNext = async (values: any) => {
    if (!attemptId || !currentQuestion) return

    // Save response
    const response = {
      ...values,
      questionId: currentQuestion.id,
    }

    setResponses((prev) => ({
      ...prev,
      [currentQuestion.id]: response,
    }))

    // Submit response to server
    try {
      await submitQuizResponse(attemptId, currentQuestion.id, values)
    } catch (error) {
      console.error("Error submitting response:", error)
      toast.error("Failed to save your answer. Please try again.")
    }

    // Move to next question or submit quiz
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      handleSubmitQuiz()
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const handleSubmitQuiz = async () => {
    if (!attemptId) return

    setIsSubmitting(true)
    try {
      await submitQuizAttempt(attemptId)
      toast.success("Quiz submitted successfully!")
      router.push(`/student/quizzes/${quiz.id}/results/${attemptId}`)
    } catch (error) {
      console.error("Error submitting quiz:", error)
      toast.error("Failed to submit quiz. Please try again.")
      setIsSubmitting(false)
    }
  }

  if (isLoading || !attemptId) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
          <p className="mt-2">Loading quiz...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{quiz.title}</h1>
          <p className="text-muted-foreground">
            Question {currentQuestionIndex + 1} of {quiz.questions.length}
          </p>
        </div>
        {timeRemaining !== null && (
          <div className="flex items-center gap-2 rounded-full bg-secondary px-4 py-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{formatTime(timeRemaining)}</span>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span>Progress</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {currentQuestion && (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">{currentQuestion.question_text}</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form id="question-form" onSubmit={form.handleSubmit(handleNext)}>
                {currentQuestion.question_type === "multiple-choice" && (
                  <div className="space-y-4">
                    {currentQuestion.options && (
                      <RadioGroup
                        value={form.watch("selectedOptionId")}
                        onValueChange={(value) => form.setValue("selectedOptionId", value)}
                      >
                        {currentQuestion.options.map((option) => (
                          <div key={option.id} className="flex items-center space-x-2 rounded-md p-3 hover:bg-muted">
                            <RadioGroupItem value={option.id} id={option.id} />
                            <Label htmlFor={option.id} className="flex-1 cursor-pointer">
                              {option.option_text}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    )}
                    {form.formState.errors.selectedOptionId && (
                      <p className="text-sm text-destructive">{form.formState.errors.selectedOptionId.message}</p>
                    )}
                  </div>
                )}

                {currentQuestion.question_type === "true-false" && (
                  <div className="space-y-4">
                    <RadioGroup
                      value={form.watch("selectedOptionId")}
                      onValueChange={(value) => form.setValue("selectedOptionId", value)}
                    >
                      {currentQuestion.options &&
                        currentQuestion.options.map((option) => (
                          <div key={option.id} className="flex items-center space-x-2 rounded-md p-3 hover:bg-muted">
                            <RadioGroupItem value={option.id} id={option.id} />
                            <Label htmlFor={option.id} className="flex-1 cursor-pointer">
                              {option.option_text}
                            </Label>
                          </div>
                        ))}
                    </RadioGroup>
                    {form.formState.errors.selectedOptionId && (
                      <p className="text-sm text-destructive">{form.formState.errors.selectedOptionId.message}</p>
                    )}
                  </div>
                )}

                {(currentQuestion.question_type === "short-answer" ||
                  currentQuestion.question_type === "fill-blank") && (
                  <div className="space-y-4">
                    <Input placeholder="Type your answer here..." {...form.register("textResponse")} />
                    {form.formState.errors.textResponse && (
                      <p className="text-sm text-destructive">{form.formState.errors.textResponse.message}</p>
                    )}
                  </div>
                )}

                {currentQuestion.question_type === "matching" && (
                  <div className="text-center py-6 text-muted-foreground">
                    <p>Matching questions are not supported in this demo.</p>
                  </div>
                )}
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={handlePrevious} disabled={currentQuestionIndex === 0}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>
            <Button type="submit" form="question-form">
              {currentQuestionIndex < quiz.questions.length - 1 ? (
                <>
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              ) : (
                "Submit Quiz"
              )}
            </Button>
          </CardFooter>
        </Card>
      )}

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => router.push(`/student/quizzes/${quiz.id}`)}>
          Exit Quiz
        </Button>
        <Button variant="destructive" onClick={handleSubmitQuiz} disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            "Submit Quiz"
          )}
        </Button>
      </div>
    </div>
  )
}
