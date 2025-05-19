"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "@/components/ui/password-input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { loginUser } from "@/app/actions/auth"
import { showApiError } from "@/lib/api-error"
import { useSupabase } from "@/hooks/use-supabase"

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(1, {
    message: "Password is required.",
  }),
  role: z.enum(["student", "instructor"], {
    required_error: "Please select a role.",
  }),
})

export function LoginForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { supabase } = useSupabase()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      role: "student",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    setError(null)

    try {
      // Show loading toast
      const loadingToast = toast.loading("Signing in...")

      // First try the server action
      const result = await loginUser({
        email: values.email,
        password: values.password,
        role: values.role,
      })

      // If there's an error about email confirmation, try the API route
      if (!result.success && result.error?.includes("Email not confirmed")) {
        // Try the API route that bypasses email confirmation
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: values.email,
            password: values.password,
          }),
        })

        const apiResult = await response.json()

        if (apiResult.success) {
          // Refresh the session
          await supabase.auth.refreshSession()

          // Dismiss the loading toast
          toast.dismiss(loadingToast)
          toast.success(`Welcome back! You've been logged in as a ${values.role}.`)

          // Redirect based on role
          router.push(values.role === "student" ? "/student/dashboard" : "/instructor/dashboard")
          return
        }
      }

      // Dismiss the loading toast
      toast.dismiss(loadingToast)

      if (result.success && result.data) {
        toast.success(`Welcome back! You've been logged in as a ${values.role}.`)

        // Redirect based on role
        if (result.data.role === "student") {
          router.push("/student/dashboard")
        } else {
          router.push("/instructor/dashboard")
        }
      } else {
        setError(result.error || "An error occurred during login. Please try again.")
        showApiError(result)
      }
    } catch (error) {
      console.error("Login error:", error)
      setError("Please check your credentials and try again.")
      toast.error("Please check your credentials and try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>Password</FormLabel>
                <Link href="/forgot-password" className="text-xs text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <FormControl>
                <PasswordInput
                  placeholder="••••••••"
                  {...field}
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-primary/20">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="instructor">Instructor</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full btn-hover-effect transition-all duration-300" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            "Sign in"
          )}
        </Button>
      </form>
    </Form>
  )
}
