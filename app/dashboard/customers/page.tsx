"use client"

import { useState, useMemo } from "react"
import { useDashboardStore } from "@/lib/store/dashboard"
import { Search } from "iconoir-react"
import { t } from "@/lib/i18n/translations"

export default function CustomersPage() {
    const orders = useDashboardStore((s) => s.orders)
    const language = useDashboardStore((s) => s.language)
    const [search, setSearch] = useState("")
    const [selectedPhone, setSelectedPhone] = useState<string | null>(null)

    const locale = language === "ar" ? "ar-EG" : "de-DE"

    const customers = useMemo(() => {
        const map = new Map<string, { id: string; name: string; phone: string; totalOrders: number; totalSpent: number; lastVisit: string }>()
        orders.forEach((o) => {
            const existing = map.get(o.customerPhone)
            if (existing) {
                existing.totalOrders += 1
                existing.totalSpent += o.total
                const oDate = new Date(o.createdAt).toLocaleDateString(locale)
                if (oDate > existing.lastVisit) existing.lastVisit = oDate
            } else {
                map.set(o.customerPhone, {
                    id: o.customerPhone,
                    name: o.customerName,
                    phone: o.customerPhone,
                    totalOrders: 1,
                    totalSpent: o.total,
                    lastVisit: new Date(o.createdAt).toLocaleDateString(locale),
                })
            }
        })
        return Array.from(map.values())
    }, [orders, locale])

    const filtered = customers.filter((c) =>
        !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search)
    )

    const customerOrders = selectedPhone
        ? orders.filter((o) => o.customerPhone === selectedPhone).slice(0, 10)
        : []

    return (
        <div className="space-y-6">
            <div className="flex gap-3 items-center">
                <div className="relative flex-1 max-w-sm">
                    <Search className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground ${language === "ar" ? "right-3" : "left-3"}`} />
                    <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                        placeholder={t("customers", "search", language)}
                        className={`w-full bg-input border border-border rounded-lg py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring ${language === "ar" ? "pr-10 pl-3" : "pl-10 pr-3"}`}
                    />
                </div>
                <span className="text-xs text-muted-foreground">{customers.length} {t("customers", "title", language)}</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-card border border-border rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-border text-start">
                                    <th className="p-4 text-xs font-medium text-muted-foreground">{t("customers", "name", language)}</th>
                                    <th className="p-4 text-xs font-medium text-muted-foreground">{t("customers", "phone", language)}</th>
                                    <th className="p-4 text-xs font-medium text-muted-foreground hidden sm:table-cell">{t("customers", "orders", language)}</th>
                                    <th className="p-4 text-xs font-medium text-muted-foreground hidden md:table-cell">{t("customers", "totalSpent", language)}</th>
                                    <th className="p-4 text-xs font-medium text-muted-foreground hidden lg:table-cell">{t("customers", "lastVisit", language)}</th>
                                    <th className="p-4 text-xs font-medium text-muted-foreground">{t("orders", "actions", language)}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.length === 0 ? (
                                    <tr><td colSpan={6} className="p-8 text-center text-muted-foreground text-sm">{t("common", "noData", language)}</td></tr>
                                ) : filtered.map((c) => (
                                    <tr key={c.id} className="border-b border-border/50 hover:bg-secondary/30">
                                        <td className="p-4 text-sm text-foreground">{c.name}</td>
                                        <td className="p-4 text-sm text-muted-foreground">{c.phone}</td>
                                        <td className="p-4 text-sm text-muted-foreground hidden sm:table-cell">{c.totalOrders}</td>
                                        <td className="p-4 text-sm text-foreground hidden md:table-cell">{c.totalSpent.toFixed(2)}€</td>
                                        <td className="p-4 text-xs text-muted-foreground hidden lg:table-cell">{c.lastVisit}</td>
                                        <td className="p-4">
                                            <button onClick={() => setSelectedPhone(c.phone)}
                                                className="text-xs text-primary hover:text-primary/80">{t("orders", "timeline", language)}</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {selectedPhone && (
                    <div className="bg-card border border-border rounded-xl p-4 space-y-3">
                        <div className="flex justify-between items-center">
                            <h3 className="text-sm font-bold text-foreground">{t("orders", "timeline", language)}</h3>
                            <button onClick={() => setSelectedPhone(null)} className="text-xs text-muted-foreground">✕</button>
                        </div>
                        {customerOrders.length === 0 ? (
                            <p className="text-xs text-muted-foreground">{t("common", "noData", language)}</p>
                        ) : customerOrders.map((o) => (
                            <div key={o.id} className="border-b border-border/50 pb-2">
                                <div className="flex justify-between">
                                    <span className="text-xs font-medium text-foreground">{o.orderNumber}</span>
                                    <span className="text-xs text-foreground">{o.total.toFixed(2)}€</span>
                                </div>
                                <p className="text-xs text-muted-foreground">{new Date(o.createdAt).toLocaleDateString(locale)} · {o.status}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}