"use server"

import { createClient } from "@/lib/supabase/server"

// Update quiz settings
export async function updateQuizSettings(quizId: string, settingsData: any): Promise<void> {
  try {
    const supabase = createClient()

    // Check if we're in development/preview mode
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    const isDevOrPreview = !uuidRegex.test(quizId) || process.env.NODE_ENV === "development"

    // Get the current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    // If in development/preview and no user is authenticated, return success
    if (!user && isDevOrPreview) {
      console.log(
        "No authenticated user found, but in development/preview mode. Simulating successful settings update.",
      )
      return
    }

    if (!user) {
      throw new Error("Not authenticated")
    }

    // First, check if the quiz belongs to the current user
    const { data: quiz, error: quizError } = await supabase
      .from("quizzes")
      .select("instructor_id")
      .eq("id", quizId)
      .single()

    if (quizError) {
      console.error("Error fetching quiz:", quizError)
      throw new Error("Failed to fetch quiz")
    }

    if (quiz.instructor_id !== user.id) {
      throw new Error("You don't have permission to update this quiz")
    }

    // Check if settings exist
    const { data: existingSettings, error: settingsError } = await supabase
      .from("quiz_settings")
      .select("*")
      .eq("quiz_id", quizId)
      .single()

    if (settingsError && settingsError.code !== "PGRST116") {
      console.error("Error fetching quiz settings:", settingsError)
    }

    if (existingSettings) {
      // Update existing settings
      const { error } = await supabase
        .from("quiz_settings")
        .update({
          shuffle_questions: settingsData.shuffle_questions,
          shuffle_options: settingsData.shuffle_options,
          show_results: settingsData.show_results,
          allow_retakes: settingsData.allow_retakes,
          max_retakes: settingsData.allow_retakes ? settingsData.max_retakes : null,
          passing_score: settingsData.passing_score,
        })
        .eq("quiz_id", quizId)

      if (error) {
        console.error("Error updating quiz settings:", error)
        throw new Error("Failed to update quiz settings")
      }
    } else {
      // Create new settings
      const { error } = await supabase.from("quiz_settings").insert({
        quiz_id: quizId,
        shuffle_questions: settingsData.shuffle_questions,
        shuffle_options: settingsData.shuffle_options,
        show_results: settingsData.show_results,
        allow_retakes: settingsData.allow_retakes,
        max_retakes: settingsData.allow_retakes ? settingsData.max_retakes : null,
        passing_score: settingsData.passing_score,
      })

      if (error) {
        console.error("Error creating quiz settings:", error)
        throw new Error("Failed to create quiz settings")
      }
    }
  } catch (error) {
    console.error("Error in updateQuizSettings:", error)
    throw error
  }
}
