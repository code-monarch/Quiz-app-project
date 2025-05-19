import { toast } from "sonner"

export type ApiResponse<T = any> = {
  success: boolean
  data?: T
  error?: string
  validationErrors?: Record<string, string[]>
}

export function handleApiError(error: unknown): ApiResponse {
  console.error("API Error:", error)

  if (error instanceof Error) {
    return {
      success: false,
      error: error.message,
    }
  }

  return {
    success: false,
    error: "An unexpected error occurred. Please try again.",
  }
}

export function showApiError(response: ApiResponse) {
  if (response.validationErrors) {
    // Show the first validation error
    const firstField = Object.keys(response.validationErrors)[0]
    const firstError = response.validationErrors[firstField][0]

    toast.error(`${firstField}: ${firstError}`)
    return
  }

  if (response.error) {
    toast.error(response.error)
    return
  }

  toast.error("An unexpected error occurred. Please try again.")
}
