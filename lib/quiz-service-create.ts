"use server"

import { createClient } from "@/lib/supabase/server"
import { createQuestions } from "./quiz-service-questions"

// Create a new quiz with questions and settings
export async function createQuizWithQuestions(quizData: any): Promise<string> {
  const supabase = createClient()

  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Not authenticated")
  }

  // Create the quiz
  const { data, error } = await supabase
    .from("quizzes")
    .insert({
      instructor_id: user.id,
      title: quizData.title,
      description: quizData.description,
      category: quizData.category,
      cover_image: quizData.cover_image,
      time_limit: quizData.time_limit,
      published: quizData.published,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select("id")
    .single()

  if (error) {
    console.error("Error creating quiz:", error)
    throw new Error("Failed to create quiz")
  }

  // Create quiz settings
  const { error: settingsError } = await supabase.from("quiz_settings").insert({
    quiz_id: data.id,
    shuffle_questions: quizData.settings.shuffle_questions,
    shuffle_options: quizData.settings.shuffle_options,
    show_results: quizData.settings.show_results,
    allow_retakes: quizData.settings.allow_retakes,
    max_retakes: quizData.settings.max_retakes,
    passing_score: quizData.settings.passing_score,
  })

  if (settingsError) {
    console.error("Error creating quiz settings:", settingsError)
    // Continue anyway, as the quiz was created
  }

  // Create questions
  if (quizData.questions && quizData.questions.length > 0) {
    try {
      await createQuestions(data.id, quizData.questions)
    } catch (error) {
      console.error("Error creating questions:", error)
      // Continue anyway, as the quiz was created
    }
  }

  return data.id
}
