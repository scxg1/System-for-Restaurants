"use client"

import { MapPin, Clock, Phone } from "iconoir-react"
import { useDashboardStore } from "@/lib/store/dashboard"
import { st } from "@/lib/i18n/storefront"

export function LocationSection() {
  const lang = useDashboardStore((s) => s.storefrontLang)
  const settings = useDashboardStore((s) => s.settings)
  const managedBranches = useDashboardStore((s) => s.managedBranches)
  const isRtl = lang === "ar"

  const activeBranches = managedBranches.filter((b) => b.isActive)

  return (
    <section id="location" className="py-20 md:py-32 bg-background" dir={isRtl ? "rtl" : "ltr"}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <div className="flex items-center justify-center gap-4 mb-6">
            <img src="/graphics/truck.svg" alt="Food Truck" className="h-16 w-16 object-contain" />
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-primary tracking-tight">{st("location.title", lang)}</h2>
            <img src="/graphics/truck.svg" alt="Food Truck" className="h-16 w-16 object-contain transform scale-x-[-1]" />
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{st("location.subtitle", lang)}</p>
        </div>

        <div className="relative aspect-video lg:aspect-square rounded-2xl overflow-hidden bg-secondary mb-12">
          <img src="/map-of-ingolstadt-germany-westpark-area-street-map.jpg" alt="Standort Karte" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-background/40" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="relative">
              <div className="absolute -inset-4 bg-accent/30 rounded-full animate-ping" />
              <div className="relative w-12 h-12 bg-accent rounded-full flex items-center justify-center">
                <MapPin className="w-6 h-6 text-accent-foreground" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeBranches.length > 0 ? activeBranches.map((branch) => (
            <div key={branch.id} className="p-6 bg-card border border-border rounded-2xl hover:border-primary/30 transition-colors">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-accent-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-foreground mb-1 truncate">{branch.name}</h3>
                  <p className="text-sm text-muted-foreground">{branch.address}</p>
                </div>
              </div>

              {branch.hours && (
                <div className="flex items-center gap-3 mb-3 pl-14">
                  <Clock className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">{branch.hours}</span>
                </div>
              )}

              {branch.phone && (
                <div className="flex items-center gap-3 pl-14">
                  <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                  <a href={`tel:${branch.phone}`} className="text-sm text-muted-foreground hover:text-primary transition-colors">{branch.phone}</a>
                </div>
              )}
            </div>
          )) : (
            <div className="sm:col-span-2 lg:col-span-3 p-8 bg-card border border-border rounded-2xl text-center">
              <div className="flex items-start gap-4 justify-center mb-4">
                <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-accent-foreground" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">{st("location.mainLocation", lang)}</h3>
                  <p className="text-lg text-muted-foreground">
                    {settings.address.split(",").map((part, i) => (
                      <span key={i}>{part.trim()}{i < settings.address.split(",").length - 1 && <br />}</span>
                    ))}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-center gap-3 mt-4">
                <Clock className="w-5 h-5 text-primary" />
                <span className="text-muted-foreground">{st("location.openingHoursDetail", lang)}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
