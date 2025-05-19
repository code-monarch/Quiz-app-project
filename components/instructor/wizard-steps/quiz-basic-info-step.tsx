"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

const quizBasicInfoSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters.",
  }),
  description: z.string().optional(),
  category: z.string().min(1, {
    message: "Please select a category.",
  }),
  cover_image: z.string().url().optional().or(z.literal("")),
  time_limit: z.coerce.number().int().min(0).optional(),
  published: z.boolean().default(false),
})

type QuizBasicInfoValues = z.infer<typeof quizBasicInfoSchema>

interface QuizBasicInfoStepProps {
  quizData: any
  updateQuizData: (field: string, value: any) => void
  categories: string[]
}

export function QuizBasicInfoStep({ quizData, updateQuizData, categories }: QuizBasicInfoStepProps) {
  const form = useForm<QuizBasicInfoValues>({
    resolver: zodResolver(quizBasicInfoSchema),
    defaultValues: {
      title: quizData.title || "",
      description: quizData.description || "",
      category: quizData.category || "",
      cover_image: quizData.cover_image || "",
      time_limit: quizData.time_limit || 30,
      published: quizData.published || false,
    },
  })

  function onSubmit(values: QuizBasicInfoValues) {
    Object.entries(values).forEach(([key, value]) => {
      updateQuizData(key, value)
    })
  }

  // Update the parent component whenever form values change
  const handleFieldChange = (field: string, value: any) => {
    updateQuizData(field, value)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quiz Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter quiz title"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e)
                        handleFieldChange("title", e.target.value)
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter a description for your quiz"
                      className="min-h-[120px]"
                      {...field}
                      value={field.value || ""}
                      onChange={(e) => {
                        field.onChange(e)
                        handleFieldChange("description", e.target.value)
                      }}
                    />
                  </FormControl>
                  <FormDescription>Provide a brief description of what this quiz covers.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value)
                      handleFieldChange("category", value)
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-6">
            <FormField
              control={form.control}
              name="cover_image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cover Image URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://example.com/image.jpg"
                      {...field}
                      value={field.value || ""}
                      onChange={(e) => {
                        field.onChange(e)
                        handleFieldChange("cover_image", e.target.value)
                      }}
                    />
                  </FormControl>
                  <FormDescription>Provide a URL for the quiz cover image (optional).</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="time_limit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Time Limit (minutes)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      {...field}
                      onChange={(e) => {
                        field.onChange(e)
                        handleFieldChange("time_limit", Number.parseInt(e.target.value))
                      }}
                    />
                  </FormControl>
                  <FormDescription>Set to 0 for no time limit.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="published"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Publish Quiz</FormLabel>
                    <FormDescription>Make this quiz available to students immediately.</FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={(checked) => {
                        field.onChange(checked)
                        handleFieldChange("published", checked)
                      }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>
      </form>
    </Form>
  )
}
