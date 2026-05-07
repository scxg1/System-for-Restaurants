"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
    HomeSimple, Shop, StatsReport, Settings, LogOut,
    Menu, Xmark, SidebarCollapse, SidebarExpand
} from "iconoir-react"
import { useRealtimeSync } from "@/lib/hooks/use-realtime-sync"

const adminNav = [
    { href: "/admin", label: "Übersicht", icon: HomeSimple },
    { href: "/admin/restaurants", label: "Restaurants", icon: Shop },
    { href: "/admin/subscriptions", label: "Abonnements", icon: StatsReport },
    { href: "/admin/analytics", label: "Analytics", icon: Settings },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [collapsed, setCollapsed] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)
    const pathname = usePathname()
    const router = useRouter()
    const [authed, setAuthed] = useState(false)
    const [mounted, setMounted] = useState(false)

    useRealtimeSync()

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        if (!mounted) return
        const role = localStorage.getItem("role")
        if (role !== "super_admin") {
            router.replace("/login")
        } else {
            setAuthed(true)
        }
    }, [mounted, router])

    const handleLogout = () => {
        localStorage.removeItem("role")
        localStorage.removeItem("email")
        localStorage.removeItem("sessionId")
        router.replace("/login")
    }

    if (!mounted || !authed) {
        return <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
    }

    const navContent = (
        <div className="flex flex-col h-full">
            <div className="p-4 border-b border-sidebar-border flex items-center justify-between">
                <Link href="/admin" className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-red-500 flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-sm">SA</span>
                    </div>
                    {!collapsed && (
                        <div>
                            <h2 className="text-sm font-bold text-sidebar-foreground">Super Admin</h2>
                            <p className="text-[10px] text-sidebar-foreground/50">Platform</p>
                        </div>
                    )}
                </Link>
                <button onClick={() => setMobileOpen(false)} className="lg:hidden p-1 text-sidebar-foreground">
                    <Xmark className="w-5 h-5" />
                </button>
            </div>
            <nav className="flex-1 py-4 px-2 space-y-1">
                {adminNav.map((item) => {
                    const Icon = item.icon
                    const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href))
                    return (
                        <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${active
                                ? "bg-sidebar-primary text-sidebar-primary-foreground font-medium"
                                : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                                } ${collapsed ? "justify-center" : ""}`}
                        >
                            <Icon className="w-5 h-5 flex-shrink-0" />
                            {!collapsed && <span>{item.label}</span>}
                        </Link>
                    )
                })}
            </nav>
            <div className="hidden lg:block p-2 border-t border-sidebar-border">
                <button onClick={() => setCollapsed(!collapsed)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent w-full"
                >
                    {collapsed ? <SidebarExpand className="w-5 h-5" /> : <SidebarCollapse className="w-5 h-5" />}
                    {!collapsed && <span>Einklappen</span>}
                </button>
            </div>
            <div className="p-4 border-t border-sidebar-border">
                <div className={`flex items-center gap-3 ${collapsed ? "justify-center" : ""}`}>
                    <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-red-400 text-xs font-bold">OW</span>
                    </div>
                    {!collapsed && (
                        <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-sidebar-foreground truncate">Platform Owner</p>
                            <p className="text-[10px] text-sidebar-foreground/50">Super Admin</p>
                        </div>
                    )}
                </div>
                <button
                    onClick={handleLogout}
                    className={`flex items-center gap-3 mt-3 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-colors w-full ${collapsed ? "justify-center" : ""}`}
                >
                    <LogOut className="w-4 h-4 flex-shrink-0" />
                    {!collapsed && <span>Abmelden</span>}
                </button>
            </div>
        </div>
    )

    return (
        <div className="flex min-h-screen bg-background">
            <aside className={`hidden lg:flex flex-col bg-sidebar border-r border-sidebar-border h-screen sticky top-0 transition-all duration-300 ${collapsed ? "w-[72px]" : "w-60"}`}>
                {navContent}
            </aside>
            {mobileOpen && (
                <>
                    <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
                    <aside className="fixed left-0 top-0 h-full w-72 bg-sidebar border-r border-sidebar-border z-50 lg:hidden">
                        {navContent}
                    </aside>
                </>
            )}
            <div className="flex-1 flex flex-col min-w-0">
                <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border">
                    <div className="flex items-center justify-between h-16 px-4 lg:px-6">
                        <div className="flex items-center gap-3">
                            <button onClick={() => setMobileOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-secondary">
                                <Menu className="w-5 h-5 text-foreground" />
                            </button>
                            <h1 className="text-lg font-bold text-foreground">Super Admin</h1>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs px-2 py-1 bg-red-500/10 text-red-400 rounded-full font-medium">Admin</span>
                        </div>
                    </div>
                </header>
                <main className="flex-1 p-4 lg:p-6">{children}</main>
            </div>
        </div>
    )
}
