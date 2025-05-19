"use client"

import { useState } from "react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

export function QuizMultipleChoice() {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)

  const question = {
    id: "q1",
    text: "Which of the following is NOT a JavaScript data type?",
    options: [
      { id: "a", text: "String" },
      { id: "b", text: "Boolean" },
      { id: "c", text: "Float" },
      { id: "d", text: "Object" },
    ],
    correctAnswer: "c",
  }

  return (
    <div className="space-y-6">
      <div className="text-lg font-medium">Question 5: {question.text}</div>
      <RadioGroup value={selectedAnswer || ""} onValueChange={setSelectedAnswer}>
        {question.options.map((option) => (
          <div key={option.id} className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted">
            <RadioGroupItem value={option.id} id={`option-${option.id}`} />
            <Label htmlFor={`option-${option.id}`} className="flex-1 cursor-pointer">
              {option.text}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  )
}
