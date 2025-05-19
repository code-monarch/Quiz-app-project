"use client"

import { useState } from "react"
import { useFormContext } from "react-hook-form"
import { ImageIcon } from "lucide-react"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface QuizBasicInfoStepProps {
  categories: string[]
}

export function QuizBasicInfoStep({ categories }: QuizBasicInfoStepProps) {
  // Get form methods from parent context
  const form = useFormContext()

  // Local state for cover image selection UI
  const [coverImage, setCoverImage] = useState<string>(form.getValues("cover_image") || "")

  // Handle cover image selection
  const handleCoverImageSelect = (imageUrl: string) => {
    setCoverImage(imageUrl)
    form.setValue("cover_image", imageUrl, { shouldValidate: true, shouldDirty: true })
  }

  // Predefined cover images
  const coverImages = [
    "/javascript-code.png",
    "/react-logo-abstract.png",
    "/css-code.png",
    "/html-code-snippet.png",
    "/quiz-concept.png",
  ]

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-medium">Quiz Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter quiz title" {...field} />
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
              <FormLabel className="text-base font-medium">Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter a description for your quiz"
                  className="min-h-[100px]"
                  {...field}
                  value={field.value || ""}
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
              <FormLabel className="text-base font-medium">Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
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

        <FormField
          control={form.control}
          name="time_limit"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-medium">Time Limit (minutes)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={0}
                  placeholder="Enter time limit in minutes (0 for no limit)"
                  {...field}
                  onChange={(e) => field.onChange(Number.parseInt(e.target.value) || 0)}
                  value={field.value}
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
                <FormLabel className="text-base font-medium">Published</FormLabel>
                <FormDescription>
                  When published, this quiz will be visible to students. You can change this later.
                </FormDescription>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium mb-2">Cover Image</h3>
          <p className="text-sm text-muted-foreground mb-4">Select a cover image for your quiz.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {coverImages.map((image, index) => (
              <div
                key={index}
                className={`relative aspect-video rounded-md overflow-hidden border-2 cursor-pointer transition-all ${
                  coverImage === image ? "border-primary ring-2 ring-primary ring-opacity-50" : "border-border"
                }`}
                onClick={() => handleCoverImageSelect(image)}
              >
                <img
                  src={image || "/placeholder.svg"}
                  alt={`Cover option ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
            <div
              className={`relative aspect-video rounded-md overflow-hidden border-2 border-dashed flex items-center justify-center cursor-pointer ${
                coverImage === "" ? "border-primary bg-primary/5" : "border-border"
              }`}
              onClick={() => handleCoverImageSelect("")}
            >
              <div className="flex flex-col items-center text-muted-foreground">
                <ImageIcon className="h-8 w-8 mb-1" />
                <span className="text-xs">No Image</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
