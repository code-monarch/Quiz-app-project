import Link from "next/link"
import { Clock, FileText, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getQuizById } from "@/lib/quiz-service"

interface QuizPageProps {
  params: {
    id: string
  }
}

export default async function QuizPage({ params }: QuizPageProps) {
  const quiz = await getQuizById(params.id)

  if (!quiz) {
    return (
      <div className="container py-8">
        <h1 className="text-3xl font-bold">Quiz Not Found</h1>
        <p className="mt-2 text-muted-foreground">The quiz you are looking for does not exist or has been removed.</p>
        <Button asChild className="mt-4">
          <Link href="/student/quizzes">Back to Quizzes</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{quiz.title}</h1>
        <p className="mt-2 text-muted-foreground">{quiz.description}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Quiz Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-start gap-2">
                  <Clock className="mt-0.5 h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Time Limit</p>
                    <p className="text-sm text-muted-foreground">
                      {quiz.time_limit ? `${quiz.time_limit} minutes` : "No time limit"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <FileText className="mt-0.5 h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Questions</p>
                    <p className="text-sm text-muted-foreground">{quiz.question_count || 0} questions</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Users className="mt-0.5 h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Created By</p>
                    <p className="text-sm text-muted-foreground">{quiz.instructor_name || "Unknown Instructor"}</p>
                  </div>
                </div>
                <div>
                  <p className="font-medium">Category</p>
                  <Badge variant="outline" className="mt-1">
                    {quiz.category}
                  </Badge>
                </div>
              </div>

              <div className="rounded-lg border p-4">
                <p className="font-medium">Quiz Rules</p>
                <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start">
                    <span className="mr-2 text-primary">•</span>
                    <span>
                      {quiz.settings?.shuffle_questions
                        ? "Questions will be presented in random order."
                        : "Questions will be presented in a fixed order."}
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-primary">•</span>
                    <span>
                      {quiz.settings?.shuffle_options
                        ? "Answer options will be shuffled for each question."
                        : "Answer options will be presented in a fixed order."}
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-primary">•</span>
                    <span>
                      {quiz.settings?.show_results === "immediately"
                        ? "Results will be shown immediately after each question."
                        : quiz.settings?.show_results === "after-submission"
                          ? "Results will be shown after submitting the entire quiz."
                          : "Results will be shown after the due date."}
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-primary">•</span>
                    <span>
                      {quiz.settings?.allow_retakes
                        ? `You can retake this quiz up to ${
                            quiz.settings.max_retakes ? quiz.settings.max_retakes + " times" : "unlimited times"
                          }.`
                        : "You cannot retake this quiz once submitted."}
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-primary">•</span>
                    <span>Passing score: {quiz.settings?.passing_score || 70}%</span>
                  </li>
                </ul>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href={`/student/quizzes/${quiz.id}/attempt`}>Start Quiz</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Your Attempts</CardTitle>
            </CardHeader>
            <CardContent>
              {quiz.attempts && quiz.attempts.length > 0 ? (
                <div className="space-y-4">
                  {quiz.attempts.map((attempt) => (
                    <div key={attempt.id} className="flex items-center justify-between rounded-lg border p-3">
                      <div>
                        <p className="font-medium">Attempt #{attempt.attempt_number}</p>
                        <p className="text-sm text-muted-foreground">
                          {attempt.completed_at
                            ? `Completed: ${new Date(attempt.completed_at).toLocaleDateString()}`
                            : `Started: ${new Date(attempt.started_at).toLocaleDateString()}`}
                        </p>
                      </div>
                      <div className="text-right">
                        {attempt.completed_at ? (
                          <div>
                            <p className="font-medium">{attempt.score}%</p>
                            <p className="text-sm text-muted-foreground">
                              {(attempt.score || 0) >= (quiz.settings?.passing_score || 70) ? "Passed" : "Failed"}
                            </p>
                          </div>
                        ) : (
                          <Badge variant="outline">In Progress</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  <p>You haven&apos;t attempted this quiz yet.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
