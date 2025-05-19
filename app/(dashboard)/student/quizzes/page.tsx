import { StudentQuizList } from "@/components/student/student-quiz-list"
import { getStudentQuizzes } from "@/lib/quiz-service"

export default async function StudentQuizzesPage() {
  const quizzes = await getStudentQuizzes()

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">My Quizzes</h1>
        <p className="text-muted-foreground">View and take quizzes assigned to you</p>
      </div>

      <StudentQuizList quizzes={quizzes} />
    </div>
  )
}
