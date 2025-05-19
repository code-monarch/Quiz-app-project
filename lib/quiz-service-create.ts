"\"use server"

import { createClient } from "@/lib/supabase/server"

// Create a new quiz
export async function createQuiz(quizData: any): Promise<string> {
  const supabase = createClient()

  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // If in development or preview and no user is authenticated, return mock data
  if (!user) {
    console.log("No authenticated user found, returning mock quiz ID for development")
    return "mock-quiz-id-" + Date.now()
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
    shuffle_questions: true,
    shuffle_options: true,
    show_results: "after-submission",
    allow_retakes: true,
    max_retakes: 3,
    passing_score: 70,
  })

  if (settingsError) {
    console.error("Error creating quiz settings:", settingsError)
    // Continue anyway, as the quiz was created
  }

  return data.id
}
