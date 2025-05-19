import Link from "next/link"
import { Button } from "@/components/ui/button"
import { QuizWizard } from "@/components/instructor/quiz-wizard"
import { getCategories } from "@/lib/quiz-service"

export default async function CreateQuizPage() {
  const categories = await getCategories()

  return (
    <div className="container py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Create Quiz</h1>
          <p className="text-muted-foreground">Create a new quiz with questions and settings</p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/instructor/quizzes">Cancel</Link>
        </Button>
      </div>

      <QuizWizard categories={categories} />
    </div>
  )
}
