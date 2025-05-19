"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Bell, BookOpen, Home, LayoutDashboard, LogOut, Settings, Users } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ThemeToggle } from "@/components/theme-toggle"

interface MainNavProps {
  userRole: "student" | "instructor"
  userName?: string
}

export function MainNav({ userRole, userName = "User" }: MainNavProps) {
  const pathname = usePathname()
  const [notifications, setNotifications] = useState(3)

  const studentLinks = [
    {
      title: "Dashboard",
      href: "/student/dashboard",
      icon: Home,
    },
    {
      title: "My Quizzes",
      href: "/student/quizzes",
      icon: BookOpen,
    },
    {
      title: "Analytics",
      href: "/student/analytics",
      icon: LayoutDashboard,
    },
  ]

  const instructorLinks = [
    {
      title: "Dashboard",
      href: "/instructor/dashboard",
      icon: Home,
    },
    {
      title: "My Quizzes",
      href: "/instructor/quizzes",
      icon: BookOpen,
    },
    {
      title: "Students",
      href: "/instructor/students",
      icon: Users,
    },
    {
      title: "Analytics",
      href: "/instructor/analytics",
      icon: LayoutDashboard,
    },
  ]

  const links = userRole === "student" ? studentLinks : instructorLinks

  return (
    <div className="container flex h-full items-center">
      <Link
        href={userRole === "student" ? "/student/dashboard" : "/instructor/dashboard"}
        className="mr-6 flex items-center space-x-2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-6 w-6"
        >
          <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
        </svg>
        <span className="hidden font-bold sm:inline-block">QuizMaster</span>
      </Link>
      <nav className="flex items-center space-x-6 text-sm font-medium">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex items-center transition-colors hover:text-primary",
              pathname === link.href ? "text-primary" : "text-muted-foreground",
            )}
          >
            <link.icon className="mr-2 h-4 w-4" />
            <span className="hidden md:block">{link.title}</span>
          </Link>
        ))}
      </nav>
      <div className="ml-auto flex items-center space-x-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {notifications > 0 && (
                <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                  {notifications}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>New quiz assigned: "JavaScript Basics"</DropdownMenuItem>
            <DropdownMenuItem>Quiz feedback available: "React Fundamentals"</DropdownMenuItem>
            <DropdownMenuItem>Reminder: "CSS Layouts" quiz due tomorrow</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <ThemeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                {userName.charAt(0).toUpperCase()}
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/settings">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
