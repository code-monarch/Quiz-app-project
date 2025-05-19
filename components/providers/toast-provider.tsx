"use client"

import { Toaster as SonnerToaster } from "sonner"

export function ToastProvider() {
  return (
    <SonnerToaster
      position="top-right"
      toastOptions={{
        className: "border-border",
        style: {
          background: "hsl(var(--background))",
          color: "hsl(var(--foreground))",
          border: "1px solid hsl(var(--border))",
        },
      }}
      richColors
      closeButton
    />
  )
}
