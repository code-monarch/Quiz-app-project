import Link from "next/link"
import { CheckCircle2, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getQuizAttemptResults } from "@/lib/quiz-service"

interface ResultsPageProps {
  params: {
    id: string
    attemptId: string
  }
}

export default async function ResultsPage({ params }: ResultsPageProps) {
  const results = await getQuizAttemptResults(params.attemptId)

  if (!results) {
    return (
      <div className="container py-8">
        <h1 className="text-3xl font-bold">Results Not Found</h1>
        <p className="mt-2 text-muted-foreground">
          The quiz results you are looking for do not exist or have been removed.
        </p>
        <Button asChild className="mt-4">
          <Link href="/student/quizzes">Back to Quizzes</Link>
        </Button>
      </div>
    )
  }

  const isPassed = (results.score || 0) >= (results.passing_score || 70)

  return (
    <div className="container py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quiz Results: {results.quiz_title}</h1>
          <p className="text-muted-foreground">
            Completed on {new Date(results.completed_at).toLocaleDateString()} at{" "}
            {new Date(results.completed_at).toLocaleTimeString()}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" asChild>
            <Link href="/student/quizzes">Back to Quizzes</Link>
          </Button>
          {results.can_retake && (
            <Button asChild>
              <Link href={`/student/quizzes/${params.id}`}>Retake Quiz</Link>
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Score</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center">
            <div className="text-5xl font-bold text-primary">{results.score}%</div>
            <p className="mt-2 text-sm text-muted-foreground">
              {results.correct_count}/{results.total_questions} correct answers
            </p>
            <div className="mt-4 flex items-center gap-2">
              {isPassed ? (
                <>
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span className="font-medium text-green-500">Passed</span>
                </>
              ) : (
                <>
                  <XCircle className="h-5 w-5 text-destructive" />
                  <span className="font-medium text-destructive">Failed</span>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Time Spent</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center">
            <div className="text-5xl font-bold">
              {Math.floor(results.time_spent / 60)}:{(results.time_spent % 60).toString().padStart(2, "0")}
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              {results.time_limit ? `Out of ${results.time_limit}:00 allowed` : "No time limit"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center">
            <div className="text-5xl font-bold text-primary">{isPassed ? "Good" : "Needs Work"}</div>
            <p className="mt-2 text-sm text-muted-foreground">
              {isPassed ? "Keep up the good work!" : `Passing score: ${results.passing_score}%`}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="questions" className="mt-8">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="questions">Question Details</TabsTrigger>
          <TabsTrigger value="summary">Performance Summary</TabsTrigger>
        </TabsList>

        <TabsContent value="questions" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Question Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {results.responses.map((response, index) => (
                  <div key={response.question_id} className="space-y-2">
                    <div className="flex items-start">
                      <div className="mr-2 mt-0.5">
                        {response.is_correct ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-destructive" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">
                          Question {index + 1}: {response.question_text}
                        </div>
                        <div className="mt-2 space-y-1 text-sm">
                          <div>
                            <span className="font-medium">Your answer: </span>
                            <span className={response.is_correct ? "text-green-500" : "text-destructive"}>
                              {response.student_answer}
                            </span>
                          </div>
                          {!response.is_correct && (
                            <div>
                              <span className="font-medium">Correct answer: </span>
                              <span className="text-green-500">{response.correct_answer}</span>
                            </div>
                          )}
                        </div>
                        {response.explanation && (
                          <div className="mt-2 rounded-md bg-muted p-3 text-sm">
                            <span className="font-medium">Explanation: </span>
                            {response.explanation}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="summary" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {results.categories && results.categories.length > 0 ? (
                  <div className="space-y-4">
                    {results.categories.map((category) => (
                      <div key={category.name} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">{category.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {category.correct}/{category.total} questions correct
                            </div>
                          </div>
                          <div className="font-medium">{Math.round((category.correct / category.total) * 100)}%</div>
                        </div>
                        <div className="h-2 w-full rounded-full bg-secondary">
                          <div
                            className="h-full rounded-full bg-primary"
                            style={{
                              width: `${Math.round((category.correct / category.total) * 100)}%`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-lg border p-4">
                    <h3 className="mb-2 font-medium">Overall Performance</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="font-medium">Accuracy</div>
                        <div className="font-medium">{results.score}%</div>
                      </div>
                      <Progress value={results.score} className="h-2" />
                    </div>
                  </div>
                )}

                <div className="rounded-lg border p-4">
                  <h3 className="mb-2 font-medium">Recommendations</h3>
                  <ul className="space-y-2 text-sm">
                    {isPassed ? (
                      <>
                        <li className="flex items-start">
                          <span className="mr-2 text-primary">•</span>
                          <span>Great job! You've demonstrated a solid understanding of the material.</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2 text-primary">•</span>
                          <span>Review the questions you missed to further improve your knowledge.</span>
                        </li>
                      </>
                    ) : (
                      <>
                        <li className="flex items-start">
                          <span className="mr-2 text-primary">•</span>
                          <span>Review the questions you missed and their explanations.</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2 text-primary">•</span>
                          <span>Consider retaking the quiz after studying the material more thoroughly.</span>
                        </li>
                      </>
                    )}
                    <li className="flex items-start">
                      <span className="mr-2 text-primary">•</span>
                      <span>Check out related quizzes to expand your knowledge.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
