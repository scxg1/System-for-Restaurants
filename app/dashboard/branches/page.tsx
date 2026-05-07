"use client"

import { useState } from "react"
import { useDashboardStore } from "@/lib/store/dashboard"
import { Plus, Trash } from "iconoir-react"
import { t } from "@/lib/i18n/translations"

export default function BranchesPage() {
    const branches = useDashboardStore((s) => s.managedBranches)
    const toggleBranchActive = useDashboardStore((s) => s.toggleBranchActive)
    const addBranch = useDashboardStore((s) => s.addBranch)
    const deleteBranch = useDashboardStore((s) => s.deleteBranch)
    const language = useDashboardStore((s) => s.language)
    const [showAdd, setShowAdd] = useState(false)
    const [newName, setNewName] = useState("")
    const [newAddress, setNewAddress] = useState("")
    const [newPhone, setNewPhone] = useState("")
    const [newHours, setNewHours] = useState("")
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

    const handleAdd = () => {
        if (!newName.trim() || !newAddress.trim()) return
        addBranch({ name: newName.trim(), address: newAddress.trim(), phone: newPhone.trim(), hours: newHours.trim() || "Täglich 11–22 Uhr", isActive: true, openingHours: { Monday: { isOpen: true, open: "11:00", close: "22:00" }, Tuesday: { isOpen: true, open: "11:00", close: "22:00" }, Wednesday: { isOpen: true, open: "11:00", close: "22:00" }, Thursday: { isOpen: true, open: "11:00", close: "22:00" }, Friday: { isOpen: true, open: "11:00", close: "22:00" }, Saturday: { isOpen: true, open: "11:00", close: "22:00" }, Sunday: { isOpen: true, open: "12:00", close: "21:00" } } })
        setNewName(""); setNewAddress(""); setNewPhone(""); setNewHours("")
        setShowAdd(false)
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-end">
                <button onClick={() => setShowAdd(!showAdd)} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 flex items-center gap-2">
                    <Plus className="w-4 h-4" /> {t("branches", "addBranch", language)}
                </button>
            </div>

            {showAdd && (
                <div className="bg-card border border-border rounded-xl p-4 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder={`${t("categories", "name", language)} *`}
                            className="bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                        <input type="text" value={newAddress} onChange={(e) => setNewAddress(e.target.value)} placeholder={`${t("orders", "address", language)} *`}
                            className="bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                        <input type="text" value={newPhone} onChange={(e) => setNewPhone(e.target.value)} placeholder={t("orders", "phone", language)}
                            className="bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                        <input type="text" value={newHours} onChange={(e) => setNewHours(e.target.value)} placeholder={t("settings", "hours", language)}
                            className="bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                    </div>
                    <div className="flex gap-2">
                        <button onClick={handleAdd} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm">{t("categories", "save", language)}</button>
                        <button onClick={() => setShowAdd(false)} className="px-4 py-2 border border-border rounded-lg text-sm text-foreground">{t("categories", "cancel", language)}</button>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {branches.map((branch) => (
                    <div key={branch.id} className="bg-card border border-border rounded-xl p-4 space-y-3">
                        <div className="flex items-center justify-between">
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${branch.isActive ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>
                                {branch.isActive ? `🟢 ${t("branches", "active", language)}` : `🔴 ${t("branches", "inactive", language)}`}
                            </span>
                            <div className="flex items-center gap-2">
                                <button onClick={() => toggleBranchActive(branch.id)} className="text-xs px-2 py-1 bg-secondary rounded-lg text-foreground hover:bg-secondary/80">
                                    {branch.isActive ? t("branches", "deactivate", language) : t("branches", "activate", language)}
                                </button>
                                <button
                                    onClick={() => setConfirmDeleteId(branch.id)}
                                    className="text-xs px-2 py-1 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 flex items-center gap-1"
                                    aria-label={t("branches", "delete", language)}
                                >
                                    <Trash className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>
                        <h3 className="text-sm font-bold text-foreground">{branch.name}</h3>
                        <p className="text-xs text-muted-foreground">{branch.address}</p>
                        <p className="text-xs text-muted-foreground">{branch.hours}</p>
                        <div className="flex gap-4 pt-2 border-t border-border/50">
                            <span className="text-xs text-muted-foreground">{t("branches", "todayOrders", language)}: {branch.todayOrders}</span>
                            <span className="text-xs text-muted-foreground">· {branch.todayRevenue.toFixed(2)}€</span>
                        </div>
                        {confirmDeleteId === branch.id && (
                            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 space-y-2">
                                <p className="text-xs text-red-300">{t("branches", "confirmDelete", language)}</p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => { deleteBranch(branch.id); setConfirmDeleteId(null) }}
                                        className="text-xs px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
                                    >
                                        {t("branches", "delete", language)}
                                    </button>
                                    <button
                                        onClick={() => setConfirmDeleteId(null)}
                                        className="text-xs px-3 py-1 border border-border rounded-lg text-foreground"
                                    >
                                        {t("categories", "cancel", language)}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}