// Map between Supabase row types and app types

import type { Database } from "./types"
import type {
    Order,
    OrderItem,
    OrderStatus,
    ManagedProduct,
    ManagedCategory,
    ManagedBranch,
    RestaurantSettings,
} from "@/lib/store/dashboard"

type ProductRow = Database["public"]["Tables"]["products"]["Row"]
type CategoryRow = Database["public"]["Tables"]["categories"]["Row"]
type BranchRow = Database["public"]["Tables"]["branches"]["Row"]
type OrderRow = Database["public"]["Tables"]["orders"]["Row"]
type SettingsRow = Database["public"]["Tables"]["settings"]["Row"]

type Size = { label: string; price: string; priceNumber: number }

export function rowToProduct(row: ProductRow): ManagedProduct {
    return {
        id: row.id,
        name: row.name,
        description: row.description,
        price: row.price,
        priceNumber: Number(row.price_number),
        spiceLevel: row.spice_level,
        image: row.image || undefined,
        halal: row.halal,
        vegetarian: row.vegetarian,
        sizes: (row.sizes as Size[] | null) || undefined,
        categoryId: row.category_id || "",
        isActive: row.is_active,
    }
}

export function productToRow(p: Partial<ManagedProduct> & { id: string }): Database["public"]["Tables"]["products"]["Insert"] {
    return {
        id: p.id,
        category_id: p.categoryId || null,
        name: p.name || "",
        description: p.description || "",
        price: p.price || "",
        price_number: p.priceNumber ?? 0,
        spice_level: p.spiceLevel ?? 0,
        image: p.image || null,
        halal: p.halal ?? false,
        vegetarian: p.vegetarian ?? false,
        is_active: p.isActive ?? true,
        sizes: (p.sizes ?? null) as Database["public"]["Tables"]["products"]["Insert"]["sizes"],
    }
}

export function productToUpdate(p: Partial<ManagedProduct>): Database["public"]["Tables"]["products"]["Update"] {
    const out: Database["public"]["Tables"]["products"]["Update"] = {}
    if (p.categoryId !== undefined) out.category_id = p.categoryId || null
    if (p.name !== undefined) out.name = p.name
    if (p.description !== undefined) out.description = p.description
    if (p.price !== undefined) out.price = p.price
    if (p.priceNumber !== undefined) out.price_number = p.priceNumber
    if (p.spiceLevel !== undefined) out.spice_level = p.spiceLevel
    if (p.image !== undefined) out.image = p.image || null
    if (p.halal !== undefined) out.halal = p.halal
    if (p.vegetarian !== undefined) out.vegetarian = p.vegetarian
    if (p.isActive !== undefined) out.is_active = p.isActive
    if (p.sizes !== undefined) out.sizes = (p.sizes ?? null) as Database["public"]["Tables"]["products"]["Update"]["sizes"]
    out.updated_at = new Date().toISOString()
    return out
}

export function rowToCategory(row: CategoryRow, productCount: number): ManagedCategory {
    return {
        id: row.id,
        name: row.name,
        labelAr: row.label_ar,
        isVisible: row.is_visible,
        productCount,
    }
}

export function rowToBranch(row: BranchRow): ManagedBranch {
    return {
        id: row.id,
        name: row.name,
        address: row.address,
        phone: row.phone,
        hours: row.hours,
        isActive: row.is_active,
        openingHours: (row.opening_hours as ManagedBranch["openingHours"]) || {},
        todayOrders: 0,
        todayRevenue: 0,
    }
}

export function rowToOrder(row: OrderRow): Order {
    return {
        id: row.id,
        orderNumber: row.order_number,
        customerName: row.customer_name,
        customerPhone: row.customer_phone,
        customerAddress: row.customer_address || undefined,
        items: (row.items as unknown as OrderItem[]) || [],
        total: Number(row.total),
        status: row.status as Order["status"],
        type: row.type as Order["type"],
        paymentMethod: row.payment_method as Order["paymentMethod"],
        paymentStatus: row.payment_status as Order["paymentStatus"],
        branchId: row.branch_id || "",
        branchName: row.branch_name,
        notes: row.notes || undefined,
        timeline: (row.timeline as unknown as { status: OrderStatus; time: string }[]) || [],
        createdAt: row.created_at,
    }
}

export function orderToRow(o: Order): Database["public"]["Tables"]["orders"]["Insert"] {
    return {
        id: o.id,
        order_number: o.orderNumber,
        customer_name: o.customerName,
        customer_phone: o.customerPhone,
        customer_address: o.customerAddress || null,
        items: o.items as unknown as Database["public"]["Tables"]["orders"]["Insert"]["items"],
        total: o.total,
        status: o.status,
        type: o.type,
        payment_method: o.paymentMethod,
        payment_status: o.paymentStatus,
        branch_id: o.branchId || null,
        branch_name: o.branchName,
        notes: o.notes || null,
        timeline: o.timeline as unknown as Database["public"]["Tables"]["orders"]["Insert"]["timeline"],
        created_at: o.createdAt,
    }
}

export function rowToSettings(row: SettingsRow): RestaurantSettings {
    return row.data as unknown as RestaurantSettings
}
