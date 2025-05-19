import { QuizWizard } from "@/components/instructor/quiz-wizard"
import { getCategories } from "@/lib/quiz-service"

export default async function CreateQuizPage() {
  const categories = await getCategories()

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Create New Quiz</h1>
        <p className="text-muted-foreground">Follow the steps below to create a new quiz for your students.</p>
      </div>

      <QuizWizard categories={categories} />
    </div>
  )
}
