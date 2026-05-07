"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useDashboardStore } from "@/lib/store/dashboard"
import { ArrowLeft } from "iconoir-react"
import { ImageUploader } from "@/components/dashboard/image-uploader"

export default function NewProductPage() {
    const router = useRouter()
    const addProduct = useDashboardStore((s) => s.addProduct)
    const managedCategories = useDashboardStore((s) => s.managedCategories)

    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [price, setPrice] = useState("")
    const [category, setCategory] = useState("")
    const [halal, setHalal] = useState(false)
    const [vegetarian, setVegetarian] = useState(false)
    const [spiceLevel, setSpiceLevel] = useState(0)
    const [image, setImage] = useState("")
    const [sizes, setSizes] = useState<{ label: string; price: string }[]>([])
    const [errors, setErrors] = useState<Record<string, string>>({})

    const updateSize = (index: number, field: "label" | "price", value: string) => {
        const updated = [...sizes]
        updated[index] = { ...updated[index], [field]: value }
        setSizes(updated)
    }

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {}
        if (!name.trim()) newErrors.name = "Name ist erforderlich"
        if (!price || isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
            newErrors.price = "Gültiger Preis ist erforderlich"
        }
        if (!category) newErrors.category = "Kategorie ist erforderlich"
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!validate()) return

        const priceNum = parseFloat(price)
        const priceFormatted = `${price.replace(".", ",")}€`
        const productSizes = sizes
            .filter((s) => s.label.trim() && s.price)
            .map((s) => ({
                label: s.label.trim(),
                price: `${s.price.replace(".", ",")}€`,
                priceNumber: parseFloat(s.price) || 0,
            }))

        addProduct({
            name: name.trim(),
            description: description.trim(),
            price: priceFormatted,
            priceNumber: priceNum,
            categoryId: category,
            halal,
            vegetarian,
            spiceLevel,
            image: image.trim() || undefined,
            isActive: true,
            sizes: productSizes.length > 0 ? productSizes : undefined,
        })

        router.push("/dashboard/menu")
    }

    return (
        <div className="max-w-2xl space-y-6">
            <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="w-4 h-4" /> Zurück
            </button>

            <h2 className="text-lg font-bold text-foreground">Neues Produkt hinzufügen</h2>

            <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1.5">Produktname *</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} maxLength={100}
                            className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                            placeholder="z.B. Smokie Beefy BBQ" />
                        {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1.5">Kategorie *</label>
                        <select value={category} onChange={(e) => setCategory(e.target.value)}
                            className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground">
                            <option value="">Kategorie wählen...</option>
                            {managedCategories.map((cat) => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                        {errors.category && <p className="text-xs text-red-400 mt-1">{errors.category}</p>}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Beschreibung</label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} maxLength={500}
                        className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                        placeholder="Zutaten und Beschreibung..." />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1.5">Preis (€) *</label>
                        <input type="number" step="0.01" min="0" value={price} onChange={(e) => setPrice(e.target.value)}
                            className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                            placeholder="10.50" />
                        {errors.price && <p className="text-xs text-red-400 mt-1">{errors.price}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1.5">Schärfe (0-3)</label>
                        <input type="number" min="0" max="3" value={spiceLevel} onChange={(e) => setSpiceLevel(parseInt(e.target.value) || 0)}
                            className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground" />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Produktbild</label>
                    <ImageUploader value={image} onChange={setImage} />
                </div>

                <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Größen (optional)</label>
                    {sizes.map((size, index) => (
                        <div key={index} className="flex items-center gap-2 mb-2">
                            <input type="text" value={size.label} onChange={(e) => updateSize(index, "label", e.target.value)}
                                className="flex-1 bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                placeholder="z.B. Klein / Mittel / Groß" />
                            <input type="number" step="0.01" min="0" value={size.price} onChange={(e) => updateSize(index, "price", e.target.value)}
                                className="w-24 bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                placeholder="Preis" />
                            <button type="button" onClick={() => setSizes(sizes.filter((_, i) => i !== index))}
                                className="text-red-400 hover:text-red-300 text-sm px-2">✕</button>
                        </div>
                    ))}
                    <button type="button" onClick={() => setSizes([...sizes, { label: "", price: "" }])}
                        className="text-sm text-primary hover:text-primary/80 mt-1">+ Größe hinzufügen</button>
                </div>

                <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Tags</label>
                    <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" checked={halal} onChange={(e) => setHalal(e.target.checked)} className="w-4 h-4 rounded" />
                            <span className="text-sm text-foreground">Halal</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" checked={vegetarian} onChange={(e) => setVegetarian(e.target.checked)} className="w-4 h-4 rounded" />
                            <span className="text-sm text-foreground">Vegetarisch</span>
                        </label>
                    </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-border">
                    <button type="submit" className="px-6 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90">
                        Produkt erstellen
                    </button>
                    <button type="button" onClick={() => router.back()} className="px-6 py-2 border border-border rounded-lg text-sm text-foreground">
                        Abbrechen
                    </button>
                </div>
            </form>
        </div>
    )
}
