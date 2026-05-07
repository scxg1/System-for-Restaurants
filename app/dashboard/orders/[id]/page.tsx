"use client"

import { use } from "react"
import { useRouter } from "next/navigation"
import { useDashboardStore, type OrderStatus } from "@/lib/store/dashboard"
import { OrderStatusBadge } from "@/components/dashboard/order-status-badge"
import { ArrowLeft } from "iconoir-react"

const statusFlow: OrderStatus[] = ["new", "preparing", "ready", "delivered"]

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const router = useRouter()
    const order = useDashboardStore((s) => s.orders.find((o) => o.id === id))
    const updateOrderStatus = useDashboardStore((s) => s.updateOrderStatus)

    if (!order) {
        return (
            <div className="text-center py-12">
                <p className="text-muted-foreground">Bestellung nicht gefunden</p>
                <button onClick={() => router.back()} className="mt-4 text-primary text-sm">← Zurück</button>
            </div>
        )
    }

    const currentIdx = statusFlow.indexOf(order.status)
    const canAdvance = currentIdx >= 0 && currentIdx < statusFlow.length - 1
    const nextStatus = canAdvance ? statusFlow[currentIdx + 1] : null
    const nextLabel: Record<string, string> = { preparing: "In Bearbeitung", ready: "Bereit", delivered: "Geliefert" }

    return (
        <div className="space-y-6">
            <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="w-4 h-4" /> Zurück
            </button>

            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-foreground">{order.orderNumber}</h2>
                    <p className="text-sm text-muted-foreground">{new Date(order.createdAt).toLocaleString("de-DE")}</p>
                </div>
                <OrderStatusBadge status={order.status} />
            </div>

            {/* Status Actions */}
            <div className="bg-card border border-border rounded-xl p-4 flex flex-wrap gap-2">
                {canAdvance && nextStatus && (
                    <button onClick={() => updateOrderStatus(order.id, nextStatus)}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
                        → {nextLabel[nextStatus]}
                    </button>
                )}
                {order.status !== "cancelled" && order.status !== "delivered" && (
                    <button onClick={() => updateOrderStatus(order.id, "cancelled")}
                        className="px-4 py-2 bg-red-500/10 text-red-400 rounded-lg text-sm font-medium hover:bg-red-500/20 transition-colors">
                        Stornieren
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Customer Info */}
                <div className="bg-card border border-border rounded-xl p-4 space-y-2">
                    <h3 className="text-sm font-bold text-foreground">Kunde</h3>
                    <p className="text-sm text-foreground">{order.customerName}</p>
                    <p className="text-sm text-muted-foreground">{order.customerPhone}</p>
                    {order.customerAddress && <p className="text-sm text-muted-foreground">{order.customerAddress}</p>}
                    <div className="flex gap-4 pt-2">
                        <span className="text-xs text-muted-foreground">Typ: {order.type === "pickup" ? "Abholung" : "Lieferung"}</span>
                        <span className="text-xs text-muted-foreground">Filiale: {order.branchName}</span>
                    </div>
                </div>

                {/* Payment */}
                <div className="bg-card border border-border rounded-xl p-4 space-y-2">
                    <h3 className="text-sm font-bold text-foreground">Zahlung</h3>
                    <p className="text-sm text-foreground">{order.paymentMethod === "cash" ? "Bar" : order.paymentMethod === "online" ? "Online" : "Karte"}</p>
                    <p className="text-sm text-muted-foreground">Status: {order.paymentStatus === "paid" ? "Bezahlt" : "Ausstehend"}</p>
                    <p className="text-lg font-bold text-primary">{order.total.toFixed(2)}€</p>
                </div>
            </div>

            {/* Items */}
            <div className="bg-card border border-border rounded-xl p-4">
                <h3 className="text-sm font-bold text-foreground mb-3">Artikel</h3>
                <div className="space-y-2">
                    {order.items.map((item, i) => (
                        <div key={i} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                            <div>
                                <p className="text-sm text-foreground">{item.name} × {item.quantity}</p>
                                {item.size && <p className="text-xs text-muted-foreground">Größe: {item.size}</p>}
                            </div>
                            <p className="text-sm font-medium text-foreground">{item.price.toFixed(2)}€</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Timeline */}
            <div className="bg-card border border-border rounded-xl p-4">
                <h3 className="text-sm font-bold text-foreground mb-3">Verlauf</h3>
                <div className="space-y-2">
                    {order.timeline.map((t, i) => (
                        <div key={i} className="flex items-center gap-3">
                            <OrderStatusBadge status={t.status} />
                            <span className="text-xs text-muted-foreground">{new Date(t.time).toLocaleString("de-DE")}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Notes */}
            {order.notes && (
                <div className="bg-card border border-border rounded-xl p-4">
                    <h3 className="text-sm font-bold text-foreground mb-2">Notizen</h3>
                    <p className="text-sm text-muted-foreground">{order.notes}</p>
                </div>
            )}
        </div>
    )
}