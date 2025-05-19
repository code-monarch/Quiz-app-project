import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  // Check if we're in development or preview mode
  const isDevOrPreview =
    process.env.NODE_ENV === "development" || req.headers.get("x-vercel-deployment-url")?.includes("vercel.app")

  // If in development or preview, skip auth checks
  if (isDevOrPreview) {
    return NextResponse.next()
  }

  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Check auth condition
  const isLoggedIn = !!session
  const isAuthPage = req.nextUrl.pathname === "/" || req.nextUrl.pathname === "/register"
  const isProtectedRoute = req.nextUrl.pathname.startsWith("/student") || req.nextUrl.pathname.startsWith("/instructor")

  // If the user is not logged in and trying to access a protected route
  if (!isLoggedIn && isProtectedRoute) {
    const redirectUrl = new URL("/", req.url)
    return NextResponse.redirect(redirectUrl)
  }

  // If the user is logged in and trying to access an auth page
  if (isLoggedIn && isAuthPage) {
    // Get user role from the database
    const { data: userData } = await supabase.from("users").select("role").eq("id", session.user.id).single()

    if (userData) {
      const redirectUrl = new URL(userData.role === "student" ? "/student/dashboard" : "/instructor/dashboard", req.url)
      return NextResponse.redirect(redirectUrl)
    }
  }

  return res
}

export const config = {
  matcher: ["/", "/register", "/student/:path*", "/instructor/:path*"],
}
