"use client"

import { useDashboardStore, planLabels, planPrices } from "@/lib/store/dashboard"

export default function AdminSubscriptionsPage() {
    const subscriptions = useDashboardStore((s) => s.subscriptions)
    const markSubscriptionPaid = useDashboardStore((s) => s.markSubscriptionPaid)

    return (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-border text-left">
                            <th className="p-4 text-xs font-medium text-muted-foreground">Restaurant</th>
                            <th className="p-4 text-xs font-medium text-muted-foreground">Plan</th>
                            <th className="p-4 text-xs font-medium text-muted-foreground hidden sm:table-cell">Preis</th>
                            <th className="p-4 text-xs font-medium text-muted-foreground hidden md:table-cell">Nächste Zahlung</th>
                            <th className="p-4 text-xs font-medium text-muted-foreground">Status</th>
                            <th className="p-4 text-xs font-medium text-muted-foreground">Aktionen</th>
                        </tr>
                    </thead>
                    <tbody>
                        {subscriptions.map((sub) => (
                            <tr key={sub.id} className="border-b border-border/50 hover:bg-secondary/30">
                                <td className="p-4 text-sm font-medium text-foreground">{sub.restaurantName}</td>
                                <td className="p-4 text-sm text-foreground">{planLabels[sub.plan]}</td>
                                <td className="p-4 text-sm text-foreground hidden sm:table-cell">{sub.price} EGP</td>
                                <td className="p-4 text-xs text-muted-foreground hidden md:table-cell">{sub.nextPayment}</td>
                                <td className="p-4">
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${sub.status === "active" ? "bg-green-500/10 text-green-400" : sub.status === "overdue" ? "bg-red-500/10 text-red-400" : "bg-gray-500/10 text-gray-400"}`}>
                                        {sub.status === "active" ? "Aktiv" : sub.status === "overdue" ? "Überfällig" : "Storniert"}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <div className="flex gap-1">
                                        {sub.status !== "active" && (
                                            <button onClick={() => markSubscriptionPaid(sub.id)}
                                                className="text-xs px-2 py-1 bg-green-500/10 text-green-400 rounded-lg hover:bg-green-500/20">
                                                Als bezahlt
                                            </button>
                                        )}
                                        {sub.status === "overdue" && (
                                            <a href={`https://wa.me/?text=Zahlungserinnerung: ${sub.restaurantName} - ${sub.price} EGP (${planLabels[sub.plan]} Plan)`}
                                                target="_blank" rel="noopener noreferrer"
                                                className="text-xs px-2 py-1 bg-secondary rounded-lg text-foreground hover:bg-secondary/80">
                                                WhatsApp
                                            </a>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}