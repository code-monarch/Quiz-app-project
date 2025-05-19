"use server"

import { createClient } from "@/lib/supabase/server"
import { v4 as uuidv4 } from "uuid"

// Function to create a single question
export async function createQuestion(quizId: string, questionData: any) {
  const supabase = createClient()

  // Check if we're in development/preview mode
  if (quizId === "1" || quizId === "2" || quizId === "preview") {
    console.log("Development mode: Simulating question creation")
    return "question-" + uuidv4()
  }

  const { data: userData, error: userError } = await supabase.auth.getUser()
  if (userError || !userData.user) {
    console.log("No authenticated user, returning mock question ID")
    return "mock-question-" + uuidv4()
  }

  // First, create the question
  const { data: question, error: questionError } = await supabase
    .from("questions")
    .insert({
      quiz_id: quizId,
      question_type: questionData.question_type,
      question_text: questionData.question_text,
      explanation: questionData.explanation || null,
      points: questionData.points || 1,
    })
    .select()
    .single()

  if (questionError) {
    console.error("Error creating question:", questionError)
    throw new Error(`Failed to create question: ${questionError.message}`)
  }

  // Then, create options if they exist
  if (questionData.options && questionData.options.length > 0) {
    const optionsToInsert = questionData.options.map((option: any, index: number) => ({
      question_id: question.id,
      option_text: option.option_text,
      is_correct: option.is_correct,
      position: index + 1,
    }))

    const { error: optionsError } = await supabase.from("question_options").insert(optionsToInsert)

    if (optionsError) {
      console.error("Error creating options:", optionsError)
      throw new Error(`Failed to create options: ${optionsError.message}`)
    }
  }

  return question.id
}

// Function to create multiple questions at once
export async function createQuestions(quizId: string, questions: any[]) {
  const supabase = createClient()

  // Check if we're in development/preview mode
  if (quizId === "1" || quizId === "2" || quizId === "preview") {
    console.log("Development mode: Simulating multiple questions creation")
    return questions.map(() => "question-" + uuidv4())
  }

  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    console.log("No authenticated user, returning mock question IDs")
    return questions.map(() => "mock-question-" + uuidv4())
  }

  // Insert questions
  const questionsToInsert = questions.map((question: any, index: number) => ({
    quiz_id: quizId,
    question_type: question.question_type,
    question_text: question.question_text,
    explanation: question.explanation || null,
    points: question.points || 1,
    position: index + 1,
  }))

  const { data: createdQuestions, error: questionsError } = await supabase
    .from("questions")
    .insert(questionsToInsert)
    .select("*")

  if (questionsError) {
    console.error("Error creating questions:", questionsError)
    throw new Error("Failed to create questions")
  }

  // Insert options for each question
  for (const question of createdQuestions) {
    if (question.question_type === "multiple_choice" || question.question_type === "true_false") {
      const optionsToInsert = questions
        .find((q: any) => q.question_text === question.question_text)
        .options.map((option: any, index: number) => ({
          question_id: question.id,
          option_text: option.option_text,
          is_correct: option.is_correct,
          position: index + 1,
        }))

      const { error: optionsError } = await supabase.from("question_options").insert(optionsToInsert)

      if (optionsError) {
        console.error("Error creating options:", optionsError)
        throw new Error("Failed to create options")
      }
    }
  }

  return createdQuestions.map((q) => q.id)
}

export async function deleteQuestion(questionId: string) {
  const supabase = createClient()

  // Check if we're in development/preview mode
  if (
    questionId === "1" ||
    questionId === "2" ||
    questionId.startsWith("question-") ||
    questionId.startsWith("mock-")
  ) {
    console.log("Development mode: Simulating question deletion")
    return true
  }

  const { data: userData, error: userError } = await supabase.auth.getUser()
  if (userError || !userData.user) {
    throw new Error("Not authenticated")
  }

  // First delete the options
  const { error: optionsError } = await supabase.from("question_options").delete().eq("question_id", questionId)

  if (optionsError) {
    console.error("Error deleting options:", optionsError)
    throw new Error(`Failed to delete options: ${optionsError.message}`)
  }

  // Then delete the question
  const { error: questionError } = await supabase.from("questions").delete().eq("id", questionId)

  if (questionError) {
    console.error("Error deleting question:", questionError)
    throw new Error(`Failed to delete question: ${questionError.message}`)
  }

  return true
}
