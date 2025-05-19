import Link from "next/link"
import { PlusCircle } from "lucide-react"
import { QuizList } from "@/components/instructor/quiz-list"
import { Button } from "@/components/ui/button"
import { getInstructorQuizzes } from "@/lib/quiz-service"

export default async function InstructorQuizzesPage() {
  const quizzes = await getInstructorQuizzes()

  return (
    <div className="container py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Quizzes</h1>
          <p className="text-muted-foreground">Manage and create quizzes for your students</p>
        </div>
        <Button asChild>
          <Link href="/instructor/quizzes/create">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New Quiz
          </Link>
        </Button>
      </div>

      <QuizList quizzes={quizzes} />
    </div>
  )
}
