"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { settingsService } from "@/services/settings.service"
import { SettingsForm } from "@/components/dashboard/SettingsForm"

export default function SettingsPage() {
  const [settings, setSettings] = useState<any>(null)

  useEffect(() => {
    const loadSettings = async () => {
      const response = await settingsService.getSettings()
      if (response.success && response.data) {
        setSettings(response.data)
      }
    }

    loadSettings()
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Company profile and website settings</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{settings?.metaTitle || "RF Architects"}</CardTitle>
            <Badge variant="default">Live</Badge>
          </div>
          <CardDescription>{settings?.metaDescription}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>Email: {settings?.email}</p>
          <p>Phone: {settings?.phone}</p>
          <p>Address: {settings?.address}</p>
        </CardContent>
      </Card>

      <SettingsForm initialValues={settings} />
    </div>
  )
}
