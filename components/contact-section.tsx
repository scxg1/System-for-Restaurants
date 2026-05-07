"use client"

import { Phone, Mail, MapPin, Instagram } from "iconoir-react"
import { useDashboardStore } from "@/lib/store/dashboard"
import { st } from "@/lib/i18n/storefront"

export function ContactSection() {
  const settings = useDashboardStore((s) => s.settings)
  const lang = useDashboardStore((s) => s.storefrontLang)
  const isRtl = lang === "ar"

  const instagramHandle = settings.instagram
    ? `@${settings.instagram.replace(/\/$/, "").split("/").pop()}`
    : "@thefoodiewagon"

  return (
    <section id="contact" className="py-20 md:py-32 bg-card" dir={isRtl ? "rtl" : "ltr"}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-primary tracking-tight mb-4">{st("contact.title", lang)}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">{st("contact.subtitle", lang)}</p>
        </div>

        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
          {/* Phone */}
          <div className="p-8 bg-secondary rounded-2xl flex flex-col items-center text-center space-y-4 border-2 border-border hover:border-primary transition-colors">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
              <Phone className="w-8 h-8 text-primary-foreground" />
            </div>
            <div>
              <p className="text-muted-foreground text-sm mb-2">{st("contact.phone", lang)}</p>
              <a href={`tel:${settings.phone.replace(/\s/g, "")}`} className="text-2xl md:text-3xl font-black text-primary hover:text-primary/80 transition-colors">{settings.phone}</a>
            </div>
            <p className="text-sm text-muted-foreground">{st("contact.phoneHint", lang)}</p>
          </div>

          {/* Email */}
          <div className="p-8 bg-secondary rounded-2xl flex flex-col items-center text-center space-y-4 border-2 border-border hover:border-primary transition-colors">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
              <Mail className="w-8 h-8 text-primary-foreground" />
            </div>
            <div>
              <p className="text-muted-foreground text-sm mb-2">{st("contact.email", lang)}</p>
              <a href={`mailto:${settings.email}`} className="text-lg md:text-xl font-bold text-primary hover:text-primary/80 transition-colors break-all">{settings.email}</a>
            </div>
            <p className="text-sm text-muted-foreground">{st("contact.emailHint", lang)}</p>
          </div>

          {/* Instagram */}
          <div className="p-8 bg-secondary rounded-2xl flex flex-col items-center text-center space-y-4 border-2 border-border hover:border-primary transition-colors">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
              <Instagram className="w-8 h-8 text-primary-foreground" />
            </div>
            <div>
              <p className="text-muted-foreground text-sm mb-2">{st("contact.instagram", lang)}</p>
              <a href={settings.instagram || "https://instagram.com/thefoodiewagon"} target="_blank" rel="noopener noreferrer"
                className="text-lg md:text-xl font-bold text-primary hover:text-primary/80 transition-colors">{instagramHandle}</a>
            </div>
            <p className="text-sm text-muted-foreground">{st("contact.instagramHint", lang)}</p>
          </div>
        </div>

        {/* Visit Us */}
        <div className="max-w-2xl mx-auto mt-12 p-8 bg-primary/10 rounded-2xl border-2 border-primary/30 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <MapPin className="w-6 h-6 text-primary" />
            <h3 className="text-2xl font-bold text-foreground">{st("contact.visitUs", lang)}</h3>
          </div>
          <p className="text-lg text-foreground mb-2">
            <strong className="text-primary">{st("hero.everySaturday", lang)}</strong> {st("hero.hours", lang)}
          </p>
          <p className="text-muted-foreground">{st("hero.location", lang)}</p>
          <p className="text-sm text-muted-foreground mt-4">
            {st("contact.visitHint", lang)}: <strong className="text-foreground">Sohaib</strong> (FlavorBytes GmbH)
          </p>
        </div>
      </div>
    </section>
  )
}