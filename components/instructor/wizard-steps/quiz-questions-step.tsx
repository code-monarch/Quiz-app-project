"use client"

import { useState, useEffect } from "react"
import { useFormContext } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Plus, Trash, Edit } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"

// Question schema for validation
const questionSchema = z.object({
  question_type: z.enum(["multiple-choice", "true-false", "matching", "fill-blank", "short-answer"]),
  question_text: z.string().min(3, { message: "Question text is required" }),
  explanation: z.string().optional(),
  points: z.coerce.number().int().min(1).default(1),
  options: z
    .array(
      z.object({
        option_text: z.string().min(1, { message: "Option text is required" }),
        is_correct: z.boolean().default(false),
      }),
    )
    .min(2, { message: "At least two options are required" }),
})

type QuestionValues = z.infer<typeof questionSchema>

interface QuizQuestionsStepProps {
  addQuestion: (question: any) => void
  updateQuestion: (index: number, question: any) => void
  removeQuestion: (index: number) => void
}

export function QuizQuestionsStep({ addQuestion, updateQuestion, removeQuestion }: QuizQuestionsStepProps) {
  // Access the parent form context
  const parentForm = useFormContext()
  const questions = parentForm.watch("questions") || []

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)

  // Create a nested form for the question dialog
  const form = useForm<QuestionValues>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      question_type: "multiple-choice",
      question_text: "",
      explanation: "",
      points: 1,
      options: [
        { option_text: "", is_correct: false },
        { option_text: "", is_correct: false },
      ],
    },
  })

  const questionType = form.watch("question_type")

  // Reset form when question type changes
  useEffect(() => {
    if (questionType === "true-false") {
      form.setValue("options", [
        { option_text: "True", is_correct: false },
        { option_text: "False", is_correct: false },
      ])
    }
  }, [questionType, form])

  function onSubmit(values: QuestionValues) {
    if (editingIndex !== null) {
      updateQuestion(editingIndex, values)
    } else {
      addQuestion(values)
    }
    setIsDialogOpen(false)
    resetForm()
  }

  function resetForm() {
    form.reset({
      question_type: "multiple-choice",
      question_text: "",
      explanation: "",
      points: 1,
      options: [
        { option_text: "", is_correct: false },
        { option_text: "", is_correct: false },
      ],
    })
    setEditingIndex(null)
  }

  function handleAddOption() {
    const currentOptions = form.getValues("options") || []
    form.setValue("options", [...currentOptions, { option_text: "", is_correct: false }])
  }

  function handleRemoveOption(index: number) {
    const currentOptions = form.getValues("options") || []
    if (currentOptions.length <= 2) return
    form.setValue(
      "options",
      currentOptions.filter((_, i) => i !== index),
    )
  }

  function handleEditQuestion(index: number) {
    const question = questions[index]

    // Set form values based on question type
    if (question.question_type === "true-false") {
      // Ensure true-false questions have exactly two options: True and False
      const trueOption = question.options.find((o: any) => o.option_text.toLowerCase() === "true") || {
        option_text: "True",
        is_correct: false,
        ...(question.options[0]?.id ? { id: question.options[0].id } : {}),
      }

      const falseOption = question.options.find((o: any) => o.option_text.toLowerCase() === "false") || {
        option_text: "False",
        is_correct: false,
        ...(question.options[1]?.id ? { id: question.options[1].id } : {}),
      }

      form.reset({
        question_type: question.question_type,
        question_text: question.question_text,
        explanation: question.explanation || "",
        points: question.points,
        options: [trueOption, falseOption],
      })
    } else {
      // For other question types, use the options as is
      form.reset({
        question_type: question.question_type,
        question_text: question.question_text,
        explanation: question.explanation || "",
        points: question.points,
        options: question.options || [],
      })
    }

    setEditingIndex(index)
    setIsDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Quiz Questions</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                resetForm()
                setIsDialogOpen(true)
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Question
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto w-[95vw]">
            <DialogHeader>
              <DialogTitle>{editingIndex !== null ? "Edit Question" : "Add New Question"}</DialogTitle>
              <DialogDescription>
                {editingIndex !== null
                  ? "Update this question and its options."
                  : "Create a new question for your quiz. Configure the question type, text, and options."}
              </DialogDescription>
            </DialogHeader>
            {/* This is a nested form separate from the parent form */}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 overflow-y-auto">
                <FormField
                  control={form.control}
                  name="question_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Question Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select question type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                          <SelectItem value="true-false">True/False</SelectItem>
                          <SelectItem value="matching">Matching</SelectItem>
                          <SelectItem value="fill-blank">Fill in the Blank</SelectItem>
                          <SelectItem value="short-answer">Short Answer</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="question_text"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Question Text</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Enter your question" className="min-h-[80px]" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="explanation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Explanation (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Provide an explanation for the correct answer"
                          className="min-h-[80px]"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormDescription>This will be shown to students after they answer the question.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="points"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Points</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          {...field}
                          onChange={(e) => field.onChange(Number.parseInt(e.target.value) || 1)}
                        />
                      </FormControl>
                      <FormDescription>The number of points this question is worth.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {(questionType === "multiple-choice" || questionType === "true-false") && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <FormLabel>Options</FormLabel>
                      {questionType === "multiple-choice" && (
                        <Button type="button" variant="outline" size="sm" onClick={handleAddOption}>
                          <Plus className="h-4 w-4 mr-1" /> Add Option
                        </Button>
                      )}
                    </div>

                    {form.getValues("options")?.map((_, index) => (
                      <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                        <FormField
                          control={form.control}
                          name={`options.${index}.is_correct`}
                          render={({ field }) => (
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`options.${index}.option_text`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormControl>
                                <Input placeholder="Option text" {...field} disabled={questionType === "true-false"} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {questionType === "multiple-choice" && form.getValues("options").length > 2 && (
                          <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveOption(index)}>
                            <Trash className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">{editingIndex !== null ? "Update Question" : "Add Question"}</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {questions.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 border border-dashed rounded-lg">
          <p className="text-muted-foreground mb-4">No questions added yet</p>
          <Button
            variant="outline"
            onClick={() => {
              resetForm()
              setIsDialogOpen(true)
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Your First Question
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {questions.map((question: any, index: number) => (
            <Card key={index}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-base">
                      Question {index + 1}: {question.question_type}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {question.points} {question.points === 1 ? "point" : "points"}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEditQuestion(index)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => removeQuestion(index)}>
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="font-medium mb-2">{question.question_text}</p>
                {question.options && (
                  <div className="space-y-2 mt-2">
                    {question.options.map((option: any, optIndex: number) => (
                      <div
                        key={optIndex}
                        className={`flex items-center p-2 rounded-md ${
                          option.is_correct ? "bg-green-50 border border-green-200" : ""
                        }`}
                      >
                        {option.is_correct && <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>}
                        <span>{option.option_text}</span>
                      </div>
                    ))}
                  </div>
                )}
                {question.explanation && (
                  <div className="mt-3 pt-3 border-t text-sm">
                    <p className="font-medium">Explanation:</p>
                    <p className="text-muted-foreground">{question.explanation}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
