"use client"

import { useState } from "react"
import Link from "next/link"
import { Edit, Trash, Xmark, WarningTriangle } from "iconoir-react"
import type { ManagedProduct } from "@/lib/store/dashboard"

interface ProductTableProps {
    products: ManagedProduct[]
    categoryMap: Record<string, string>
    onToggleActive: (id: string) => void
    onDelete: (id: string) => void
}

export function ProductTable({ products, categoryMap, onToggleActive, onDelete }: ProductTableProps) {
    const [deleteTarget, setDeleteTarget] = useState<ManagedProduct | null>(null)

    const handleDelete = () => {
        if (deleteTarget) {
            onDelete(deleteTarget.id)
            setDeleteTarget(null)
        }
    }

    return (
        <>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-border text-left">
                            <th className="p-4 text-xs font-medium text-muted-foreground">Bild</th>
                            <th className="p-4 text-xs font-medium text-muted-foreground">Name</th>
                            <th className="p-4 text-xs font-medium text-muted-foreground hidden sm:table-cell">Kategorie</th>
                            <th className="p-4 text-xs font-medium text-muted-foreground">Preis</th>
                            <th className="p-4 text-xs font-medium text-muted-foreground hidden md:table-cell">Halal</th>
                            <th className="p-4 text-xs font-medium text-muted-foreground">Status</th>
                            <th className="p-4 text-xs font-medium text-muted-foreground">Aktionen</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.length === 0 ? (
                            <tr><td colSpan={7} className="p-8 text-center text-muted-foreground text-sm">Keine Produkte gefunden</td></tr>
                        ) : products.map((product) => (
                            <tr key={product.id} className="border-b border-border/50 hover:bg-secondary/30">
                                <td className="p-4">
                                    {product.image ? (
                                        <img src={product.image} alt={product.name} className="w-10 h-10 rounded-lg object-cover" />
                                    ) : (
                                        <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-xs text-muted-foreground">🍕</div>
                                    )}
                                </td>
                                <td className="p-4">
                                    <p className="text-sm font-medium text-foreground">{product.name}</p>
                                    {product.description && <p className="text-xs text-muted-foreground truncate max-w-[200px]">{product.description}</p>}
                                </td>
                                <td className="p-4 text-sm text-muted-foreground hidden sm:table-cell">{categoryMap[product.categoryId] || product.categoryId}</td>
                                <td className="p-4 text-sm font-medium text-foreground">
                                    {product.sizes && product.sizes.length > 0
                                        ? product.sizes.map((s) => s.price).join(" / ")
                                        : product.price}
                                </td>
                                <td className="p-4 hidden md:table-cell">
                                    {product.halal && <span className="text-xs bg-green-500/10 text-green-400 px-2 py-0.5 rounded-full">Halal</span>}
                                </td>
                                <td className="p-4">
                                    <button onClick={() => onToggleActive(product.id)}
                                        className={`text-xs px-2 py-1 rounded-full transition-colors ${product.isActive ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>
                                        {product.isActive ? "Aktiv" : "Inaktiv"}
                                    </button>
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center gap-1">
                                        <Link
                                            href={`/dashboard/menu/${product.id}`}
                                            className="text-xs px-2 py-1 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 inline-flex items-center gap-1"
                                        >
                                            <Edit className="w-3 h-3" />
                                            <span className="hidden sm:inline">Bearbeiten</span>
                                        </Link>
                                        <button
                                            onClick={() => setDeleteTarget(product)}
                                            className="text-xs px-2 py-1 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 inline-flex items-center gap-1"
                                        >
                                            <Trash className="w-3 h-3" />
                                            <span className="hidden sm:inline">Löschen</span>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Delete Confirmation Modal */}
            {deleteTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
                    <div className="bg-card border border-border rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
                                <WarningTriangle className="w-6 h-6 text-red-400" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-foreground">Produkt löschen?</h3>
                                <p className="text-sm text-muted-foreground">Diese Aktion kann nicht rückgängig gemacht werden.</p>
                            </div>
                        </div>
                        <div className="bg-secondary/50 rounded-lg p-3 mb-4">
                            <p className="text-sm font-medium text-foreground">{deleteTarget.name}</p>
                            <p className="text-xs text-muted-foreground">{deleteTarget.price} • {categoryMap[deleteTarget.categoryId] || deleteTarget.categoryId}</p>
                        </div>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setDeleteTarget(null)}
                                className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground border border-border rounded-lg transition-colors"
                            >
                                Abbrechen
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
                            >
                                Löschen bestätigen
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}