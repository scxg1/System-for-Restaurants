"use client"

import Link from "next/link"
import type { Order } from "@/lib/store/dashboard"
import { OrderStatusBadge } from "./order-status-badge"

interface RecentOrdersWidgetProps {
    orders: Order[]
}

export function RecentOrdersWidget({ orders }: RecentOrdersWidgetProps) {
    return (
        <div className="space-y-2">
            {orders.length === 0 ? (
                <p className="text-xs text-muted-foreground py-4 text-center">Keine aktuellen Bestellungen</p>
            ) : orders.map((order) => (
                <Link key={order.id} href={`/dashboard/orders/${order.id}`}
                    className="flex items-center justify-between py-2 border-b border-border/50 last:border-0 hover:bg-secondary/30 -mx-2 px-2 rounded transition-colors"
                >
                    <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground">{order.orderNumber}</p>
                        <p className="text-xs text-muted-foreground">{order.customerName} · {order.items.length} Artikel</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm font-medium text-foreground">{order.total.toFixed(2)}€</p>
                        <OrderStatusBadge status={order.status} />
                    </div>
                </Link>
            ))}
        </div>
    )
}