"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { PizzaSlice as BurgerIcon, CoffeeCup, Leaf, FireFlame as Flame } from "iconoir-react"
import { useDashboardStore } from "@/lib/store/dashboard"
import { HOMEPAGE_ITEMS_LIMIT } from "@/lib/data/menu"
import { st } from "@/lib/i18n/storefront"

const homepageCategories = [
  { id: "beef", labelDe: "Beef Burger", labelAr: "برجر لحم", icon: BurgerIcon },
  { id: "chicken", labelDe: "Chicken Burger", labelAr: "برجر دجاج", icon: Flame },
  { id: "veggie", labelDe: "Veggie", labelAr: "نباتي", icon: Leaf },
  { id: "drinks", labelDe: "Getränke", labelAr: "مشروبات", icon: CoffeeCup },
]

export function MenuSection() {
  const [activeCategory, setActiveCategory] = useState("beef")
  const products = useDashboardStore((s) => s.products)
  const managedCategories = useDashboardStore((s) => s.managedCategories)
  const settings = useDashboardStore((s) => s.settings)
  const lang = useDashboardStore((s) => s.storefrontLang)
  const isRtl = lang === "ar"

  // تحويل المنتجات إلى تنسيق grouped حسب الفئات
  const groupedItems = useMemo(() => {
    const grouped: Record<string, typeof products> = {}
    const visibleCats = managedCategories.filter((c) => c.isVisible)

    for (const cat of visibleCats) {
      const catProducts = products.filter(
        (p) => p.categoryId === cat.id && p.isActive
      )
      if (catProducts.length > 0) {
        grouped[cat.id] = catProducts
      }
    }
    return grouped
  }, [products, managedCategories])

  return (
    <section id="menu" className="py-20 md:py-32 bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header - Restaurant Style */}
        <div className="text-center mb-12">
          <h2 className="text-5xl sm:text-6xl md:text-7xl font-black text-primary tracking-tighter mb-4">
            {st("menu.ourBurgers", lang)}
          </h2>
          <p className="text-xl text-foreground/80 max-w-3xl mx-auto font-medium">
            {st("menu.ourBurgersDesc", lang)}
          </p>
        </div>

        {/* Deal Banner - Eye-Catching */}
        <div className="mb-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-amber-400 to-primary opacity-20 animate-pulse" />
          <div className="relative p-8 text-center border-4 border-primary rounded-3xl bg-card">
            <p className="text-3xl md:text-5xl font-black text-primary tracking-tight mb-2">
              {lang === "ar" ? settings.menuDealTitleAr : settings.menuDealTitleDe}
            </p>
            <p className="text-xl md:text-2xl font-bold text-foreground">
              {(lang === "ar" ? settings.menuDealDescAr : settings.menuDealDescDe).split("€").map((part, i, arr) => i < arr.length - 1 ? <span key={i}>{part}€</span> : <span key={i} className="text-primary">{part}</span>)}
            </p>
          </div>
        </div>

        {/* Category Tabs - Bold Restaurant Style */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {homepageCategories.map((category) => {
            const Icon = category.icon
            const hasItems = (groupedItems[category.id]?.length ?? 0) > 0
            if (!hasItems) return null
            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`group flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-lg tracking-tight transition-all duration-300 ${activeCategory === category.id
                  ? "bg-primary text-primary-foreground shadow-2xl shadow-primary/50 scale-105"
                  : "bg-card border-2 border-border text-foreground hover:border-primary/50 hover:scale-105"
                  }`}
              >
                <Icon className="w-6 h-6" />
                <span>{lang === "ar" ? category.labelAr : category.labelDe}</span>
              </button>
            )
          })}
        </div>

        {/* Menu Items - Limited */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {(groupedItems[activeCategory]?.slice(0, HOMEPAGE_ITEMS_LIMIT) ?? []).map((item) => (
            <div key={item.id} className="group relative cursor-pointer">
              <div className="relative w-full aspect-video mb-4 group-hover:-translate-y-2 transition-transform duration-500">
                {item.halal && (
                  <div className="absolute bottom-2 left-2 z-20 group-hover:scale-110 transition-transform duration-300">
                    <img src="/graphics/halal logo.svg" alt="100% Halal" className="h-10 w-10 md:h-12 md:w-12 drop-shadow-lg" />
                  </div>
                )}
                {item.image && (
                  <img src={item.image} alt={item.name} className="w-full h-full object-contain drop-shadow-[0_15px_40px_rgba(0,0,0,0.3)] group-hover:drop-shadow-[0_20px_60px_rgba(0,0,0,0.4)] transition-all duration-500" style={{ filter: "drop-shadow(0 8px 20px rgba(251, 191, 36, 0.2))" }} />
                )}
              </div>
              <div className="text-center">
                <h4 className="text-xl font-black text-foreground mb-2 tracking-tight group-hover:text-primary transition-colors">{item.name}</h4>
                <p className="text-sm font-bold text-primary">
                  {item.sizes ? item.sizes.map((s) => `${s.label} ${s.price}`).join(" • ") : item.price}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Button - View All */}
        <div className="text-center mt-12">
          <Link
            href="/speisekarte"
            className="inline-flex items-center gap-2 px-10 py-5 bg-primary text-primary-foreground font-black text-lg rounded-2xl hover:bg-primary/90 active:scale-95 transition-all shadow-2xl shadow-primary/30 hover:shadow-primary/50"
          >
            {st("menu.viewAll", lang)}
          </Link>
        </div>

        {/* Sides & Extras - Floating Style */}
        <div className="mt-24 space-y-16">
          {/* Appetizers Section */}
          {(groupedItems.appetizers?.length ?? 0) > 0 && (
            <div>
              <h3 className="text-4xl md:text-5xl font-black text-primary mb-12 tracking-tighter text-center">
                {st("menu.appetizers", lang)}
              </h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
                {groupedItems.appetizers?.slice(0, HOMEPAGE_ITEMS_LIMIT).map((item) => (
                  <div key={item.id} className="group relative cursor-pointer">
                    <div className="relative w-full aspect-square mb-4 group-hover:-translate-y-2 transition-transform duration-500">
                      {item.halal && (
                        <div className="absolute bottom-2 left-2 z-20 group-hover:scale-110 transition-transform duration-300">
                          <img src="/graphics/halal logo.svg" alt="100% Halal" className="h-10 w-10 md:h-12 md:w-12 drop-shadow-lg" />
                        </div>
                      )}
                      {item.image && (
                        <img src={item.image} alt={item.name} className="w-full h-full object-contain drop-shadow-[0_15px_40px_rgba(0,0,0,0.3)] group-hover:drop-shadow-[0_20px_60px_rgba(0,0,0,0.4)] transition-all duration-500" style={{ filter: "drop-shadow(0 8px 20px rgba(251, 191, 36, 0.2))" }} />
                      )}
                    </div>
                    <div className="text-center">
                      <h4 className="text-xl font-black text-foreground mb-2 tracking-tight group-hover:text-primary transition-colors">{item.name}</h4>
                      <p className="text-sm font-bold text-primary">
                        {item.sizes ? item.sizes.map((s) => `${s.label} ${s.price}`).join(" • ") : item.price}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Fried Chicken Section */}
          {(groupedItems["fried-chicken"]?.length ?? 0) > 0 && (
            <div>
              <h3 className="text-4xl md:text-5xl font-black text-primary mb-12 tracking-tighter text-center">
                {st("menu.friedChicken", lang)}
              </h3>
              <div className="grid sm:grid-cols-2 gap-12">
                {groupedItems["fried-chicken"]?.map((item) => (
                  <div key={item.id} className="group relative cursor-pointer">
                    <div className="relative w-full aspect-video mb-6 group-hover:-translate-y-2 transition-transform duration-500">
                      {item.halal && (
                        <div className="absolute bottom-2 left-2 z-20 group-hover:scale-110 transition-transform duration-300">
                          <img src="/graphics/halal logo.svg" alt="100% Halal" className="h-12 w-12 md:h-14 md:w-14 drop-shadow-lg" />
                        </div>
                      )}
                      {item.image && (
                        <img src={item.image} alt={item.name} className="w-full h-full object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.3)] group-hover:drop-shadow-[0_25px_70px_rgba(0,0,0,0.4)] transition-all duration-500" style={{ filter: "drop-shadow(0 10px 25px rgba(251, 191, 36, 0.25))" }} />
                      )}
                    </div>
                    <div className="text-center">
                      <h4 className="text-2xl lg:text-3xl font-black text-foreground mb-3 tracking-tight group-hover:text-primary transition-colors">{item.name}</h4>
                      <p className="text-lg font-bold text-primary">
                        {item.sizes ? item.sizes.map((s) => `${s.label} ${s.price}`).join(" • ") : item.price}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Dips Section - Restaurant Menu Style */}
        {(groupedItems.dips?.length ?? 0) > 0 && (
          <div className="mt-16">
            <h3 className="text-4xl md:text-5xl font-black text-primary mb-12 tracking-tighter text-center">
              {st("menu.sauces", lang)}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
              {groupedItems.dips?.slice(0, HOMEPAGE_ITEMS_LIMIT).map((dip) => (
                <div key={dip.id} className="group cursor-pointer">
                  <div className="relative w-full aspect-square mb-3">
                    <img src="/graphics/dips.svg" alt={dip.name} className="w-full h-full object-contain group-hover:-translate-y-1 transition-transform duration-300" />
                  </div>
                  <div className="text-center">
                    <p className="text-foreground font-bold text-sm mb-1 group-hover:text-primary transition-colors">
                      {dip.name}
                    </p>
                    <p className="text-primary font-black text-lg">{dip.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Second CTA - View Full Menu */}
        <div className="text-center mt-16">
          <Link
            href="/speisekarte"
            className="inline-flex items-center gap-2 px-10 py-5 bg-primary text-primary-foreground font-black text-lg rounded-2xl hover:bg-primary/90 active:scale-95 transition-all shadow-2xl shadow-primary/30 hover:shadow-primary/50"
          >
            {st("menu.viewAll", lang)}
          </Link>
        </div>
      </div>
    </section>
  )
}