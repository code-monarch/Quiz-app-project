import Link from "next/link"
import { BookOpen } from "lucide-react"
import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
  showText?: boolean
  size?: "sm" | "md" | "lg"
}

export function Logo({ className, showText = true, size = "md" }: LogoProps) {
  const iconSizes = {
    sm: "h-5 w-5",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  }

  const textSizes = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  }

  return (
    <Link href="/" className={cn("flex items-center gap-2 transition-opacity hover:opacity-90", className)}>
      <div className="relative flex items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent p-1.5 text-primary-foreground shadow-sm">
        <BookOpen className={cn("relative z-10", iconSizes[size])} />
        <div className="absolute inset-0 rounded-lg bg-white/10 blur-sm"></div>
      </div>
      {showText && (
        <span className={cn("font-display font-bold tracking-tight", textSizes[size])}>
          Quiz<span className="text-primary">Master</span>
        </span>
      )}
    </Link>
  )
}
