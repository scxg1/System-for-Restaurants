const HTML_ENTITY_MAP: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#x27;",
}

const HTML_ENTITY_REGEX = /[&<>"']/g

export function sanitizeHtml(input: string): string {
    return input.replace(HTML_ENTITY_REGEX, (char) => HTML_ENTITY_MAP[char] || char)
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_REGEX = /^\+?[\d\s\-().]{6,20}$/
const SUBDOMAIN_REGEX = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/

export function sanitizeEmail(input: string): string {
    return input.trim().toLowerCase()
}

export function isValidEmail(input: string): boolean {
    return EMAIL_REGEX.test(input.trim())
}

export function isValidPhone(input: string): boolean {
    return PHONE_REGEX.test(input.trim())
}

export function isValidSubdomain(input: string): boolean {
    return SUBDOMAIN_REGEX.test(input.trim())
}

export function sanitizeText(input: string): string {
    return sanitizeHtml(input.trim().slice(0, 1000))
}

export function sanitizeNumber(input: string): number {
    const num = parseFloat(input)
    return isNaN(num) ? 0 : num
}

export function sanitizeUrl(input: string): string {
    const trimmed = input.trim()
    if (trimmed === "") return ""
    try {
        const url = new URL(trimmed)
        if (!["http:", "https:"].includes(url.protocol)) return ""
        return url.href
    } catch {
        return ""
    }
}

export function sanitizeJsonForScript<T>(data: T): string {
    return JSON.stringify(data)
        .replace(/</g, "\\u003c")
        .replace(/>/g, "\\u003e")
        .replace(/\//g, "\\u002f")
        .replace(/\u2028/g, "\\u2028")
        .replace(/\u2029/g, "\\u2029")
}

export function generateCsrfToken(): string {
    const array = new Uint8Array(32)
    crypto.getRandomValues(array)
    return Array.from(array, (b) => b.toString(16).padStart(2, "0")).join("")
}

export function generateSessionId(): string {
    const array = new Uint8Array(48)
    crypto.getRandomValues(array)
    return Array.from(array, (b) => b.toString(16).padStart(2, "0")).join("")
}
