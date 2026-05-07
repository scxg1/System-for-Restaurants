"use client"

import { useState } from "react"

interface SizeOption {
    label: string
    price: string
    priceNumber: number
}

interface SizeSelectorProps {
    sizes: SizeOption[]
    onSelect: (size: SizeOption) => void
}

export function SizeSelector({ sizes, onSelect }: SizeSelectorProps) {
    const [selected, setSelected] = useState(0)

    return (
        <div className="flex flex-wrap gap-1.5 mt-2">
            {sizes.map((size, i) => (
                <button
                    key={size.label}
                    onClick={() => {
                        setSelected(i)
                        onSelect(size)
                    }}
                    className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all ${selected === i
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground hover:bg-primary/20"
                        }`}
                >
                    {size.label} — {size.price}
                </button>
            ))}
        </div>
    )
}