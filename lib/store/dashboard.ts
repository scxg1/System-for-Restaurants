"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import { menuItems, categories, type MenuItem } from "@/lib/data/menu"
import { broadcastEvent } from "@/lib/hooks/use-realtime-sync"
import { branches } from "@/lib/config/branches"
import { type Language } from "@/lib/i18n/translations"
import { type StorefrontLang } from "@/lib/i18n/storefront"

export type OrderStatus = "new" | "preparing" | "ready" | "delivered" | "cancelled"
export type OrderType = "pickup" | "delivery"
export type PaymentMethod = "cash" | "online" | "card"
export type PaymentStatus = "paid" | "pending" | "refunded"

export interface OrderItem {
    menuItemId: string
    name: string
    quantity: number
    price: number
    size?: string
    notes?: string
}

export interface Order {
    id: string
    orderNumber: string
    customerName: string
    customerPhone: string
    customerAddress?: string
    items: OrderItem[]
    total: number
    status: OrderStatus
    type: OrderType
    paymentMethod: PaymentMethod
    paymentStatus: PaymentStatus
    branchId: string
    branchName: string
    createdAt: string
    notes?: string
    timeline: { status: OrderStatus; time: string }[]
}

export interface Customer {
    id: string
    name: string
    phone: string
    totalOrders: number
    totalSpent: number
    lastVisit: string
    createdAt: string
}

export interface DailyRevenue {
    day: string
    revenue: number
    orders: number
}

export interface HourlyDistribution {
    hour: string
    orders: number
}

export interface TopProduct {
    name: string
    count: number
    percentage: number
    revenue: number
}

export interface DashboardStats {
    todayOrders: number
    todayOrdersChange: number
    todayRevenue: number
    todayRevenueChange: number
    avgOrderValue: number
    avgOrderValueChange: number
    totalCustomers: number
    newCustomers: number
}

export interface OpeningHours {
    day: string
    isOpen: boolean
    open: string
    close: string
}

export interface RestaurantSettings {
    name: string
    description: string
    address: string
    menuDealTitleDe: string
    menuDealTitleAr: string
    menuDealDescDe: string
    menuDealDescAr: string
    phone: string
    email: string
    website: string
    instagram: string
    whatsapp: string
    openingHours: OpeningHours[]
    deliveryEnabled: boolean
    deliveryMinOrder: number
    deliveryFee: number
    deliveryTime: string
    paymentCash: boolean
    paymentOnline: boolean
    paymentCard: boolean
    stripeKey: string
    notificationSound: boolean
    notificationBrowser: boolean
    notificationWhatsApp: string
}

export interface ManagedProduct extends MenuItem {
    categoryId: string
    isActive: boolean
}

export interface ManagedCategory {
    id: string
    name: string
    labelAr: string
    isVisible: boolean
    productCount: number
}

export interface ManagedBranch {
    id: string
    name: string
    address: string
    isActive: boolean
    phone: string
    hours: string
    todayOrders: number
    todayRevenue: number
    openingHours: Record<string, { isOpen: boolean; open: string; close: string }>
}

export interface Restaurant {
    id: string
    name: string
    subdomain: string
    logo?: string
    plan: "starter" | "pro" | "business"
    status: "active" | "inactive" | "trial"
    totalOrders: number
    totalRevenue: number
    createdAt: string
    ownerName: string
    ownerEmail: string
    adminNote?: string
}

export interface Subscription {
    id: string
    restaurantId: string
    restaurantName: string
    plan: "starter" | "pro" | "business"
    price: number
    nextPayment: string
    status: "active" | "overdue" | "cancelled"
}

export const planPrices: Record<string, number> = { starter: 500, pro: 1000, business: 2000 }
export const planLabels: Record<string, string> = { starter: "Starter", pro: "Pro", business: "Business" }

function createInitialProducts(): ManagedProduct[] {
    const products: ManagedProduct[] = []
    for (const [catId, items] of Object.entries(menuItems)) {
        for (const item of items) {
            products.push({ ...item, categoryId: catId, isActive: true })
        }
    }
    return products
}

function createInitialCategories(): ManagedCategory[] {
    return categories.map((cat) => ({
        id: cat.id,
        name: cat.labelDe,
        labelAr: cat.labelAr || cat.labelDe,
        isVisible: true,
        productCount: menuItems[cat.id]?.length || 0,
    }))
}

function createInitialBranches(): ManagedBranch[] {
    return branches.map((b) => ({
        id: b.id,
        name: b.name,
        address: b.address,
        isActive: true,
        phone: b.phone || "",
        hours: b.hours,
        todayOrders: 0,
        todayRevenue: 0,
        openingHours: {
            Monday: { isOpen: false, open: "11:00", close: "22:00" },
            Tuesday: { isOpen: false, open: "11:00", close: "22:00" },
            Wednesday: { isOpen: true, open: "11:00", close: "22:00" },
            Thursday: { isOpen: true, open: "11:00", close: "22:00" },
            Friday: { isOpen: true, open: "11:00", close: "22:00" },
            Saturday: { isOpen: true, open: "11:00", close: "22:00" },
            Sunday: { isOpen: true, open: "12:00", close: "21:00" },
        },
    }))
}

const defaultSettings: RestaurantSettings = {
    name: "The Foodie Wagon",
    description: "Best Street Food in Ingolstadt",
    address: "Saturn/Mediamarkt, Am Westpark 7, Ingolstadt",
    menuDealTitleDe: "MENÜ DEAL",
    menuDealTitleAr: "عرض الوجبة",
    menuDealDescDe: "Burger + Pommes + Getränk = nur €4,50",
    menuDealDescAr: "برجر + بطاطس + مشروب = فقط €4.50",
    phone: "+49 176 22245627",
    email: "info@foodiewagon.de",
    website: "https://foodiewagon.de",
    instagram: "https://instagram.com/foodiewagon",
    whatsapp: "+4917622245627",
    openingHours: [
        { day: "Montag", isOpen: false, open: "11:00", close: "22:00" },
        { day: "Dienstag", isOpen: false, open: "11:00", close: "22:00" },
        { day: "Mittwoch", isOpen: true, open: "11:00", close: "22:00" },
        { day: "Donnerstag", isOpen: true, open: "11:00", close: "22:00" },
        { day: "Freitag", isOpen: true, open: "11:00", close: "22:00" },
        { day: "Samstag", isOpen: true, open: "11:00", close: "22:00" },
        { day: "Sonntag", isOpen: true, open: "12:00", close: "21:00" },
    ],
    deliveryEnabled: true,
    deliveryMinOrder: 15,
    deliveryFee: 3,
    deliveryTime: "30-45 min",
    paymentCash: true,
    paymentOnline: false,
    paymentCard: false,
    stripeKey: "",
    notificationSound: true,
    notificationBrowser: false,
    notificationWhatsApp: "+4917622245627",
}

const defaultRestaurants: Restaurant[] = [
    {
        id: "foodie-wagon",
        name: "The Foodie Wagon",
        subdomain: "foodiewagon",
        plan: "pro",
        status: "active",
        totalOrders: 0,
        totalRevenue: 0,
        createdAt: new Date().toISOString().split("T")[0],
        ownerName: "Ahmed Hassan",
        ownerEmail: "admin@foodiewagon.de",
    },
]

const defaultSubscriptions: Subscription[] = [
    {
        id: "sub-1",
        restaurantId: "foodie-wagon",
        restaurantName: "The Foodie Wagon",
        plan: "pro",
        price: 1000,
        nextPayment: "2025-06-15",
        status: "active",
    },
]

interface DashboardState {
    orders: Order[]
    addOrder: (order: Omit<Order, "id" | "orderNumber" | "createdAt" | "timeline">) => Order
    updateOrderStatus: (id: string, status: OrderStatus) => void
    deleteOrder: (id: string) => void
    updateOrder: (id: string, data: Partial<Order>) => void

    products: ManagedProduct[]
    addProduct: (product: Omit<ManagedProduct, "id">) => void
    updateProduct: (id: string, data: Partial<ManagedProduct>) => void
    deleteProduct: (id: string) => void
    toggleProductActive: (id: string) => void

    managedCategories: ManagedCategory[]
    updateCategory: (id: string, data: Partial<ManagedCategory>) => void
    addCategory: (name: string) => void
    deleteCategory: (id: string) => void
    toggleCategoryVisibility: (id: string) => void
    recalcCategoryCounts: () => void

    managedBranches: ManagedBranch[]
    updateBranch: (id: string, data: Partial<ManagedBranch>) => void
    addBranch: (branch: Omit<ManagedBranch, "id" | "todayOrders" | "todayRevenue">) => void
    toggleBranchActive: (id: string) => void

    settings: RestaurantSettings
    updateSettings: (data: Partial<RestaurantSettings>) => void

    restaurants: Restaurant[]
    subscriptions: Subscription[]
    addRestaurant: (data: Omit<Restaurant, "id" | "totalOrders" | "totalRevenue">) => void
    toggleRestaurantStatus: (id: string) => void
    setRestaurantStatus: (id: string, status: Restaurant["status"], note?: string) => void
    updateRestaurantNote: (id: string, note: string) => void
    deleteRestaurant: (id: string) => void
    markSubscriptionPaid: (id: string) => void

    language: Language
    setLanguage: (lang: Language) => void
    theme: "dark" | "light"
    setTheme: (theme: "dark" | "light") => void

    storefrontLang: StorefrontLang
    setStorefrontLang: (lang: StorefrontLang) => void

    getCustomers: () => Customer[]
    getStats: () => DashboardStats
    getDailyRevenue: () => DailyRevenue[]
    getHourlyDistribution: () => HourlyDistribution[]
    getTopProducts: () => TopProduct[]
    getTodayOrders: () => Order[]
    getRecentOrders: (count: number) => Order[]
}

export const useDashboardStore = create<DashboardState>()(
    persist(
        (set, get) => ({
            orders: [],

            addOrder: (orderData) => {
                const state = get()
                const orderNum = state.orders.length + 1
                const newOrder: Order = {
                    ...orderData,
                    id: `order-${Date.now()}`,
                    orderNumber: `FW-${String(orderNum).padStart(4, "0")}`,
                    createdAt: new Date().toISOString(),
                    timeline: [{ status: orderData.status || "new", time: new Date().toISOString() }],
                }
                set({ orders: [newOrder, ...state.orders] })

                broadcastEvent({ type: "NEW_ORDER", payload: { orderId: newOrder.id } })

                const br = state.managedBranches.find((b) => b.id === newOrder.branchId)
                if (br) {
                    const isToday = new Date(newOrder.createdAt).toDateString() === new Date().toDateString()
                    if (isToday) {
                        set({
                            managedBranches: state.managedBranches.map((b) =>
                                b.id === newOrder.branchId
                                    ? { ...b, todayOrders: b.todayOrders + 1, todayRevenue: b.todayRevenue + newOrder.total }
                                    : b
                            ),
                        })
                    }
                }

                return newOrder
            },

            updateOrderStatus: (id, status) => {
                set({
                    orders: get().orders.map((o) =>
                        o.id === id
                            ? { ...o, status, timeline: [...o.timeline, { status, time: new Date().toISOString() }] }
                            : o
                    ),
                })
                broadcastEvent({ type: "ORDER_UPDATED" })
            },

            deleteOrder: (id) => {
                set({ orders: get().orders.filter((o) => o.id !== id) })
                broadcastEvent({ type: "ORDER_DELETED" })
            },

            updateOrder: (id, data) => {
                set({
                    orders: get().orders.map((o) => (o.id === id ? { ...o, ...data } : o)),
                })
                broadcastEvent({ type: "ORDER_UPDATED" })
            },

            products: createInitialProducts(),

            addProduct: (productData) => {
                const newProduct: ManagedProduct = {
                    ...productData,
                    id: `product-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
                }
                set({ products: [...get().products, newProduct] })
                get().recalcCategoryCounts()
            },

            updateProduct: (id, data) => {
                set({
                    products: get().products.map((p) => (p.id === id ? { ...p, ...data } : p)),
                })
                get().recalcCategoryCounts()
            },

            deleteProduct: (id) => {
                set({ products: get().products.filter((p) => p.id !== id) })
                get().recalcCategoryCounts()
            },

            toggleProductActive: (id) => {
                set({
                    products: get().products.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p)),
                })
            },

            managedCategories: createInitialCategories(),

            updateCategory: (id, data) => {
                set({
                    managedCategories: get().managedCategories.map((c) => (c.id === id ? { ...c, ...data } : c)),
                })
            },

            addCategory: (name) => {
                const id = name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
                set({
                    managedCategories: [...get().managedCategories, { id: `cat-${id}-${Date.now()}`, name, labelAr: name, isVisible: true, productCount: 0 }],
                })
            },

            deleteCategory: (id) => {
                set({
                    managedCategories: get().managedCategories.filter((c) => c.id !== id),
                    products: get().products.filter((p) => p.categoryId !== id),
                })
                get().recalcCategoryCounts()
            },

            toggleCategoryVisibility: (id) => {
                set({
                    managedCategories: get().managedCategories.map((c) =>
                        c.id === id ? { ...c, isVisible: !c.isVisible } : c
                    ),
                })
            },

            recalcCategoryCounts: () => {
                const state = get()
                set({
                    managedCategories: state.managedCategories.map((cat) => ({
                        ...cat,
                        productCount: state.products.filter((p) => p.categoryId === cat.id).length,
                    })),
                })
            },

            managedBranches: createInitialBranches(),

            updateBranch: (id, data) => {
                set({
                    managedBranches: get().managedBranches.map((b) => (b.id === id ? { ...b, ...data } : b)),
                })
            },

            addBranch: (branchData) => {
                const newBranch: ManagedBranch = {
                    ...branchData,
                    id: `branch-${Date.now()}`,
                    todayOrders: 0,
                    todayRevenue: 0,
                }
                set({ managedBranches: [...get().managedBranches, newBranch] })
            },

            toggleBranchActive: (id) => {
                set({
                    managedBranches: get().managedBranches.map((b) =>
                        b.id === id ? { ...b, isActive: !b.isActive } : b
                    ),
                })
            },

            settings: defaultSettings,

            updateSettings: (data) => {
                set({ settings: { ...get().settings, ...data } })
                broadcastEvent({ type: "SETTINGS_CHANGED" })
            },

            language: "de" as Language,
            setLanguage: (lang) => set({ language: lang }),
            theme: "dark" as "dark" | "light",
            setTheme: (theme) => {
                set({ theme })
                if (typeof document !== "undefined") {
                    document.documentElement.classList.toggle("dark", theme === "dark")
                    document.documentElement.classList.toggle("light", theme === "light")
                }
            },

            storefrontLang: "de" as StorefrontLang,
            setStorefrontLang: (lang) => {
                set({ storefrontLang: lang })
                if (typeof document !== "undefined") {
                    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr"
                    document.documentElement.lang = lang
                }
            },

            restaurants: defaultRestaurants,
            subscriptions: defaultSubscriptions,

            addRestaurant: (data) => {
                const newRestaurant: Restaurant = {
                    ...data,
                    id: `restaurant-${Date.now()}`,
                    totalOrders: 0,
                    totalRevenue: 0,
                }
                set({ restaurants: [...get().restaurants, newRestaurant] })
            },

            toggleRestaurantStatus: (id) => {
                set({
                    restaurants: get().restaurants.map((r) =>
                        r.id === id ? { ...r, status: r.status === "active" ? "inactive" as const : "active" as const } : r
                    ),
                })
            },

            setRestaurantStatus: (id, status, note) => {
                set({
                    restaurants: get().restaurants.map((r) =>
                        r.id === id ? { ...r, status, ...(note !== undefined ? { adminNote: note } : {}) } : r
                    ),
                })
            },

            updateRestaurantNote: (id, note) => {
                set({
                    restaurants: get().restaurants.map((r) =>
                        r.id === id ? { ...r, adminNote: note } : r
                    ),
                })
            },

            deleteRestaurant: (id) => {
                set({
                    restaurants: get().restaurants.filter((r) => r.id !== id),
                    subscriptions: get().subscriptions.filter((s) => s.restaurantId !== id),
                })
            },

            markSubscriptionPaid: (id) => {
                set({
                    subscriptions: get().subscriptions.map((s) =>
                        s.id === id ? { ...s, status: "active" as const } : s
                    ),
                })
            },

            getCustomers: () => {
                const orders = get().orders
                const customerMap = new Map<string, Customer>()

                for (const order of orders) {
                    const key = order.customerPhone
                    const existing = customerMap.get(key)
                    if (existing) {
                        existing.totalOrders += 1
                        existing.totalSpent = Math.round((existing.totalSpent + order.total) * 100) / 100
                        if (new Date(order.createdAt) > new Date(existing.lastVisit)) {
                            existing.lastVisit = order.createdAt.split("T")[0]
                        }
                    } else {
                        customerMap.set(key, {
                            id: `customer-${key}`,
                            name: order.customerName,
                            phone: order.customerPhone,
                            totalOrders: 1,
                            totalSpent: Math.round(order.total * 100) / 100,
                            lastVisit: order.createdAt.split("T")[0],
                            createdAt: order.createdAt.split("T")[0],
                        })
                    }
                }

                return Array.from(customerMap.values()).sort((a, b) => b.totalSpent - a.totalSpent)
            },

            getStats: () => {
                const orders = get().orders
                const today = new Date().toDateString()
                const todayOrders = orders.filter((o) => new Date(o.createdAt).toDateString() === today)
                const yesterday = new Date(Date.now() - 86400000).toDateString()
                const yesterdayOrders = orders.filter((o) => new Date(o.createdAt).toDateString() === yesterday)

                const todayRevenue = todayOrders.reduce((s, o) => s + o.total, 0)
                const yesterdayRevenue = yesterdayOrders.reduce((s, o) => s + o.total, 0)

                const allDelivered = orders.filter((o) => o.status === "delivered")
                const avgOrderValue = allDelivered.length > 0
                    ? Math.round((allDelivered.reduce((s, o) => s + o.total, 0) / allDelivered.length) * 100) / 100
                    : 0

                const customers = get().getCustomers()
                const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000).toISOString().split("T")[0]
                const newCustomers = customers.filter((c) => c.createdAt >= thirtyDaysAgo).length

                return {
                    todayOrders: todayOrders.length,
                    todayOrdersChange: yesterdayOrders.length > 0
                        ? Math.round(((todayOrders.length - yesterdayOrders.length) / yesterdayOrders.length) * 100)
                        : 0,
                    todayRevenue: Math.round(todayRevenue * 100) / 100,
                    todayRevenueChange: yesterdayRevenue > 0
                        ? Math.round(((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100)
                        : 0,
                    avgOrderValue,
                    avgOrderValueChange: 0,
                    totalCustomers: customers.length,
                    newCustomers,
                }
            },

            getDailyRevenue: () => {
                const orders = get().orders
                const days = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"]
                const result: DailyRevenue[] = []

                for (let i = 6; i >= 0; i--) {
                    const date = new Date(Date.now() - i * 86400000)
                    const dateStr = date.toDateString()
                    const dayOrders = orders.filter((o) => new Date(o.createdAt).toDateString() === dateStr)
                    result.push({
                        day: days[date.getDay()],
                        revenue: Math.round(dayOrders.reduce((s, o) => s + o.total, 0) * 100) / 100,
                        orders: dayOrders.length,
                    })
                }

                return result
            },

            getHourlyDistribution: () => {
                const orders = get().orders
                const today = new Date().toDateString()
                const todayOrders = orders.filter((o) => new Date(o.createdAt).toDateString() === today)
                const hourMap: Record<string, number> = {}

                for (const order of todayOrders) {
                    const hour = new Date(order.createdAt).getHours()
                    const key = `${String(hour).padStart(2, "0")}:00`
                    hourMap[key] = (hourMap[key] || 0) + 1
                }

                const result: HourlyDistribution[] = []
                for (let h = 10; h <= 22; h++) {
                    const key = `${String(h).padStart(2, "0")}:00`
                    result.push({ hour: key, orders: hourMap[key] || 0 })
                }

                return result
            },

            getTopProducts: () => {
                const orders = get().orders
                const productMap: Record<string, { count: number; revenue: number }> = {}

                for (const order of orders) {
                    for (const item of order.items) {
                        if (!productMap[item.name]) {
                            productMap[item.name] = { count: 0, revenue: 0 }
                        }
                        productMap[item.name].count += item.quantity
                        productMap[item.name].revenue += item.price
                    }
                }

                const total = Object.values(productMap).reduce((s, p) => s + p.count, 0)
                return Object.entries(productMap)
                    .map(([name, data]) => ({
                        name,
                        count: data.count,
                        percentage: total > 0 ? Math.round((data.count / total) * 100) : 0,
                        revenue: Math.round(data.revenue * 100) / 100,
                    }))
                    .sort((a, b) => b.count - a.count)
                    .slice(0, 5)
            },

            getTodayOrders: () => {
                const today = new Date().toDateString()
                return get().orders.filter((o) => new Date(o.createdAt).toDateString() === today)
            },

            getRecentOrders: (count) => {
                return get().orders.slice(0, count)
            },
        }),
        {
            name: "foodie-wagon-dashboard",
            version: 4,
            migrate: (persistedState: unknown) => {
                const state = persistedState as Record<string, unknown>

                const restaurants = state.restaurants as Array<Record<string, unknown>> | undefined
                if (restaurants) {
                    const allowedIds = ["foodie-wagon"]
                    const cleaned = restaurants.filter((r) => allowedIds.includes(r.id as string))
                    state.restaurants = cleaned.length > 0 ? cleaned : defaultRestaurants
                }
                if (!state.restaurants || (state.restaurants as Array<unknown>).length === 0) {
                    state.restaurants = defaultRestaurants
                }

                const subscriptions = state.subscriptions as Array<Record<string, unknown>> | undefined
                if (subscriptions) {
                    const allowedIds = ["foodie-wagon"]
                    const cleaned = subscriptions.filter((s) => allowedIds.includes(s.restaurantId as string))
                    state.subscriptions = cleaned.length > 0 ? cleaned : defaultSubscriptions
                }

                const settings = state.settings as Record<string, unknown> | undefined
                if (settings) {
                    if (!settings.address) settings.address = "Saturn/Mediamarkt, Am Westpark 7, Ingolstadt"
                    if (!settings.menuDealTitleDe) settings.menuDealTitleDe = "MENÜ DEAL"
                    if (!settings.menuDealTitleAr) settings.menuDealTitleAr = "عرض الوجبة"
                    if (!settings.menuDealDescDe) settings.menuDealDescDe = "Burger + Pommes + Getränk = nur €4,50"
                    if (!settings.menuDealDescAr) settings.menuDealDescAr = "برجر + بطاطس + مشروب = فقط €4.50"
                }
                const cats = state.managedCategories as Array<Record<string, unknown>> | undefined
                if (cats) {
                    const arMap: Record<string, string> = {
                        beef: "برجر لحم", chicken: "برجر دجاج", veggie: "نباتي",
                        appetizers: "مقبلات وأطباق جانبية", "fried-chicken": "دجاج مقلي",
                        dips: "صلصات وتغميسات", drinks: "مشروبات",
                    }
                    for (const cat of cats) {
                        if (!cat.labelAr) cat.labelAr = arMap[cat.id as string] || (cat.name as string)
                    }
                }
                return state
            },
            partialize: (state) => ({
                orders: state.orders,
                products: state.products,
                managedCategories: state.managedCategories,
                managedBranches: state.managedBranches,
                settings: state.settings,
                restaurants: state.restaurants,
                subscriptions: state.subscriptions,
                language: state.language,
                theme: state.theme,
                storefrontLang: state.storefrontLang,
            }),
        }
    )
)
