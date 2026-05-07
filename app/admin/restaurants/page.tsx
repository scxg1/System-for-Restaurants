"use client"

import { useState } from "react"
import { useDashboardStore, planLabels, type Restaurant } from "@/lib/store/dashboard"
import { Plus, CheckCircle, XmarkCircle, Trash, Eye, Notes } from "iconoir-react"
import { sanitizeText, sanitizeEmail, isValidEmail, isValidSubdomain } from "@/lib/utils/sanitize"

export default function AdminRestaurantsPage() {
    const restaurants = useDashboardStore((s) => s.restaurants)
    const setRestaurantStatus = useDashboardStore((s) => s.setRestaurantStatus)
    const updateRestaurantNote = useDashboardStore((s) => s.updateRestaurantNote)
    const addRestaurant = useDashboardStore((s) => s.addRestaurant)
    const deleteRestaurant = useDashboardStore((s) => s.deleteRestaurant)
    const [showAdd, setShowAdd] = useState(false)
    const [name, setName] = useState("")
    const [subdomain, setSubdomain] = useState("")
    const [ownerName, setOwnerName] = useState("")
    const [ownerEmail, setOwnerEmail] = useState("")
    const [plan, setPlan] = useState<"starter" | "pro" | "business">("starter")
    const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
    const [detailRestaurant, setDetailRestaurant] = useState<Restaurant | null>(null)
    const [formError, setFormError] = useState("")
    const [editingNoteId, setEditingNoteId] = useState<string | null>(null)
    const [noteText, setNoteText] = useState("")

    const handleAdd = () => {
        setFormError("")
        const cleanName = sanitizeText(name)
        const cleanSubdomain = subdomain.trim().toLowerCase()
        const cleanOwnerName = sanitizeText(ownerName)
        const cleanOwnerEmail = sanitizeEmail(ownerEmail)

        if (!cleanName || cleanName.length < 2) {
            setFormError("Name ist erforderlich (min. 2 Zeichen)")
            return
        }
        if (!isValidSubdomain(cleanSubdomain)) {
            setFormError("Ungültige Subdomain")
            return
        }
        if (cleanOwnerEmail && !isValidEmail(cleanOwnerEmail)) {
            setFormError("Ungültige E-Mail-Adresse")
            return
        }
        if (restaurants.some((r) => r.subdomain === cleanSubdomain)) {
            setFormError("Subdomain bereits vergeben")
            return
        }

        addRestaurant({
            name: cleanName,
            subdomain: cleanSubdomain,
            plan,
            status: "active",
            ownerName: cleanOwnerName,
            ownerEmail: cleanOwnerEmail,
            createdAt: new Date().toISOString().split("T")[0],
        })
        setName(""); setSubdomain(""); setOwnerName(""); setOwnerEmail(""); setShowAdd(false)
    }

    const handleDelete = (id: string) => {
        if (confirmDelete === id) {
            deleteRestaurant(id)
            setConfirmDelete(null)
            if (detailRestaurant?.id === id) setDetailRestaurant(null)
        } else {
            setConfirmDelete(id)
            setTimeout(() => setConfirmDelete(null), 3000)
        }
    }

    const handleSaveNote = (id: string) => {
        updateRestaurantNote(id, sanitizeText(noteText))
        if (detailRestaurant?.id === id) {
            setDetailRestaurant({ ...detailRestaurant, adminNote: noteText })
        }
        setEditingNoteId(null)
    }

    const startEditNote = (r: Restaurant) => {
        setNoteText(r.adminNote || "")
        setEditingNoteId(r.id)
    }

    const handleStatusChange = (id: string, status: Restaurant["status"]) => {
        setRestaurantStatus(id, status)
        if (detailRestaurant?.id === id) {
            setDetailRestaurant({ ...detailRestaurant, status })
        }
    }

    const statusColors: Record<string, string> = {
        active: "bg-green-500/10 text-green-400",
        trial: "bg-yellow-500/10 text-yellow-400",
        inactive: "bg-red-500/10 text-red-400",
    }
    const statusLabels: Record<string, string> = {
        active: "Aktiv",
        trial: "Testphase",
        inactive: "Inaktiv",
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-lg font-bold text-foreground">Restaurantverwaltung</h2>
                    <p className="text-sm text-muted-foreground">{restaurants.length} registrierte Restaurants</p>
                </div>
                <button onClick={() => setShowAdd(!showAdd)} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 flex items-center gap-2">
                    <Plus className="w-4 h-4" /> Neues Restaurant
                </button>
            </div>

            {showAdd && (
                <div className="bg-card border border-border rounded-xl p-4 space-y-3">
                    <h3 className="text-sm font-bold text-foreground">Neues Restaurant hinzufügen</h3>
                    {formError && (
                        <div className="bg-red-500/10 text-red-400 text-sm px-3 py-2 rounded-lg">{formError}</div>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name *" maxLength={100}
                            className="bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                        <input type="text" value={subdomain} onChange={(e) => setSubdomain(e.target.value.replace(/[^a-z0-9-]/g, ""))} placeholder="Subdomain *" maxLength={63}
                            className="bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                        <input type="text" value={ownerName} onChange={(e) => setOwnerName(e.target.value)} placeholder="Besitzer" maxLength={100}
                            className="bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                        <input type="email" value={ownerEmail} onChange={(e) => setOwnerEmail(e.target.value)} placeholder="E-Mail" maxLength={254}
                            className="bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                        <select value={plan} onChange={(e) => setPlan(e.target.value as "starter" | "pro" | "business")}
                            className="bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground">
                            <option value="starter">Starter</option>
                            <option value="pro">Pro</option>
                            <option value="business">Business</option>
                        </select>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={handleAdd} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm">Speichern</button>
                        <button onClick={() => { setShowAdd(false); setFormError("") }} className="px-4 py-2 border border-border rounded-lg text-sm text-foreground">Abbrechen</button>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-card border border-border rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-border text-left">
                                    <th className="p-4 text-xs font-medium text-muted-foreground">Name</th>
                                    <th className="p-4 text-xs font-medium text-muted-foreground hidden md:table-cell">Subdomain</th>
                                    <th className="p-4 text-xs font-medium text-muted-foreground hidden sm:table-cell">Plan</th>
                                    <th className="p-4 text-xs font-medium text-muted-foreground">Status</th>
                                    <th className="p-4 text-xs font-medium text-muted-foreground">Aktionen</th>
                                </tr>
                            </thead>
                            <tbody>
                                {restaurants.map((r) => (
                                    <tr key={r.id} className="border-b border-border/50 hover:bg-secondary/30">
                                        <td className="p-4">
                                            <p className="text-sm font-medium text-foreground">{r.name}</p>
                                            <p className="text-xs text-muted-foreground">{r.ownerName} · {r.ownerEmail}</p>
                                        </td>
                                        <td className="p-4 text-sm text-muted-foreground hidden md:table-cell">{r.subdomain}</td>
                                        <td className="p-4 text-sm text-foreground hidden sm:table-cell">{planLabels[r.plan]}</td>
                                        <td className="p-4">
                                            <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[r.status]}`}>
                                                {statusLabels[r.status]}
                                            </span>
                                            {r.adminNote && <p className="text-[10px] text-yellow-400 mt-1 truncate max-w-[120px]" title={r.adminNote}>📝 {r.adminNote}</p>}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-1">
                                                <button onClick={() => { setDetailRestaurant(r); setEditingNoteId(null) }} title="Details"
                                                    className="p-1.5 rounded-lg hover:bg-secondary transition-colors">
                                                    <Eye className="w-4 h-4 text-muted-foreground" />
                                                </button>
                                                {r.status === "active" ? (
                                                    <button onClick={() => handleStatusChange(r.id, "inactive")} title="Deaktivieren"
                                                        className="p-1.5 rounded-lg hover:bg-red-500/10 transition-colors">
                                                        <XmarkCircle className="w-4 h-4 text-red-400" />
                                                    </button>
                                                ) : (
                                                    <button onClick={() => handleStatusChange(r.id, "active")} title="Aktivieren"
                                                        className="p-1.5 rounded-lg hover:bg-green-500/10 transition-colors">
                                                        <CheckCircle className="w-4 h-4 text-green-400" />
                                                    </button>
                                                )}
                                                <button onClick={() => startEditNote(r)} title="Notiz bearbeiten"
                                                    className="p-1.5 rounded-lg hover:bg-yellow-500/10 transition-colors">
                                                    <Notes className="w-4 h-4 text-yellow-400" />
                                                </button>
                                                <button onClick={() => handleDelete(r.id)}
                                                    className={`p-1.5 rounded-lg transition-colors ${confirmDelete === r.id ? "bg-red-500" : "hover:bg-red-500/10"}`}
                                                    title={confirmDelete === r.id ? "Nochmal klicken zum Löschen" : "Löschen"}>
                                                    <Trash className={`w-4 h-4 ${confirmDelete === r.id ? "text-white" : "text-red-400"}`} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="space-y-4">
                    {editingNoteId && (
                        <div className="bg-card border border-yellow-500/30 rounded-xl p-4 space-y-3">
                            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                                <Notes className="w-4 h-4 text-yellow-400" />
                                ملاحظة الإدارة
                            </h3>
                            <p className="text-xs text-muted-foreground">ستظهر هذه الملاحظة للمطعم عند محاولة تسجيل الدخول</p>
                            <textarea
                                value={noteText}
                                onChange={(e) => setNoteText(e.target.value)}
                                rows={3}
                                maxLength={500}
                                placeholder="اكتب ملاحظة تظهر لصاحب المطعم..."
                                className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                            />
                            <div className="flex gap-2">
                                <button onClick={() => handleSaveNote(editingNoteId)} className="px-4 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs">حفظ</button>
                                <button onClick={() => setEditingNoteId(null)} className="px-4 py-1.5 border border-border rounded-lg text-xs text-foreground">إلغاء</button>
                            </div>
                        </div>
                    )}

                    {detailRestaurant && !editingNoteId && (
                        <div className="bg-card border border-border rounded-xl p-4 space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="text-sm font-bold text-foreground">{detailRestaurant.name}</h3>
                                <button onClick={() => setDetailRestaurant(null)} className="text-xs text-muted-foreground hover:text-foreground">✕</button>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-xs text-muted-foreground">Status</span>
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[detailRestaurant.status]}`}>
                                        {statusLabels[detailRestaurant.status]}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-xs text-muted-foreground">Plan</span>
                                    <span className="text-xs text-foreground">{planLabels[detailRestaurant.plan]}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-xs text-muted-foreground">Besitzer</span>
                                    <span className="text-xs text-foreground">{detailRestaurant.ownerName}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-xs text-muted-foreground">E-Mail</span>
                                    <span className="text-xs text-foreground">{detailRestaurant.ownerEmail}</span>
                                </div>
                            </div>

                            {detailRestaurant.adminNote && (
                                <div className="p-3 bg-yellow-500/5 border border-yellow-500/20 rounded-lg">
                                    <p className="text-xs font-medium text-yellow-400 mb-1">ملاحظة الإدارة:</p>
                                    <p className="text-sm text-foreground">{detailRestaurant.adminNote}</p>
                                </div>
                            )}

                            <div className="pt-3 border-t border-border space-y-2">
                                <p className="text-xs font-medium text-muted-foreground">Status ändern</p>
                                <div className="flex gap-2">
                                    <button onClick={() => handleStatusChange(detailRestaurant.id, "active")}
                                        className={`flex-1 px-3 py-1.5 text-xs rounded-lg transition-colors ${detailRestaurant.status === "active" ? "bg-green-500 text-white" : "bg-green-500/10 text-green-400 hover:bg-green-500/20"}`}>
                                        Aktiv
                                    </button>
                                    <button onClick={() => handleStatusChange(detailRestaurant.id, "inactive")}
                                        className={`flex-1 px-3 py-1.5 text-xs rounded-lg transition-colors ${detailRestaurant.status === "inactive" ? "bg-red-500 text-white" : "bg-red-500/10 text-red-400 hover:bg-red-500/20"}`}>
                                        Inaktiv
                                    </button>
                                    <button onClick={() => handleStatusChange(detailRestaurant.id, "trial")}
                                        className={`flex-1 px-3 py-1.5 text-xs rounded-lg transition-colors ${detailRestaurant.status === "trial" ? "bg-yellow-500 text-white" : "bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20"}`}>
                                        Testphase
                                    </button>
                                </div>
                                <button onClick={() => startEditNote(detailRestaurant)}
                                    className="w-full px-3 py-1.5 text-xs rounded-lg bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20 transition-colors flex items-center justify-center gap-1">
                                    <Notes className="w-3.5 h-3.5" /> {detailRestaurant.adminNote ? "تعديل الملاحظة" : "إضافة ملاحظة"}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
