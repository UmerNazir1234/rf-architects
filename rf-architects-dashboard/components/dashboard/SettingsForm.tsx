"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { settingsService } from "@/services/settings.service"

interface SettingsFormProps {
  initialValues?: any
}

export function SettingsForm({ initialValues }: SettingsFormProps) {
  const [values, setValues] = useState(initialValues || {})
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    setValues(initialValues || {})
  }, [initialValues])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setSaving(true)
    const response = await settingsService.updateSettings(values)
    setSaving(false)
    setMessage(response.success ? "Settings saved successfully" : response.message || "Failed to save settings")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Website Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Phone</label>
              <Input value={values.phone || ""} onChange={(event) => setValues((prev: any) => ({ ...prev, phone: event.target.value }))} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input value={values.email || ""} onChange={(event) => setValues((prev: any) => ({ ...prev, email: event.target.value }))} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">Address</label>
              <Input value={values.address || ""} onChange={(event) => setValues((prev: any) => ({ ...prev, address: event.target.value }))} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Instagram</label>
              <Input value={values.instagram || ""} onChange={(event) => setValues((prev: any) => ({ ...prev, instagram: event.target.value }))} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Facebook</label>
              <Input value={values.facebook || ""} onChange={(event) => setValues((prev: any) => ({ ...prev, facebook: event.target.value }))} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">TikTok</label>
              <Input value={values.tiktok || ""} onChange={(event) => setValues((prev: any) => ({ ...prev, tiktok: event.target.value }))} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Meta title</label>
              <Input value={values.metaTitle || ""} onChange={(event) => setValues((prev: any) => ({ ...prev, metaTitle: event.target.value }))} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Meta description</label>
              <Input value={values.metaDescription || ""} onChange={(event) => setValues((prev: any) => ({ ...prev, metaDescription: event.target.value }))} />
            </div>
          </div>
          {message && <p className="text-sm text-muted-foreground">{message}</p>}
          <div className="flex justify-end">
            <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Save Settings"}</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
