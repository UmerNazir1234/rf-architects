"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { faqService } from "@/services/faq.service"
import { useToast } from "@/hooks/use-toast"

export default function FaqsPage() {
  const [faqs, setFaqs] = useState<any[]>([])
  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState("")
  const [published, setPublished] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValues, setEditValues] = useState({ question: "", answer: "", isPublished: false })
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const loadFaqs = async () => {
      const response = await faqService.getFAQs()
      if (response.success && response.data) {
        setFaqs(response.data)
      }
    }

    loadFaqs()
  }, [])

  const refreshFaqs = async () => {
    const response = await faqService.getFAQs()
    if (response.success && response.data) {
      setFaqs(response.data)
    }
  }

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault()
    const response = await faqService.createFAQ({ question, answer, isPublished: published })
    if (response.success && response.data) {
      setQuestion("")
      setAnswer("")
      setPublished(false)
      toast({ title: "FAQ created" })
      await refreshFaqs()
    } else {
      toast({ title: "Unable to create FAQ", variant: "destructive" })
    }
  }

  const handleSave = async (id: string) => {
    setLoadingId(id)
    const response = await faqService.updateFAQ(id, editValues)
    setLoadingId(null)
    if (response.success && response.data) {
      toast({ title: "FAQ updated" })
      setEditingId(null)
      await refreshFaqs()
    } else {
      toast({ title: response.message || "Unable to update FAQ", variant: "destructive" })
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setLoadingId(deleteId)
    const response = await faqService.deleteFAQ(deleteId)
    setLoadingId(null)
    if (response.success) {
      toast({ title: "FAQ deleted" })
      setDeleteId(null)
      await refreshFaqs()
    } else {
      toast({ title: response.message || "Unable to delete FAQ", variant: "destructive" })
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">FAQs</h1>
        <p className="text-muted-foreground">Manage frequently asked questions for the site</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>New FAQ</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreate} className="space-y-4">
            <Input placeholder="Question" value={question} onChange={(event) => setQuestion(event.target.value)} />
            <textarea
              className="w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              rows={4}
              placeholder="Answer"
              value={answer}
              onChange={(event) => setAnswer(event.target.value)}
            />
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={published} onChange={(event) => setPublished(event.target.checked)} />
              Publish immediately
            </label>
            <Button type="submit">Create FAQ</Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {faqs.map((faq) => (
          <Card key={faq.id}>
            <CardHeader>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <CardTitle>{faq.question}</CardTitle>
                  <CardDescription>{faq.answer}</CardDescription>
                </div>
                <Badge variant={faq.isPublished ? "default" : "secondary"}>
                  {faq.isPublished ? "Published" : "Draft"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {editingId === faq.id ? (
                <div className="space-y-3">
                  <Input value={editValues.question} onChange={(event) => setEditValues((prev) => ({ ...prev, question: event.target.value }))} placeholder="Question" />
                  <textarea
                    className="w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                    rows={4}
                    value={editValues.answer}
                    onChange={(event) => setEditValues((prev) => ({ ...prev, answer: event.target.value }))}
                  />
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={editValues.isPublished} onChange={(event) => setEditValues((prev) => ({ ...prev, isPublished: event.target.checked }))} />
                    Published
                  </label>
                  <div className="flex gap-2">
                    <Button onClick={() => handleSave(faq.id)} disabled={loadingId === faq.id}>Save</Button>
                    <Button variant="outline" onClick={() => setEditingId(null)}>Cancel</Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" onClick={() => {
                    setEditingId(faq.id)
                    setEditValues({ question: faq.question, answer: faq.answer, isPublished: faq.isPublished })
                  }}>
                    Edit
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => setDeleteId(faq.id)}>
                    Delete
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogTitle>Delete FAQ?</AlertDialogTitle>
          <AlertDialogDescription>
            This action will remove the FAQ from the mock data.
          </AlertDialogDescription>
          <div className="mt-6 flex justify-end gap-2">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground" onClick={handleDelete}>
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
