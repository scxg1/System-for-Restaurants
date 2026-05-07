"use client"

import { useState } from "react"
import { useDashboardStore } from "@/lib/store/dashboard"
import { t } from "@/lib/i18n/translations"
import { LightBulb, HalfMoon, Language } from "iconoir-react"

type Tab = "info" | "hours" | "delivery" | "payment" | "notifications" | "appearance"

export default function SettingsPage() {
    const settings = useDashboardStore((s) => s.settings)
    const updateSettings = useDashboardStore((s) => s.updateSettings)
    const language = useDashboardStore((s) => s.language)
    const setLanguage = useDashboardStore((s) => s.setLanguage)
    const storefrontLang = useDashboardStore((s) => s.storefrontLang)
    const setStorefrontLang = useDashboardStore((s) => s.setStorefrontLang)
    const theme = useDashboardStore((s) => s.theme)
    const setTheme = useDashboardStore((s) => s.setTheme)
    const [tab, setTab] = useState<Tab>("info")
    const [saved, setSaved] = useState(false)

    const save = (data: Partial<typeof settings>) => {
        updateSettings(data)
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
    }

    const tabs: { id: Tab; label: string }[] = [
        { id: "info", label: t("settings", "info", language) },
        { id: "hours", label: t("settings", "hours", language) },
        { id: "delivery", label: t("settings", "delivery", language) },
        { id: "payment", label: t("settings", "payment", language) },
        { id: "notifications", label: t("settings", "notifications", language) },
        { id: "appearance", label: t("settings", "appearance", language) },
    ]

    return (
        <div className="max-w-2xl space-y-6">
            {saved && (
                <div className="bg-green-500/10 text-green-400 text-sm px-4 py-2 rounded-lg">
                    ✓ {t("settings", "saved", language)}
                </div>
            )}
            <div className="flex gap-1 overflow-x-auto pb-1">
                {tabs.map((tb) => (
                    <button key={tb.id} onClick={() => setTab(tb.id)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-full whitespace-nowrap transition-colors ${tab === tb.id ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>
                        {tb.label}
                    </button>
                ))}
            </div>

            {tab === "info" && (
                <div className="bg-card border border-border rounded-xl p-4 space-y-3">
                    {(["name", "description", "address", "phone", "email", "website", "instagram", "whatsapp"] as const).map((field) => (
                        <div key={field}>
                            <label className="block text-xs font-medium text-muted-foreground mb-1">{t("settings", field, language)}</label>
                            <input type="text" value={settings[field]} onChange={(e) => save({ [field]: e.target.value })}
                                className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                        </div>
                    ))}

                    {/* MENÜ DEAL Section */}
                    <div className="pt-4 mt-4 border-t border-border">
                        <h3 className="text-sm font-bold text-primary mb-3">{t("settings", "menuDealHeader", language)}</h3>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-xs font-medium text-muted-foreground mb-1">{t("settings", "dealTitleDe", language)}</label>
                                <input type="text" value={settings.menuDealTitleDe} onChange={(e) => save({ menuDealTitleDe: e.target.value })}
                                    className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-muted-foreground mb-1">{t("settings", "dealTitleAr", language)}</label>
                                <input type="text" value={settings.menuDealTitleAr} onChange={(e) => save({ menuDealTitleAr: e.target.value })}
                                    className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" dir="rtl" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-muted-foreground mb-1">{t("settings", "dealDescDe", language)}</label>
                                <input type="text" value={settings.menuDealDescDe} onChange={(e) => save({ menuDealDescDe: e.target.value })}
                                    className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-muted-foreground mb-1">{t("settings", "dealDescAr", language)}</label>
                                <input type="text" value={settings.menuDealDescAr} onChange={(e) => save({ menuDealDescAr: e.target.value })}
                                    className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" dir="rtl" />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {tab === "hours" && (
                <div className="bg-card border border-border rounded-xl p-4 space-y-2">
                    {settings.openingHours.map((oh, i) => (
                        <div key={oh.day} className="flex items-center gap-3 py-2 border-b border-border/50 last:border-0">
                            <label className="flex items-center gap-2 w-24">
                                <input type="checkbox" checked={oh.isOpen}
                                    onChange={(e) => {
                                        const hours = [...settings.openingHours]
                                        hours[i] = { ...hours[i], isOpen: e.target.checked }
                                        save({ openingHours: hours })
                                    }} className="w-4 h-4 rounded" />
                                <span className="text-sm text-foreground">{oh.day}</span>
                            </label>
                            {oh.isOpen && (
                                <div className="flex gap-2">
                                    <input type="time" value={oh.open}
                                        onChange={(e) => {
                                            const hours = [...settings.openingHours]
                                            hours[i] = { ...hours[i], open: e.target.value }
                                            save({ openingHours: hours })
                                        }} className="bg-input border border-border rounded px-2 py-1 text-sm text-foreground" />
                                    <span className="text-muted-foreground">–</span>
                                    <input type="time" value={oh.close}
                                        onChange={(e) => {
                                            const hours = [...settings.openingHours]
                                            hours[i] = { ...hours[i], close: e.target.value }
                                            save({ openingHours: hours })
                                        }} className="bg-input border border-border rounded px-2 py-1 text-sm text-foreground" />
                                </div>
                            )}
                            {!oh.isOpen && <span className="text-xs text-muted-foreground">{t("settings", "closed", language)}</span>}
                        </div>
                    ))}
                </div>
            )}

            {tab === "delivery" && (
                <div className="bg-card border border-border rounded-xl p-4 space-y-4">
                    <label className="flex items-center gap-2">
                        <input type="checkbox" checked={settings.deliveryEnabled} onChange={(e) => save({ deliveryEnabled: e.target.checked })} className="w-4 h-4 rounded" />
                        <span className="text-sm text-foreground">{t("settings", "deliveryEnabled", language)}</span>
                    </label>
                    {settings.deliveryEnabled && (
                        <>
                            <div>
                                <label className="block text-xs text-muted-foreground mb-1">{t("settings", "minOrder", language)}</label>
                                <input type="number" value={settings.deliveryMinOrder} onChange={(e) => save({ deliveryMinOrder: parseFloat(e.target.value) || 0 })} className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground" />
                            </div>
                            <div>
                                <label className="block text-xs text-muted-foreground mb-1">{t("settings", "deliveryFee", language)}</label>
                                <input type="number" value={settings.deliveryFee} onChange={(e) => save({ deliveryFee: parseFloat(e.target.value) || 0 })} className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground" />
                            </div>
                            <div>
                                <label className="block text-xs text-muted-foreground mb-1">{t("settings", "deliveryTime", language)}</label>
                                <input type="text" value={settings.deliveryTime} onChange={(e) => save({ deliveryTime: e.target.value })} className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground" />
                            </div>
                        </>
                    )}
                </div>
            )}

            {tab === "payment" && (
                <div className="bg-card border border-border rounded-xl p-4 space-y-4">
                    <label className="flex items-center gap-2">
                        <input type="checkbox" checked={settings.paymentCash} onChange={(e) => save({ paymentCash: e.target.checked })} className="w-4 h-4 rounded" />
                        <span className="text-sm text-foreground">{t("settings", "cashPayment", language)}</span>
                    </label>
                    <label className="flex items-center gap-2">
                        <input type="checkbox" checked={settings.paymentCard} onChange={(e) => save({ paymentCard: e.target.checked })} className="w-4 h-4 rounded" />
                        <span className="text-sm text-foreground">{t("settings", "cardPayment", language)}</span>
                    </label>
                    <div>
                        <label className="flex items-center gap-2">
                            <input type="checkbox" checked={settings.paymentOnline} onChange={(e) => save({ paymentOnline: e.target.checked })} className="w-4 h-4 rounded" />
                            <span className="text-sm text-foreground">{t("settings", "onlinePayment", language)}</span>
                        </label>
                        {!settings.paymentOnline && <p className="text-xs text-muted-foreground mt-1 ml-6">{t("settings", "comingSoon", language)}</p>}
                    </div>
                </div>
            )}

            {tab === "notifications" && (
                <div className="bg-card border border-border rounded-xl p-4 space-y-4">
                    <label className="flex items-center gap-2">
                        <input type="checkbox" checked={settings.notificationSound} onChange={(e) => save({ notificationSound: e.target.checked })} className="w-4 h-4 rounded" />
                        <span className="text-sm text-foreground">{t("settings", "orderSound", language)}</span>
                    </label>
                    <label className="flex items-center gap-2">
                        <input type="checkbox" checked={settings.notificationBrowser} onChange={(e) => save({ notificationBrowser: e.target.checked })} className="w-4 h-4 rounded" />
                        <span className="text-sm text-foreground">{t("settings", "browserNotif", language)}</span>
                    </label>
                    <div>
                        <label className="block text-xs text-muted-foreground mb-1">{t("settings", "whatsappNumber", language)}</label>
                        <input type="text" value={settings.notificationWhatsApp} onChange={(e) => save({ notificationWhatsApp: e.target.value })}
                            className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground" />
                    </div>
                </div>
            )}

            {tab === "appearance" && (
                <div className="bg-card border border-border rounded-xl p-4 space-y-6">
                    {/* المظهر */}
                    <div>
                        <h3 className="text-sm font-medium text-foreground mb-3">{t("settings", "theme", language)}</h3>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => setTheme("dark")}
                                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-colors ${theme === "dark"
                                    ? "border-primary bg-primary/10"
                                    : "border-border hover:border-muted-foreground/30"
                                    }`}
                            >
                                <HalfMoon className="w-6 h-6 text-primary" />
                                <span className="text-sm text-foreground">{t("settings", "darkMode", language)}</span>
                            </button>
                            <button
                                onClick={() => setTheme("light")}
                                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-colors ${theme === "light"
                                    ? "border-primary bg-primary/10"
                                    : "border-border hover:border-muted-foreground/30"
                                    }`}
                            >
                                <LightBulb className="w-6 h-6 text-primary" />
                                <span className="text-sm text-foreground">{t("settings", "lightMode", language)}</span>
                            </button>
                        </div>
                    </div>

                    {/* لغة لوحة التحكم */}
                    <div>
                        <h3 className="text-sm font-medium text-foreground mb-3">{t("settings", "language", language)}</h3>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => setLanguage("de")}
                                className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-colors ${language === "de"
                                    ? "border-primary bg-primary/10"
                                    : "border-border hover:border-muted-foreground/30"
                                    }`}
                            >
                                <Language className="w-5 h-5 text-primary" />
                                <div className="text-start">
                                    <p className="text-sm text-foreground font-medium">Deutsch</p>
                                    <p className="text-[10px] text-muted-foreground">German</p>
                                </div>
                            </button>
                            <button
                                onClick={() => setLanguage("ar")}
                                className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-colors ${language === "ar"
                                    ? "border-primary bg-primary/10"
                                    : "border-border hover:border-muted-foreground/30"
                                    }`}
                            >
                                <Language className="w-5 h-5 text-primary" />
                                <div className="text-start">
                                    <p className="text-sm text-foreground font-medium">العربية</p>
                                    <p className="text-[10px] text-muted-foreground">Arabic</p>
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* لغة واجهة المتجر */}
                    <div>
                        <h3 className="text-sm font-medium text-foreground mb-3">{t("settings", "storefrontLanguage", language)}</h3>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => setStorefrontLang("de")}
                                className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-colors ${storefrontLang === "de"
                                    ? "border-primary bg-primary/10"
                                    : "border-border hover:border-muted-foreground/30"
                                    }`}
                            >
                                <Language className="w-5 h-5 text-primary" />
                                <div className="text-start">
                                    <p className="text-sm text-foreground font-medium">Deutsch</p>
                                    <p className="text-[10px] text-muted-foreground">Storefront</p>
                                </div>
                            </button>
                            <button
                                onClick={() => setStorefrontLang("ar")}
                                className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-colors ${storefrontLang === "ar"
                                    ? "border-primary bg-primary/10"
                                    : "border-border hover:border-muted-foreground/30"
                                    }`}
                            >
                                <Language className="w-5 h-5 text-primary" />
                                <div className="text-start">
                                    <p className="text-sm text-foreground font-medium">العربية</p>
                                    <p className="text-[10px] text-muted-foreground">واجهة المتجر</p>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}