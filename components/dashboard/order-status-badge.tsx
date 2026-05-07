"use client"

import type { OrderStatus } from "@/lib/store/dashboard"

const statusConfig: Record<OrderStatus, { label: string; className: string }> = {
    new: { label: "Neu", className: "bg-primary/20 text-primary" },
    preparing: { label: "In Bearbeitung", className: "bg-blue-500/20 text-blue-400" },
    ready: { label: "Bereit", className: "bg-green-500/20 text-green-400" },
    delivered: { label: "Geliefert", className: "bg-gray-500/20 text-gray-400" },
    cancelled: { label: "Storniert", className: "bg-red-500/20 text-red-400" },
}

interface OrderStatusBadgeProps {
    status: OrderStatus
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
    const config = statusConfig[status]
    return (
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${config.className}`}>
            {config.label}
        </span>
    )
}