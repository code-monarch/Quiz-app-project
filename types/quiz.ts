export interface Quiz {
  id: string
  instructor_id: string
  title: string
  description?: string
  category?: string
  cover_image?: string
  time_limit?: number
  created_at: string
  updated_at: string
  published: boolean
  archived?: boolean
}

export interface QuizSettings {
  quiz_id: string
  shuffle_questions: boolean
  shuffle_options: boolean
  show_results: "immediately" | "after-submission" | "after-due-date"
  allow_retakes: boolean
  max_retakes?: number
  passing_score: number
  due_date?: string
}

export interface Question {
  id: string
  quiz_id: string
  question_type: "multiple-choice" | "true-false" | "matching" | "fill-blank" | "short-answer"
  question_text: string
  explanation?: string
  points: number
  media_type?: string
  media_url?: string
  position: number
  options?: QuestionOption[]
}

export interface QuestionOption {
  id: string
  question_id: string
  option_text: string
  is_correct: boolean
  match_text?: string
  position: number
}

export interface QuizAttempt {
  id: string
  quiz_id: string
  student_id: string
  started_at: string
  completed_at?: string
  score?: number
  time_spent?: number
  attempt_number: number
}

export interface StudentQuiz {
  id: string
  title: string
  description?: string
  category: string
  cover_image?: string
  time_limit?: number
  due_date?: string
  attempts?: QuizAttempt[]
}

export interface QuizWithQuestions extends Quiz {
  settings: QuizSettings
  questions: Question[]
}
