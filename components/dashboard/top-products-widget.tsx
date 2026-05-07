"use client"

import type { TopProduct } from "@/lib/store/dashboard"

interface TopProductsWidgetProps {
    products: TopProduct[]
}

export function TopProductsWidget({ products }: TopProductsWidgetProps) {
    return (
        <div className="space-y-3">
            {products.length === 0 ? (
                <p className="text-xs text-muted-foreground py-4 text-center">Keine Daten</p>
            ) : products.map((product) => (
                <div key={product.name}>
                    <div className="flex justify-between mb-1">
                        <span className="text-sm text-foreground">{product.name}</span>
                        <span className="text-xs text-muted-foreground">{product.count}× · {product.percentage.toFixed(0)}%</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${product.percentage}%` }} />
                    </div>
                </div>
            ))}
        </div>
    )
}