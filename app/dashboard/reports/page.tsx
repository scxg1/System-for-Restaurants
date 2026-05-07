"use client"

import { useState, useMemo } from "react"
import { useDashboardStore } from "@/lib/store/dashboard"
import { RevenueChart } from "@/components/dashboard/revenue-chart"
import { t } from "@/lib/i18n/translations"

type Period = "today" | "week" | "month" | "year"

const periodKeys: { value: Period; key: string }[] = [
    { value: "today", key: "today" },
    { value: "week", key: "thisWeek" },
    { value: "month", key: "thisMonth" },
    { value: "year", key: "thisYear" },
]

export default function ReportsPage() {
    const orders = useDashboardStore((s) => s.orders)
    const language = useDashboardStore((s) => s.language)
    const [period, setPeriod] = useState<Period>("week")

    const filteredOrders = useMemo(() => {
        const now = new Date()
        return orders.filter((o) => {
            const d = new Date(o.createdAt)
            switch (period) {
                case "today": return d.toDateString() === now.toDateString()
                case "week": return d >= new Date(now.getTime() - 7 * 86400000)
                case "month": return d >= new Date(now.getFullYear(), now.getMonth(), 1)
                case "year": return d.getFullYear() === now.getFullYear()
            }
        })
    }, [orders, period])

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

    const hourlyDistribution = useMemo(() => {
        const hours = Array.from({ length: 24 }, (_, i) => ({ hour: `${i.toString().padStart(2, "0")}:00`, orders: 0 }))
        orders.forEach((o) => {
            const h = new Date(o.createdAt).getHours()
            hours[h].orders += 1
        })
        return hours
    }, [orders])

    const topProducts = useMemo(() => {
        const productCounts: Record<string, { name: string; count: number; revenue: number }> = {}
        orders.forEach((o) => o.items.forEach((item) => {
            if (!productCounts[item.menuItemId]) productCounts[item.menuItemId] = { name: item.name, count: 0, revenue: 0 }
            productCounts[item.menuItemId].count += item.quantity
            productCounts[item.menuItemId].revenue += item.price * item.quantity
        }))
        const totalSold = Object.values(productCounts).reduce((s, p) => s + p.count, 0) || 1
        return Object.values(productCounts).sort((a, b) => b.count - a.count).slice(0, 5).map((p) => ({ ...p, percentage: (p.count / totalSold) * 100 }))
    }, [orders])

    const totalOrders = filteredOrders.length
    const totalRevenue = filteredOrders.reduce((s, o) => s + o.total, 0)
    const avgOrder = totalOrders > 0 ? totalRevenue / totalOrders : 0
    const pickupCount = filteredOrders.filter((o) => o.type === "pickup").length
    const deliveryCount = filteredOrders.filter((o) => o.type === "delivery").length
    const maxHourly = Math.max(...hourlyDistribution.map((h) => h.orders), 1)

    return (
        <div className="space-y-6">
            <div className="flex gap-1 overflow-x-auto">
                {periodKeys.map((p) => (
                    <button key={p.value} onClick={() => setPeriod(p.value)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-full whitespace-nowrap transition-colors ${period === p.value ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`}>
                        {t("reports", p.key, language)}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: t("reports", "orders", language), value: totalOrders },
                    { label: t("reports", "revenue", language), value: `${totalRevenue.toFixed(2)}€` },
                    { label: t("reports", "avgOrder", language), value: `${avgOrder.toFixed(2)}€` },
                    { label: `${t("orders", "pickup", language)} / ${t("orders", "delivery", language)}`, value: `${pickupCount} / ${deliveryCount}` },
                ].map((s) => (
                    <div key={s.label} className="bg-card border border-border rounded-xl p-4">
                        <p className="text-xs text-muted-foreground">{s.label}</p>
                        <p className="text-lg font-bold text-foreground mt-1">{s.value}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-card border border-border rounded-xl p-4">
                    <h3 className="text-sm font-bold text-foreground mb-4">{t("reports", "revenueOverTime", language)}</h3>
                    <RevenueChart data={dailyRevenue} />
                </div>

                <div className="bg-card border border-border rounded-xl p-4">
                    <h3 className="text-sm font-bold text-foreground mb-4">{t("reports", "ordersByHour", language)}</h3>
                    <div className="flex items-end gap-1 h-40">
                        {hourlyDistribution.map((h) => (
                            <div key={h.hour} className="flex-1 flex flex-col items-center gap-1">
                                <span className="text-[10px] text-muted-foreground">{h.orders}</span>
                                <div className="w-full bg-primary/20 rounded-t" style={{ height: `${(h.orders / maxHourly) * 100}%` }}>
                                    <div className="w-full bg-primary rounded-t" style={{ height: "100%" }} />
                                </div>
                                <span className="text-[9px] text-muted-foreground">{h.hour.slice(0, 2)}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-card border border-border rounded-xl p-4">
                    <h3 className="text-sm font-bold text-foreground mb-4">{t("reports", "topProducts", language)}</h3>
                    {topProducts.length === 0 ? (
                        <p className="text-xs text-muted-foreground">{t("common", "noData", language)}</p>
                    ) : topProducts.map((p) => (
                        <div key={p.name} className="mb-3">
                            <div className="flex justify-between mb-1">
                                <span className="text-xs text-foreground">{p.name}</span>
                                <span className="text-xs text-muted-foreground">{p.count}× · {p.revenue.toFixed(2)}€</span>
                            </div>
                            <div className="h-2 bg-secondary rounded-full overflow-hidden">
                                <div className="h-full bg-primary rounded-full" style={{ width: `${p.percentage}%` }} />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="bg-card border border-border rounded-xl p-4">
                    <h3 className="text-sm font-bold text-foreground mb-4">{t("reports", "orderTypes", language)}</h3>
                    <div className="flex items-center justify-center gap-8">
                        <div className="text-center">
                            <div className="w-20 h-20 rounded-full border-4 border-primary flex items-center justify-center">
                                <span className="text-lg font-bold text-foreground">{pickupCount}</span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-2">{t("orders", "pickup", language)}</p>
                        </div>
                        <div className="text-center">
                            <div className="w-20 h-20 rounded-full border-4 border-blue-500 flex items-center justify-center">
                                <span className="text-lg font-bold text-foreground">{deliveryCount}</span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-2">{t("orders", "delivery", language)}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}