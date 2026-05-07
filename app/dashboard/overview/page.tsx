"use client"

import { useMemo } from "react"
import Link from "next/link"
import { useDashboardStore } from "@/lib/store/dashboard"
import { StatsCard } from "@/components/dashboard/stats-card"
import { RevenueChart } from "@/components/dashboard/revenue-chart"
import { RecentOrdersWidget } from "@/components/dashboard/recent-orders-widget"
import { TopProductsWidget } from "@/components/dashboard/top-products-widget"
import { ShoppingBag, Euro, Community } from "iconoir-react"
import { t } from "@/lib/i18n/translations"

export default function OverviewPage() {
    const orders = useDashboardStore((s) => s.orders)
    const language = useDashboardStore((s) => s.language)

    const stats = useMemo(() => {
        const today = new Date().toDateString()
        const todayOrders = orders.filter((o) => new Date(o.createdAt).toDateString() === today)
        const todayRevenue = todayOrders.reduce((s, o) => s + o.total, 0)
        const avgOrderValue = todayOrders.length > 0 ? todayRevenue / todayOrders.length : 0
        const totalCustomers = new Set(orders.map((o) => o.customerPhone)).size
        return { todayOrders: todayOrders.length, todayRevenue, avgOrderValue, totalCustomers }
    }, [orders])

    const dailyRevenue = useMemo(() => {
        const days = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"]
        const now = new Date()
        return Array.from({ length: 7 }, (_, i) => {
            const d = new Date(now.getTime() - (6 - i) * 86400000)
            const dayStr = d.toDateString()
            const dayOrders = orders.filter((o) => new Date(o.createdAt).toDateString() === dayStr)
            return { day: days[d.getDay()], revenue: dayOrders.reduce((s, o) => s + o.total, 0), orders: dayOrders.length }
        })
    }, [orders])

    const recentOrders = useMemo(() => {
        return [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5)
    }, [orders])

    const topProducts = useMemo(() => {
        const productCounts: Record<string, { name: string; count: number; revenue: number }> = {}
        orders.forEach((o) => o.items.forEach((item) => {
            if (!productCounts[item.menuItemId]) productCounts[item.menuItemId] = { name: item.name, count: 0, revenue: 0 }
            productCounts[item.menuItemId].count += item.quantity
            productCounts[item.menuItemId].revenue += item.price * item.quantity
        }))
        const totalSold = Object.values(productCounts).reduce((s, p) => s + p.count, 0) || 1
        return Object.values(productCounts).sort((a, b) => b.count - a.count).slice(0, 3).map((p) => ({ ...p, percentage: (p.count / totalSold) * 100 }))
    }, [orders])

    const activeOrders = useMemo(() => {
        return orders.filter((o) => o.status !== "delivered" && o.status !== "cancelled")
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    }, [orders])

    const statusLabel = (status: string) => {
        switch (status) {
            case "new": return t("orders", "new", language)
            case "preparing": return t("orders", "preparing", language)
            case "ready": return t("orders", "ready", language)
            default: return status
        }
    }

    return (
        <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCard title={t("overview", "ordersToday", language)} value={stats.todayOrders} icon={<ShoppingBag className="w-5 h-5" />} change={12} changeLabel="+12%" />
                <StatsCard title={t("overview", "revenueToday", language)} value={`${stats.todayRevenue.toFixed(2)}€`} icon={<Euro className="w-5 h-5" />} change={8} changeLabel="+8%" />
                <StatsCard title={t("overview", "avgOrder", language)} value={`${stats.avgOrderValue.toFixed(2)}€`} icon={<Euro className="w-5 h-5" />} change={-2} changeLabel="-2%" />
                <StatsCard title={t("overview", "totalCustomers", language)} value={stats.totalCustomers} icon={<Community className="w-5 h-5" />} changeLabel="+5" />
            </div>

            {/* Charts + Widgets */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-3 bg-card border border-border rounded-xl p-4">
                    <h3 className="text-sm font-bold text-foreground mb-4">{t("overview", "revenueChart", language)}</h3>
                    <RevenueChart data={dailyRevenue} />
                </div>
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-card border border-border rounded-xl p-4">
                        <h3 className="text-sm font-bold text-foreground mb-3">{t("overview", "recentOrders", language)}</h3>
                        <RecentOrdersWidget orders={recentOrders} />
                    </div>
                    <div className="bg-card border border-border rounded-xl p-4">
                        <h3 className="text-sm font-bold text-foreground mb-3">{t("overview", "topProducts", language)}</h3>
                        <TopProductsWidget products={topProducts} />
                    </div>
                </div>
            </div>

            {/* Live Orders */}
            <div className="bg-card border border-border rounded-xl p-4">
                <h3 className="text-sm font-bold text-foreground mb-4">
                    {t("overview", "liveOrders", language)} ({activeOrders.length})
                </h3>
                {activeOrders.length === 0 ? (
                    <p className="text-sm text-muted-foreground">{t("overview", "noOrders", language)}</p>
                ) : (
                    <div className="space-y-2">
                        {activeOrders.map((o) => (
                            <Link key={o.id} href={`/dashboard/orders/${o.id}`}
                                className="flex items-center justify-between py-2 border-b border-border/50 last:border-0 hover:bg-secondary/30 -mx-2 px-2 rounded transition-colors"
                            >
                                <div>
                                    <span className="text-sm font-medium text-foreground">{o.orderNumber}</span>
                                    <span className="text-xs text-muted-foreground ms-2">{o.items.length} {t("orders", "items", language)}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-medium text-foreground">{o.total.toFixed(2)}€</span>
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${o.status === "new" ? "bg-primary/20 text-primary" : o.status === "preparing" ? "bg-blue-500/20 text-blue-400" : "bg-green-500/20 text-green-400"}`}>
                                        {statusLabel(o.status)}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        {new Date(o.createdAt).toLocaleTimeString(language === "ar" ? "ar-EG" : "de-DE", { hour: "2-digit", minute: "2-digit" })}
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}