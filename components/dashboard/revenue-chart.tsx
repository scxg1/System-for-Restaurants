"use client"

interface RevenueChartProps {
    data: Array<{ day: string; revenue: number; orders: number }>
}

export function RevenueChart({ data }: RevenueChartProps) {
    const maxRevenue = Math.max(...data.map((d) => d.revenue), 1)

    return (
        <div className="space-y-2">
            <div className="flex items-end gap-2 h-40">
                {data.map((d, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <span className="text-[10px] text-muted-foreground">{d.revenue.toFixed(0)}€</span>
                        <div className="w-full bg-primary/20 rounded-t relative" style={{ height: `${(d.revenue / maxRevenue) * 100}%` }}>
                            <div className="absolute bottom-0 w-full bg-primary rounded-t" style={{ height: "100%" }} />
                        </div>
                        <span className="text-[9px] text-muted-foreground">{d.day}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}