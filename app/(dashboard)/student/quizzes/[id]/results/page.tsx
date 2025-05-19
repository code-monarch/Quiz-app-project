import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { QuizResultsSummary } from "@/components/student/quiz-results-summary"
import { QuizResultsDetails } from "@/components/student/quiz-results-details"
import { QuizResultsFeedback } from "@/components/student/quiz-results-feedback"

export default function QuizResultsPage() {
  return (
    <div className="container py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quiz Results: JavaScript Basics</h1>
          <p className="text-muted-foreground">Completed on May 15, 2023 at 2:45 PM</p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" asChild>
            <Link href="/student/quizzes">Back to Quizzes</Link>
          </Button>
          <Button asChild>
            <Link href="/student/quizzes/js-basics/review">Review Answers</Link>
          </Button>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Score</CardTitle>
            <CardDescription>Your overall performance</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center">
            <div className="text-5xl font-bold text-primary">85%</div>
            <p className="mt-2 text-sm text-muted-foreground">13/15 correct answers</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Time Spent</CardTitle>
            <CardDescription>How long you took to complete</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center">
            <div className="text-5xl font-bold">18:24</div>
            <p className="mt-2 text-sm text-muted-foreground">Out of 30:00 allowed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Mastery Level</CardTitle>
            <CardDescription>Your proficiency in this topic</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center">
            <div className="text-5xl font-bold text-primary">Advanced</div>
            <p className="mt-2 text-sm text-muted-foreground">Keep up the good work!</p>
          </CardContent>
        </Card>
      </div>
      <Tabs defaultValue="summary" className="mt-8">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="details">Question Details</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
        </TabsList>
        <TabsContent value="summary" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Summary</CardTitle>
              <CardDescription>Overview of your performance in different areas</CardDescription>
            </CardHeader>
            <CardContent>
              <QuizResultsSummary />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="details" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Question Details</CardTitle>
              <CardDescription>Detailed breakdown of your answers</CardDescription>
            </CardHeader>
            <CardContent>
              <QuizResultsDetails />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="feedback" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Instructor Feedback</CardTitle>
              <CardDescription>Personalized feedback on your performance</CardDescription>
            </CardHeader>
            <CardContent>
              <QuizResultsFeedback />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
