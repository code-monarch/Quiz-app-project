"use server"

import { createClient } from "@/lib/supabase/server"
import { z } from "zod"

const loginSchema = z.object({
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

export type LoginFormData = z.infer<typeof loginSchema>

export async function loginUser(formData: LoginFormData) {
  // Validate form data
  const validatedFields = loginSchema.safeParse(formData)

  if (!validatedFields.success) {
    return {
      success: false,
      error: "Invalid form data. Please check your inputs.",
    }
  }

  const { email, password, role } = validatedFields.data

  try {
    const supabase = createClient()

    // Sign in the user
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError) {
      return {
        success: false,
        error: "Invalid email or password. Please try again.",
      }
    }

    // Verify the user's role
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("role")
      .eq("id", data.user.id)
      .single()

    if (userError || !userData) {
      return {
        success: false,
        error: "User account not found. Please contact support.",
      }
    }

    // Check if the selected role matches the user's actual role
    if (userData.role !== role) {
      return {
        success: false,
        error: `You are not registered as a ${role}. Please select the correct role.`,
      }
    }

    // Return success with user role for redirection
    return {
      success: true,
      role: userData.role,
    }
  } catch (error) {
    console.error("Login error:", error)
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    }
  }
}
