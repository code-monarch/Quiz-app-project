"use client"

import { useFormContext } from "react-hook-form"

type QuizPreviewStepProps = {}

export function QuizPreviewStep({}: QuizPreviewStepProps) {
  const form = useFormContext()

  const quizData = form.getValues()
  const questions = quizData.questions || []
  const settings = quizData.settings

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Quiz Preview</h3>
        <p className="text-sm text-muted-foreground">Review your quiz before finalizing.</p>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="font-medium">Basic Information</h4>
          <div className="mt-2 space-y-2">
            <p>
              <strong>Title:</strong> {quizData.title}
            </p>
            <p>
              <strong>Description:</strong> {quizData.description || "None"}
            </p>
            <p>
              <strong>Category:</strong> {quizData.category}
            </p>
            <p>
              <strong>Time Limit:</strong> {quizData.time_limit} minutes
            </p>
            <p>
              <strong>Status:</strong> {quizData.published ? "Published" : "Draft"}
            </p>
            {quizData.cover_image && (
              <div>
                <strong>Cover Image:</strong>
                <div className="mt-2 w-full max-w-xs rounded-md overflow-hidden">
                  <img
                    src={quizData.cover_image || "/placeholder.svg"}
                    alt="Quiz cover"
                    className="w-full h-auto object-cover"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div>
          <h4 className="font-medium">Questions ({questions.length})</h4>
          <div className="mt-2 space-y-4">
            {questions.map((q: any, i: number) => (
              <div key={i} className="border p-3 rounded-md">
                <p className="font-medium">
                  Question {i + 1}: {q.question_text}
                </p>
                <p className="text-sm text-muted-foreground">Type: {q.question_type}</p>
                <p className="text-sm text-muted-foreground">Points: {q.points}</p>
                {q.options && q.options.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm font-medium">Options:</p>
                    <ul className="mt-1 space-y-1">
                      {q.options.map((opt: any, idx: number) => (
                        <li key={idx} className="text-sm pl-2 border-l-2 border-muted-foreground">
                          {opt.option_text} {opt.is_correct && <span className="text-green-600">(Correct)</span>}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-medium">Settings</h4>
          <div className="mt-2 space-y-2">
            <p>
              <strong>Shuffle Questions:</strong> {settings.shuffle_questions ? "Yes" : "No"}
            </p>
            <p>
              <strong>Shuffle Options:</strong> {settings.shuffle_options ? "Yes" : "No"}
            </p>
            <p>
              <strong>Show Results:</strong> {settings.show_results}
            </p>
            <p>
              <strong>Allow Retakes:</strong> {settings.allow_retakes ? "Yes" : "No"}
            </p>
            {settings.allow_retakes && (
              <p>
                <strong>Max Retakes:</strong> {settings.max_retakes}
              </p>
            )}
            <p>
              <strong>Passing Score:</strong> {settings.passing_score}%
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
