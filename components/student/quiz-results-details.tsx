import { CheckCircle2, XCircle } from "lucide-react"

export function QuizResultsDetails() {
  const questions = [
    {
      id: 1,
      text: "Which of the following is NOT a JavaScript data type?",
      yourAnswer: "Float",
      correctAnswer: "Float",
      isCorrect: true,
      explanation:
        "JavaScript has the following primitive data types: String, Number, Boolean, Undefined, Null, Symbol, and BigInt. It also has Object as a non-primitive data type. Float is not a distinct data type in JavaScript; floating-point numbers are part of the Number type.",
    },
    {
      id: 2,
      text: "What does the '===' operator do in JavaScript?",
      yourAnswer: "Compares values only",
      correctAnswer: "Compares values and types",
      isCorrect: false,
      explanation:
        "The '===' operator is the strict equality operator in JavaScript. It compares both the values and the types of the operands. It returns true only if both the value and type are the same.",
    },
    {
      id: 3,
      text: "Which method is used to add an element to the end of an array?",
      yourAnswer: "push()",
      correctAnswer: "push()",
      isCorrect: true,
      explanation:
        "The push() method adds one or more elements to the end of an array and returns the new length of the array.",
    },
  ]

  return (
    <div className="space-y-8">
      {questions.map((question) => (
        <div key={question.id} className="space-y-2">
          <div className="flex items-start">
            <div className="mr-2 mt-0.5">
              {question.isCorrect ? (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
            </div>
            <div>
              <div className="font-medium">
                Question {question.id}: {question.text}
              </div>
              <div className="mt-2 space-y-1 text-sm">
                <div>
                  <span className="font-medium">Your answer:</span>{" "}
                  <span className={question.isCorrect ? "text-green-500" : "text-red-500"}>{question.yourAnswer}</span>
                </div>
                {!question.isCorrect && (
                  <div>
                    <span className="font-medium">Correct answer:</span>{" "}
                    <span className="text-green-500">{question.correctAnswer}</span>
                  </div>
                )}
              </div>
              <div className="mt-2 rounded-md bg-muted p-3 text-sm">
                <span className="font-medium">Explanation:</span> {question.explanation}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
