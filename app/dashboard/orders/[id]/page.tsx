"use client"

import { use } from "react"
import { useRouter } from "next/navigation"
import { useDashboardStore, type OrderStatus } from "@/lib/store/dashboard"
import { OrderStatusBadge } from "@/components/dashboard/order-status-badge"
import { ArrowLeft } from "iconoir-react"
import { t } from "@/lib/i18n/translations"

const statusFlow: OrderStatus[] = ["new", "preparing", "ready", "delivered"]

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const router = useRouter()
    const order = useDashboardStore((s) => s.orders.find((o) => o.id === id))
    const updateOrderStatus = useDashboardStore((s) => s.updateOrderStatus)
    const language = useDashboardStore((s) => s.language)

    if (!order) {
        return (
            <div className="text-center py-12">
                <p className="text-muted-foreground">{t("common", "noData", language)}</p>
                <button onClick={() => router.back()} className="mt-4 text-primary text-sm">← {t("orders", "back", language)}</button>
            </div>
        )
    }

    const currentIdx = statusFlow.indexOf(order.status)
    const canAdvance = currentIdx >= 0 && currentIdx < statusFlow.length - 1
    const nextStatus = canAdvance ? statusFlow[currentIdx + 1] : null
    const locale = language === "ar" ? "ar-EG" : "de-DE"

    return (
        <div className="space-y-6">
            <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="w-4 h-4" /> {t("orders", "back", language)}
            </button>

            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-foreground">{order.orderNumber}</h2>
                    <p className="text-sm text-muted-foreground">{new Date(order.createdAt).toLocaleString(locale)}</p>
                </div>
                <OrderStatusBadge status={order.status} />
            </div>

            {/* Status Actions */}
            <div className="bg-card border border-border rounded-xl p-4 flex flex-wrap gap-2">
                {canAdvance && nextStatus && (
                    <button onClick={() => updateOrderStatus(order.id, nextStatus)}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
                        → {t("orders", nextStatus, language)}
                    </button>
                )}
                {order.status !== "cancelled" && order.status !== "delivered" && (
                    <button onClick={() => updateOrderStatus(order.id, "cancelled")}
                        className="px-4 py-2 bg-red-500/10 text-red-400 rounded-lg text-sm font-medium hover:bg-red-500/20 transition-colors">
                        {t("orders", "cancelled", language)}
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Customer Info */}
                <div className="bg-card border border-border rounded-xl p-4 space-y-2">
                    <h3 className="text-sm font-bold text-foreground">{t("orders", "customerInfo", language)}</h3>
                    <p className="text-sm text-foreground">{order.customerName}</p>
                    <p className="text-sm text-muted-foreground">{order.customerPhone}</p>
                    {order.customerAddress && (
                        <div className="text-sm text-muted-foreground whitespace-pre-line break-words">
                            {order.customerAddress}
                            {/* Show map link if coordinates are detected */}
                            {(() => {
                                const match = order.customerAddress.match(/(-?\d+\.\d+),\s*(-?\d+\.\d+)/)
                                if (!match) return null
                                const url = `https://www.google.com/maps?q=${match[1]},${match[2]}`
                                return (
                                    <a href={url} target="_blank" rel="noopener noreferrer" className="block mt-1 text-primary text-xs hover:underline">
                                        🗺️ {t("orders", "address", language)} → Google Maps
                                    </a>
                                )
                            })()}
                        </div>
                    )}
                    <div className="flex gap-4 pt-2">
                        <span className="text-xs text-muted-foreground">{t("orders", "type", language)}: {order.type === "pickup" ? t("orders", "pickup", language) : t("orders", "delivery", language)}</span>
                        <span className="text-xs text-muted-foreground">{t("orders", "branch", language)}: {order.branchName}</span>
                    </div>
                </div>

                {/* Payment */}
                <div className="bg-card border border-border rounded-xl p-4 space-y-2">
                    <h3 className="text-sm font-bold text-foreground">{t("orders", "paymentMethod", language)}</h3>
                    <p className="text-sm text-foreground">{order.paymentMethod === "cash" ? t("orders", "cash", language) : t("orders", "online", language)}</p>
                    <p className="text-sm text-muted-foreground">{t("orders", "status", language)}: {order.paymentStatus === "paid" ? t("orders", "paid", language) : t("orders", "pending", language)}</p>
                    <p className="text-lg font-bold text-primary">{order.total.toFixed(2)}€</p>
                </div>
            </div>

            {/* Items */}
            <div className="bg-card border border-border rounded-xl p-4">
                <h3 className="text-sm font-bold text-foreground mb-3">{t("orders", "orderItems", language)}</h3>
                <div className="space-y-2">
                    {order.items.map((item, i) => (
                        <div key={i} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                            <div>
                                <p className="text-sm text-foreground">{item.name} × {item.quantity}</p>
                                {item.size && <p className="text-xs text-muted-foreground">{t("menu", "sizeName", language)}: {item.size}</p>}
                            </div>
                            <p className="text-sm font-medium text-foreground">{item.price.toFixed(2)}€</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Timeline */}
            <div className="bg-card border border-border rounded-xl p-4">
                <h3 className="text-sm font-bold text-foreground mb-3">{t("orders", "timeline", language)}</h3>
                <div className="space-y-2">
                    {order.timeline.map((tl, i) => (
                        <div key={i} className="flex items-center gap-3">
                            <OrderStatusBadge status={tl.status} />
                            <span className="text-xs text-muted-foreground">{new Date(tl.time).toLocaleString(locale)}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Notes */}
            {order.notes && (
                <div className="bg-card border border-border rounded-xl p-4">
                    <h3 className="text-sm font-bold text-foreground mb-2">💬 {t("orders", "notes", language)}</h3>
                    <p className="text-sm text-foreground whitespace-pre-line">{order.notes}</p>
                </div>
            )}
        </div>
    )
}
