"use server"

import { createClient } from "@/lib/supabase/server"
import { z } from "zod"

const requestResetSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
})

export type RequestResetFormData = z.infer<typeof requestResetSchema>

export async function requestPasswordReset(formData: RequestResetFormData) {
  try {
    // Validate form data
    const validatedFields = requestResetSchema.safeParse(formData)

    if (!validatedFields.success) {
      return {
        success: false,
        error: "Invalid email address. Please check and try again.",
      }
    }

    const { email } = validatedFields.data
    const supabase = createClient()

    // Check if the user exists
    const { data: userData } = await supabase.from("users").select("id").eq("email", email).maybeSingle()

    if (!userData) {
      // Don't reveal if the email exists or not for security reasons
      // But still return success to prevent email enumeration attacks
      return {
        success: true,
        message: "If your email is registered, you will receive a password reset link shortly.",
      }
    }

    // Send password reset email
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password`,
    })

    if (error) {
      console.error("Password reset error:", error)
      return {
        success: false,
        error: "Failed to send password reset email. Please try again.",
      }
    }

    return {
      success: true,
      message: "If your email is registered, you will receive a password reset link shortly.",
    }
  } catch (error) {
    console.error("Password reset request error:", error)
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    }
  }
}

const resetPasswordSchema = z
  .object({
    password: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),
    confirmPassword: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>

export async function resetPassword(formData: ResetPasswordFormData) {
  try {
    // Validate form data
    const validatedFields = resetPasswordSchema.safeParse(formData)

    if (!validatedFields.success) {
      return {
        success: false,
        error: "Invalid form data. Please check your inputs.",
        validationErrors: validatedFields.error.flatten().fieldErrors,
      }
    }

    const { password } = validatedFields.data
    const supabase = createClient()

    // Update the user's password
    const { error } = await supabase.auth.updateUser({
      password,
    })

    if (error) {
      console.error("Password update error:", error)
      return {
        success: false,
        error: "Failed to update password. Please try again.",
      }
    }

    return {
      success: true,
      message: "Your password has been updated successfully. You can now log in with your new password.",
    }
  } catch (error) {
    console.error("Password reset error:", error)
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    }
  }
}
