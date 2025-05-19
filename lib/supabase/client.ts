import { createBrowserClient } from "@supabase/ssr"

// Global variable to store the client instance
let supabaseClient: ReturnType<typeof createBrowserClient> | null = null

export function createClient() {
  // Only create a new client if one doesn't exist already and we're in the browser
  if (!supabaseClient && typeof window !== "undefined") {
    supabaseClient = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )
  }

  return supabaseClient
}
