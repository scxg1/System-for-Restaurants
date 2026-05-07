"use client"

import { useState } from "react"
import { Bell } from "iconoir-react"
import { useDashboardStore } from "@/lib/store/dashboard"
import { OrderStatusBadge } from "./order-status-badge"

export function NotificationBell() {
    const [isOpen, setIsOpen] = useState(false)
    const orders = useDashboardStore((s) => s.orders)
    const newOrders = orders.filter((o) => o.status === "new")
    const unreadCount = newOrders.length

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-lg hover:bg-secondary transition-colors"
            >
                <Bell className="w-5 h-5 text-foreground" />
                {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                        {unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                    <div className="absolute right-0 top-full mt-2 w-80 bg-card border border-border rounded-xl shadow-2xl z-50 overflow-hidden">
                        <div className="p-3 border-b border-border">
                            <h3 className="text-sm font-bold text-foreground">Benachrichtigungen</h3>
                        </div>
                        <div className="max-h-64 overflow-y-auto">
                            {newOrders.length === 0 ? (
                                <div className="p-4 text-center text-sm text-muted-foreground">
                                    Keine neuen Bestellungen
                                </div>
                            ) : (
                                newOrders.slice(0, 5).map((order) => (
                                    <div
                                        key={order.id}
                                        className="p-3 border-b border-border/50 hover:bg-secondary/50 transition-colors"
                                    >
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-sm font-medium text-foreground">
                                                {order.orderNumber}
                                            </span>
                                            <OrderStatusBadge status={order.status} />
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            {order.customerName} · {order.total.toFixed(2)}€
                                        </p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}
