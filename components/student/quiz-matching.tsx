"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export function QuizMatching() {
  const [selectedTerm, setSelectedTerm] = useState<string | null>(null)
  const [selectedDefinition, setSelectedDefinition] = useState<string | null>(null)
  const [matches, setMatches] = useState<Record<string, string>>({})

  const terms = [
    { id: "t1", text: "Variable" },
    { id: "t2", text: "Function" },
    { id: "t3", text: "Object" },
    { id: "t4", text: "Array" },
  ]

  const definitions = [
    { id: "d1", text: "A container for storing data values" },
    { id: "d2", text: "A block of code designed to perform a particular task" },
    { id: "d3", text: "A collection of properties, each with a name and value" },
    { id: "d4", text: "A special variable that can hold more than one value" },
  ]

  const correctMatches: Record<string, string> = {
    t1: "d1",
    t2: "d2",
    t3: "d3",
    t4: "d4",
  }

  const handleTermClick = (termId: string) => {
    setSelectedTerm(termId)
    if (selectedDefinition) {
      // If both term and definition are selected, create a match
      setMatches((prev) => ({ ...prev, [termId]: selectedDefinition }))
      setSelectedTerm(null)
      setSelectedDefinition(null)
    }
  }

  const handleDefinitionClick = (defId: string) => {
    setSelectedDefinition(defId)
    if (selectedTerm) {
      // If both term and definition are selected, create a match
      setMatches((prev) => ({ ...prev, [selectedTerm]: defId }))
      setSelectedTerm(null)
      setSelectedDefinition(null)
    }
  }

  const isTermMatched = (termId: string) => {
    return termId in matches
  }

  const isDefinitionMatched = (defId: string) => {
    return Object.values(matches).includes(defId)
  }

  const isMatchCorrect = (termId: string) => {
    return matches[termId] === correctMatches[termId]
  }

  return (
    <div className="space-y-6">
      <div className="text-lg font-medium">Match each term with its correct definition</div>
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="font-medium">Terms</h3>
          {terms.map((term) => (
            <Card
              key={term.id}
              className={`cursor-pointer transition-colors ${
                isTermMatched(term.id)
                  ? isMatchCorrect(term.id)
                    ? "border-green-500"
                    : "border-red-500"
                  : selectedTerm === term.id
                    ? "border-primary"
                    : ""
              }`}
              onClick={() => !isTermMatched(term.id) && handleTermClick(term.id)}
            >
              <CardContent className="p-4">{term.text}</CardContent>
            </Card>
          ))}
        </div>
        <div className="space-y-4">
          <h3 className="font-medium">Definitions</h3>
          {definitions.map((def) => (
            <Card
              key={def.id}
              className={`cursor-pointer transition-colors ${
                isDefinitionMatched(def.id) ? "bg-muted" : selectedDefinition === def.id ? "border-primary" : ""
              }`}
              onClick={() => !isDefinitionMatched(def.id) && handleDefinitionClick(def.id)}
            >
              <CardContent className="p-4">{def.text}</CardContent>
            </Card>
          ))}
        </div>
      </div>
      <div className="flex justify-end">
        <Button
          onClick={() => {
            setMatches({})
            setSelectedTerm(null)
            setSelectedDefinition(null)
          }}
          variant="outline"
          className="mr-2"
        >
          Reset
        </Button>
        <Button>Check Answers</Button>
      </div>
    </div>
  )
}
