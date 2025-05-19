"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { ChevronLeft, ChevronRight, Save, Loader2 } from "lucide-react"
import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { QuizBasicInfoStep } from "./wizard-steps/quiz-basic-info-step"
import { QuizQuestionsStep } from "./wizard-steps/quiz-questions-step"
import { QuizSettingsStep } from "./wizard-steps/quiz-settings-step"
import { createQuizWithQuestions, updateQuizWithQuestions } from "@/lib/quiz-service"

// Schema for the entire form
const quizFormSchema = z.object({
  // Basic info
  id: z.string().optional(),
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  description: z.string().optional(),
  category: z.string().min(1, { message: "Category is required" }),
  cover_image: z.string().optional(),
  time_limit: z.number().int().nonnegative(),
  published: z.boolean().default(false),
  archived: z.boolean().optional(),

  // Settings
  settings: z.object({
    shuffle_questions: z.boolean().default(true),
    shuffle_options: z.boolean().default(true),
    show_results: z.enum(["immediately", "after-submission", "after-due-date"]).default("after-submission"),
    allow_retakes: z.boolean().default(true),
    max_retakes: z.number().int().min(0).default(3),
    passing_score: z.number().int().min(0).max(100).default(70),
  }),

  // Questions will be managed separately as they're more complex
  questions: z.array(z.any()).min(0),
})

type QuizFormData = z.infer<typeof quizFormSchema>

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

  // Create parent form with react-hook-form
  const methods = useForm<QuizFormData>({
    resolver: zodResolver(quizFormSchema),
    defaultValues: defaultQuizData,
    mode: "onChange",
  })

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

      methods.reset(formattedData)
    }
  }, [initialData, methods])

  const addQuestion = (question: any) => {
    const currentQuestions = methods.getValues("questions") || []
    const newQuestion = {
      ...question,
      position: currentQuestions.length + 1,
      options: question.options.map((opt: any, index: number) => ({
        ...opt,
        position: index + 1,
      })),
    }

    methods.setValue("questions", [...currentQuestions, newQuestion], {
      shouldValidate: true,
      shouldDirty: true,
    })
  }

  const updateQuestion = (index: number, question: any) => {
    const currentQuestions = [...methods.getValues("questions")]
    const existingQuestion = currentQuestions[index]

    currentQuestions[index] = {
      ...question,
      id: existingQuestion.id,
      position: existingQuestion.position,
      options: question.options.map((opt: any, optIndex: number) => {
        const existingOption = existingQuestion?.options?.[optIndex]
        return {
          ...opt,
          id: existingOption?.id,
          position: optIndex + 1,
        }
      }),
    }

    methods.setValue("questions", currentQuestions, {
      shouldValidate: true,
      shouldDirty: true,
    })
  }

  const removeQuestion = (index: number) => {
    const currentQuestions = [...methods.getValues("questions")]
    currentQuestions.splice(index, 1)

    methods.setValue(
      "questions",
      currentQuestions.map((q, i) => ({
        ...q,
        position: i + 1,
      })),
      {
        shouldValidate: true,
        shouldDirty: true,
      },
    )
  }

  const handleNext = () => {
    // Handle tab navigation with validation
    if (activeTab === "basic-info") {
      methods.trigger(["title", "category"]).then((isValid) => {
        if (isValid) {
          setActiveTab("questions")
        } else {
          toast.error("Please fill in all required fields")
        }
      })
    } else if (activeTab === "questions") {
      const questions = methods.getValues("questions")
      if (questions.length === 0) {
        toast.error("Please add at least one question")
      } else {
        setActiveTab("settings")
      }
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

  const onSubmit = async (data: QuizFormData) => {
    if (data.questions.length === 0) {
      toast.error("Please add at least one question to your quiz")
      setActiveTab("questions")
      return
    }

    setIsSubmitting(true)

    try {
      if (isEditing && data.id) {
        // Update existing quiz
        await updateQuizWithQuestions(data.id, data)
        toast.success("Quiz updated successfully!")
        router.push(`/instructor/quizzes/${data.id}`)
      } else {
        // Create new quiz
        const quizId = await createQuizWithQuestions(data)
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
    const { title, category } = methods.getValues()
    return title.trim().length > 0 && category.trim().length > 0
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <Card className="w-full">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic-info">Basic Info</TabsTrigger>
              <TabsTrigger value="questions" disabled={!isBasicInfoValid()}>
                Questions
              </TabsTrigger>
              <TabsTrigger value="settings" disabled={methods.getValues("questions").length === 0}>
                Settings
              </TabsTrigger>
              <TabsTrigger value="preview" disabled={methods.getValues("questions").length === 0}>
                Preview
              </TabsTrigger>
            </TabsList>

            <CardContent className="pt-6">
              <TabsContent value="basic-info">
                <QuizBasicInfoStep categories={categories} />
              </TabsContent>

              <TabsContent value="questions">
                <QuizQuestionsStep
                  addQuestion={addQuestion}
                  updateQuestion={updateQuestion}
                  removeQuestion={removeQuestion}
                />
              </TabsContent>

              <TabsContent value="settings">
                <QuizSettingsStep />
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
                          <strong>Title:</strong> {methods.getValues("title")}
                        </p>
                        <p>
                          <strong>Description:</strong> {methods.getValues("description") || "None"}
                        </p>
                        <p>
                          <strong>Category:</strong> {methods.getValues("category")}
                        </p>
                        <p>
                          <strong>Time Limit:</strong> {methods.getValues("time_limit")} minutes
                        </p>
                        <p>
                          <strong>Status:</strong> {methods.getValues("published") ? "Published" : "Draft"}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium">Questions ({methods.getValues("questions").length})</h4>
                      <div className="mt-2 space-y-4">
                        {methods.getValues("questions").map((q: any, i: number) => (
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
                          <strong>Shuffle Questions:</strong>{" "}
                          {methods.getValues("settings.shuffle_questions") ? "Yes" : "No"}
                        </p>
                        <p>
                          <strong>Shuffle Options:</strong>{" "}
                          {methods.getValues("settings.shuffle_options") ? "Yes" : "No"}
                        </p>
                        <p>
                          <strong>Show Results:</strong> {methods.getValues("settings.show_results")}
                        </p>
                        <p>
                          <strong>Allow Retakes:</strong> {methods.getValues("settings.allow_retakes") ? "Yes" : "No"}
                        </p>
                        {methods.getValues("settings.allow_retakes") && (
                          <p>
                            <strong>Max Retakes:</strong> {methods.getValues("settings.max_retakes")}
                          </p>
                        )}
                        <p>
                          <strong>Passing Score:</strong> {methods.getValues("settings.passing_score")}%
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <div className="flex justify-between mt-6">
                <Button type="button" variant="outline" onClick={handleBack} disabled={activeTab === "basic-info"}>
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>

                {activeTab !== "preview" ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    disabled={
                      (activeTab === "basic-info" && !isBasicInfoValid()) ||
                      (activeTab === "questions" && methods.getValues("questions").length === 0)
                    }
                  >
                    Next
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button type="submit" disabled={isSubmitting}>
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
      </form>
    </FormProvider>
  )
}
