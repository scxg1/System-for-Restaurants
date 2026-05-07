"use client"

import { useState } from "react"
import Link from "next/link"
import { useDashboardStore } from "@/lib/store/dashboard"
import { Search, Eye } from "iconoir-react"
import { OrderStatusBadge } from "@/components/dashboard/order-status-badge"
import { t } from "@/lib/i18n/translations"

const statusTabKeys = [
    { key: "all", value: "all" },
    { key: "new", value: "new" },
    { key: "preparing", value: "preparing" },
    { key: "ready", value: "ready" },
    { key: "delivered", value: "delivered" },
    { key: "cancelled", value: "cancelled" },
]

export default function OrdersPage() {
    const orders = useDashboardStore((s) => s.orders)
    const deleteOrder = useDashboardStore((s) => s.deleteOrder)
    const language = useDashboardStore((s) => s.language)
    const [statusFilter, setStatusFilter] = useState("all")
    const [search, setSearch] = useState("")

    const filtered = orders.filter((o) => {
        if (statusFilter !== "all" && o.status !== statusFilter) return false
        if (search) {
            const q = search.toLowerCase()
            return o.orderNumber.toLowerCase().includes(q) || o.customerName.toLowerCase().includes(q)
        }
        return true
    })

    return (
        <div className="space-y-6">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex gap-1 overflow-x-auto pb-1">
                    {statusTabKeys.map((tab) => (
                        <button key={tab.value} onClick={() => setStatusFilter(tab.value)}
                            className={`px-3 py-1.5 text-xs font-medium rounded-full whitespace-nowrap transition-colors ${statusFilter === tab.value
                                ? "bg-primary text-primary-foreground"
                                : "bg-secondary text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            {tab.key === "all" ? t("orders", "all", language) : t("orders", tab.key, language)}
                        </button>
                    ))}
                </div>
                <div className="relative flex-1 max-w-sm">
                    <Search className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground ${language === "ar" ? "right-3" : "left-3"}`} />
                    <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                        placeholder={t("orders", "search", language)}
                        className={`w-full bg-input border border-border rounded-lg py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring ${language === "ar" ? "pr-10 pl-3" : "pl-10 pr-3"}`}
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-border text-start">
                                <th className="p-4 text-xs font-medium text-muted-foreground">#</th>
                                <th className="p-4 text-xs font-medium text-muted-foreground">{t("orders", "orderNumber", language)}</th>
                                <th className="p-4 text-xs font-medium text-muted-foreground hidden sm:table-cell">{t("orders", "customer", language)}</th>
                                <th className="p-4 text-xs font-medium text-muted-foreground hidden md:table-cell">{t("orders", "items", language)}</th>
                                <th className="p-4 text-xs font-medium text-muted-foreground">{t("orders", "total", language)}</th>
                                <th className="p-4 text-xs font-medium text-muted-foreground hidden lg:table-cell">{t("orders", "branch", language)}</th>
                                <th className="p-4 text-xs font-medium text-muted-foreground hidden md:table-cell">{t("orders", "type", language)}</th>
                                <th className="p-4 text-xs font-medium text-muted-foreground">{t("orders", "status", language)}</th>
                                <th className="p-4 text-xs font-medium text-muted-foreground hidden sm:table-cell">{t("orders", "time", language)}</th>
                                <th className="p-4 text-xs font-medium text-muted-foreground">{t("orders", "actions", language)}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={10} className="p-8 text-center text-muted-foreground text-sm">
                                        {t("common", "noData", language)}
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((order, idx) => (
                                    <tr key={order.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                                        <td className="p-4 text-xs text-muted-foreground">{idx + 1}</td>
                                        <td className="p-4 text-sm font-medium text-foreground">{order.orderNumber}</td>
                                        <td className="p-4 text-sm text-foreground hidden sm:table-cell">{order.customerName}</td>
                                        <td className="p-4 text-sm text-muted-foreground hidden md:table-cell">{order.items.length}</td>
                                        <td className="p-4 text-sm font-medium text-foreground">{order.total.toFixed(2)}€</td>
                                        <td className="p-4 text-xs text-muted-foreground hidden lg:table-cell">{order.branchName}</td>
                                        <td className="p-4 text-xs text-muted-foreground hidden md:table-cell">
                                            {order.type === "pickup" ? t("orders", "pickup", language) : t("orders", "delivery", language)}
                                        </td>
                                        <td className="p-4"><OrderStatusBadge status={order.status} /></td>
                                        <td className="p-4 text-xs text-muted-foreground hidden sm:table-cell">
                                            {new Date(order.createdAt).toLocaleTimeString(language === "ar" ? "ar-EG" : "de-DE", { hour: "2-digit", minute: "2-digit" })}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-1">
                                                <Link href={`/dashboard/orders/${order.id}`}
                                                    className="p-1.5 rounded-lg hover:bg-secondary transition-colors" title={t("orders", "viewDetail", language)}>
                                                    <Eye className="w-4 h-4 text-muted-foreground" />
                                                </Link>
                                                <button onClick={() => deleteOrder(order.id)}
                                                    className="p-1.5 rounded-lg hover:bg-red-500/10 transition-colors" title={t("menu", "delete", language)}>
                                                    <span className="text-red-400 text-xs">✕</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}