"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import Link from "next/link"
import { Search, PizzaSlice as BurgerIcon, CoffeeCup, Leaf, FireFlame as Flame, NavArrowLeft } from "iconoir-react"
import { ProductCard } from "@/components/product-card"
import { useDashboardStore } from "@/lib/store/dashboard"
import { st } from "@/lib/i18n/storefront"
import type { MenuItem } from "@/lib/data/menu"

const categoryIcons: Record<string, React.ReactNode> = {
    beef: <BurgerIcon className="w-5 h-5" />,
    chicken: <Flame className="w-5 h-5" />,
    veggie: <Leaf className="w-5 h-5" />,
    appetizers: <BurgerIcon className="w-5 h-5" />,
    "fried-chicken": <Flame className="w-5 h-5" />,
    dips: <CoffeeCup className="w-5 h-5" />,
    drinks: <CoffeeCup className="w-5 h-5" />,
}

type FilterType = "alle" | "halal" | "vegetarisch" | "scharf"

export default function SpeisekartePage() {
    const products = useDashboardStore((s) => s.products)
    const managedCategories = useDashboardStore((s) => s.managedCategories)
    const lang = useDashboardStore((s) => s.storefrontLang)

    const [searchQuery, setSearchQuery] = useState("")
    const [activeFilter, setActiveFilter] = useState<FilterType>("alle")
    const [activeCategory, setActiveCategory] = useState("beef")
    const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({})

    // تحويل المنتجات من dashboard store إلى تنسيق grouped
    const { groupedItems, categories: storeCategories } = useMemo(() => {
        const grouped: Record<string, MenuItem[]> = {}

        // فقط المنتجات النشطة والفئات المرئية
        const visibleCats = managedCategories.filter((c) => c.isVisible)

        for (const cat of visibleCats) {
            const catProducts = products.filter(
                (p) => p.categoryId === cat.id && p.isActive
            )
            if (catProducts.length > 0) {
                grouped[cat.id] = catProducts.map((p) => ({
                    id: p.id,
                    name: p.name,
                    price: p.price,
                    priceNumber: p.priceNumber,
                    description: p.description,
                    spiceLevel: p.spiceLevel,
                    image: p.image,
                    halal: p.halal,
                    vegetarian: p.vegetarian,
                    sizes: p.sizes,
                }))
            }
        }

        return { groupedItems: grouped, categories: visibleCats }
    }, [products, managedCategories])

    // Filter items based on search and filter
    const filteredMenuItems = useMemo(() => {
        const result: Record<string, MenuItem[]> = {}

        for (const [catId, items] of Object.entries(groupedItems)) {
            let filtered = items

            if (searchQuery) {
                const query = searchQuery.toLowerCase()
                filtered = filtered.filter(
                    (item) =>
                        item.name.toLowerCase().includes(query) ||
                        item.description.toLowerCase().includes(query)
                )
            }

            if (activeFilter === "halal") {
                filtered = filtered.filter((item) => item.halal)
            } else if (activeFilter === "vegetarisch") {
                filtered = filtered.filter((item) => item.vegetarian)
            } else if (activeFilter === "scharf") {
                filtered = filtered.filter((item) => (item.spiceLevel ?? 0) > 0)
            }

            if (filtered.length > 0) {
                result[catId] = filtered
            }
        }

        return result
    }, [groupedItems, searchQuery, activeFilter])

    // Intersection Observer for active category
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        setActiveCategory(entry.target.id)
                    }
                }
            },
            { rootMargin: "-100px 0px -60% 0px", threshold: 0 }
        )

        Object.values(sectionRefs.current).forEach((ref) => {
            if (ref) observer.observe(ref)
        })

        return () => observer.disconnect()
    }, [filteredMenuItems])

    const scrollToCategory = (catId: string) => {
        const el = sectionRefs.current[catId]
        if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" })
        }
    }

    const filters: { id: FilterType; label: string }[] = [
        { id: "alle", label: st("speisekarte.all", lang) },
        { id: "halal", label: "Halal" },
        { id: "vegetarisch", label: st("speisekarte.vegetarian", lang) },
        { id: "scharf", label: st("speisekarte.spicy", lang) },
    ]

    return (
        <div className="min-h-screen bg-background">
            {/* Sticky Page Header */}
            <div className="fixed top-16 md:top-20 left-0 right-0 z-30 border-b border-border bg-background/95 backdrop-blur-sm">
                <div className="max-w-[1600px] mx-auto px-6 lg:px-10 py-3">
                    <div className="flex items-center gap-6 mb-3">
                        <Link
                            href="/"
                            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                        >
                            <NavArrowLeft className="w-5 h-5" />
                            <span className="text-sm font-medium hidden sm:inline">{st("speisekarte.back", lang)}</span>
                        </Link>
                        <h1 className="text-2xl md:text-3xl font-black text-primary tracking-tighter">
                            {st("speisekarte.title", lang)}
                        </h1>
                    </div>

                    {/* Search + Filter */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder={st("speisekarte.search", lang)}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none text-sm"
                            />
                        </div>
                        <div className="flex gap-1.5 flex-wrap">
                            {filters.map((f) => (
                                <button
                                    key={f.id}
                                    onClick={() => setActiveFilter(f.id)}
                                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${activeFilter === f.id
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-card border border-border text-foreground hover:border-primary/50"
                                        }`}
                                >
                                    {f.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content - with top padding for fixed header */}
            <div className="pt-[180px] md:pt-[170px]">
                <div className="max-w-[1600px] mx-auto px-6 lg:px-10 py-6">
                    <div className="flex gap-6">
                        {/* Category Sidebar - Desktop */}
                        <aside className="hidden lg:block w-52 shrink-0">
                            <div className="sticky top-[200px] space-y-1">
                                {storeCategories.map((cat) => {
                                    const hasItems = filteredMenuItems[cat.id]?.length > 0
                                    if (!hasItems && (searchQuery || activeFilter !== "alle")) return null
                                    return (
                                        <button
                                            key={cat.id}
                                            onClick={() => scrollToCategory(cat.id)}
                                            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-left text-sm font-bold transition-all ${activeCategory === cat.id
                                                ? "bg-primary text-primary-foreground"
                                                : "text-foreground hover:bg-primary/10"
                                                }`}
                                        >
                                            {categoryIcons[cat.id]}
                                            <span>{lang === "ar" ? cat.labelAr : cat.name}</span>
                                        </button>
                                    )
                                })}
                            </div>
                        </aside>

                        {/* Menu Content */}
                        <div className="flex-1 min-w-0">
                            {/* Category Tabs - Mobile */}
                            <div className="lg:hidden flex gap-1.5 overflow-x-auto pb-3 -mx-2 px-2 scrollbar-hide">
                                {storeCategories.map((cat) => {
                                    const hasItems = filteredMenuItems[cat.id]?.length > 0
                                    if (!hasItems && (searchQuery || activeFilter !== "alle")) return null
                                    return (
                                        <button
                                            key={cat.id}
                                            onClick={() => scrollToCategory(cat.id)}
                                            className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${activeCategory === cat.id
                                                ? "bg-primary text-primary-foreground"
                                                : "bg-card border border-border text-foreground"
                                                }`}
                                        >
                                            {categoryIcons[cat.id]}
                                            {lang === "ar" ? cat.labelAr : cat.name}
                                        </button>
                                    )
                                })}
                            </div>

                            {/* Menu Sections */}
                            <div className="space-y-12">
                                {storeCategories.map((cat) => {
                                    const items = filteredMenuItems[cat.id]
                                    if (!items || items.length === 0) return null

                                    return (
                                        <div
                                            key={cat.id}
                                            id={cat.id}
                                            ref={(el) => { sectionRefs.current[cat.id] = el }}
                                            className="scroll-mt-[220px]"
                                        >
                                            <h2 className="text-2xl md:text-3xl font-black text-primary mb-6 tracking-tighter">
                                                {(lang === "ar" ? cat.labelAr : cat.name).toUpperCase()}
                                            </h2>
                                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                                                {items.map((item) => (
                                                    <ProductCard key={item.id} item={item} />
                                                ))}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>

                            {/* No results */}
                            {Object.keys(filteredMenuItems).length === 0 && (
                                <div className="text-center py-20">
                                    <Search className="w-16 h-16 text-muted mx-auto mb-4" />
                                    <p className="text-xl font-bold text-foreground">
                                        {st("speisekarte.noResults", lang)}
                                    </p>
                                    <p className="text-muted-foreground mt-2">
                                        {st("speisekarte.tryAgain", lang)}
                                    </p>
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}