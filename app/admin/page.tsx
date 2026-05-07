"use client"

import { useDashboardStore, planLabels } from "@/lib/store/dashboard"
import { StatsCard } from "@/components/dashboard/stats-card"
import { ShoppingBag, Euro, Community, Shop } from "iconoir-react"

export default function AdminOverviewPage() {
    const restaurants = useDashboardStore((s) => s.restaurants)
    const orders = useDashboardStore((s) => s.orders)
    const subscriptions = useDashboardStore((s) => s.subscriptions)

    const activeRestaurants = restaurants.filter((r) => r.status === "active").length
    const totalOrders = orders.length
    const totalRevenue = subscriptions.filter((s) => s.status === "active").reduce((sum, s) => sum + s.price, 0)
    const totalCustomers = new Set(orders.map((o) => o.customerPhone)).size

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCard title="Restaurants" value={restaurants.length} icon={<Shop className="w-5 h-5" />} changeLabel={`${activeRestaurants} aktiv`} />
                <StatsCard title="Gesamtbestellungen" value={totalOrders} icon={<ShoppingBag className="w-5 h-5" />} />
                <StatsCard title="Plattform-Umsatz" value={`${totalRevenue.toLocaleString()} EGP`} icon={<Euro className="w-5 h-5" />} />
                <StatsCard title="Kunden gesamt" value={totalCustomers} icon={<Community className="w-5 h-5" />} />
            </div>

            <div className="bg-card border border-border rounded-xl p-4">
                <h3 className="text-sm font-bold text-foreground mb-4">Registrierte Restaurants</h3>
                <div className="space-y-3">
                    {restaurants.map((r) => (
                        <div key={r.id} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                            <div>
                                <p className="text-sm font-medium text-foreground">{r.name}</p>
                                <p className="text-xs text-muted-foreground">{r.subdomain} · {r.ownerName} · {planLabels[r.plan]}</p>
                            </div>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${r.status === "active" ? "bg-green-500/10 text-green-400" : r.status === "trial" ? "bg-yellow-500/10 text-yellow-400" : "bg-red-500/10 text-red-400"}`}>
                                {r.status === "active" ? "Aktiv" : r.status === "trial" ? "Testphase" : "Inaktiv"}
                            </span>
                        </div>
                    ))}
                    {restaurants.length === 0 && (
                        <p className="text-sm text-muted-foreground text-center py-4">Keine Restaurants registriert</p>
                    )}
                </div>
            </div>
        </div>
    )
}
