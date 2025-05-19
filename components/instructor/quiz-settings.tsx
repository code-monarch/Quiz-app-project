"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { updateQuizSettings } from "@/lib/quiz-service-settings"
import { useToast } from "@/components/ui/use-toast"

const formSchema = z.object({
  shuffle_questions: z.boolean().default(true),
  shuffle_options: z.boolean().default(true),
  show_results: z.enum(["immediately", "after-submission", "after-due-date"]).default("after-submission"),
  allow_retakes: z.boolean().default(true),
  max_retakes: z.number().min(0).max(10).default(3),
  passing_score: z.number().min(0).max(100).default(70),
})

interface QuizSettingsProps {
  quizId: string
  settings: any
}

export function QuizSettings({ quizId, settings }: QuizSettingsProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      shuffle_questions: settings?.shuffle_questions ?? true,
      shuffle_options: settings?.shuffle_options ?? true,
      show_results: settings?.show_results ?? "after-submission",
      allow_retakes: settings?.allow_retakes ?? true,
      max_retakes: settings?.max_retakes ?? 3,
      passing_score: settings?.passing_score ?? 70,
    },
  })

  const allowRetakes = form.watch("allow_retakes")

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true)
      await updateQuizSettings(quizId, values)
      toast({
        title: "Settings updated",
        description: "Quiz settings have been successfully updated.",
      })
    } catch (error) {
      console.error("Error updating settings:", error)
      toast({
        title: "Error",
        description: "Failed to update quiz settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
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
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
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
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="show_results"
            render={({ field }) => (
              <FormItem className="rounded-lg border p-4">
                <FormLabel className="text-base">Show Results</FormLabel>
                <FormDescription>When to show quiz results to students</FormDescription>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select when to show results" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="immediately">Immediately after each question</SelectItem>
                    <SelectItem value="after-submission">After quiz submission</SelectItem>
                    <SelectItem value="after-due-date">After due date</SelectItem>
                  </SelectContent>
                </Select>
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
                  <FormDescription>Let students retake the quiz if they fail</FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />

          {allowRetakes && (
            <FormField
              control={form.control}
              name="max_retakes"
              render={({ field }) => (
                <FormItem className="rounded-lg border p-4">
                  <FormLabel className="text-base">Maximum Retakes</FormLabel>
                  <FormDescription>Maximum number of times a student can retake the quiz</FormDescription>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      max={10}
                      {...field}
                      onChange={(e) => field.onChange(Number.parseInt(e.target.value))}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="passing_score"
            render={({ field }) => (
              <FormItem className="rounded-lg border p-4">
                <FormLabel className="text-base">Passing Score (%)</FormLabel>
                <FormDescription>Minimum percentage required to pass the quiz</FormDescription>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    {...field}
                    onChange={(e) => field.onChange(Number.parseInt(e.target.value))}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Settings"}
        </Button>
      </form>
    </Form>
  )
}
