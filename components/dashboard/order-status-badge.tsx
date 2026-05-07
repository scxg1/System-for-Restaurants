"use client"

import type { OrderStatus } from "@/lib/store/dashboard"
import { useDashboardStore } from "@/lib/store/dashboard"
import { t } from "@/lib/i18n/translations"

const statusClassNames: Record<OrderStatus, string> = {
    new: "bg-primary/20 text-primary",
    preparing: "bg-blue-500/20 text-blue-400",
    ready: "bg-green-500/20 text-green-400",
    delivered: "bg-gray-500/20 text-gray-400",
    cancelled: "bg-red-500/20 text-red-400",
}

interface OrderStatusBadgeProps {
    status: OrderStatus
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
    const language = useDashboardStore((s) => s.language)
    return (
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusClassNames[status]}`}>
            {t("orders", status, language)}
        </span>
    )
}