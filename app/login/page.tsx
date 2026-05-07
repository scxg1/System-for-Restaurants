"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { sanitizeEmail, sanitizeText, isValidEmail, generateSessionId } from "@/lib/utils/sanitize"

const ADMIN_EMAIL = "owner@platform.com"
const ADMIN_PASS_HASH = "owner123"
const RESTAURANT_EMAIL = "admin@foodiewagon.de"
const RESTAURANT_PASS_HASH = "admin123"

export default function LoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const [suspendedInfo, setSuspendedInfo] = useState<{ note?: string } | null>(null)

    const getRestaurantStatus = (emailAddress: string): { active: boolean; note?: string } => {
        try {
            const raw = localStorage.getItem("foodie-wagon-dashboard")
            if (!raw) return { active: true }
            const parsed = JSON.parse(raw)
            const restaurants = parsed?.state?.restaurants as Array<{ ownerEmail?: string; status?: string; adminNote?: string }> | undefined
            if (!restaurants) return { active: true }
            const restaurant = restaurants.find((r) => r.ownerEmail === emailAddress)
            if (!restaurant) return { active: true }
            return { active: restaurant.status === "active" || restaurant.status === "trial", note: restaurant.adminNote }
        } catch {
            return { active: true }
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setSuspendedInfo(null)
        setLoading(true)

        const cleanEmail = sanitizeEmail(email)

        if (!isValidEmail(cleanEmail)) {
            setError("Ungültige E-Mail-Adresse")
            setLoading(false)
            return
        }

        if (password.length < 4) {
            setError("Ungültige Anmeldedaten")
            setLoading(false)
            return
        }

        await new Promise((r) => setTimeout(r, 500))

        if (cleanEmail === ADMIN_EMAIL && password === ADMIN_PASS_HASH) {
            const sessionId = generateSessionId()
            localStorage.setItem("role", "super_admin")
            localStorage.setItem("email", cleanEmail)
            localStorage.setItem("sessionId", sessionId)
            router.push("/admin")
            setLoading(false)
            return
        }

        if (cleanEmail === RESTAURANT_EMAIL && password === RESTAURANT_PASS_HASH) {
            const status = getRestaurantStatus(cleanEmail)
            if (!status.active) {
                setSuspendedInfo({ note: status.note })
                setLoading(false)
                return
            }
            const sessionId = generateSessionId()
            localStorage.setItem("role", "restaurant_admin")
            localStorage.setItem("email", cleanEmail)
            localStorage.setItem("sessionId", sessionId)
            router.push("/dashboard/overview")
            setLoading(false)
            return
        }

        setError("Ungültige Anmeldedaten")
        setLoading(false)
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="w-full max-w-sm">
                <div className="text-center mb-8">
                    <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center mx-auto mb-4">
                        <span className="text-primary-foreground font-bold text-lg">FW</span>
                    </div>
                    <h1 className="text-2xl font-bold text-foreground">The Foodie Wagon</h1>
                    <p className="text-sm text-muted-foreground mt-1">Dashboard Anmeldung</p>
                </div>

                {suspendedInfo && (
                    <div className="bg-red-500/10 border border-red-500/30 text-center rounded-xl p-6 mb-4 space-y-3">
                        <div className="w-14 h-14 rounded-full bg-red-500/20 flex items-center justify-center mx-auto">
                            <svg className="w-7 h-7 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-bold text-red-400">حسابك متوقف</h3>
                        <p className="text-sm text-red-300">تم إيقاف تفعيل حسابك من قبل إدارة المنصة. لوحة التحكم غير متاحة حالياً.</p>
                        <p className="text-xs text-muted-foreground">واجهة الطلبات والمتجر تعمل بشكل طبيعي.</p>
                        {suspendedInfo.note && (
                            <div className="mt-3 p-3 bg-background/50 rounded-lg">
                                <p className="text-xs font-medium text-foreground mb-1">ملاحظة من الإدارة:</p>
                                <p className="text-sm text-foreground">{suspendedInfo.note}</p>
                            </div>
                        )}
                        <button onClick={() => setSuspendedInfo(null)} className="text-xs text-muted-foreground hover:text-foreground mt-2">
                            ← العودة لتسجيل الدخول
                        </button>
                    </div>
                )}

                {!suspendedInfo && (
                    <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-6 space-y-4">
                        {error && (
                            <div className="bg-red-500/10 text-red-400 text-sm rounded-lg px-3 py-2" role="alert">
                                {error}
                            </div>
                        )}
                        <div>
                            <label htmlFor="login-email" className="block text-sm font-medium text-foreground mb-1.5">E-Mail</label>
                            <input
                                id="login-email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(sanitizeText(e.target.value))}
                                autoComplete="email"
                                className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                placeholder="ihre@email.de"
                                required
                                maxLength={254}
                            />
                        </div>
                        <div>
                            <label htmlFor="login-password" className="block text-sm font-medium text-foreground mb-1.5">Passwort</label>
                            <input
                                id="login-password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete="current-password"
                                className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                placeholder="••••••"
                                required
                                maxLength={128}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Anmelden..." : "Anmelden"}
                        </button>
                    </form>
                )}

                <p className="text-center mt-6">
                    <a href="/" className="text-sm text-primary hover:text-primary/80 transition-colors">
                        ← Zurück zum Shop
                    </a>
                </p>
            </div>
        </div>
    )
}
