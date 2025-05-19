"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function QuizTypeToLearn() {
  const [answer, setAnswer] = useState("")
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [showHint, setShowHint] = useState(false)

  const question = {
    id: "q1",
    text: "What keyword is used to declare a variable in JavaScript that can be reassigned?",
    correctAnswer: "let",
    hint: "It was introduced in ES6 and is block-scoped.",
  }

  const handleCheck = () => {
    const correct = answer.toLowerCase().trim() === question.correctAnswer.toLowerCase()
    setIsCorrect(correct)
  }

  return (
    <div className="space-y-6">
      <div className="text-lg font-medium">{question.text}</div>
      <div className="space-y-2">
        <Label htmlFor="answer">Your Answer</Label>
        <div className="flex space-x-2">
          <Input
            id="answer"
            value={answer}
            onChange={(e) => {
              setAnswer(e.target.value)
              setIsCorrect(null)
            }}
            className={`flex-1 ${
              isCorrect === true ? "border-green-500" : isCorrect === false ? "border-red-500" : ""
            }`}
          />
          <Button onClick={handleCheck}>Check</Button>
        </div>
      </div>
      {isCorrect === false && <div className="text-sm text-red-500">That's not correct. Try again or use a hint.</div>}
      {isCorrect === true && <div className="text-sm text-green-500">Correct! Well done.</div>}
      <div className="space-y-2">
        <Button variant="outline" size="sm" onClick={() => setShowHint(!showHint)}>
          {showHint ? "Hide Hint" : "Show Hint"}
        </Button>
        {showHint && <div className="text-sm text-muted-foreground p-2 bg-muted rounded-md">Hint: {question.hint}</div>}
      </div>
    </div>
  )
}
