"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { faqService } from "@/services/faq.service"

export default function EditFaqPage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState("")
  const [isPublished, setIsPublished] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const loadFaq = async () => {
      if (!params?.id) return
      const response = await faqService.getFAQs()
      if (response.success && response.data) {
        const faq = response.data.find((item) => item.id === params.id)
        if (faq) {
          setQuestion(faq.question)
          setAnswer(faq.answer)
          setIsPublished(faq.isPublished)
        }
      }
      setLoading(false)
    }

    loadFaq()
  }, [params?.id])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!params?.id) return
    setSaving(true)
    const response = await faqService.updateFAQ(params.id, { question, answer, isPublished })
    setSaving(false)

    if (response.success) {
      router.push("/faqs")
    }
  }

  if (loading) {
    return <p className="text-muted-foreground">Loading FAQ…</p>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/faqs">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Edit FAQ</h1>
          <p className="text-muted-foreground">Update this FAQ item.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>FAQ details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input placeholder="Question" value={question} onChange={(event) => setQuestion(event.target.value)} />
            <textarea
              className="w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              rows={5}
              placeholder="Answer"
              value={answer}
              onChange={(event) => setAnswer(event.target.value)}
            />
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={isPublished} onChange={(event) => setIsPublished(event.target.checked)} />
              Publish FAQ
            </label>
            <div className="flex justify-end">
              <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Save changes"}</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
