"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"

// Custom hook to get the Supabase client
export function useSupabase() {
  const [supabase] = useState(() => createClient())

  return { supabase }
}
