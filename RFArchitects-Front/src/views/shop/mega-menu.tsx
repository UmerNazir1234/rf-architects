"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronRight, X } from "lucide-react"
import { cn } from "@/lib/utils"
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { navigationData } from "@/lib/mega-menu-data"
import { fetchNavMenu } from "@/lib/api"

export function MegaMenu() {
    const [menuItems, setMenuItems] = useState<any[]>([]);

    useEffect(() => {
        const load = async () => {
            const data = await fetchNavMenu("main-navbar");
            if (data && data.items && data.items.length > 0) {
                const mapped = data.items.map((cat: any) => {
                    // Structure the top level dropdown items
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
    }, []);

    return (
        <NavigationMenu className="max-w-full">
            <NavigationMenuList className="gap-1">
                {menuItems.map((item) => (
                    <MegaMenuItem key={item.label} item={item} />
                ))}
            </NavigationMenuList>
        </NavigationMenu>
    )
}

interface MegaMenuItemProps {
    item: (typeof navigationData)[0]
}

function MegaMenuItem({ item }: MegaMenuItemProps) {
    const [activeCategory, setActiveCategory] = useState<string>(
        item.megaMenu?.categories[0]?.label || ""
    )

    const currentCategory = item.megaMenu?.categories.find(
        (cat) => cat.label === activeCategory
    )

    if (!item.megaMenu) {
        return (
            <NavigationMenuItem className="hover:bg-transparent focus:bg-transparent cursor-pointer">
                <Link href={item.href} legacyBehavior passHref>
                    <NavigationMenuLink className="px-3 py-2 text-sm font-medium tracking-wider hover:bg-transparent focus:bg-transparent">
                        {item.label}
                    </NavigationMenuLink>
                </Link>
            </NavigationMenuItem>
        )
    }

    return (
        <NavigationMenuItem className="hover:bg-transparent focus:bg-transparent">
            <NavigationMenuTrigger
                className="cursor-pointer rounded-none border-b-2 border-transparent bg-transparent px-3 text-sm font-medium tracking-wider text-muted-foreground transition-colors hover:bg-transparent hover:text-foreground focus:bg-transparent  data-[state=open]:bg-transparent data-[state=open]:text-foreground hover:bg-transparent focus:bg-transparent"
                onPointerEnter={() => {
                    // Reset to first category when opening menu
                    if (item.megaMenu?.categories[0]) {
                        setActiveCategory(item.megaMenu.categories[0].label)
                    }
                }}
            >
                {item.label}
            </NavigationMenuTrigger>
            <NavigationMenuContent className="left-0 w-full">
                <div className="mx-auto max-w-full px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-12 gap-8 py-8 w-full">
                        {/* Left Column - Categories */}
                        <div className="col-span-2 border-r border-border pr-6">
                            <ul className="space-y-1">
                                {item.megaMenu.categories.map((category) => (
                                    <li key={category.label}>
                                        <button
                                            type="button"
                                            className={cn(
                                                "cursor-pointer group flex w-full items-center justify-between py-2.5 text-left text-sm font-medium tracking-wide transition-colors",
                                                activeCategory === category.label
                                                    ? "text-foreground"
                                                    : "text-muted-foreground hover:text-foreground"
                                            )}
                                            onMouseEnter={() => setActiveCategory(category.label)}
                                            onFocus={() => setActiveCategory(category.label)}
                                        >
                                            <span>{category.label}</span>
                                            <ChevronRight
                                                className={cn(
                                                    "h-4 w-4 transition-opacity",
                                                    activeCategory === category.label
                                                        ? "opacity-100"
                                                        : "opacity-0 group-hover:opacity-50"
                                                )}
                                            />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Middle Column - Subcategories */}
                        <div className="col-span-4 px-6">
                            {currentCategory && (
                                <div key={currentCategory.label}>
                                    <ul className="space-y-3">
                                        {currentCategory.subLinks.map((subLink) => (
                                            <li key={subLink.href}>
                                                <Link
                                                    href={subLink.href}
                                                    className="block text-sm tracking-wide text-muted-foreground transition-colors hover:text-foreground"
                                                >
                                                    {subLink.label.toUpperCase()}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>

                                    {/* Shop All Link */}
                                    {item.megaMenu.shopAllLabel && (
                                        <Link
                                            href={item.megaMenu.shopAllHref || "#"}
                                            className="mt-8 inline-block text-sm font-semibold tracking-wide text-foreground hover:underline"
                                        >
                                            {item.megaMenu.shopAllLabel}
                                        </Link>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Right Column - Featured Products */}
                        <div className="col-span-6">
                            <div className="grid grid-cols-2 gap-6">
                                {item.megaMenu.featured.map((product, index) => (
                                    <FeaturedProductCard key={index} product={product} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Close Button - Hidden, using Radix built-in close behavior */}
                <NavigationMenuLink asChild>
                    <button
                        type="button"
                        className="cursor-pointer absolute right-4 top-4 p-2 text-muted-foreground transition-colors hover:bg-gray-100"
                        aria-label="Close menu"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </NavigationMenuLink>
            </NavigationMenuContent>
        </NavigationMenuItem>
    )
}

interface FeaturedProductCardProps {
    product: {
        collection: string
        name: string
        image: string
        href: string
    }
}

function FeaturedProductCard({ product }: FeaturedProductCardProps) {
    return (
        <NavigationMenuLink asChild>
            <Link href={product.href} className="group block">
                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                    <Image
                        src={product.image || "/placeholder.svg"}
                        alt={`${product.collection} ${product.name}`}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 300px"
                    />
                </div>
                <div className="mt-3">
                    <p className="text-xs tracking-wider text-muted-foreground">
                        {product.collection}
                    </p>
                    <p className="text-sm font-medium tracking-wide text-foreground">
                        {product.name}
                    </p>
                </div>
            </Link>
        </NavigationMenuLink>
    )
}
