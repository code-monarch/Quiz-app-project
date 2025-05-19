"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "sonner"
import { Trash2, Plus } from "lucide-react"
import { createQuestion } from "@/lib/quiz-service-questions"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

const questionSchema = z.object({
  question_type: z.enum(["multiple_choice", "true_false", "short_answer", "matching"]),
  question_text: z.string().min(3, { message: "Question text must be at least 3 characters" }),
  explanation: z.string().optional(),
  points: z.coerce.number().min(1).default(1),
  options: z
    .array(
      z.object({
        option_text: z.string().min(1, { message: "Option text is required" }),
        is_correct: z.boolean().default(false),
      }),
    )
    .optional(),
  correct_answer: z.enum(["true", "false"]).optional(),
})

type QuestionFormValues = z.infer<typeof questionSchema>

interface QuestionFormProps {
  quizId: string
}

export function QuestionForm({ quizId }: QuestionFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<QuestionFormValues>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      question_type: "multiple_choice",
      question_text: "",
      explanation: "",
      points: 1,
      options: [
        { option_text: "", is_correct: false },
        { option_text: "", is_correct: false },
        { option_text: "", is_correct: false },
        { option_text: "", is_correct: false },
      ],
      correct_answer: undefined,
    },
  })

  const questionType = form.watch("question_type")

  const onSubmit = async (data: QuestionFormValues) => {
    setIsSubmitting(true)

    try {
      // Handle different question types
      const processedData = { ...data }

      if (data.question_type === "true_false") {
        // For true/false questions, create two options: True and False
        processedData.options = [
          { option_text: "True", is_correct: data.correct_answer === "true" },
          { option_text: "False", is_correct: data.correct_answer === "false" },
        ]
      } else if (data.question_type === "short_answer") {
        // Short answer questions don't need options
        processedData.options = []
      } else if (data.question_type === "multiple_choice") {
        // Filter out empty options for multiple choice
        processedData.options = data.options?.filter((option) => option.option_text.trim() !== "") || []
      }

      // Remove the correct_answer field as it's not needed in the API
      delete processedData.correct_answer

      await createQuestion(quizId, processedData)
      toast.success("Question added successfully!")
      router.push(`/instructor/quizzes/${quizId}`)
      router.refresh()
    } catch (error) {
      console.error("Error adding question:", error)
      toast.error("Failed to add question. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const addOption = () => {
    const currentOptions = form.getValues("options") || []
    form.setValue("options", [...currentOptions, { option_text: "", is_correct: false }])
  }

  const removeOption = (index: number) => {
    const currentOptions = form.getValues("options") || []
    form.setValue(
      "options",
      currentOptions.filter((_, i) => i !== index),
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                  <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
                  <SelectItem value="true_false">True/False</SelectItem>
                  <SelectItem value="short_answer">Short Answer</SelectItem>
                  <SelectItem value="matching">Matching</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>Select the type of question you want to create</FormDescription>
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
                <Textarea placeholder="Enter your question here" {...field} className="min-h-[100px]" />
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
                  {...field}
                  className="min-h-[80px]"
                />
              </FormControl>
              <FormDescription>This will be shown to students after they answer</FormDescription>
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
                <Input type="number" min={1} {...field} />
              </FormControl>
              <FormDescription>How many points this question is worth</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {questionType === "multiple_choice" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base">Answer Options</Label>
              <Button type="button" variant="outline" size="sm" onClick={addOption}>
                <Plus className="mr-2 h-4 w-4" />
                Add Option
              </Button>
            </div>

            {form.getValues("options")?.map((_, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-1 space-y-2">
                      <FormField
                        control={form.control}
                        name={`options.${index}.option_text`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Option {index + 1}</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter option text" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`options.${index}.is_correct`}
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                            <div className="space-y-0.5">
                              <FormLabel>Correct Answer</FormLabel>
                              <FormDescription>Mark this as the correct answer</FormDescription>
                            </div>
                            <FormControl>
                              <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeOption(index)}
                      disabled={form.getValues("options")?.length <= 2}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                      <span className="sr-only">Remove option</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {questionType === "true_false" && (
          <FormField
            control={form.control}
            name="correct_answer"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Answer</FormLabel>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <FormControl>
                      <input
                        type="radio"
                        className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
                        checked={field.value === "true"}
                        onChange={() => field.onChange("true")}
                        id="true-option"
                      />
                    </FormControl>
                    <Label htmlFor="true-option" className="font-normal">
                      True
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FormControl>
                      <input
                        type="radio"
                        className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
                        checked={field.value === "false"}
                        onChange={() => field.onChange("false")}
                        id="false-option"
                      />
                    </FormControl>
                    <Label htmlFor="false-option" className="font-normal">
                      False
                    </Label>
                  </div>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <div className="flex justify-end space-x-4">
          <Button variant="outline" type="button" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Question"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
