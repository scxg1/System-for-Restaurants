"use client"

import { getSupabase, isSupabaseConfigured } from "./client"
import {
    rowToProduct,
    productToRow,
    productToUpdate,
    rowToCategory,
    rowToBranch,
    rowToOrder,
    orderToRow,
    rowToSettings,
} from "./mappers"
import type {
    Order,
    ManagedProduct,
    ManagedCategory,
    ManagedBranch,
    RestaurantSettings,
} from "@/lib/store/dashboard"

// =============== PRODUCTS ===============

export async function fetchProducts(): Promise<ManagedProduct[]> {
    if (!isSupabaseConfigured) return []
    const { data, error } = await getSupabase()
        .from("products")
        .select("*")
        .order("sort_order", { ascending: true })
    if (error) throw error
    return (data || []).map(rowToProduct)
}

export async function insertProduct(product: ManagedProduct): Promise<void> {
    if (!isSupabaseConfigured) return
    const { error } = await getSupabase()
        .from("products")
        .insert(productToRow(product))
    if (error) throw error
}

export async function updateProductRow(id: string, data: Partial<ManagedProduct>): Promise<void> {
    if (!isSupabaseConfigured) return
    const { error } = await getSupabase()
        .from("products")
        .update(productToUpdate(data))
        .eq("id", id)
    if (error) throw error
}

export async function deleteProductRow(id: string): Promise<void> {
    if (!isSupabaseConfigured) return
    const { error } = await getSupabase().from("products").delete().eq("id", id)
    if (error) throw error
}

// =============== CATEGORIES ===============

export async function fetchCategories(productCounts: Record<string, number>): Promise<ManagedCategory[]> {
    if (!isSupabaseConfigured) return []
    const { data, error } = await getSupabase()
        .from("categories")
        .select("*")
        .order("sort_order", { ascending: true })
    if (error) throw error
    return (data || []).map((row) => rowToCategory(row, productCounts[row.id] || 0))
}

export async function insertCategory(c: ManagedCategory): Promise<void> {
    if (!isSupabaseConfigured) return
    const { error } = await getSupabase().from("categories").insert({
        id: c.id,
        name: c.name,
        label_ar: c.labelAr,
        is_visible: c.isVisible,
    })
    if (error) throw error
}

export async function updateCategoryRow(id: string, data: Partial<ManagedCategory>): Promise<void> {
    if (!isSupabaseConfigured) return
    const update: Record<string, unknown> = {}
    if (data.name !== undefined) update.name = data.name
    if (data.labelAr !== undefined) update.label_ar = data.labelAr
    if (data.isVisible !== undefined) update.is_visible = data.isVisible
    const { error } = await getSupabase().from("categories").update(update as never).eq("id", id)
    if (error) throw error
}

export async function deleteCategoryRow(id: string): Promise<void> {
    if (!isSupabaseConfigured) return
    const { error } = await getSupabase().from("categories").delete().eq("id", id)
    if (error) throw error
}

// =============== BRANCHES ===============

export async function fetchBranches(): Promise<ManagedBranch[]> {
    if (!isSupabaseConfigured) return []
    const { data, error } = await getSupabase()
        .from("branches")
        .select("*")
        .order("created_at", { ascending: true })
    if (error) throw error
    return (data || []).map(rowToBranch)
}

export async function insertBranch(b: ManagedBranch): Promise<void> {
    if (!isSupabaseConfigured) return
    const { error } = await getSupabase().from("branches").insert({
        id: b.id,
        name: b.name,
        address: b.address,
        phone: b.phone,
        hours: b.hours,
        is_active: b.isActive,
        opening_hours: b.openingHours as never,
    })
    if (error) throw error
}

export async function updateBranchRow(id: string, data: Partial<ManagedBranch>): Promise<void> {
    if (!isSupabaseConfigured) return
    const update: Record<string, unknown> = {}
    if (data.name !== undefined) update.name = data.name
    if (data.address !== undefined) update.address = data.address
    if (data.phone !== undefined) update.phone = data.phone
    if (data.hours !== undefined) update.hours = data.hours
    if (data.isActive !== undefined) update.is_active = data.isActive
    if (data.openingHours !== undefined) update.opening_hours = data.openingHours
    const { error } = await getSupabase().from("branches").update(update as never).eq("id", id)
    if (error) throw error
}

export async function deleteBranchRow(id: string): Promise<void> {
    if (!isSupabaseConfigured) return
    const { error } = await getSupabase().from("branches").delete().eq("id", id)
    if (error) throw error
}

// =============== ORDERS ===============

export async function fetchOrders(): Promise<Order[]> {
    if (!isSupabaseConfigured) return []
    const { data, error } = await getSupabase()
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(500)
    if (error) throw error
    return (data || []).map(rowToOrder)
}

export async function insertOrder(order: Order): Promise<void> {
    if (!isSupabaseConfigured) return
    const { error } = await getSupabase().from("orders").insert(orderToRow(order))
    if (error) throw error
}

export async function insertOrderSafe(order: Order): Promise<boolean> {
    if (!isSupabaseConfigured) return true
    const { error } = await getSupabase().from("orders").insert(orderToRow(order))
    if (error) {
        console.error("[Supabase] insertOrderSafe failed:", error.code, error.message, error.details)
        return false
    }
    return true
}

export async function updateOrderRow(id: string, data: Partial<Order>): Promise<void> {
    if (!isSupabaseConfigured) return
    const update: Record<string, unknown> = {}
    if (data.status !== undefined) update.status = data.status
    if (data.timeline !== undefined) update.timeline = data.timeline
    if (data.customerName !== undefined) update.customer_name = data.customerName
    if (data.customerPhone !== undefined) update.customer_phone = data.customerPhone
    if (data.customerAddress !== undefined) update.customer_address = data.customerAddress
    if (data.notes !== undefined) update.notes = data.notes
    if (data.paymentStatus !== undefined) update.payment_status = data.paymentStatus
    const { error } = await getSupabase().from("orders").update(update as never).eq("id", id)
    if (error) throw error
}

export async function deleteOrderRow(id: string): Promise<void> {
    if (!isSupabaseConfigured) return
    const { error } = await getSupabase().from("orders").delete().eq("id", id)
    if (error) throw error
}

export async function getNextOrderNumber(): Promise<number> {
    if (!isSupabaseConfigured) return 1
    const { data } = await getSupabase()
        .from("orders")
        .select("order_number")
    if (!data || data.length === 0) return 1
    const maxNum = data.reduce((max: number, row: { order_number: string }) => {
        const num = parseInt(row.order_number.replace("FW-", ""), 10)
        return isNaN(num) ? max : Math.max(max, num)
    }, 0)
    return maxNum + 1
}

export function generateLocalOrderNumber(): string {
    const ts = Date.now().toString(36).toUpperCase()
    const rand = Math.random().toString(36).substring(2, 5).toUpperCase()
    return `FW-${ts}-${rand}`
}

// =============== SETTINGS ===============

export async function fetchSettings(): Promise<RestaurantSettings | null> {
    if (!isSupabaseConfigured) return null
    const { data, error } = await getSupabase()
        .from("settings")
        .select("*")
        .eq("id", 1)
        .maybeSingle()
    if (error) throw error
    if (!data) return null
    return rowToSettings(data)
}

export async function updateSettingsRow(data: RestaurantSettings): Promise<void> {
    if (!isSupabaseConfigured) return
    const { error } = await getSupabase()
        .from("settings")
        .upsert({ id: 1, data: data as never, updated_at: new Date().toISOString() })
    if (error) throw error
}
