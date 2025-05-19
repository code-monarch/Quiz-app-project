"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

const quizSettingsSchema = z.object({
  shuffle_questions: z.boolean().default(true),
  shuffle_options: z.boolean().default(true),
  show_results: z.enum(["immediately", "after-submission", "after-due-date"]).default("after-submission"),
  allow_retakes: z.boolean().default(true),
  max_retakes: z.coerce.number().int().min(0).default(3),
  passing_score: z.coerce.number().int().min(0).max(100).default(70),
})

type QuizSettingsValues = z.infer<typeof quizSettingsSchema>

interface QuizSettingsStepProps {
  settings: any
  updateSettings: (settings: any) => void
}

export function QuizSettingsStep({ settings, updateSettings }: QuizSettingsStepProps) {
  const form = useForm<QuizSettingsValues>({
    resolver: zodResolver(quizSettingsSchema),
    defaultValues: {
      shuffle_questions: settings.shuffle_questions,
      shuffle_options: settings.shuffle_options,
      show_results: settings.show_results,
      allow_retakes: settings.allow_retakes,
      max_retakes: settings.max_retakes,
      passing_score: settings.passing_score,
    },
  })

  const allowRetakes = form.watch("allow_retakes")

  function onSubmit(values: QuizSettingsValues) {
    updateSettings(values)
  }

  // Update the parent component whenever form values change
  const handleFieldChange = (field: string, value: any) => {
    updateSettings({ [field]: value })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="shuffle_questions"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Shuffle Questions</FormLabel>
                    <FormDescription>Randomize the order of questions for each student</FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={(checked) => {
                        field.onChange(checked)
                        handleFieldChange("shuffle_questions", checked)
                      }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="shuffle_options"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Shuffle Options</FormLabel>
                    <FormDescription>Randomize the order of answer options for each question</FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={(checked) => {
                        field.onChange(checked)
                        handleFieldChange("shuffle_options", checked)
                      }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="show_results"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Show Results</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={(value) => {
                        field.onChange(value)
                        handleFieldChange("show_results", value)
                      }}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="immediately" />
                        </FormControl>
                        <FormLabel className="font-normal">Immediately after each question</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="after-submission" />
                        </FormControl>
                        <FormLabel className="font-normal">After quiz submission</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="after-due-date" />
                        </FormControl>
                        <FormLabel className="font-normal">After due date</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-6">
            <FormField
              control={form.control}
              name="passing_score"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Passing Score (%)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      {...field}
                      onChange={(e) => {
                        field.onChange(e)
                        handleFieldChange("passing_score", Number.parseInt(e.target.value))
                      }}
                    />
                  </FormControl>
                  <FormDescription>Minimum percentage required to pass the quiz</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="allow_retakes"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Allow Retakes</FormLabel>
                    <FormDescription>Let students retake the quiz if they don't pass</FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={(checked) => {
                        field.onChange(checked)
                        handleFieldChange("allow_retakes", checked)
                      }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {allowRetakes && (
              <FormField
                control={form.control}
                name="max_retakes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Maximum Retakes</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        {...field}
                        onChange={(e) => {
                          field.onChange(e)
                          handleFieldChange("max_retakes", Number.parseInt(e.target.value))
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      Maximum number of times a student can retake the quiz (0 for unlimited)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>
        </div>
      </form>
    </Form>
  )
}
