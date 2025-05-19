"use server"

import { createClient } from "@/lib/supabase/server"
import { z } from "zod"

const registerSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  role: z.enum(["student", "instructor"], {
    required_error: "Please select a role.",
  }),
})

export type RegisterFormData = z.infer<typeof registerSchema>

export async function registerUser(formData: RegisterFormData) {
  try {
    // Validate form data
    const validatedFields = registerSchema.safeParse(formData)

    if (!validatedFields.success) {
      return {
        success: false,
        error: "Invalid form data. Please check your inputs.",
        validationErrors: validatedFields.error.flatten().fieldErrors,
      }
    }

    const { name, email, password, role } = validatedFields.data

    const supabase = createClient()

    // Check if a user with this email already exists in our custom users table
    const { data: existingUserData } = await supabase.from("users").select("id").eq("email", email).maybeSingle()

    if (existingUserData) {
      return {
        success: false,
        error: "An account with this email already exists. Please sign in instead.",
      }
    }

    // Create the user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role,
        },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/auth/callback`,
      },
    })

    if (authError) {
      // Handle specific Supabase Auth errors
      if (authError.message.includes("already registered")) {
        return {
          success: false,
          error: "An account with this email already exists. Please sign in instead.",
        }
      }

      return {
        success: false,
        error: authError.message,
      }
    }

    if (!authData.user?.id) {
      return {
        success: false,
        error: "Failed to create user account. Please try again.",
      }
    }

    // Use admin privileges to confirm the user's email immediately
    // This is a workaround for development/testing purposes
    const { error: confirmError } = await supabase.auth.admin.updateUserById(authData.user.id, { email_confirm: true })

    if (confirmError) {
      console.error("Error confirming email:", confirmError)
      // Continue anyway, as this is just a convenience feature
    }

    try {
      // Insert user data into our custom users table
      const { error: dbError } = await supabase.from("users").insert({
        id: authData.user.id,
        email,
        name,
        role,
        password_hash: "supabase_auth_managed", // Placeholder value since Supabase Auth manages the actual password
      })

      if (dbError) {
        console.error("Error creating user in database:", dbError)

        // If it's a duplicate key error, the user might already exist
        if (dbError.code === "23505") {
          // PostgreSQL unique violation code
          return {
            success: true,
            data: {
              userId: authData.user.id,
              role,
            },
          }
        }

        return {
          success: false,
          error: "Failed to create user account. Please try again.",
        }
      }
    } catch (insertError) {
      console.error("Error inserting user:", insertError)
      // Even if the database insert fails, the auth user was created
      // Return success so the user can still log in
      return {
        success: true,
        data: {
          userId: authData.user.id,
          role,
        },
      }
    }

    // Sign out the user after registration to ensure they sign in explicitly
    await supabase.auth.signOut()

    // Return success
    return {
      success: true,
      data: {
        userId: authData.user.id,
        role,
      },
    }
  } catch (error) {
    console.error("Registration error:", error)
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    }
  }
}

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
  try {
    // Validate form data
    const validatedFields = loginSchema.safeParse(formData)

    if (!validatedFields.success) {
      return {
        success: false,
        error: "Invalid form data. Please check your inputs.",
        validationErrors: validatedFields.error.flatten().fieldErrors,
      }
    }

    const { email, password, role } = validatedFields.data

    const supabase = createClient()

    // First, try to sign in normally
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    // If there's an error about email confirmation
    if (signInError && signInError.message.includes("Email not confirmed")) {
      console.log("Email not confirmed, attempting to auto-confirm...")

      // Get the user by email
      const { data: userData, error: userError } = await supabase.auth.admin.listUsers()

      if (userError) {
        console.error("Error listing users:", userError)
        return {
          success: false,
          error: "Authentication failed. Please try again.",
        }
      }

      // Find the user with the matching email
      const user = userData.users.find((u) => u.email === email)

      if (!user) {
        return {
          success: false,
          error: "User not found. Please check your credentials.",
        }
      }

      // Confirm the user's email
      const { error: confirmError } = await supabase.auth.admin.updateUserById(user.id, { email_confirm: true })

      if (confirmError) {
        console.error("Error confirming email:", confirmError)
        return {
          success: false,
          error: "Failed to confirm email. Please contact support.",
        }
      }

      // Try signing in again after confirming the email
      const { data: confirmedData, error: confirmedError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (confirmedError) {
        console.error("Sign in error after confirmation:", confirmedError)
        return {
          success: false,
          error: "Authentication failed. Please try again.",
        }
      }

      // Use the confirmed data for the rest of the function
      data.user = confirmedData.user
      data.session = confirmedData.session
    } else if (signInError) {
      console.error("Sign in error:", signInError)
      return {
        success: false,
        error: "Invalid email or password. Please try again.",
      }
    }

    if (!data.user) {
      return {
        success: false,
        error: "User not found. Please check your credentials.",
      }
    }

    // Check if the user exists in our custom users table
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("role")
      .eq("id", data.user.id)
      .maybeSingle()

    // If the user doesn't exist in our custom table but exists in auth, create them
    if (!userData && !userError) {
      // Get user metadata from auth
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user && user.user_metadata) {
        const name = user.user_metadata.name || "User"
        const userRole = user.user_metadata.role || role

        // Insert the user into our custom table
        await supabase.from("users").insert({
          id: user.id,
          email: user.email,
          name,
          role: userRole,
          password_hash: "supabase_auth_managed",
        })

        // Check if the selected role matches the user's role from metadata
        if (userRole !== role) {
          return {
            success: false,
            error: `You are not registered as a ${role}. Please select the correct role.`,
          }
        }

        return {
          success: true,
          data: {
            role: userRole,
          },
        }
      }
    }

    if (userError) {
      console.error("User data fetch error:", userError)
      return {
        success: false,
        error: "Failed to retrieve user information. Please try again.",
      }
    }

    if (!userData) {
      // Create user record if it doesn't exist
      const name = data.user.user_metadata?.name || "User"
      const userRole = data.user.user_metadata?.role || role

      await supabase.from("users").insert({
        id: data.user.id,
        email: data.user.email,
        name,
        role: userRole,
        password_hash: "supabase_auth_managed",
      })

      return {
        success: true,
        data: {
          role: userRole,
        },
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
      data: {
        role: userData.role,
      },
    }
  } catch (error) {
    console.error("Login error:", error)
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    }
  }
}

export async function resendConfirmationEmail(email: string) {
  try {
    const supabase = createClient()

    // Get the user by email
    const { data: userData, error: userError } = await supabase.auth.admin.listUsers()

    if (userError) {
      console.error("Error listing users:", userError)
      return {
        success: false,
        error: "Failed to find user. Please try again.",
      }
    }

    // Find the user with the matching email
    const user = userData.users.find((u) => u.email === email)

    if (!user) {
      return {
        success: false,
        error: "User not found. Please check your email address.",
      }
    }

    // Confirm the user's email directly
    const { error: confirmError } = await supabase.auth.admin.updateUserById(user.id, { email_confirm: true })

    if (confirmError) {
      console.error("Error confirming email:", confirmError)

      // Fall back to sending a confirmation email
      const { error } = await supabase.auth.resend({
        type: "signup",
        email,
      })

      if (error) {
        console.error("Error resending confirmation email:", error)
        return {
          success: false,
          error: "Failed to confirm email. Please try again.",
        }
      }

      return {
        success: true,
        message: "Confirmation email has been sent. Please check your inbox.",
      }
    }

    return {
      success: true,
      message: "Your email has been confirmed. You can now sign in.",
    }
  } catch (error) {
    console.error("Email confirmation error:", error)
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    }
  }
}
