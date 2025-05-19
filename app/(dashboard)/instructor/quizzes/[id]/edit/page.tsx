import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { QuizWizard } from "@/components/instructor/quiz-wizard"
import { getQuizWithQuestions, getCategories } from "@/lib/quiz-service"

interface QuizEditPageProps {
  params: {
    id: string
  }
}

export default async function QuizEditPage({ params }: QuizEditPageProps) {
  const [quiz, categories] = await Promise.all([getQuizWithQuestions(params.id), getCategories()])

  if (!quiz) {
    notFound()
  }

  return (
    <div className="container py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Edit Quiz</h1>
          <p className="text-muted-foreground">Update the details and questions of your quiz</p>
        </div>
        <Button variant="outline" asChild>
          <Link href={`/instructor/quizzes/${params.id}`}>Cancel</Link>
        </Button>
      </div>

      <QuizWizard categories={categories} initialData={quiz} isEditing={true} />
    </div>
  )
}
