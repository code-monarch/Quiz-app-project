import { cn } from "@/lib/utils"
import type { PasswordStrength as PasswordStrengthType } from "@/lib/password-strength"

interface PasswordStrengthProps {
  strength: PasswordStrengthType
  feedback?: string[]
  className?: string
}

export function PasswordStrength({ strength, feedback, className }: PasswordStrengthProps) {
  const getColorClass = () => {
    switch (strength) {
      case "weak":
        return "bg-destructive"
      case "medium":
        return "bg-amber-500"
      case "strong":
        return "bg-emerald-500"
      case "very-strong":
        return "bg-green-500"
      default:
        return "bg-destructive"
    }
  }

  const getWidthClass = () => {
    switch (strength) {
      case "weak":
        return "w-1/4"
      case "medium":
        return "w-2/4"
      case "strong":
        return "w-3/4"
      case "very-strong":
        return "w-full"
      default:
        return "w-0"
    }
  }

  const getLabel = () => {
    switch (strength) {
      case "weak":
        return "Weak"
      case "medium":
        return "Medium"
      case "strong":
        return "Strong"
      case "very-strong":
        return "Very Strong"
      default:
        return ""
    }
  }

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
          <div
            className={cn("h-full rounded-full transition-all duration-500 ease-out", getColorClass(), getWidthClass())}
          />
        </div>
        <span className="ml-2 text-xs font-medium">{getLabel()}</span>
      </div>
      {feedback && feedback.length > 0 && (
        <ul className="text-xs text-muted-foreground">
          {feedback.map((item, index) => (
            <li key={index} className="flex items-start animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
              <span className="mr-1 text-primary">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
