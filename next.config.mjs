/** @type {import('next').NextConfig} */
const ContentSecurityPolicy = `
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval';
    style-src 'self' 'unsafe-inline';
    img-src 'self' data: blob: https:;
    font-src 'self' https://fonts.gstatic.com;
    connect-src 'self' https://nominatim.openstreetmap.org https://*.supabase.co wss://*.supabase.co https://api.cloudinary.com https://res.cloudinary.com;
    frame-src https://www.openstreetmap.org;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
`.replace(/\n/g, " ").trim()

const securityHeaders = [
    { key: "X-DNS-Prefetch-Control", value: "on" },
    { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
    { key: "X-XSS-Protection", value: "1; mode=block" },
    { key: "X-Frame-Options", value: "DENY" },
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(self)" },
    { key: "Content-Security-Policy", value: ContentSecurityPolicy },
]

const nextConfig = {
    images: {
        unoptimized: true,
        remotePatterns: [
            { protocol: "https", hostname: "nominatim.openstreetmap.org" },
            { protocol: "https", hostname: "res.cloudinary.com" },
        ],
    },
    async headers() {
        return [{ source: "/(.*)", headers: securityHeaders }]
    },
    poweredByHeader: false,
}

export default nextConfig
