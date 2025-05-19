import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { QuizQuestions } from "@/components/instructor/quiz-questions"
import { QuizSettings } from "@/components/instructor/quiz-settings"
import { QuizAnalytics } from "@/components/instructor/quiz-analytics"
import { QuizDeleteDialog } from "@/components/instructor/quiz-delete-dialog"
import { getQuizWithQuestions } from "@/lib/quiz-service"
import { formatDistanceToNow } from "date-fns"

interface QuizDetailPageProps {
  params: {
    id: string
  }
}

export default async function QuizDetailPage({ params }: QuizDetailPageProps) {
  const quiz = await getQuizWithQuestions(params.id)

  if (!quiz) {
    notFound()
  }

  return (
    <div className="container py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{quiz.title}</h1>
          <p className="text-muted-foreground">{quiz.description || "No description provided"}</p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" asChild>
            <Link href="/instructor/quizzes">Back to Quizzes</Link>
          </Button>
          <Button asChild>
            <Link href={`/instructor/quizzes/${params.id}/edit`}>Edit Quiz</Link>
          </Button>
          <QuizDeleteDialog quizId={params.id} quizTitle={quiz.title} />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Tabs defaultValue="questions" className="space-y-4">
            <TabsList>
              <TabsTrigger value="questions">Questions</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>
            <TabsContent value="questions">
              <Card>
                <CardHeader>
                  <CardTitle>Quiz Questions</CardTitle>
                </CardHeader>
                <CardContent>
                  <QuizQuestions quizId={params.id} questions={quiz.questions || []} />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Quiz Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <QuizSettings quizId={params.id} settings={quiz.settings} />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="analytics">
              <Card>
                <CardHeader>
                  <CardTitle>Quiz Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <QuizAnalytics quizId={params.id} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quiz Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm font-medium">Status</div>
                <div className="mt-1">
                  {quiz.published ? (
                    <Badge variant="default" className="bg-green-500">
                      Published
                    </Badge>
                  ) : (
                    <Badge variant="outline">Draft</Badge>
                  )}
                  {quiz.archived && (
                    <Badge variant="secondary" className="ml-2">
                      Archived
                    </Badge>
                  )}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium">Category</div>
                <div className="mt-1">
                  <Badge variant="outline">{quiz.category || "Uncategorized"}</Badge>
                </div>
              </div>
              <div>
                <div className="text-sm font-medium">Time Limit</div>
                <div className="mt-1 text-sm">{quiz.time_limit ? `${quiz.time_limit} minutes` : "No time limit"}</div>
              </div>
              <div>
                <div className="text-sm font-medium">Questions</div>
                <div className="mt-1 text-sm">{quiz.questions?.length || 0} questions</div>
              </div>
              <div>
                <div className="text-sm font-medium">Created</div>
                <div className="mt-1 text-sm">
                  {quiz.created_at ? `${formatDistanceToNow(new Date(quiz.created_at))} ago` : "Date not available"}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium">Last Updated</div>
                <div className="mt-1 text-sm">
                  {quiz.updated_at ? `${formatDistanceToNow(new Date(quiz.updated_at))} ago` : "Date not available"}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Student Attempts</CardTitle>
            </CardHeader>
            <CardContent>
              {quiz.attempts && quiz.attempts.length > 0 ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">Total Attempts</div>
                    <div className="text-sm">{quiz.attempts.length}</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">Average Score</div>
                    <div className="text-sm">
                      {Math.round(
                        quiz.attempts.reduce((sum, attempt) => sum + (attempt.score || 0), 0) / quiz.attempts.length,
                      )}
                      %
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">Completion Rate</div>
                    <div className="text-sm">
                      {Math.round(
                        (quiz.attempts.filter((attempt) => attempt.completed_at).length / quiz.attempts.length) * 100,
                      )}
                      %
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  <p>No attempts yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
