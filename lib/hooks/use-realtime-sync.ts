"use client"

import { useEffect, useRef, useCallback } from "react"
import { useDashboardStore } from "@/lib/store/dashboard"

// ===== قنوات البث =====
type BroadcastEvent = {
    type: "NEW_ORDER" | "ORDER_UPDATED" | "ORDER_DELETED" | "PRODUCT_CHANGED" | "SETTINGS_CHANGED" | "BRANCH_CHANGED"
    payload?: Record<string, unknown>
}

// قناة مشتركة بين كل التبويبات
let channel: BroadcastChannel | null = null

function getChannel(): BroadcastChannel {
    if (!channel) {
        channel = new BroadcastChannel("foodie-wagon-sync")
    }
    return channel
}

// ===== بث حدث =====
export function broadcastEvent(event: BroadcastEvent): void {
    try {
        getChannel().postMessage(event)
    } catch {
        // BroadcastChannel غير مدعوم
    }
}

// ===== هوك الاستماع للتحديثات =====
export function useRealtimeSync() {
    const store = useDashboardStore
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

    // إعادة قراءة البيانات من localStorage (عند التبديل بين التبويبات)
    const rehydrate = useCallback(() => {
        try {
            const raw = localStorage.getItem("foodie-wagon-dashboard")
            if (raw) {
                const parsed = JSON.parse(raw)
                const currentState = store.getState()

                // مقارنة عدد الطلبات — إذا تغير، نعيد التحميل
                if (parsed.state?.orders?.length !== currentState.orders.length) {
                    // Zustand persist يوفر rehydrate function
                    // لكننا نستخدم طريقة أبسط: مقارنة بسيطة
                    store.persist.rehydrate()
                }
            }
        } catch {
            // تجاهل الأخطاء
        }
    }, [store])

    useEffect(() => {
        // 1. الاستماع لـ BroadcastChannel (تبويبات مختلفة)
        const ch = new BroadcastChannel("foodie-wagon-sync")
        ch.onmessage = (event: MessageEvent<BroadcastEvent>) => {
            const data = event.data
            if (data.type === "NEW_ORDER" || data.type === "ORDER_UPDATED" || data.type === "ORDER_DELETED") {
                // إعادة تحديث الطلبات من localStorage
                store.persist.rehydrate()
            }
            if (data.type === "PRODUCT_CHANGED" || data.type === "SETTINGS_CHANGED" || data.type === "BRANCH_CHANGED") {
                store.persist.rehydrate()
            }
        }

        // 2. الاستماع لـ storage event (للتبويبات القديمة)
        const handleStorage = (e: StorageEvent) => {
            if (e.key === "foodie-wagon-dashboard" && e.newValue) {
                store.persist.rehydrate()
            }
        }
        window.addEventListener("storage", handleStorage)

        // 3. إعادة التحميل عند العودة للتبويب (visibility change)
        const handleVisibility = () => {
            if (document.visibilityState === "visible") {
                rehydrate()
            }
        }
        document.addEventListener("visibilitychange", handleVisibility)

        // 4. تحديث دوري كل 30 ثانية للطلبات الحية
        intervalRef.current = setInterval(() => {
            if (document.visibilityState === "visible") {
                rehydrate()
            }
        }, 30000)

        return () => {
            ch.close()
            window.removeEventListener("storage", handleStorage)
            document.removeEventListener("visibilitychange", handleVisibility)
            if (intervalRef.current) clearInterval(intervalRef.current)
        }
    }, [store, rehydrate])
}

// ===== هوك إشعارات الطلبات الجديدة =====
export function useOrderNotifications() {
    const orders = useDashboardStore((s) => s.orders)
    const notificationSound = useDashboardStore((s) => s.settings.notificationSound)
    const notificationBrowser = useDashboardStore((s) => s.settings.notificationBrowser)
    const prevCountRef = useRef(orders.length)

    useEffect(() => {
        const currentCount = orders.length
        const prevCount = prevCountRef.current

        // إذا زاد عدد الطلبات = طلب جديد
        if (currentCount > prevCount && prevCount > 0) {
            const newOrders = orders.slice(0, currentCount - prevCount)
            const latestOrder = newOrders[0]

            if (latestOrder) {
                // صوت إشعار
                if (notificationSound) {
                    playNotificationSound()
                }

                // إشعار المتصفح
                if (notificationBrowser && Notification.permission === "granted") {
                    new Notification("🛒 طلب جديد!", {
                        body: `${latestOrder.customerName} — ${latestOrder.items.length} عنصر — ${latestOrder.total.toFixed(2)}€`,
                        tag: "new-order",
                    })
                }
            }
        }

        prevCountRef.current = currentCount
    }, [orders, notificationSound, notificationBrowser])
}

// ===== تشغيل صوت الإشعار =====
function playNotificationSound() {
    try {
        // صوت بسيط باستخدام Web Audio API
        const ctx = new AudioContext()
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.frequency.value = 880
        osc.type = "sine"
        gain.gain.value = 0.3
        osc.start()
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5)
        osc.stop(ctx.currentTime + 0.5)
    } catch {
        // تجاهل
    }
}

// ===== طلب إذن الإشعارات =====
export function requestNotificationPermission(): void {
    if (typeof window !== "undefined" && "Notification" in window) {
        if (Notification.permission === "default") {
            Notification.requestPermission()
        }
    }
}