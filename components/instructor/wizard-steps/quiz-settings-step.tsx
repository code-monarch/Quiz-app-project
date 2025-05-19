"use client"

import { useFormContext } from "react-hook-form"
import { FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

type QuizSettingsStepProps = {}

export function QuizSettingsStep({}: QuizSettingsStepProps) {
  // Access form from context
  const form = useFormContext()

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <FormField
          control={form.control}
          name="settings.shuffle_questions"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base font-medium">Shuffle Questions</FormLabel>
                <FormDescription>Randomize the order of questions for each student.</FormDescription>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="settings.shuffle_options"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base font-medium">Shuffle Answer Options</FormLabel>
                <FormDescription>Randomize the order of answer options for each question.</FormDescription>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="settings.show_results"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="text-base font-medium">Show Results</FormLabel>
              <FormControl>
                <RadioGroup onValueChange={field.onChange} value={field.value} className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="immediately" id="show_results_immediately" />
                    <FormLabel htmlFor="show_results_immediately" className="font-normal">
                      Immediately after each question
                    </FormLabel>
                  </div>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="after-submission" id="show_results_after_submission" />
                    <FormLabel htmlFor="show_results_after_submission" className="font-normal">
                      After quiz submission
                    </FormLabel>
                  </div>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="after-due-date" id="show_results_after_due_date" />
                    <FormLabel htmlFor="show_results_after_due_date" className="font-normal">
                      After due date
                    </FormLabel>
                  </div>
                </RadioGroup>
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="settings.allow_retakes"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base font-medium">Allow Retakes</FormLabel>
                <FormDescription>Let students retake the quiz if they want to improve their score.</FormDescription>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />

        {form.watch("settings.allow_retakes") && (
          <FormField
            control={form.control}
            name="settings.max_retakes"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-base font-medium">Maximum Retakes</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    {...field}
                    onChange={(e) => field.onChange(Number.parseInt(e.target.value) || 1)}
                  />
                </FormControl>
                <FormDescription>Maximum number of times a student can retake this quiz.</FormDescription>
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="settings.passing_score"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-base font-medium">Passing Score: {field.value}%</FormLabel>
              <FormControl>
                <Slider
                  min={0}
                  max={100}
                  step={5}
                  defaultValue={[field.value]}
                  value={[field.value]}
                  onValueChange={(values) => field.onChange(values[0])}
                />
              </FormControl>
              <FormDescription>Minimum percentage required to pass the quiz.</FormDescription>
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}
