"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Eye, EyeOff } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { PasswordStrength } from "@/components/ui/password-strength"
import { getPasswordStrength } from "@/lib/password-strength"

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string
  showStrengthIndicator?: boolean
}

export function PasswordInput({ className, showStrengthIndicator = false, ...props }: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState({
    strength: "weak" as const,
    score: 0,
    feedback: [] as string[],
  })

  // Update password strength when value changes
  useEffect(() => {
    if (showStrengthIndicator && props.value && typeof props.value === "string") {
      setPasswordStrength(getPasswordStrength(props.value))
    }
  }, [props.value, showStrengthIndicator])

  return (
    <div className="space-y-2">
      <div className="relative">
        <Input
          type={showPassword ? "text" : "password"}
          className={cn("pr-10 transition-all duration-200", className)}
          {...props}
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground transition-opacity hover:bg-transparent hover:opacity-80"
          onClick={() => setShowPassword(!showPassword)}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4 transition-transform duration-200 hover:scale-110" />
          ) : (
            <Eye className="h-4 w-4 transition-transform duration-200 hover:scale-110" />
          )}
        </Button>
      </div>
      {showStrengthIndicator && props.value && typeof props.value === "string" && props.value.length > 0 && (
        <PasswordStrength
          strength={passwordStrength.strength}
          feedback={passwordStrength.feedback}
          className="mt-1.5 animate-fade-in"
        />
      )}
    </div>
  )
}
