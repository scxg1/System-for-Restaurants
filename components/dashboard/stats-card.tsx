"use client"

import { type ReactNode } from "react"
import { ArrowUp, ArrowDown } from "iconoir-react"

interface StatsCardProps {
    title: string
    value: string | number
    change?: number
    changeLabel?: string
    icon: ReactNode
}

export function StatsCard({ title, value, change, changeLabel, icon }: StatsCardProps) {
    const isPositive = change !== undefined && change >= 0

    return (
        <div className="bg-card border border-border rounded-xl p-5 flex flex-col gap-3 min-w-0">
            <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground font-sans">{title}</span>
                <div className="text-primary">{icon}</div>
            </div>
            <div className="flex items-end gap-2">
                <span className="text-2xl font-bold text-foreground">{value}</span>
                {change !== undefined && (
                    <span
                        className={`text-xs font-medium flex items-center gap-0.5 pb-1 ${isPositive ? "text-green-400" : "text-red-400"
                            }`}
                    >
                        {isPositive ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                        {Math.abs(change)}%
                    </span>
                )}
            </div>
            {changeLabel && <span className="text-xs text-muted-foreground">{changeLabel}</span>}
        </div>
    )
}