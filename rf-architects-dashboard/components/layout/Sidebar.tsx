"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import {
  LayoutDashboard,
  Package,
  Layers,
  Tags,
  Briefcase,
  HelpCircle,
  TrendingUp,
  Users,
  Settings,
  Menu,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

const navigation = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/products", label: "Products", icon: Package },
  { href: "/collections", label: "Collections", icon: Layers },
  { href: "/categories", label: "Categories", icon: Tags },
  { href: "/projects", label: "Projects", icon: Briefcase },
  { href: "/faqs", label: "FAQs", icon: HelpCircle },
  { href: "/site-stats", label: "Site Statistics", icon: TrendingUp },
  { href: "/users", label: "Users", icon: Users, requiredRole: "superadmin" },
  { href: "/settings", label: "Settings", icon: Settings, requiredRole: "superadmin" },
]

export function Sidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const { user } = useAuth()

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard" || pathname === "/"
    return pathname.startsWith(href)
  }

  const NavContent = () => (
    <nav className="space-y-2">
      {navigation.map(({ href, label, icon: Icon, requiredRole }) => {
        if (requiredRole === "superadmin" && user?.role !== "superadmin") {
          return null
        }
        return (
          <Link
            key={href}
            href={href}
            onClick={() => setIsOpen(false)}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              isActive(href)
                ? "bg-accent text-accent-foreground"
                : "text-foreground/70 hover:bg-muted hover:text-foreground"
            }`}
          >
            <Icon className="h-5 w-5" />
            <span>{label}</span>
          </Link>
        )
      })}
    </nav>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden border-r border-border bg-card md:block md:w-56 md:shrink-0">
        <div className="flex h-full flex-col">
          <div className="border-b border-border px-6 py-4">
            <h1 className="text-lg font-bold text-primary">RF Architects</h1>
            <p className="text-xs text-muted-foreground">Admin Dashboard</p>
          </div>
          <div className="flex-1 overflow-y-auto px-3 py-4">
            <NavContent />
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <div className="md:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="fixed top-4 left-4 z-40">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64">
            <div className="mb-6 mt-2">
              <h1 className="text-lg font-bold text-primary">RF Architects</h1>
              <p className="text-xs text-muted-foreground">Admin Dashboard</p>
            </div>
            <NavContent />
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
}
