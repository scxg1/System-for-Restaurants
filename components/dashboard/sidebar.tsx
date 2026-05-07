"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    HomeSimple,
    ShoppingBag,
    PizzaSlice,
    List,
    MapPin,
    Community,
    Reports,
    Settings,
    LogOut,
    Xmark,
    SidebarCollapse,
    SidebarExpand,
} from "iconoir-react"
import { useDashboardStore } from "@/lib/store/dashboard"
import { t } from "@/lib/i18n/translations"

const navKeys = [
    { href: "/dashboard/overview", key: "overview", icon: HomeSimple },
    { href: "/dashboard/orders", key: "orders", icon: ShoppingBag },
    { href: "/dashboard/menu", key: "menu", icon: PizzaSlice },
    { href: "/dashboard/categories", key: "categories", icon: List },
    { href: "/dashboard/branches", key: "branches", icon: MapPin },
    { href: "/dashboard/customers", key: "customers", icon: Community },
    { href: "/dashboard/reports", key: "reports", icon: Reports },
    { href: "/dashboard/settings", key: "settings", icon: Settings },
]

interface SidebarProps {
    collapsed: boolean
    onToggle: () => void
    mobileOpen: boolean
    onMobileClose: () => void
}

export function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose }: SidebarProps) {
    const pathname = usePathname()
    const language = useDashboardStore((s) => s.language)

    const isActive = (href: string) => pathname.startsWith(href)

    const sidebarContent = (
        <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="p-4 border-b border-sidebar-border flex items-center justify-between">
                <Link href="/dashboard/overview" className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
                        <span className="text-primary-foreground font-bold text-sm">FW</span>
                    </div>
                    {!collapsed && (
                        <div className="min-w-0">
                            <h2 className="text-sm font-bold text-sidebar-foreground truncate">
                                The Foodie Wagon
                            </h2>
                            <p className="text-[10px] text-sidebar-foreground/50">Dashboard</p>
                        </div>
                    )}
                </Link>
                <button
                    onClick={onMobileClose}
                    className="lg:hidden p-1 text-sidebar-foreground hover:text-primary"
                >
                    <Xmark className="w-5 h-5" />
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
                {navKeys.map((item) => {
                    const Icon = item.icon
                    const active = isActive(item.href)
                    const label = t("sidebar", item.key, language)
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={onMobileClose}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${active
                                ? "bg-sidebar-primary text-sidebar-primary-foreground font-medium"
                                : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                                } ${collapsed ? "justify-center" : ""}`}
                            title={collapsed ? label : undefined}
                        >
                            <Icon className="w-5 h-5 flex-shrink-0" />
                            {!collapsed && <span>{label}</span>}
                        </Link>
                    )
                })}
            </nav>

            {/* Collapse toggle (desktop only) */}
            <div className="hidden lg:block p-2 border-t border-sidebar-border">
                <button
                    onClick={onToggle}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors w-full"
                >
                    {collapsed ? (
                        <SidebarExpand className="w-5 h-5 flex-shrink-0" />
                    ) : (
                        <SidebarCollapse className="w-5 h-5 flex-shrink-0" />
                    )}
                    {!collapsed && <span>{language === "ar" ? "طي" : "Einklappen"}</span>}
                </button>
            </div>

            {/* User / Logout */}
            <div className="p-4 border-t border-sidebar-border">
                <div className={`flex items-center gap-3 ${collapsed ? "justify-center" : ""}`}>
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-primary text-xs font-bold">AH</span>
                    </div>
                    {!collapsed && (
                        <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-sidebar-foreground truncate">Ahmed H.</p>
                            <p className="text-[10px] text-sidebar-foreground/50">Restaurant Admin</p>
                        </div>
                    )}
                </div>
                <Link
                    href="/login"
                    className={`flex items-center gap-3 mt-3 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-colors ${collapsed ? "justify-center" : ""}`}
                >
                    <LogOut className="w-4 h-4 flex-shrink-0" />
                    {!collapsed && <span>{t("sidebar", "logout", language)}</span>}
                </Link>
            </div>
        </div>
    )

    return (
        <>
            {/* Desktop sidebar */}
            <aside
                className={`hidden lg:flex flex-col bg-sidebar border-sidebar-border h-screen sticky top-0 transition-all duration-300 ${collapsed ? "w-[72px]" : "w-60"
                    } ${language === "ar" ? "border-l" : "border-r"
                    }`}
            >
                {sidebarContent}
            </aside>

            {/* Mobile overlay */}
            {mobileOpen && (
                <>
                    <div
                        className="fixed inset-0 bg-black/60 z-40 lg:hidden"
                        onClick={onMobileClose}
                    />
                    <aside className={`fixed top-0 h-full w-72 bg-sidebar border-sidebar-border z-50 lg:hidden ${language === "ar" ? "right-0 border-l" : "left-0 border-r"
                        }`}>
                        {sidebarContent}
                    </aside>
                </>
            )}
        </>
    )
}