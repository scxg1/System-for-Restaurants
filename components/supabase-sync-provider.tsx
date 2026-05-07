"use client"

import { useEffect } from "react"
import { useDashboardStore } from "@/lib/store/dashboard"
import { isSupabaseConfigured } from "@/lib/supabase/client"
import { subscribeToRealtime } from "@/lib/supabase/realtime"

export function SupabaseSyncProvider({ children }: { children: React.ReactNode }) {
    const loadFromRemote = useDashboardStore((s) => s.loadFromRemote)
    const upsertProductRemote = useDashboardStore((s) => s.upsertProductRemote)
    const removeProductRemote = useDashboardStore((s) => s.removeProductRemote)
    const upsertCategoryRemote = useDashboardStore((s) => s.upsertCategoryRemote)
    const removeCategoryRemote = useDashboardStore((s) => s.removeCategoryRemote)
    const upsertBranchRemote = useDashboardStore((s) => s.upsertBranchRemote)
    const removeBranchRemote = useDashboardStore((s) => s.removeBranchRemote)
    const upsertOrderRemote = useDashboardStore((s) => s.upsertOrderRemote)
    const removeOrderRemote = useDashboardStore((s) => s.removeOrderRemote)
    const setSettingsRemote = useDashboardStore((s) => s.setSettingsRemote)

    useEffect(() => {
        if (!isSupabaseConfigured) return

        loadFromRemote()

        const unsubscribe = subscribeToRealtime({
            onProductChange: (event, product, id) => {
                if (event === "DELETE") removeProductRemote(id)
                else if (product) upsertProductRemote(product)
            },
            onCategoryChange: (event, category, id) => {
                if (event === "DELETE") removeCategoryRemote(id)
                else if (category) upsertCategoryRemote(category)
            },
            onBranchChange: (event, branch, id) => {
                if (event === "DELETE") removeBranchRemote(id)
                else if (branch) upsertBranchRemote(branch)
            },
            onOrderChange: (event, order, id) => {
                if (event === "DELETE") removeOrderRemote(id)
                else if (order) upsertOrderRemote(order)
            },
            onSettingsChange: (settings) => {
                setSettingsRemote(settings)
            },
        })

        return unsubscribe
    }, [
        loadFromRemote,
        upsertProductRemote,
        removeProductRemote,
        upsertCategoryRemote,
        removeCategoryRemote,
        upsertBranchRemote,
        removeBranchRemote,
        upsertOrderRemote,
        removeOrderRemote,
        setSettingsRemote,
    ])

    return <>{children}</>
}
