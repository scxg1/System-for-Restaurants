"use client"

const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || ""
const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || ""

export const isCloudinaryConfigured = Boolean(cloudName && uploadPreset)

export interface UploadResult {
    url: string
    publicId: string
}

export async function uploadImage(file: File, folder = "foodie-wagon"): Promise<UploadResult> {
    if (!isCloudinaryConfigured) {
        throw new Error(
            "Cloudinary is not configured. Set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET in .env.local"
        )
    }

    const maxBytes = 5 * 1024 * 1024
    if (file.size > maxBytes) {
        throw new Error("Bild ist zu groß (max 5 MB)")
    }
    if (!file.type.startsWith("image/")) {
        throw new Error("Nur Bilddateien sind erlaubt")
    }

    const form = new FormData()
    form.append("file", file)
    form.append("upload_preset", uploadPreset)
    form.append("folder", folder)

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: form,
    })

    if (!res.ok) {
        const text = await res.text()
        throw new Error(`Upload fehlgeschlagen: ${text}`)
    }

    const data = await res.json()
    return {
        url: data.secure_url as string,
        publicId: data.public_id as string,
    }
}
