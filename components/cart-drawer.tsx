"use client"

import { useState, useEffect } from "react"
import { ShoppingBag, Xmark, Minus, Plus, Trash } from "iconoir-react"
import { useCartStore } from "@/lib/store/cart"
import { useDashboardStore } from "@/lib/store/dashboard"
import { st } from "@/lib/i18n/storefront"

export function CartDrawer() {
    const { items, isOpen, setCartOpen, removeItem, updateQuantity, getTotalPrice, getTotalItems } =
        useCartStore()
    const lang = useDashboardStore((s) => s.storefrontLang)

    const totalPrice = getTotalPrice()
    const totalItems = getTotalItems()

    if (!isOpen) return null

    return (
        <>
            <div className="fixed inset-0 bg-black/60 z-50" onClick={() => setCartOpen(false)} />
            <div className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border rounded-t-3xl max-h-[85vh] flex flex-col animate-slide-up">
                <div className="flex items-center justify-between p-4 border-b border-border">
                    <div className="flex items-center gap-3">
                        <ShoppingBag className="w-6 h-6 text-primary" />
                        <h2 className="text-xl font-black text-foreground tracking-tight">
                            {st("cart.title", lang)}
                        </h2>
                        <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-bold">
                            {totalItems}
                        </span>
                    </div>
                    <button onClick={() => setCartOpen(false)} className="p-2 hover:bg-muted rounded-lg transition-colors">
                        <Xmark className="w-6 h-6" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {items.length === 0 ? (
                        <div className="text-center py-8">
                            <ShoppingBag className="w-12 h-12 text-muted mx-auto mb-3" />
                            <p className="text-muted-foreground">{st("cart.empty", lang)}</p>
                        </div>
                    ) : (
                        items.map((ci) => {
                            const price = ci.selectedSize?.priceNumber ?? ci.item.priceNumber
                            const label = ci.selectedSize
                                ? `${ci.item.name} (${ci.selectedSize.label})`
                                : ci.item.name
                            return (
                                <div key={`${ci.item.id}-${ci.selectedSize?.label ?? "default"}`}
                                    className="flex items-center gap-3 bg-background/50 p-3 rounded-xl border border-border">
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-foreground text-sm truncate">{label}</p>
                                        <p className="text-primary font-black text-sm">
                                            {(price * ci.quantity).toFixed(2).replace(".", ",")}€
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => updateQuantity(ci.item.id, ci.quantity - 1, ci.selectedSize?.label)}
                                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-muted">
                                            <Minus className="w-4 h-4" />
                                        </button>
                                        <span className="w-6 text-center font-bold text-sm">{ci.quantity}</span>
                                        <button onClick={() => updateQuantity(ci.item.id, ci.quantity + 1, ci.selectedSize?.label)}
                                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-muted">
                                            <Plus className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => removeItem(ci.item.id, ci.selectedSize?.label)}
                                            className="w-8 h-8 flex items-center justify-center rounded-lg text-red-500">
                                            <Trash className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            )
                        })
                    )}
                </div>

                {items.length > 0 && (
                    <div className="p-4 border-t border-border space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-foreground font-bold">{st("cart.total", lang)}:</span>
                            <span className="text-2xl font-black text-primary">
                                {totalPrice.toFixed(2).replace(".", ",")}€
                            </span>
                        </div>
                        <button
                            onClick={() => {
                                setCartOpen(false)
                                const event = new CustomEvent("open-checkout")
                                window.dispatchEvent(event)
                            }}
                            className="w-full py-4 bg-primary text-primary-foreground font-black text-lg rounded-xl">
                            {st("cart.checkout", lang)} — {totalPrice.toFixed(2).replace(".", ",")}€
                        </button>
                    </div>
                )}
            </div>
        </>
    )
}

export function CartFloatingButton() {
    const { setCartOpen, getTotalItems } = useCartStore()
    const totalItems = getTotalItems()
    const [mounted, setMounted] = useState(false)

    useEffect(() => { setMounted(true) }, [])

    if (!mounted || totalItems === 0) return null

    return (
        <button
            onClick={() => setCartOpen(true)}
            className="fixed bottom-6 right-6 z-40 bg-primary text-primary-foreground w-16 h-16 rounded-full shadow-2xl flex items-center justify-center active:scale-95 transition-transform">
            <ShoppingBag className="w-7 h-7" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center">
                {totalItems}
            </span>
        </button>
    )
}