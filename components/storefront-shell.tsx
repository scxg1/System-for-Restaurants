"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { Header } from "@/components/header"
import { CartDrawer, CartFloatingButton } from "@/components/cart-drawer"
import { CheckoutModal } from "@/components/checkout-modal"

export function StorefrontShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const isDashboard = pathname.startsWith("/dashboard")
    const isAdmin = pathname.startsWith("/admin")
    const isLogin = pathname === "/login"
    const showStorefront = mounted && !isDashboard && !isAdmin && !isLogin

    return (
        <>
            {showStorefront && <Header />}
            {children}
            {showStorefront && (
                <>
                    <CartDrawer />
                    <CartFloatingButton />
                    <CheckoutModal />
                </>
            )}
        </>
    )
}
