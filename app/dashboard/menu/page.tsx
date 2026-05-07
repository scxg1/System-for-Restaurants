"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { useDashboardStore } from "@/lib/store/dashboard"
import { Plus, Search } from "iconoir-react"
import { ProductTable } from "@/components/dashboard/product-table"
import { t } from "@/lib/i18n/translations"

export default function MenuPage() {
    const products = useDashboardStore((s) => s.products)
    const managedCategories = useDashboardStore((s) => s.managedCategories)
    const deleteProduct = useDashboardStore((s) => s.deleteProduct)
    const toggleProductActive = useDashboardStore((s) => s.toggleProductActive)
    const language = useDashboardStore((s) => s.language)
    const [search, setSearch] = useState("")
    const [categoryFilter, setCategoryFilter] = useState("all")

    const categoryMap = useMemo(() => {
        const map: Record<string, string> = {}
        managedCategories.forEach((c) => { map[c.id] = c.name })
        return map
    }, [managedCategories])

    const filtered = useMemo(() => {
        return products.filter((p) => {
            const matchesSearch = !search ||
                p.name.toLowerCase().includes(search.toLowerCase()) ||
                p.description.toLowerCase().includes(search.toLowerCase())
            const matchesCategory = categoryFilter === "all" || p.categoryId === categoryFilter
            return matchesSearch && matchesCategory
        })
    }, [products, search, categoryFilter])

    const handleToggle = (id: string) => {
        toggleProductActive(id)
    }

    const handleDelete = (id: string) => {
        deleteProduct(id)
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex gap-3 items-center flex-1 max-w-md">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder={t("orders", "search", language)}
                            className="w-full pl-10 pr-3 py-2 bg-input border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                    </div>
                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground"
                    >
                        <option value="all">{language === "ar" ? "كل الفئات" : "Alle Kategorien"}</option>
                        {managedCategories.map((cat) => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                </div>
                <div className="flex items-center gap-3">
                    <Link
                        href="/dashboard/menu/new"
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        {language === "ar" ? "إضافة منتج" : "Produkt hinzufügen"}
                    </Link>
                    <span className="text-xs text-muted-foreground">{filtered.length} / {products.length}</span>
                </div>
            </div>

            <div className="bg-card border border-border rounded-xl overflow-hidden">
                <ProductTable
                    products={filtered}
                    categoryMap={categoryMap}
                    onToggleActive={handleToggle}
                    onDelete={handleDelete}
                />
            </div>
        </div>
    )
}
