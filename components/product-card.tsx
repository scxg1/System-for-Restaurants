"use client"

import { useState } from "react"
import Image from "next/image"
import { FireFlame, Plus, Check } from "iconoir-react"
import { SizeSelector } from "./size-selector"
import { useCartStore } from "@/lib/store/cart"
import { useDashboardStore } from "@/lib/store/dashboard"
import { st } from "@/lib/i18n/storefront"
import type { MenuItem } from "@/lib/data/menu"

interface ProductCardProps {
    item: MenuItem
}

export function ProductCard({ item }: ProductCardProps) {
    const addItem = useCartStore((s) => s.addItem)
    const lang = useDashboardStore((s) => s.storefrontLang)
    const [selectedSize, setSelectedSize] = useState(
        item.sizes ? item.sizes[0] : undefined
    )
    const [added, setAdded] = useState(false)

    const handleAdd = () => {
        addItem(item, selectedSize)
        setAdded(true)
        setTimeout(() => setAdded(false), 1500)
    }

    const displayPrice = selectedSize?.price ?? item.price

    return (
        <div className="group relative bg-card border border-border rounded-lg overflow-hidden hover:border-primary/50 transition-all duration-300">
            {/* Image */}
            {item.image && (
                <div className="relative w-full aspect-[3/2] bg-black/20">
                    <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-contain p-2 group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    {/* Price Badge */}
                    <div className="absolute top-1.5 right-1.5 bg-primary text-primary-foreground px-2 py-0.5 rounded-full shadow-lg text-xs font-black">
                        {displayPrice}
                    </div>
                    {/* Halal Badge */}
                    {item.halal && (
                        <div className="absolute bottom-1 left-1">
                            <img
                                src="/graphics/halal logo.svg"
                                alt="100% Halal"
                                className="h-6 w-6 drop-shadow"
                            />
                        </div>
                    )}
                </div>
            )}

            {/* Content */}
            <div className="p-2.5">
                <h3 className="text-sm font-black text-foreground tracking-tight group-hover:text-primary transition-colors leading-tight">
                    {item.name}
                </h3>
                <p className="text-muted-foreground text-[11px] leading-relaxed mt-0.5 line-clamp-2">
                    {item.description}
                </p>

                {/* Spice Level */}
                {item.spiceLevel !== undefined && item.spiceLevel > 0 && (
                    <div className="flex items-center gap-0.5 mt-1">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <FireFlame
                                key={i}
                                className={`w-3 h-3 ${i < item.spiceLevel! ? "text-red-500 fill-red-500" : "text-muted"}`}
                            />
                        ))}
                    </div>
                )}

                {/* Size Selector */}
                {item.sizes && (
                    <SizeSelector sizes={item.sizes} onSelect={setSelectedSize} />
                )}

                {/* Add to Cart Button */}
                <button
                    onClick={handleAdd}
                    className={`mt-2 w-full flex items-center justify-center gap-1 py-1.5 rounded-md font-bold text-[11px] transition-all duration-300 ${added
                        ? "bg-green-600 text-white"
                        : "bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95"
                        }`}
                >
                    {added ? (
                        <>
                            <Check className="w-3.5 h-3.5" />
                            {st("product.added", lang)}
                        </>
                    ) : (
                        <>
                            <Plus className="w-3.5 h-3.5" />
                            {st("product.add", lang)} — {displayPrice}
                        </>
                    )}
                </button>
            </div>
        </div>
    )
}