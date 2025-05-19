import { QuizAttempt } from "@/components/student/quiz-attempt"
import { getQuizForAttempt } from "@/lib/quiz-service"

interface AttemptPageProps {
  params: {
    id: string
  }
}

export default async function AttemptPage({ params }: AttemptPageProps) {
  const quiz = await getQuizForAttempt(params.id)

  return (
    <div className="container py-8">
      <QuizAttempt quiz={quiz} />
    </div>
  )
}
