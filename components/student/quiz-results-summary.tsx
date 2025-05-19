export function QuizResultsSummary() {
  const categories = [
    {
      name: "Variables & Data Types",
      score: 90,
      questions: 5,
    },
    {
      name: "Functions & Scope",
      score: 80,
      questions: 4,
    },
    {
      name: "Arrays & Objects",
      score: 75,
      questions: 3,
    },
    {
      name: "DOM Manipulation",
      score: 100,
      questions: 2,
    },
    {
      name: "Async JavaScript",
      score: 67,
      questions: 1,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {categories.map((category) => (
          <div key={category.name} className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">{category.name}</div>
                <div className="text-sm text-muted-foreground">
                  {Math.round((category.score / 100) * category.questions)}/{category.questions} questions correct
                </div>
              </div>
              <div className="font-medium">{category.score}%</div>
            </div>
            <div className="h-2 w-full rounded-full bg-secondary">
              <div className="h-full rounded-full bg-primary" style={{ width: `${category.score}%` }} />
            </div>
          </div>
        ))}
      </div>
      <div className="rounded-lg border p-4">
        <h3 className="mb-2 font-medium">Recommendations</h3>
        <ul className="space-y-2 text-sm">
          <li className="flex items-start">
            <span className="mr-2 text-primary">•</span>
            <span>Review Async JavaScript concepts, particularly Promises and async/await.</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2 text-primary">•</span>
            <span>Practice more with Arrays & Objects to improve your understanding.</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2 text-primary">•</span>
            <span>Great job on DOM Manipulation! Consider exploring advanced topics in this area.</span>
          </li>
        </ul>
      </div>
    </div>
  )
}
