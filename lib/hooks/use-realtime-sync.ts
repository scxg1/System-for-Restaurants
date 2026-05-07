"use client"

import { useEffect, useRef } from "react"
import { useDashboardStore } from "@/lib/store/dashboard"
import { isSupabaseConfigured } from "@/lib/supabase/client"

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

export function useRealtimeSync() {
    const store = useDashboardStore
    const loadFromRemote = useDashboardStore((s) => s.loadFromRemote)

    useEffect(() => {
        const ch = new BroadcastChannel("foodie-wagon-sync")
        ch.onmessage = (ev: MessageEvent<BroadcastEvent>) => {
            if (isSupabaseConfigured) {
                const evt = ev.data
                if (evt?.type === "NEW_ORDER" || evt?.type === "ORDER_UPDATED" || evt?.type === "ORDER_DELETED") {
                    loadFromRemote()
                    return
                }
            }
            store.persist.rehydrate()
        }

        return () => {
            ch.close()
        }
    }, [store, loadFromRemote])
}

// ===== هوك إشعارات الطلبات الجديدة =====
export function useOrderNotifications() {
    const orders = useDashboardStore((s) => s.orders)
    const notificationSound = useDashboardStore((s) => s.settings.notificationSound)
    const notificationBrowser = useDashboardStore((s) => s.settings.notificationBrowser)
    const prevCountRef = useRef<number>(orders.length)

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