"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, ChevronRight, ChevronLeft, X } from "lucide-react"
import { cn } from "@/lib/utils"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetClose,
} from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { navigationData, type NavItem, type CategoryLink } from "@/lib/mega-menu-data"
import { fetchNavMenu } from "@/lib/api"

type MenuView = "main" | "category" | "subcategory"

interface MenuState {
    view: MenuView
    selectedCategory: NavItem | null
    selectedSubcategory: CategoryLink | null
}

export function MobileMenu() {
    const [open, setOpen] = useState(false)
    const [menuItems, setMenuItems] = useState<any[]>([])
    const [menuState, setMenuState] = useState<MenuState>({
        view: "main",
        selectedCategory: null,
        selectedSubcategory: null,
    })

    useEffect(() => {
        const load = async () => {
            const data = await fetchNavMenu("main-navbar");
            if (data && data.items && data.items.length > 0) {
                const mapped = data.items.map((cat: any) => {
                    const categoriesGroupedByParent = cat.children ? [{
                        label: cat.label,
                        href: cat.href || "/shop",
                        subLinks: cat.children.map((sub: any) => ({
                            label: sub.label,
                            href: sub.href || `/collections/${sub.label.toLowerCase().replace(/\s+/g, "-")}`,
                        }))
                    }] : [];

                    return {
                        label: cat.label,
                        href: cat.href || "/shop",
                        megaMenu: cat.children && cat.children.length > 0 ? {
                            label: cat.label,
                            href: cat.href || "/shop",
                            categories: categoriesGroupedByParent,
                            featured: [
                                {
                                    collection: cat.label,
                                    name: "SIGNATURE PIECE",
                                    image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&h=300&fit=crop",
                                    href: cat.href || "/shop",
                                }
                            ],
                            shopAllLabel: `SHOP ALL ${cat.label}`,
                            shopAllHref: cat.href || "/shop",
                        } : undefined
                    };
                });
                setMenuItems(mapped);
            } else {
                setMenuItems(navigationData);
            }
        };
        load();
    }, [open]);

    const resetMenu = () => {
        setMenuState({
            view: "main",
            selectedCategory: null,
            selectedSubcategory: null,
        })
    }

    const handleOpenChange = (isOpen: boolean) => {
        setOpen(isOpen)
        if (!isOpen) {
            // Reset menu state when closing
            setTimeout(resetMenu, 300)
        }
    }

    const handleCategoryClick = (category: NavItem) => {
        if (category.megaMenu) {
            setMenuState({
                view: "category",
                selectedCategory: category,
                selectedSubcategory: null,
            })
        }
    }

    const handleSubcategoryClick = (subcategory: CategoryLink) => {
        setMenuState((prev) => ({
            ...prev,
            view: "subcategory",
            selectedSubcategory: subcategory,
        }))
    }

    const handleBack = () => {
        if (menuState.view === "subcategory") {
            setMenuState((prev) => ({
                ...prev,
                view: "category",
                selectedSubcategory: null,
            }))
        } else if (menuState.view === "category") {
            setMenuState({
                view: "main",
                selectedCategory: null,
                selectedSubcategory: null,
            })
        }
    }

    return (
        <Sheet open={open} onOpenChange={handleOpenChange}>
            <SheetTrigger asChild>
                <button
                    type="button"
                    className="p-2 text-muted-foreground transition-colors hover:text-foreground lg:hidden"
                    aria-label="Open menu"
                >
                    <Menu className="h-6 w-6" />
                </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-full p-0 sm:max-w-md">
                {/* Header */}
                <SheetHeader className="flex h-16 flex-row items-center justify-between border-b border-border px-4">
                    {menuState.view !== "main" && (
                        <button
                            type="button"
                            onClick={handleBack}
                            className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                        >
                            <ChevronLeft className="h-4 w-4" />
                            Back
                        </button>
                    )}
                </SheetHeader>

                {/* Content */}
                <ScrollArea className="h-[calc(100vh-4rem)]">
                    {/* Main Menu View */}
                    {menuState.view === "main" && (
                        <MainMenuView
                            menuItems={menuItems}
                            onCategoryClick={handleCategoryClick}
                            onClose={() => setOpen(false)}
                        />
                    )}

                    {/* Category View */}
                    {menuState.view === "category" && menuState.selectedCategory && (
                        <CategoryView
                            category={menuState.selectedCategory}
                            onSubcategoryClick={handleSubcategoryClick}
                            onClose={() => setOpen(false)}
                        />
                    )}

                    {/* Subcategory View */}
                    {menuState.view === "subcategory" &&
                        menuState.selectedCategory &&
                        menuState.selectedSubcategory && (
                            <SubcategoryView
                                category={menuState.selectedCategory}
                                subcategory={menuState.selectedSubcategory}
                                onClose={() => setOpen(false)}
                            />
                        )}
                </ScrollArea>
            </SheetContent>
        </Sheet>
    )
}

interface MainMenuViewProps {
    menuItems: any[]
    onCategoryClick: (category: NavItem) => void
    onClose: () => void
}

function MainMenuView({ menuItems, onCategoryClick, onClose }: MainMenuViewProps) {
    return (
        <div className="flex flex-col">
            {/* Navigation Links */}
            <nav className="flex-1">
                <ul className="divide-y divide-border">
                    {menuItems.map((item) => (
                        <li key={item.label}>
                            {item.megaMenu ? (
                                <button
                                    type="button"
                                    onClick={() => onCategoryClick(item)}
                                    className="flex w-full items-center justify-between px-6 py-4 text-left"
                                >
                                    <span className="text-sm font-medium tracking-wider text-foreground">
                                        {item.label}
                                    </span>
                                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                </button>
                            ) : (
                                <Link
                                    href={item.href}
                                    onClick={onClose}
                                    className="flex w-full items-center justify-between px-6 py-4"
                                >
                                    <span className="text-sm font-medium tracking-wider text-foreground">
                                        {item.label}
                                    </span>
                                </Link>
                            )}
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Featured Image */}
            <div className="p-6">
                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                    <Image
                        src="https://res.cloudinary.com/dzmrdbwqh/image/upload/v1764856442/RF%20Architects%20Images/D29F004B-C2B9-47B9-858F-771F0F57618F_oqmko3.jpg"
                        alt="Featured Collection"
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 400px"
                    />
                </div>
                <div className="mt-3 text-center">
                    <p className="text-xs tracking-wider text-muted-foreground">
                        EXPLORE
                    </p>
                    <p className="text-sm font-medium tracking-wide text-foreground">
                        NEW ARRIVALS
                    </p>
                </div>
            </div>
        </div>
    )
}

interface CategoryViewProps {
    category: NavItem
    onSubcategoryClick: (subcategory: CategoryLink) => void
    onClose: () => void
}

function CategoryView({
    category,
    onSubcategoryClick,
    onClose,
}: CategoryViewProps) {
    if (!category.megaMenu) return null

    return (
        <div className="flex flex-col">
            {/* Category Title */}
            <div className="border-b border-border bg-muted/30 px-6 py-4">
                <h2 className="text-lg font-semibold tracking-wider text-foreground">
                    {category.label}
                </h2>
            </div>

            {/* Subcategory Links */}
            <nav className="flex-1">
                <ul className="divide-y divide-border">
                    {category.megaMenu.categories.map((subcat) => (
                        <li key={subcat.label}>
                            <button
                                type="button"
                                onClick={() => onSubcategoryClick(subcat)}
                                className="flex w-full items-center justify-between px-6 py-4 text-left"
                            >
                                <span className="text-sm font-medium tracking-wide text-foreground">
                                    {subcat.label}
                                </span>
                                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Shop All Link */}
            {category.megaMenu.shopAllLabel && (
                <div className="border-t border-border px-6 py-4">
                    <Link
                        href={category.megaMenu.shopAllHref || "#"}
                        onClick={onClose}
                        className="flex items-center justify-center gap-2 rounded-none border border-foreground bg-foreground px-6 py-3 text-sm font-semibold tracking-wider text-background transition-colors hover:bg-transparent hover:text-foreground"
                    >
                        {category.megaMenu.shopAllLabel}
                    </Link>
                </div>
            )}

            {/* Featured Products */}
            <div className="border-t border-border p-6">
                <p className="mb-4 text-xs font-medium tracking-wider text-muted-foreground">
                    FEATURED
                </p>
                <div className="grid grid-cols-2 gap-4">
                    {category.megaMenu.featured.slice(0, 2).map((product, index) => (
                        <Link
                            key={index}
                            href={product.href}
                            onClick={onClose}
                            className="group"
                        >
                            <div className="relative aspect-square overflow-hidden bg-muted">
                                <Image
                                    src={product.image || "/placeholder.svg"}
                                    alt={`${product.collection} ${product.name}`}
                                    fill
                                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                                    sizes="150px"
                                />
                            </div>
                            <div className="mt-2">
                                <p className="text-[10px] tracking-wider text-muted-foreground">
                                    {product.collection}
                                </p>
                                <p className="text-xs font-medium tracking-wide text-foreground">
                                    {product.name}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}

interface SubcategoryViewProps {
    category: NavItem
    subcategory: CategoryLink
    onClose: () => void
}

function SubcategoryView({
    category,
    subcategory,
    onClose,
}: SubcategoryViewProps) {
    return (
        <div className="flex flex-col">
            {/* Breadcrumb Title */}
            <div className="border-b border-border bg-muted/30 px-6 py-4">
                <p className="text-xs tracking-wider text-muted-foreground">
                    {category.label}
                </p>
                <h2 className="mt-1 text-lg font-semibold tracking-wider text-foreground">
                    {subcategory.label}
                </h2>
            </div>

            {/* Sub-links */}
            <nav className="flex-1">
                <ul className="divide-y divide-border">
                    {subcategory.subLinks.map((link) => (
                        <li key={link.href}>
                            <Link
                                href={link.href}
                                onClick={onClose}
                                className="flex w-full items-center px-6 py-4"
                            >
                                <span className="text-sm tracking-wide text-foreground">
                                    {link.label}
                                </span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* View All Link */}
            <div className="border-t border-border px-6 py-4">
                <Link
                    href={subcategory.href}
                    onClick={onClose}
                    className="flex items-center justify-center gap-2 rounded-none border border-foreground bg-transparent px-6 py-3 text-sm font-semibold tracking-wider text-foreground transition-colors hover:bg-foreground hover:text-background"
                >
                    VIEW ALL {subcategory.label}
                </Link>
            </div>
        </div>
    )
}
