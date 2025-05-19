"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { toast } from "sonner"
import { Loader2, ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { requestPasswordReset, type RequestResetFormData } from "@/app/actions/password-reset"
import { showApiError } from "@/lib/api-error"

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
})

export function ForgotPasswordForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    setError(null)

    try {
      const resetData: RequestResetFormData = {
        email: values.email,
      }

      // Show loading toast
      const loadingToast = toast.loading("Sending password reset email...")

      const result = await requestPasswordReset(resetData)

      // Dismiss the loading toast
      toast.dismiss(loadingToast)

      if (result.success) {
        toast.success(result.message || "Password reset email sent successfully.")
        setIsSubmitted(true)
      } else {
        setError(result.error || "An error occurred. Please try again.")
        showApiError(result)
      }
    } catch (error) {
      console.error("Password reset request error:", error)
      setError("Failed to send password reset email. Please try again.")
      toast.error("Failed to send password reset email. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="space-y-6 text-center animate-fade-in">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6 text-primary"
          >
            <rect width="20" height="14" x="2" y="5" rx="2" />
            <path d="m2 10 8.5 3.5a2 2 0 0 0 3 0L22 10" />
          </svg>
        </div>
        <h3 className="font-display text-xl font-medium">Check your email</h3>
        <p className="text-muted-foreground">
          If your email is registered, we&apos;ve sent a password reset link to your inbox.
        </p>
        <Button
          variant="outline"
          className="w-full btn-hover-effect transition-all duration-300"
          onClick={() => router.push("/")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Sign In
        </Button>
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2 text-center">
          <h3 className="font-display text-xl font-medium">Forgot your password?</h3>
          <p className="text-sm text-muted-foreground">
            Enter your email address and we&apos;ll send you a link to reset your password.
          </p>
        </div>

        {error && (
          <div className="animate-fade-in rounded-md bg-destructive/15 p-3 text-sm text-destructive">
            <p>{error}</p>
          </div>
        )}

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="name@example.com"
                  {...field}
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full btn-hover-effect transition-all duration-300" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            "Send Reset Link"
          )}
        </Button>
        <Button
          variant="ghost"
          className="w-full transition-all duration-200 hover:bg-secondary"
          onClick={() => router.push("/")}
          type="button"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Sign In
        </Button>
      </form>
    </Form>
  )
}
