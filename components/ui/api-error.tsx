import { AlertCircle } from "lucide-react"
import type { ApiResponse } from "@/lib/api-error"

interface ApiErrorProps {
  response: ApiResponse
  className?: string
}

export function ApiError({ response, className }: ApiErrorProps) {
  if (!response.error && !response.validationErrors) {
    return null
  }

  return (
    <div className={`rounded-md bg-destructive/15 p-3 text-sm text-destructive ${className}`}>
      <div className="flex items-center gap-2">
        <AlertCircle className="h-4 w-4" />
        {response.error && <p>{response.error}</p>}
        {response.validationErrors && (
          <ul className="list-disc pl-5">
            {Object.entries(response.validationErrors).map(([field, errors]) => (
              <li key={field}>
                <strong>{field}:</strong> {errors[0]}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
