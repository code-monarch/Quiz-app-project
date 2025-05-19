"use client"

import { useState } from "react"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function CreateQuizDialog() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Quiz
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Create New Quiz</DialogTitle>
          <DialogDescription>
            Fill in the details to create a new quiz. You can add questions in the next step.
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="basic" className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="import">Import</TabsTrigger>
          </TabsList>
          <TabsContent value="basic" className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Quiz Title</Label>
              <Input id="title" placeholder="Enter quiz title" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" placeholder="Enter a description for your quiz" className="min-h-[100px]" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="topic">Topic/Subject</Label>
              <Input id="topic" placeholder="e.g., JavaScript, React, CSS" />
            </div>
          </TabsContent>
          <TabsContent value="settings" className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="time-limit">Time Limit (minutes)</Label>
              <Input id="time-limit" type="number" placeholder="0 for no limit" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="passing-score">Passing Score (%)</Label>
              <Input id="passing-score" type="number" placeholder="e.g., 70" />
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="randomize" className="h-4 w-4 rounded border-gray-300" />
              <Label htmlFor="randomize">Randomize Questions</Label>
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="show-answers" className="h-4 w-4 rounded border-gray-300" />
              <Label htmlFor="show-answers">Show Answers After Submission</Label>
            </div>
          </TabsContent>
          <TabsContent value="import" className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="import-file">Import from CSV or Google Sheets</Label>
              <Input id="import-file" type="file" />
              <p className="text-xs text-muted-foreground mt-1">
                Upload a CSV file or connect to Google Sheets to import questions
              </p>
            </div>
            <div className="space-y-2">
              <Label>Or generate questions with AI</Label>
              <Button variant="outline" className="w-full">
                Generate Questions with AI
              </Button>
              <p className="text-xs text-muted-foreground mt-1">
                Our AI will generate questions based on the topic you provided
              </p>
            </div>
          </TabsContent>
        </Tabs>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => setOpen(false)}>Continue to Questions</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
