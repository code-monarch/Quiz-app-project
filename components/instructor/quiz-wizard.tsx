"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { ChevronLeft, ChevronRight, Save, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { QuizBasicInfoStep } from "./wizard-steps/quiz-basic-info-step"
import { QuizQuestionsStep } from "./wizard-steps/quiz-questions-step"
import { QuizSettingsStep } from "./wizard-steps/quiz-settings-step"
import { createQuizWithQuestions, updateQuizWithQuestions } from "@/lib/quiz-service"

type QuizFormData = {
  id?: string
  title: string
  description: string
  category: string
  cover_image: string
  time_limit: number
  published: boolean
  archived?: boolean
  settings: {
    shuffle_questions: boolean
    shuffle_options: boolean
    show_results: "immediately" | "after-submission" | "after-due-date"
    allow_retakes: boolean
    max_retakes: number
    passing_score: number
  }
  questions: Array<{
    id?: string
    question_type: string
    question_text: string
    explanation?: string
    points: number
    position: number
    options: Array<{
      id?: string
      option_text: string
      is_correct: boolean
      position: number
    }>
  }>
}

const defaultQuizData: QuizFormData = {
  title: "",
  description: "",
  category: "",
  cover_image: "",
  time_limit: 30,
  published: false,
  settings: {
    shuffle_questions: true,
    shuffle_options: true,
    show_results: "after-submission",
    allow_retakes: true,
    max_retakes: 3,
    passing_score: 70,
  },
  questions: [],
}

interface QuizWizardProps {
  categories: string[]
  initialData?: any
  isEditing?: boolean
}

export function QuizWizard({ categories, initialData, isEditing = false }: QuizWizardProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("basic-info")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [quizData, setQuizData] = useState<QuizFormData>(defaultQuizData)

  // Initialize with initial data if provided (for editing mode)
  useEffect(() => {
    if (initialData) {
      // Transform the data structure if needed
      const formattedData: QuizFormData = {
        id: initialData.id,
        title: initialData.title || "",
        description: initialData.description || "",
        category: initialData.category || "",
        cover_image: initialData.cover_image || "",
        time_limit: initialData.time_limit || 30,
        published: initialData.published || false,
        archived: initialData.archived || false,
        settings: {
          shuffle_questions: initialData.settings?.shuffle_questions || true,
          shuffle_options: initialData.settings?.shuffle_options || true,
          show_results: initialData.settings?.show_results || "after-submission",
          allow_retakes: initialData.settings?.allow_retakes || true,
          max_retakes: initialData.settings?.max_retakes || 3,
          passing_score: initialData.settings?.passing_score || 70,
        },
        questions:
          initialData.questions?.map((q: any, index: number) => ({
            id: q.id,
            question_type: q.question_type,
            question_text: q.question_text,
            explanation: q.explanation || "",
            points: q.points || 1,
            position: q.position || index + 1,
            options:
              q.options?.map((o: any, optIndex: number) => ({
                id: o.id,
                option_text: o.option_text,
                is_correct: o.is_correct,
                position: o.position || optIndex + 1,
              })) || [],
          })) || [],
      }

      setQuizData(formattedData)
    }
  }, [initialData])

  const updateQuizData = (field: string, value: any) => {
    setQuizData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const updateQuizSettings = (settings: any) => {
    setQuizData((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        ...settings,
      },
    }))
  }

  const addQuestion = (question: any) => {
    setQuizData((prev) => {
      const newQuestion = {
        ...question,
        position: prev.questions.length + 1,
        options: question.options.map((opt: any, index: number) => ({
          ...opt,
          position: index + 1,
        })),
      }
      return {
        ...prev,
        questions: [...prev.questions, newQuestion],
      }
    })
  }

  const updateQuestion = (index: number, question: any) => {
    setQuizData((prev) => {
      const updatedQuestions = [...prev.questions]
      // Preserve the ID and position if they exist
      const existingQuestion = updatedQuestions[index]
      updatedQuestions[index] = {
        ...question,
        id: existingQuestion.id,
        position: existingQuestion.position,
        options: question.options.map((opt: any, optIndex: number) => {
          const existingOption = existingQuestion.options[optIndex]
          return {
            ...opt,
            id: existingOption?.id,
            position: optIndex + 1,
          }
        }),
      }
      return {
        ...prev,
        questions: updatedQuestions,
      }
    })
  }

  const removeQuestion = (index: number) => {
    setQuizData((prev) => {
      const updatedQuestions = [...prev.questions]
      updatedQuestions.splice(index, 1)
      // Update positions for remaining questions
      return {
        ...prev,
        questions: updatedQuestions.map((q, i) => ({
          ...q,
          position: i + 1,
        })),
      }
    })
  }

  const handleNext = () => {
    if (activeTab === "basic-info") {
      setActiveTab("questions")
    } else if (activeTab === "questions") {
      setActiveTab("settings")
    } else if (activeTab === "settings") {
      setActiveTab("preview")
    }
  }

  const handleBack = () => {
    if (activeTab === "questions") {
      setActiveTab("basic-info")
    } else if (activeTab === "settings") {
      setActiveTab("questions")
    } else if (activeTab === "preview") {
      setActiveTab("settings")
    }
  }

  const handleSubmit = async () => {
    if (quizData.questions.length === 0) {
      toast.error("Please add at least one question to your quiz")
      setActiveTab("questions")
      return
    }

    setIsSubmitting(true)

    try {
      if (isEditing && quizData.id) {
        // Update existing quiz
        await updateQuizWithQuestions(quizData.id, quizData)
        toast.success("Quiz updated successfully!")
        router.push(`/instructor/quizzes/${quizData.id}`)
      } else {
        // Create new quiz
        const quizId = await createQuizWithQuestions(quizData)
        toast.success("Quiz created successfully!")
        router.push(`/instructor/quizzes/${quizId}`)
      }
      router.refresh()
    } catch (error) {
      console.error("Error saving quiz:", error)
      toast.error(`Failed to ${isEditing ? "update" : "create"} quiz. Please try again.`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const isBasicInfoValid = () => {
    return quizData.title.trim().length > 0 && quizData.category.trim().length > 0
  }

  return (
    <Card className="w-full">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic-info">Basic Info</TabsTrigger>
          <TabsTrigger value="questions" disabled={!isBasicInfoValid()}>
            Questions
          </TabsTrigger>
          <TabsTrigger value="settings" disabled={quizData.questions.length === 0}>
            Settings
          </TabsTrigger>
          <TabsTrigger value="preview" disabled={quizData.questions.length === 0}>
            Preview
          </TabsTrigger>
        </TabsList>

        <CardContent className="pt-6">
          <TabsContent value="basic-info">
            <QuizBasicInfoStep quizData={quizData} updateQuizData={updateQuizData} categories={categories} />
          </TabsContent>

          <TabsContent value="questions">
            <QuizQuestionsStep
              questions={quizData.questions}
              addQuestion={addQuestion}
              updateQuestion={updateQuestion}
              removeQuestion={removeQuestion}
            />
          </TabsContent>

          <TabsContent value="settings">
            <QuizSettingsStep settings={quizData.settings} updateSettings={updateQuizSettings} />
          </TabsContent>

          <TabsContent value="preview">
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Quiz Preview</h3>
                <p className="text-sm text-muted-foreground">
                  Review your quiz before {isEditing ? "saving changes" : "creating it"}.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium">Basic Information</h4>
                  <div className="mt-2 space-y-2">
                    <p>
                      <strong>Title:</strong> {quizData.title}
                    </p>
                    <p>
                      <strong>Description:</strong> {quizData.description || "None"}
                    </p>
                    <p>
                      <strong>Category:</strong> {quizData.category}
                    </p>
                    <p>
                      <strong>Time Limit:</strong> {quizData.time_limit} minutes
                    </p>
                    <p>
                      <strong>Status:</strong> {quizData.published ? "Published" : "Draft"}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium">Questions ({quizData.questions.length})</h4>
                  <div className="mt-2 space-y-4">
                    {quizData.questions.map((q, i) => (
                      <div key={i} className="border p-3 rounded-md">
                        <p className="font-medium">
                          Question {i + 1}: {q.question_text}
                        </p>
                        <p className="text-sm text-muted-foreground">Type: {q.question_type}</p>
                        <p className="text-sm text-muted-foreground">Points: {q.points}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium">Settings</h4>
                  <div className="mt-2 space-y-2">
                    <p>
                      <strong>Shuffle Questions:</strong> {quizData.settings.shuffle_questions ? "Yes" : "No"}
                    </p>
                    <p>
                      <strong>Shuffle Options:</strong> {quizData.settings.shuffle_options ? "Yes" : "No"}
                    </p>
                    <p>
                      <strong>Show Results:</strong> {quizData.settings.show_results}
                    </p>
                    <p>
                      <strong>Allow Retakes:</strong> {quizData.settings.allow_retakes ? "Yes" : "No"}
                    </p>
                    {quizData.settings.allow_retakes && (
                      <p>
                        <strong>Max Retakes:</strong> {quizData.settings.max_retakes}
                      </p>
                    )}
                    <p>
                      <strong>Passing Score:</strong> {quizData.settings.passing_score}%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <div className="flex justify-between mt-6">
            <Button variant="outline" onClick={handleBack} disabled={activeTab === "basic-info"}>
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back
            </Button>

            {activeTab !== "preview" ? (
              <Button
                onClick={handleNext}
                disabled={
                  (activeTab === "basic-info" && !isBasicInfoValid()) ||
                  (activeTab === "questions" && quizData.questions.length === 0)
                }
              >
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isEditing ? "Updating Quiz..." : "Creating Quiz..."}
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {isEditing ? "Save Changes" : "Create Quiz"}
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Tabs>
    </Card>
  )
}
