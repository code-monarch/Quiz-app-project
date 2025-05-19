"use client"

import { useState } from "react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { Clock, PlayCircle, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import type { StudentQuiz } from "@/types/quiz"

interface StudentQuizListProps {
  quizzes: StudentQuiz[]
}

export function StudentQuizList({ quizzes }: StudentQuizListProps) {
  const [searchTerm, setSearchTerm] = useState("")

  // Filter quizzes based on search term
  const filteredQuizzes = quizzes.filter(
    (quiz) =>
      quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quiz.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Separate quizzes into assigned, in progress, and completed
  const assignedQuizzes = filteredQuizzes.filter((quiz) => !quiz.attempts || quiz.attempts.length === 0)
  const inProgressQuizzes = filteredQuizzes.filter(
    (quiz) => quiz.attempts && quiz.attempts.some((attempt) => !attempt.completed_at),
  )
  const completedQuizzes = filteredQuizzes.filter(
    (quiz) => quiz.attempts && quiz.attempts.every((attempt) => attempt.completed_at),
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search quizzes..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="assigned" className="space-y-4">
        <TabsList>
          <TabsTrigger value="assigned">
            Assigned
            <Badge variant="secondary" className="ml-2">
              {assignedQuizzes.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="in-progress">
            In Progress
            <Badge variant="secondary" className="ml-2">
              {inProgressQuizzes.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed
            <Badge variant="secondary" className="ml-2">
              {completedQuizzes.length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="assigned" className="space-y-4">
          {assignedQuizzes.length === 0 ? (
            <div className="flex h-[200px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
              <h3 className="mt-4 text-lg font-semibold">No assigned quizzes</h3>
              <p className="mt-2 text-sm text-muted-foreground">You don&apos;t have any quizzes assigned to you yet.</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {assignedQuizzes.map((quiz) => (
                <Card key={quiz.id} className="overflow-hidden transition-all hover:shadow-md">
                  {quiz.cover_image && (
                    <div className="aspect-video w-full overflow-hidden">
                      <img
                        src={quiz.cover_image || "/placeholder.svg"}
                        alt={quiz.title}
                        className="h-full w-full object-cover transition-transform hover:scale-105"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="line-clamp-1">{quiz.title}</CardTitle>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Badge variant="outline">{quiz.category}</Badge>
                      {quiz.time_limit > 0 && (
                        <div className="flex items-center">
                          <Clock className="mr-1 h-3 w-3" />
                          {quiz.time_limit} min
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-sm">
                        {quiz.due_date ? (
                          <span className="text-destructive">
                            Due {formatDistanceToNow(new Date(quiz.due_date), { addSuffix: true })}
                          </span>
                        ) : (
                          <span>No due date</span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button asChild className="w-full">
                      <Link href={`/student/quizzes/${quiz.id}`}>
                        <PlayCircle className="mr-2 h-4 w-4" />
                        Start Quiz
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="in-progress" className="space-y-4">
          {inProgressQuizzes.length === 0 ? (
            <div className="flex h-[200px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
              <h3 className="mt-4 text-lg font-semibold">No quizzes in progress</h3>
              <p className="mt-2 text-sm text-muted-foreground">You don&apos;t have any quizzes in progress.</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {inProgressQuizzes.map((quiz) => {
                const latestAttempt = quiz.attempts?.sort(
                  (a, b) => new Date(b.started_at).getTime() - new Date(a.started_at).getTime(),
                )[0]

                return (
                  <Card key={quiz.id} className="overflow-hidden transition-all hover:shadow-md">
                    {quiz.cover_image && (
                      <div className="aspect-video w-full overflow-hidden">
                        <img
                          src={quiz.cover_image || "/placeholder.svg"}
                          alt={quiz.title}
                          className="h-full w-full object-cover transition-transform hover:scale-105"
                        />
                      </div>
                    )}
                    <CardHeader>
                      <CardTitle className="line-clamp-1">{quiz.title}</CardTitle>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Badge variant="outline">{quiz.category}</Badge>
                        {quiz.time_limit > 0 && (
                          <div className="flex items-center">
                            <Clock className="mr-1 h-3 w-3" />
                            {quiz.time_limit} min
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="text-sm">
                          {latestAttempt && (
                            <span>
                              Started {formatDistanceToNow(new Date(latestAttempt.started_at), { addSuffix: true })}
                            </span>
                          )}
                        </div>
                      </div>
                      <Progress value={33} className="h-2" />
                      <div className="text-xs text-muted-foreground">33% complete</div>
                    </CardContent>
                    <CardFooter>
                      <Button asChild className="w-full">
                        <Link href={`/student/quizzes/${quiz.id}/attempt/${latestAttempt?.id}`}>
                          <PlayCircle className="mr-2 h-4 w-4" />
                          Continue Quiz
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                )
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedQuizzes.length === 0 ? (
            <div className="flex h-[200px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
              <h3 className="mt-4 text-lg font-semibold">No completed quizzes</h3>
              <p className="mt-2 text-sm text-muted-foreground">You haven&apos;t completed any quizzes yet.</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {completedQuizzes.map((quiz) => {
                const bestAttempt = quiz.attempts?.reduce(
                  (best, current) => ((current.score || 0) > (best.score || 0) ? current : best),
                  quiz.attempts[0],
                )

                return (
                  <Card key={quiz.id} className="overflow-hidden transition-all hover:shadow-md">
                    {quiz.cover_image && (
                      <div className="aspect-video w-full overflow-hidden">
                        <img
                          src={quiz.cover_image || "/placeholder.svg"}
                          alt={quiz.title}
                          className="h-full w-full object-cover transition-transform hover:scale-105"
                        />
                      </div>
                    )}
                    <CardHeader>
                      <CardTitle className="line-clamp-1">{quiz.title}</CardTitle>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Badge variant="outline">{quiz.category}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="text-sm">Best Score</div>
                          <div className="text-sm font-medium">{bestAttempt?.score}%</div>
                        </div>
                        <Progress
                          value={bestAttempt?.score}
                          className="h-2"
                          indicatorClassName={
                            (bestAttempt?.score || 0) >= 70
                              ? "bg-green-500"
                              : (bestAttempt?.score || 0) >= 50
                                ? "bg-yellow-500"
                                : "bg-red-500"
                          }
                        />
                        <div className="text-xs text-muted-foreground">
                          {bestAttempt?.completed_at && (
                            <span>
                              Completed {formatDistanceToNow(new Date(bestAttempt.completed_at), { addSuffix: true })}
                            </span>
                          )}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button asChild variant="outline" className="w-full">
                        <Link href={`/student/quizzes/${quiz.id}/results/${bestAttempt?.id}`}>View Results</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                )
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
