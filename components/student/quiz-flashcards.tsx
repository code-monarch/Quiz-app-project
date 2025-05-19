"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export function QuizFlashcards() {
  const [isFlipped, setIsFlipped] = useState(false)
  const [currentCard, setCurrentCard] = useState(0)

  const flashcards = [
    {
      id: "f1",
      front: "What is JavaScript?",
      back: "JavaScript is a high-level, interpreted programming language that conforms to the ECMAScript specification. It is a language that is also characterized as dynamic, weakly typed, prototype-based and multi-paradigm.",
    },
    {
      id: "f2",
      front: "What is a closure in JavaScript?",
      back: "A closure is the combination of a function bundled together (enclosed) with references to its surrounding state (the lexical environment). In other words, a closure gives you access to an outer function's scope from an inner function.",
    },
    {
      id: "f3",
      front: "What is the difference between let and var?",
      back: "var is function scoped while let is block scoped. Variables declared with var can be hoisted (accessed before declaration) while let cannot. let was introduced in ES6.",
    },
  ]

  const handleNext = () => {
    setIsFlipped(false)
    setCurrentCard((prev) => (prev + 1) % flashcards.length)
  }

  const handlePrevious = () => {
    setIsFlipped(false)
    setCurrentCard((prev) => (prev - 1 + flashcards.length) % flashcards.length)
  }

  return (
    <div className="space-y-6">
      <div className="text-center text-sm text-muted-foreground">
        Card {currentCard + 1} of {flashcards.length}
      </div>
      <div className="relative cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
        <div
          className={`transform transition-all duration-500 ${
            isFlipped ? "rotate-y-180 opacity-0 absolute" : "rotate-y-0 opacity-100"
          }`}
        >
          <Card className="min-h-[200px] flex items-center justify-center">
            <CardContent className="p-6 text-center text-lg font-medium">{flashcards[currentCard].front}</CardContent>
          </Card>
        </div>
        <div
          className={`transform transition-all duration-500 ${
            isFlipped ? "rotate-y-0 opacity-100" : "rotate-y-180 opacity-0 absolute"
          }`}
        >
          <Card className="min-h-[200px] flex items-center justify-center">
            <CardContent className="p-6 text-center">{flashcards[currentCard].back}</CardContent>
          </Card>
        </div>
      </div>
      <div className="flex justify-between">
        <Button variant="outline" onClick={handlePrevious}>
          Previous Card
        </Button>
        <Button onClick={handleNext}>Next Card</Button>
      </div>
    </div>
  )
}
