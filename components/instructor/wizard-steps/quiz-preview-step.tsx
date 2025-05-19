"use client"

interface QuizPreviewStepProps {
  quizData: any
}

export function QuizPreviewStep({ quizData }: QuizPreviewStepProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Quiz Preview</h3>
        <p className="text-sm text-muted-foreground">
          Review your quiz before {quizData.id ? "saving changes" : "creating it"}.
        </p>
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
          </div>
        </div>

        <div>
          <h4 className="font-medium">Questions ({quizData.questions.length})</h4>
          <div className="mt-2 space-y-4">
            {quizData.questions.map((q: any, i: number) => (
              <div key={i} className="border p-3 rounded-md">
                <p className="font-medium">
                  Question {i + 1}: {q.question_text}
                </p>
                <p className="text-sm text-muted-foreground">Type: {q.question_type}</p>
                <p className="text-sm text-muted-foreground">Points: {q.points}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-medium">Settings</h4>
          <div className="mt-2 space-y-2">
            <p>
              <strong>Shuffle Questions:</strong> {quizData.settings.shuffle_questions ? "Yes" : "No"}
            </p>
            <p>
              <strong>Shuffle Options:</strong> {quizData.settings.shuffle_options ? "Yes" : "No"}
            </p>
            <p>
              <strong>Show Results:</strong> {quizData.settings.show_results}
            </p>
            <p>
              <strong>Allow Retakes:</strong> {quizData.settings.allow_retakes ? "Yes" : "No"}
            </p>
            {quizData.settings.allow_retakes && (
              <p>
                <strong>Max Retakes:</strong> {quizData.settings.max_retakes}
              </p>
            )}
            <p>
              <strong>Passing Score:</strong> {quizData.settings.passing_score}%
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
