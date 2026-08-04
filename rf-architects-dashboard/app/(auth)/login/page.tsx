"use client"

import { useEffect, useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff } from "lucide-react"
import { toast } from "sonner"
import { useAuth } from "@/contexts/AuthContext"
import { getApiBaseUrl } from "@/services/api/client"

const API_BASE_URL = getApiBaseUrl()

export default function LoginPage() {
  const router = useRouter()
  const { isAuthenticated, login } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})


  function validateForm() {
    const newErrors: typeof errors = {}
    if (!email || !email.includes("@")) {
      newErrors.email = "Valid email required"
    }
    if (!password || password.length < 3) {
      newErrors.password = "Password must be at least 3 characters"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      })

      const data = await res.json()
      const user = data?.data?.user ?? data?.user

      if (res.ok) {
        login(user)
        toast.success("Login successful!")
      } else {
        toast.error(data.message || "Invalid credentials")
      }
    } catch {
      toast.error("An error occurred during login")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-background via-background to-muted">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">RF Architects</CardTitle>
          <CardDescription>Admin Dashboard Login</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">Email</label>
              <Input
                id="email"
                placeholder="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (errors.email) setErrors({ ...errors, email: undefined })
                }}
              />
              {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">Password</label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    if (errors.password) setErrors({ ...errors, password: undefined })
                  }}
                  className="pr-10"
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          {/* <div className="mt-6 space-y-2 rounded-lg bg-muted p-4 text-sm">
            <p className="font-medium text-foreground">Super Admin Credentials (from .env):</p>
            <p className="text-muted-foreground">Email: superadmin@rfarchitects.com</p>
            <p className="text-muted-foreground">Password: supersecretpassword</p>
          </div> */}
        </CardContent>
      </Card>
    </div>
  )
}
