"use client"

import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Topbar } from "@/components/dashboard/topbar"
import { useDashboardStore } from "@/lib/store/dashboard"
import { t } from "@/lib/i18n/translations"
import { useRealtimeSync, useOrderNotifications } from "@/lib/hooks/use-realtime-sync"

const pageTitleKeys: Record<string, { section: string; key: string }> = {
    "/dashboard/overview": { section: "sidebar", key: "overview" },
    "/dashboard/orders": { section: "sidebar", key: "orders" },
    "/dashboard/menu": { section: "sidebar", key: "menu" },
    "/dashboard/categories": { section: "sidebar", key: "categories" },
    "/dashboard/branches": { section: "sidebar", key: "branches" },
    "/dashboard/customers": { section: "sidebar", key: "customers" },
    "/dashboard/reports": { section: "sidebar", key: "reports" },
    "/dashboard/settings": { section: "sidebar", key: "settings" },
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [collapsed, setCollapsed] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)
    const pathname = usePathname()
    const router = useRouter()
    const [authed, setAuthed] = useState(false)
    const [mounted, setMounted] = useState(false)
    const [suspended, setSuspended] = useState(false)
    const [adminNote, setAdminNote] = useState("")

    const language = useDashboardStore((s) => s.language)
    const theme = useDashboardStore((s) => s.theme)
    const restaurants = useDashboardStore((s) => s.restaurants)

    // تفعيل المزامنة اللحظية والإشعارات
    useRealtimeSync()
    useOrderNotifications()

    // تطبيق المظهر والـ RTL
    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        if (!mounted) return
        const role = localStorage.getItem("role")
        if (role !== "restaurant_admin") {
            router.replace("/login")
            return
        }
        const email = localStorage.getItem("email")
        const restaurant = restaurants.find((r) => r.ownerEmail === email)
        if (restaurant && restaurant.status === "inactive") {
            setSuspended(true)
            setAdminNote(restaurant.adminNote || "")
            return
        }
        setAuthed(true)
    }, [mounted, router, restaurants])

    // تطبيق المظهر على HTML element
    useEffect(() => {
        if (!mounted) return
        document.documentElement.classList.remove("dark", "light")
        document.documentElement.classList.add(theme)
        document.documentElement.dir = language === "ar" ? "rtl" : "ltr"
    }, [theme, language, mounted])

    if (!mounted) {
        return <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
    }

    if (suspended) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <div className="max-w-md text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto">
                        <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-foreground">حسابك متوقف</h2>
                    <p className="text-muted-foreground">تم إيقاف تفعيل حسابك من قبل إدارة المنصة. لوحة التحكم غير متاحة حالياً.</p>
                    <p className="text-xs text-muted-foreground">واجهة الطلبات والمتجر تعمل بشكل طبيعي.</p>
                    {adminNote && (
                        <div className="mt-4 p-4 bg-card border border-border rounded-xl text-start">
                            <p className="text-xs font-medium text-yellow-400 mb-2">ملاحظة من الإدارة:</p>
                            <p className="text-sm text-foreground">{adminNote}</p>
                        </div>
                    )}
                    <button onClick={() => { localStorage.clear(); router.replace("/login") }}
                        className="mt-4 px-6 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90">
                        تسجيل الخروج
                    </button>
                </div>
            </div>
        )
    }

    if (!authed) {
        return <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
    }

    const getTitle = () => {
        for (const [path, { section, key }] of Object.entries(pageTitleKeys)) {
            if (pathname.startsWith(path)) return t(section, key, language)
        }
        return "Dashboard"
    }

    return (
        <div className="flex min-h-screen bg-background" dir={language === "ar" ? "rtl" : "ltr"}>
            <Sidebar
                collapsed={collapsed}
                onToggle={() => setCollapsed(!collapsed)}
                mobileOpen={mobileOpen}
                onMobileClose={() => setMobileOpen(false)}
            />
            <div className="flex-1 flex flex-col min-w-0">
                <Topbar title={getTitle()} onMenuClick={() => setMobileOpen(true)} />
                <main className="flex-1 p-4 lg:p-6">{children}</main>
            </div>
        </div>
    )
}