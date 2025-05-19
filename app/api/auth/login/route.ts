import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const supabase = createClient()

    // First, try to sign in normally
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    // If there's an error about email confirmation
    if (signInError && signInError.message.includes("Email not confirmed")) {
      // Get the user by email
      const { data: userData, error: userError } = await supabase.auth.admin.listUsers()

      if (userError) {
        return NextResponse.json({ error: "Authentication failed" }, { status: 500 })
      }

      // Find the user with the matching email
      const user = userData.users.find((u) => u.email === email)

      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 })
      }

      // Confirm the user's email
      const { error: confirmError } = await supabase.auth.admin.updateUserById(user.id, { email_confirm: true })

      if (confirmError) {
        return NextResponse.json({ error: "Failed to confirm email" }, { status: 500 })
      }

      // Try signing in again after confirming the email
      const { data: confirmedData, error: confirmedError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (confirmedError) {
        return NextResponse.json({ error: "Authentication failed after confirmation" }, { status: 401 })
      }

      return NextResponse.json({ success: true, user: confirmedData.user })
    } else if (signInError) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    return NextResponse.json({ success: true, user: data.user })
  } catch (error) {
    console.error("Login API error:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
