"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { MenuItem } from "@/lib/data/menu"

export interface CartItem {
    item: MenuItem
    quantity: number
    selectedSize?: { label: string; price: string; priceNumber: number }
}

interface CartState {
    items: CartItem[]
    isOpen: boolean
    addItem: (item: MenuItem, selectedSize?: { label: string; price: string; priceNumber: number }) => void
    removeItem: (itemId: string, selectedSizeLabel?: string) => void
    updateQuantity: (itemId: string, quantity: number, selectedSizeLabel?: string) => void
    clearCart: () => void
    toggleCart: () => void
    setCartOpen: (open: boolean) => void
    getTotalItems: () => number
    getTotalPrice: () => number
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            isOpen: false,

            addItem: (item, selectedSize) => {
                const sizeLabel = selectedSize?.label
                set((state) => {
                    const existingIndex = state.items.findIndex(
                        (ci) => ci.item.id === item.id && ci.selectedSize?.label === sizeLabel
                    )
                    if (existingIndex > -1) {
                        const newItems = [...state.items]
                        newItems[existingIndex] = {
                            ...newItems[existingIndex],
                            quantity: newItems[existingIndex].quantity + 1,
                        }
                        return { items: newItems }
                    }
                    return {
                        items: [...state.items, { item, quantity: 1, selectedSize }],
                    }
                })
            },

            removeItem: (itemId, selectedSizeLabel) => {
                set((state) => ({
                    items: state.items.filter(
                        (ci) => !(ci.item.id === itemId && ci.selectedSize?.label === selectedSizeLabel)
                    ),
                }))
            },

            updateQuantity: (itemId, quantity, selectedSizeLabel) => {
                if (quantity <= 0) {
                    get().removeItem(itemId, selectedSizeLabel)
                    return
                }
                set((state) => ({
                    items: state.items.map((ci) =>
                        ci.item.id === itemId && ci.selectedSize?.label === selectedSizeLabel
                            ? { ...ci, quantity }
                            : ci
                    ),
                }))
            },

            clearCart: () => set({ items: [] }),
            toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
            setCartOpen: (open) => set({ isOpen: open }),

            getTotalItems: () => {
                return get().items.reduce((sum, ci) => sum + ci.quantity, 0)
            },

            getTotalPrice: () => {
                return get().items.reduce((sum, ci) => {
                    const price = ci.selectedSize?.priceNumber ?? ci.item.priceNumber
                    return sum + price * ci.quantity
                }, 0)
            },
        }),
        {
            name: "foodie-wagon-cart",
            partialize: (state) => ({ items: state.items }),
        }
    )
)