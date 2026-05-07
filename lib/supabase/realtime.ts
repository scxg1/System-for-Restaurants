"use client"

import { getSupabase, isSupabaseConfigured } from "./client"
import {
    rowToProduct,
    rowToCategory,
    rowToBranch,
    rowToOrder,
    rowToSettings,
} from "./mappers"
import type {
    Order,
    ManagedProduct,
    ManagedCategory,
    ManagedBranch,
    RestaurantSettings,
} from "@/lib/store/dashboard"
import type { Database } from "./types"

type ProductRow = Database["public"]["Tables"]["products"]["Row"]
type CategoryRow = Database["public"]["Tables"]["categories"]["Row"]
type BranchRow = Database["public"]["Tables"]["branches"]["Row"]
type OrderRow = Database["public"]["Tables"]["orders"]["Row"]
type SettingsRow = Database["public"]["Tables"]["settings"]["Row"]

interface RealtimeHandlers {
    onProductChange?: (event: "INSERT" | "UPDATE" | "DELETE", product: ManagedProduct | null, id: string) => void
    onCategoryChange?: (event: "INSERT" | "UPDATE" | "DELETE", category: ManagedCategory | null, id: string) => void
    onBranchChange?: (event: "INSERT" | "UPDATE" | "DELETE", branch: ManagedBranch | null, id: string) => void
    onOrderChange?: (event: "INSERT" | "UPDATE" | "DELETE", order: Order | null, id: string) => void
    onSettingsChange?: (settings: RestaurantSettings) => void
}

export function subscribeToRealtime(handlers: RealtimeHandlers): () => void {
    if (!isSupabaseConfigured) return () => undefined

    const supa = getSupabase()
    const channel = supa
        .channel("foodie-wagon-realtime")
        .on(
            "postgres_changes",
            { event: "*", schema: "public", table: "products" },
            (payload) => {
                if (!handlers.onProductChange) return
                const event = payload.eventType as "INSERT" | "UPDATE" | "DELETE"
                const newRow = payload.new as ProductRow | null
                const oldRow = payload.old as ProductRow | null
                const id = newRow?.id || oldRow?.id || ""
                const product = newRow ? rowToProduct(newRow) : null
                handlers.onProductChange(event, product, id)
            }
        )
        .on(
            "postgres_changes",
            { event: "*", schema: "public", table: "categories" },
            (payload) => {
                if (!handlers.onCategoryChange) return
                const event = payload.eventType as "INSERT" | "UPDATE" | "DELETE"
                const newRow = payload.new as CategoryRow | null
                const oldRow = payload.old as CategoryRow | null
                const id = newRow?.id || oldRow?.id || ""
                const category = newRow ? rowToCategory(newRow, 0) : null
                handlers.onCategoryChange(event, category, id)
            }
        )
        .on(
            "postgres_changes",
            { event: "*", schema: "public", table: "branches" },
            (payload) => {
                if (!handlers.onBranchChange) return
                const event = payload.eventType as "INSERT" | "UPDATE" | "DELETE"
                const newRow = payload.new as BranchRow | null
                const oldRow = payload.old as BranchRow | null
                const id = newRow?.id || oldRow?.id || ""
                const branch = newRow ? rowToBranch(newRow) : null
                handlers.onBranchChange(event, branch, id)
            }
        )
        .on(
            "postgres_changes",
            { event: "*", schema: "public", table: "orders" },
            (payload) => {
                if (!handlers.onOrderChange) return
                const event = payload.eventType as "INSERT" | "UPDATE" | "DELETE"
                const newRow = payload.new as OrderRow | null
                const oldRow = payload.old as OrderRow | null
                const id = newRow?.id || oldRow?.id || ""
                const order = newRow ? rowToOrder(newRow) : null
                handlers.onOrderChange(event, order, id)
            }
        )
        .on(
            "postgres_changes",
            { event: "*", schema: "public", table: "settings" },
            (payload) => {
                if (!handlers.onSettingsChange) return
                const newRow = payload.new as SettingsRow | null
                if (newRow) handlers.onSettingsChange(rowToSettings(newRow))
            }
        )
        .subscribe()

    return () => {
        supa.removeChannel(channel)
    }
}
