"use client"

import { useState, useEffect } from "react"
import { Menu, LightBulb, HalfMoon, Language } from "iconoir-react"
import { NotificationBell } from "./notification-bell"
import { useDashboardStore } from "@/lib/store/dashboard"

interface TopbarProps {
    title: string
    onMenuClick: () => void
}

export function Topbar({ title, onMenuClick }: TopbarProps) {
    const [currentTime, setCurrentTime] = useState("")
    const language = useDashboardStore((s) => s.language)
    const setLanguage = useDashboardStore((s) => s.setLanguage)
    const theme = useDashboardStore((s) => s.theme)
    const setTheme = useDashboardStore((s) => s.setTheme)

    useEffect(() => {
        const locale = language === "ar" ? "ar-EG" : "de-DE"
        const update = () =>
            setCurrentTime(
                new Date().toLocaleDateString(locale, {
                    weekday: "short",
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                })
            )
        update()
        const interval = setInterval(update, 60000)
        return () => clearInterval(interval)
    }, [language])

    return (
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border">
            <div className="flex items-center justify-between h-16 px-4 lg:px-6">
                <div className="flex items-center gap-3">
                    <button
                        onClick={onMenuClick}
                        className="lg:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
                    >
                        <Menu className="w-5 h-5 text-foreground" />
                    </button>
                    <h1 className="text-lg font-bold text-foreground">{title}</h1>
                </div>

                <div className="flex items-center gap-2 sm:gap-4">
                    <span className="text-xs text-muted-foreground hidden sm:block">{currentTime}</span>

                    {/* تبديل المظهر */}
                    <button
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        className="p-2 rounded-lg hover:bg-secondary transition-colors"
                        title={theme === "dark" ? (language === "ar" ? "الوضع النهاري" : "Hellmodus") : (language === "ar" ? "الوضع الليلي" : "Dunkelmodus")}
                    >
                        {theme === "dark" ? (
                            <LightBulb className="w-5 h-5 text-primary" />
                        ) : (
                            <HalfMoon className="w-5 h-5 text-primary" />
                        )}
                    </button>

                    {/* تبديل اللغة */}
                    <button
                        onClick={() => setLanguage(language === "de" ? "ar" : "de")}
                        className="flex items-center gap-1 px-2 py-1.5 rounded-lg hover:bg-secondary transition-colors text-sm"
                        title={language === "ar" ? "Deutsch" : "العربية"}
                    >
                        <Language className="w-4 h-4 text-primary" />
                        <span className="text-xs font-medium text-foreground">
                            {language === "de" ? "AR" : "DE"}
                        </span>
                    </button>

                    <NotificationBell />
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                            <span className="text-primary text-xs font-bold">FW</span>
                        </div>
                        <span className="text-sm text-foreground hidden md:block">The Foodie Wagon</span>
                    </div>
                </div>
            </div>
        </header>
    )
}