"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { siteStatService } from "@/services/siteStat.service"
import { useToast } from "@/hooks/use-toast"

export default function SiteStatsPage() {
  const [stats, setStats] = useState<any[]>([])
  const [values, setValues] = useState<Record<string, string>>({})
  const [savingId, setSavingId] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const loadStats = async () => {
      const response = await siteStatService.getSiteStats()
      if (response.success && response.data) {
        setStats(response.data)
        setValues(Object.fromEntries(response.data.map((stat: any) => [stat.id, String(stat.value)])))
      }
    }

    loadStats()
  }, [])

  const handleSave = async (statId: string) => {
    const value = Number(values[statId])
    if (Number.isNaN(value)) {
      toast({ title: "Value must be a number", variant: "destructive" })
      return
    }
    setSavingId(statId)
    const response = await siteStatService.updateSiteStat(statId, value)
    setSavingId(null)
    if (response.success && response.data) {
      toast({ title: "Stat updated" })
      setStats((prev) => prev.map((stat) => (stat.id === statId ? response.data : stat)))
    } else {
      toast({ title: response.message || "Unable to update stat", variant: "destructive" })
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Site Statistics</h1>
        <p className="text-muted-foreground">Track high-level site performance metrics</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.id}>
            <CardHeader>
              <CardTitle>{stat.label}</CardTitle>
              <CardDescription>{stat.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="space-y-2">
                <Input value={values[stat.id] ?? ""} onChange={(event) => setValues((prev) => ({ ...prev, [stat.id]: event.target.value }))} />
                <Button onClick={() => handleSave(stat.id)} disabled={savingId === stat.id}>
                  {savingId === stat.id ? "Saving..." : "Save"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
