"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { LogOut } from "lucide-react"

import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"

interface LogoutButtonProps {
  children?: React.ReactNode
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
}

export function LogoutButton({ children, variant = "ghost" }: LogoutButtonProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleLogout = async () => {
    setIsLoading(true)

    try {
      const supabase = createClient()
      await supabase.auth.signOut()

      toast.success("Logged out successfully")

      router.push("/")
      router.refresh()
    } catch (error) {
      console.error("Logout error:", error)
      toast.error("There was a problem logging out. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button variant={variant} onClick={handleLogout} disabled={isLoading}>
      {children || (
        <>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </>
      )}
    </Button>
  )
}
