"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import type React from "react"
import { MainNav } from "@/components/layout/main-nav"
import { useSupabase } from "@/hooks/use-supabase"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter()
  const { supabase } = useSupabase()
  const [userRole, setUserRole] = useState<"student" | "instructor">("instructor")
  const [userName, setUserName] = useState("User")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function checkUser() {
      try {
        setIsLoading(true)

        // Get the current user
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          // For development/preview, we'll use a default role and name
          console.log("No authenticated user found, using default values for development")
          setUserRole("instructor")
          setUserName("John Doe")
          setIsLoading(false)
          return
        }

        // Get the user's role from the database
        const { data: userData, error } = await supabase.from("users").select("name, role").eq("id", user.id).single()

        if (error) {
          console.error("Error fetching user data:", error)
          // Use default values from user metadata if available
          const metadataName = user.user_metadata?.name
          const metadataRole = user.user_metadata?.role

          setUserName(metadataName || "User")
          setUserRole(metadataRole === "student" || metadataRole === "instructor" ? metadataRole : "student")
        } else if (userData) {
          setUserName(userData.name)
          setUserRole(userData.role as "student" | "instructor")
        }
      } catch (error) {
        console.error("Error checking user:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkUser()
  }, [supabase, router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="flex h-16 items-center border-b bg-background">
          <MainNav userRole={userRole} userName={userName} />
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  )
}
