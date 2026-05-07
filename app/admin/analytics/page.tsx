"use client"

import { useDashboardStore } from "@/lib/store/dashboard"
import { StatsCard } from "@/components/dashboard/stats-card"
import { Shop, ShoppingBag, Euro, Community } from "iconoir-react"

export default function AdminAnalyticsPage() {
    const restaurants = useDashboardStore((s) => s.restaurants)
    const orders = useDashboardStore((s) => s.orders)
    const subscriptions = useDashboardStore((s) => s.subscriptions)

    const totalRestaurants = restaurants.length
    const activeSubs = subscriptions.filter((s) => s.status === "active")
    const totalRevenue = activeSubs.reduce((sum, s) => sum + s.price, 0)
    const totalOrders = orders.length
    const totalCustomers = new Set(orders.map((o) => o.customerPhone)).size

    // حساب الاشتراكات حسب الخطة
    const byPlan = { starter: 0, pro: 0, business: 0 }
    activeSubs.forEach((s) => { byPlan[s.plan]++ })

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCard title="Restaurants" value={totalRestaurants} icon={<Shop className="w-5 h-5" />} changeLabel={`${restaurants.filter((r) => r.status === "active").length} aktiv`} />
                <StatsCard title="Gesamtbestellungen" value={totalOrders} icon={<ShoppingBag className="w-5 h-5" />} />
                <StatsCard title="Plattform-Umsatz" value={`${totalRevenue.toLocaleString()} EGP`} icon={<Euro className="w-5 h-5" />} />
                <StatsCard title="Kunden gesamt" value={totalCustomers} icon={<Community className="w-5 h-5" />} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Plans distribution */}
                <div className="bg-card border border-border rounded-xl p-4">
                    <h3 className="text-sm font-bold text-foreground mb-4">Aktive Abonnements nach Plan</h3>
                    <div className="space-y-3">
                        {(["starter", "pro", "business"] as const).map((plan) => (
                            <div key={plan} className="flex items-center gap-3">
                                <span className="text-sm text-foreground w-20 capitalize">{plan}</span>
                                <div className="flex-1 h-6 bg-secondary rounded-full overflow-hidden">
                                    <div className="h-full bg-primary rounded-full flex items-center justify-end pr-2" style={{ width: `${totalRestaurants > 0 ? (byPlan[plan] / totalRestaurants) * 100 : 0}%`, minWidth: byPlan[plan] > 0 ? "2rem" : "0" }}>
                                        <span className="text-[10px] text-primary-foreground font-medium">{byPlan[plan]}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Restaurant status */}
                <div className="bg-card border border-border rounded-xl p-4">
                    <h3 className="text-sm font-bold text-foreground mb-4">Restaurant-Status</h3>
                    <div className="flex items-center justify-center gap-8">
                        {(["active", "trial", "inactive"] as const).map((status) => {
                            const count = restaurants.filter((r) => r.status === status).length
                            const colors = { active: "border-green-500", trial: "border-yellow-500", inactive: "border-red-500" }
                            const labels = { active: "Aktiv", trial: "Testphase", inactive: "Inaktiv" }
                            return (
                                <div key={status} className="text-center">
                                    <div className={`w-20 h-20 rounded-full border-4 ${colors[status]} flex items-center justify-center`}>
                                        <span className="text-lg font-bold text-foreground">{count}</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-2">{labels[status]}</p>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>

            {/* Revenue by restaurant */}
            <div className="bg-card border border-border rounded-xl p-4">
                <h3 className="text-sm font-bold text-foreground mb-4">Umsatz nach Restaurant</h3>
                <div className="space-y-2">
                    {restaurants.map((r) => {
                        const sub = subscriptions.find((s) => s.restaurantId === r.id)
                        return (
                            <div key={r.id} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                                <div>
                                    <p className="text-sm font-medium text-foreground">{r.name}</p>
                                    <p className="text-xs text-muted-foreground">{sub ? `${sub.plan} Plan` : "Kein Plan"}</p>
                                </div>
                                <span className="text-sm font-medium text-foreground">{sub && sub.status === "active" ? `${sub.price} EGP` : "–"}</span>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}