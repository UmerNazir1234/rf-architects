"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { navMenuService } from "@/services/navMenu.service"
import { categoryService } from "@/services/category.service"
import { collectionService } from "@/services/collection.service"
import { useToast } from "@/hooks/use-toast"
import { Plus, Trash2, Edit, ChevronRight, GripVertical, Monitor, Smartphone } from "lucide-react"
import type { NavMenu, NavMenuItem, Category, Collection, NavItemLinkType } from "@/models/index"

export default function NavigationPage() {
  const [menu, setMenu] = useState<NavMenu | null>(null)
  const [items, setItems] = useState<NavMenuItem[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [collections, setCollections] = useState<Collection[]>([])

  // Modal / Editing State
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<NavMenuItem | null>(null)
  const [label, setLabel] = useState("")
  const [linkType, setLinkType] = useState<NavItemLinkType>("none")
  const [targetCategory, setTargetCategory] = useState("")
  const [targetCollection, setTargetCollection] = useState("")
  const [targetUrl, setTargetUrl] = useState("")
  const [parentId, setParentId] = useState<string | null>(null)
  const [isActive, setIsActive] = useState(true)

  // Cascade delete dialog
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop")

  const { toast } = useToast()

  const loadMenuData = async () => {
    const [navRes, catRes, colRes] = await Promise.all([
      navMenuService.getAdminNavMenu("main-navbar"),
      categoryService.getCategories(),
      collectionService.getCollections(),
    ])
    if (navRes.success && navRes.data) {
      setMenu(navRes.data.menu)
      setItems(navRes.data.items)
    }
    if (catRes.success && catRes.data) setCategories(catRes.data)
    if (colRes.success && colRes.data) setCollections(colRes.data.items)
  }

  useEffect(() => {
    loadMenuData()
  }, [])

  const handleOpenCreate = (parent: string | null = null) => {
    setEditingItem(null)
    setLabel("")
    setLinkType("none")
    setTargetCategory("")
    setTargetCollection("")
    setTargetUrl("")
    setParentId(parent)
    setIsActive(true)
    setIsDialogOpen(true)
  }

  const handleOpenEdit = (item: NavMenuItem) => {
    setEditingItem(item)
    setLabel(item.label)
    setLinkType(item.linkType)
    setTargetCategory(item.targetCategory || "")
    setTargetCollection(item.targetCollection || "")
    setTargetUrl(item.targetUrl || "")
    setParentId(item.parentId || null)
    setIsActive(item.isActive)
    setIsDialogOpen(true)
  }

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!label) {
      toast({ title: "Label is required", variant: "destructive" })
      return
    }

    const payload: Partial<NavMenuItem> = {
      label,
      linkType,
      targetCategory: linkType === "category" ? targetCategory : null,
      targetCollection: linkType === "collection" ? targetCollection : null,
      targetUrl: linkType === "custom_url" ? targetUrl : null,
      parentId,
      isActive,
    }

    let res
    if (editingItem) {
      res = await navMenuService.updateNavItem("main-navbar", editingItem.id, payload)
    } else {
      res = await navMenuService.createNavItem("main-navbar", payload)
    }

    if (res.success) {
      toast({ title: editingItem ? "Nav item updated" : "Nav item created" })
      setIsDialogOpen(false)
      await loadMenuData()
    } else {
      toast({ title: res.message || "Failed to save item", variant: "destructive" })
    }
  }

  const handleDeleteItem = async () => {
    if (!deleteId) return
    const res = await navMenuService.deleteNavItem("main-navbar", deleteId)
    if (res.success) {
      toast({ title: "Nav item deleted" })
      setDeleteId(null)
      await loadMenuData()
    } else {
      toast({ title: res.message || "Failed to delete item", variant: "destructive" })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Navigation Builder</h1>
          <p className="text-muted-foreground">Manage top header dropdowns and mobile menu tree structure</p>
        </div>
        <Button onClick={() => handleOpenCreate(null)}>
          <Plus className="mr-2 h-4 w-4" /> Add Top Category Item
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left 2 Cols: Tree Editor */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Main Navbar Tree</CardTitle>
              <CardDescription>
                Nested items match the live site navbar (5 top-level categories, 14 sub-collections)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {items.map((topItem) => (
                <div key={topItem.id} className="rounded-lg border bg-card p-3 space-y-2">
                  {/* Top Level Item */}
                  <div className="flex items-center justify-between font-medium">
                    <div className="flex items-center gap-2">
                      <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                      <span className="font-bold text-sm tracking-wide">{topItem.label}</span>
                      <Badge variant="outline" className="text-[10px]">
                        {topItem.linkType}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" onClick={() => handleOpenCreate(topItem.id)}>
                        <Plus className="h-3.5 w-3.5 mr-1" /> Add Sub-Item
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(topItem)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive" onClick={() => setDeleteId(topItem.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Sub items */}
                  {topItem.children && topItem.children.length > 0 && (
                    <div className="ml-6 space-y-1.5 border-l pl-3 pt-1">
                      {topItem.children.map((subItem) => (
                        <div key={subItem.id} className="flex items-center justify-between rounded p-1.5 hover:bg-muted/50 text-xs">
                          <div className="flex items-center gap-2">
                            <ChevronRight className="h-3 w-3 text-muted-foreground" />
                            <span>{subItem.label}</span>
                            <span className="text-[10px] text-muted-foreground">({subItem.href || subItem.linkType})</span>
                          </div>

                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleOpenEdit(subItem)}>
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => setDeleteId(subItem.id)}>
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Col: Live Preview Panel */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-semibold">Live Preview</CardTitle>
              <div className="flex items-center gap-1 bg-muted p-1 rounded-md">
                <Button
                  variant={previewMode === "desktop" ? "default" : "ghost"}
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => setPreviewMode("desktop")}
                >
                  <Monitor className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant={previewMode === "mobile" ? "default" : "ghost"}
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => setPreviewMode("mobile")}
                >
                  <Smartphone className="h-3.5 w-3.5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {previewMode === "desktop" ? (
                /* Desktop Nav Preview */
                <div className="border rounded-md p-3 bg-zinc-950 text-white space-y-4 text-xs">
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                    <span className="font-bold tracking-widest uppercase text-xs">RF ARCHITECTS</span>
                    <span className="text-[10px] text-zinc-500">DESKTOP HEADER</span>
                  </div>
                  <div className="flex flex-wrap gap-4 text-[11px] font-medium tracking-wider">
                    {items.map((cat) => (
                      <span key={cat.id} className="hover:text-amber-400 cursor-pointer">
                        {cat.label}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                /* Mobile Menu Preview */
                <div className="border rounded-md p-4 bg-zinc-950 text-white space-y-3 text-xs max-w-xs mx-auto">
                  <div className="border-b border-zinc-800 pb-2 font-bold tracking-widest uppercase text-xs flex justify-between">
                    <span>MENU</span>
                    <span className="text-zinc-500">MOBILE</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="font-semibold text-zinc-400">SHOP ALL</div>
                    {items.map((cat) => (
                      <div key={cat.id} className="space-y-1">
                        <div className="font-semibold text-zinc-200">{cat.label}</div>
                        {cat.children?.map((sub) => (
                          <div key={sub.id} className="pl-3 text-zinc-400 hover:text-white">
                            • {sub.label}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Item Create / Edit Modal Dialog */}
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogTitle>{editingItem ? "Edit Nav Item" : "Create Nav Item"}</AlertDialogTitle>
          <form onSubmit={handleSaveItem} className="space-y-4 mt-2 text-sm">
            <div>
              <label className="font-medium">Label *</label>
              <Input className="mt-1" value={label} onChange={(e) => setLabel(e.target.value)} placeholder="e.g. FURNITURE or Coffee Tables" />
            </div>

            <div>
              <label className="font-medium">Link Type</label>
              <Select value={linkType} onValueChange={(v) => setLinkType(v as NavItemLinkType)}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None (Header container)</SelectItem>
                  <SelectItem value="category">Target Category</SelectItem>
                  <SelectItem value="collection">Target Collection</SelectItem>
                  <SelectItem value="custom_url">Custom URL / Page</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {linkType === "category" && (
              <div>
                <label className="font-medium">Select Category</label>
                <Select value={targetCategory} onValueChange={(value) => setTargetCategory(value || "")}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Choose category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {linkType === "collection" && (
              <div>
                <label className="font-medium">Select Collection</label>
                <Select value={targetCollection} onValueChange={(value) => setTargetCollection(value || "")}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Choose collection" />
                  </SelectTrigger>
                  <SelectContent>
                    {collections.map((col) => (
                      <SelectItem key={col.id} value={col.id}>{col.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {linkType === "custom_url" && (
              <div>
                <label className="font-medium">Custom URL</label>
                <Input className="mt-1" value={targetUrl} onChange={(e) => setTargetUrl(e.target.value)} placeholder="/shop?sale=true" />
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <label className="font-medium">Is Active</label>
              <Switch checked={isActive} onCheckedChange={setIsActive} />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button type="submit">Save Item</Button>
            </div>
          </form>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogTitle>Delete Nav Item?</AlertDialogTitle>
          <AlertDialogDescription>
            Deleting a parent item will also remove all its nested sub-items.
          </AlertDialogDescription>
          <div className="mt-4 flex justify-end gap-2">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground" onClick={handleDeleteItem}>
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
