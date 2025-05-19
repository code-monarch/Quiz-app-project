import { Suspense } from "react"
import { QuestionForm } from "@/components/instructor/question-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface QuestionCreatePageProps {
  params: {
    id: string
  }
}

export default function QuestionCreatePage({ params }: QuestionCreatePageProps) {
  return (
    <div className="container py-6 space-y-6">
      <h1 className="text-2xl font-bold">Add Question</h1>
      <Card>
        <CardHeader>
          <CardTitle>Create a New Question</CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
            <QuestionForm quizId={params.id} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}
