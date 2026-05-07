"use client"

import { useRef, useState } from "react"
import { uploadImage, isCloudinaryConfigured } from "@/lib/upload/cloudinary"

interface ImageUploaderProps {
    value: string
    onChange: (url: string) => void
    disabled?: boolean
}

export function ImageUploader({ value, onChange, disabled }: ImageUploaderProps) {
    const inputRef = useRef<HTMLInputElement>(null)
    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setError(null)
        setUploading(true)
        try {
            const result = await uploadImage(file)
            onChange(result.url)
        } catch (err) {
            setError(err instanceof Error ? err.message : "Upload fehlgeschlagen")
        } finally {
            setUploading(false)
            if (inputRef.current) inputRef.current.value = ""
        }
    }

    const handleClear = () => {
        onChange("")
    }

    if (!isCloudinaryConfigured) {
        return (
            <div className="space-y-2">
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="/burgers/beef/my-burger.webp"
                    disabled={disabled}
                />
                <p className="text-xs text-muted-foreground">
                    Bild-Upload nicht konfiguriert. Setze NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME und NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET in .env.local, um Bilder direkt hochzuladen.
                </p>
            </div>
        )
    }

    return (
        <div className="space-y-3">
            {value ? (
                <div className="relative inline-block">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={value} alt="Produktbild" className="w-32 h-32 rounded-xl object-cover border border-border" />
                    <button
                        type="button"
                        onClick={handleClear}
                        className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                        aria-label="Bild entfernen"
                        disabled={disabled || uploading}
                    >
                        ✕
                    </button>
                </div>
            ) : (
                <div
                    onClick={() => !disabled && !uploading && inputRef.current?.click()}
                    className={`w-32 h-32 rounded-xl border-2 border-dashed border-border flex items-center justify-center cursor-pointer hover:border-primary transition-colors ${
                        disabled || uploading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                >
                    <span className="text-xs text-muted-foreground text-center px-2">
                        {uploading ? "Hochladen..." : "Klicken zum Hochladen"}
                    </span>
                </div>
            )}

            <div className="flex items-center gap-2">
                <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    disabled={disabled || uploading}
                    className="px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50"
                >
                    {uploading ? "Hochladen..." : value ? "Bild ändern" : "Bild hochladen"}
                </button>
                <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleSelect}
                    className="hidden"
                />
            </div>

            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full bg-input border border-border rounded-lg px-3 py-2 text-xs text-muted-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="oder URL einfügen: https://..."
                disabled={disabled || uploading}
            />

            {error && <p className="text-xs text-red-400">{error}</p>}
        </div>
    )
}
