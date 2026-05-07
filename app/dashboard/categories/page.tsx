"use client"

import { useState } from "react"
import { useDashboardStore } from "@/lib/store/dashboard"
import { Plus } from "iconoir-react"
import { t } from "@/lib/i18n/translations"

export default function CategoriesPage() {
    const categories = useDashboardStore((s) => s.managedCategories)
    const addCategory = useDashboardStore((s) => s.addCategory)
    const updateCategory = useDashboardStore((s) => s.updateCategory)
    const deleteCategory = useDashboardStore((s) => s.deleteCategory)
    const toggleCategoryVisibility = useDashboardStore((s) => s.toggleCategoryVisibility)
    const language = useDashboardStore((s) => s.language)
    const [newName, setNewName] = useState("")
    const [editingId, setEditingId] = useState<string | null>(null)
    const [editName, setEditName] = useState("")
    const [editNameAr, setEditNameAr] = useState("")
    const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

    const handleAdd = () => {
        if (!newName.trim()) return
        addCategory(newName.trim())
        setNewName("")
    }

    const handleEdit = (id: string, name: string, labelAr: string) => {
        setEditingId(id)
        setEditName(name)
        setEditNameAr(labelAr)
    }

    const handleSaveEdit = (id: string) => {
        if (editName.trim()) updateCategory(id, { name: editName.trim(), labelAr: editNameAr.trim() || editName.trim() })
        setEditingId(null)
    }

    const handleDelete = (id: string) => {
        if (confirmDelete === id) {
            deleteCategory(id)
            setConfirmDelete(null)
        } else {
            setConfirmDelete(id)
        }
    }

    return (
        <div className="max-w-2xl space-y-6">
            {/* Add new */}
            <div className="flex gap-2">
                <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                    placeholder={t("categories", "addPlaceholder", language)}
                    className="flex-1 bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <button onClick={handleAdd} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 flex items-center gap-2">
                    <Plus className="w-4 h-4" /> {t("categories", "add", language)}
                </button>
            </div>

            {/* List */}
            <div className="space-y-2">
                {categories.map((cat) => (
                    <div key={cat.id} className="bg-card border border-border rounded-xl p-4 flex items-center justify-between gap-4">
                        <div className="flex-1 min-w-0">
                            {editingId === cat.id ? (
                                <div className="space-y-2">
                                    <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && handleSaveEdit(cat.id)}
                                        className="w-full bg-input border border-border rounded-lg px-3 py-1 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                        placeholder="Name (DE)"
                                        autoFocus
                                    />
                                    <input type="text" value={editNameAr} onChange={(e) => setEditNameAr(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && handleSaveEdit(cat.id)}
                                        className="w-full bg-input border border-border rounded-lg px-3 py-1 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                        placeholder="الاسم (AR)"
                                        dir="rtl"
                                    />
                                    <div className="flex gap-2">
                                        <button onClick={() => handleSaveEdit(cat.id)} className="text-xs px-3 py-1 bg-primary text-primary-foreground rounded-lg">Save</button>
                                        <button onClick={() => setEditingId(null)} className="text-xs px-3 py-1 bg-secondary rounded-lg text-foreground">Cancel</button>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <p className="text-sm font-medium text-foreground">{cat.name} <span className="text-muted-foreground text-xs">({cat.labelAr})</span></p>
                                    <p className="text-xs text-muted-foreground">{cat.productCount} {t("categories", "products", language)}</p>
                                </div>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            <button onClick={() => toggleCategoryVisibility(cat.id)}
                                className={`text-xs px-2 py-1 rounded-full ${cat.isVisible ? "bg-green-500/10 text-green-400" : "bg-gray-500/10 text-gray-400"}`}>
                                {cat.isVisible ? t("categories", "visible", language) : t("categories", "hidden", language)}
                            </button>
                            <button onClick={() => handleEdit(cat.id, cat.name, cat.labelAr)}
                                className="text-xs px-2 py-1 bg-secondary rounded-lg text-foreground hover:bg-secondary/80">{t("categories", "edit", language)}</button>
                            <button onClick={() => handleDelete(cat.id)}
                                className={`text-xs px-2 py-1 rounded-lg ${confirmDelete === cat.id ? "bg-red-500 text-white" : "bg-red-500/10 text-red-400 hover:bg-red-500/20"}`}>
                                {confirmDelete === cat.id ? t("categories", "confirmDelete", language) : t("categories", "delete", language)}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}