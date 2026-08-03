'use client'

import { toast as sonnerToast } from "sonner"

type ToastOptions = {
  title?: string
  description?: string
  variant?: "default" | "destructive"
}

export function useToast() {
  const toast = ({ title, description, variant = "default" }: ToastOptions) => {
    if (variant === "destructive") {
      sonnerToast.error(title || "Error", { description })
      return
    }

    sonnerToast.success(title || "Success", { description })
  }

  return { toast }
}
