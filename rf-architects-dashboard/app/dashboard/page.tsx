"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus } from "lucide-react"
import { productService } from "@/services/product.service"
import { projectService } from "@/services/project.service"

interface DashboardStats {
  totalProducts: number
  totalProjects: number
}

const chartData = [
  { name: "Furniture", count: 25 },
  { name: "Lighting", count: 18 },
  { name: "Decor", count: 12 },
  { name: "Bath", count: 8 },
  { name: "Marble", count: 15 },
]

const INITIAL_STATS: DashboardStats = {
  totalProducts: 0,
  totalProjects: 0,
}

const arrayFromResponse = <T,>(value: unknown): T[] => {
  if (Array.isArray(value)) {
    return value as T[]
  }

  if (!value || typeof value !== "object") {
    return []
  }

  const candidate = value as Record<string, unknown>
  const items = candidate.items ?? candidate.products ?? candidate.projects

  return Array.isArray(items) ? (items as T[]) : []
}

export default function OverviewPage() {
  const [stats, setStats] = useState<DashboardStats>(INITIAL_STATS)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    const loadOverview = async () => {
      setIsLoading(true)
      setErrorMessage(null)

      try {
        const [productsRes, projectsRes] = await Promise.all([
          productService.getProducts({ page: 1, limit: 10 }),
          projectService.getProjects({ page: 1, limit: 10 }),
        ])

        const products = arrayFromResponse(productsRes.data)
        const projects = arrayFromResponse(projectsRes.data)
        const projectTotal =
          projectsRes.data && typeof projectsRes.data === "object" && "totalResults" in projectsRes.data
            ? Number(projectsRes.data.totalResults)
            : projects.length

        setStats({
          totalProducts: products.length,
          totalProjects: projectTotal,
        })

        if (!productsRes.success || !projectsRes.success) {
          const failedRequests = [
            productsRes.success ? null : "products",
            projectsRes.success ? null : "projects",
          ].filter(Boolean)

          console.warn("Dashboard overview fetch warnings:", failedRequests)
          setErrorMessage("Some dashboard data could not be loaded. Showing empty totals for the unavailable sections.")
        }
      } catch (error) {
        console.error("Dashboard overview failed to load:", error)
        setStats(INITIAL_STATS)
        setErrorMessage("The dashboard could not load some data. Please retry in a moment.")
      } finally {
        setIsLoading(false)
      }
    }

    void loadOverview()
  }, [])

  const StatCard = ({ title, value, description }: { title: string; value: number; description: string }) => (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{isLoading ? "—" : value}</div>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
          <p className="text-muted-foreground mt-1">Welcome back to RF Architects admin panel</p>
        </div>
        <div className="flex gap-2">
          <Link href="/products/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Product
            </Button>
          </Link>
          <Link href="/projects/new">
            <Button variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              New Project
            </Button>
          </Link>
        </div>
      </div>

      {errorMessage && (
        <div className="rounded-md border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-700 dark:text-amber-300">
          {errorMessage}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <StatCard title="Total Products" value={stats.totalProducts} description="Active products" />
        <StatCard title="Projects Completed" value={stats.totalProjects} description="Portfolio projects" />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Products by Category</CardTitle>
            <CardDescription>Distribution of products across categories</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" stroke="var(--muted-foreground)" />
                <YAxis stroke="var(--muted-foreground)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius)",
                  }}
                />
                <Legend />
                <Bar dataKey="count" fill="var(--accent)" name="Product Count" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/products">
              <Button variant="outline" className="w-full justify-start">
                Manage Products
              </Button>
            </Link>
            <Link href="/projects">
              <Button variant="outline" className="w-full justify-start">
                Manage Projects
              </Button>
            </Link>
            <Link href="/settings">
              <Button variant="outline" className="w-full justify-start">
                Site Settings
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
