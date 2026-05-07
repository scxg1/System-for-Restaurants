"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, Xmark, MapPin, ShoppingBag, Language } from "iconoir-react"
import { useCartStore } from "@/lib/store/cart"
import { useDashboardStore } from "@/lib/store/dashboard"
import { st } from "@/lib/i18n/storefront"

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  const getTotalItems = useCartStore((s) => s.getTotalItems)
  const setCartOpen = useCartStore((s) => s.setCartOpen)
  const settings = useDashboardStore((s) => s.settings)
  const storefrontLang = useDashboardStore((s) => s.storefrontLang)
  const setStorefrontLang = useDashboardStore((s) => s.setStorefrontLang)
  const [itemCount, setItemCount] = useState(0)

  useEffect(() => {
    setMounted(true)
    setItemCount(getTotalItems())
  }, [getTotalItems, useCartStore.getState().items])

  const isRtl = storefrontLang === "ar"

  const isHomePage = pathname === "/"
  const speisekarteHref = isHomePage ? "#menu" : "/speisekarte"

  const handleSpeisekarteClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (isHomePage) {
      e.preventDefault()
      const el = document.getElementById("menu")
      if (el) el.scrollIntoView({ behavior: "smooth" })
    }
    setIsOpen(false)
  }

  const toggleLang = () => {
    setStorefrontLang(storefrontLang === "de" ? "ar" : "de")
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border" dir={isRtl ? "rtl" : "ltr"}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <img
              src="/graphics/fooiewagen logo.svg"
              alt={settings.name}
              className="h-12 md:h-16 w-auto"
            />
            <div className="hidden sm:block">
              <h1 className="text-primary font-bold text-xl md:text-2xl tracking-wider uppercase">{settings.name}</h1>
              <p className="text-muted-foreground text-xs tracking-widest">{settings.description}</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href={speisekarteHref}
              onClick={handleSpeisekarteClick}
              className="text-foreground hover:text-primary transition-colors font-medium tracking-wide"
            >
              {st("nav.menu", storefrontLang)}
            </Link>
            <Link
              href="#location"
              className="text-foreground hover:text-primary transition-colors font-medium tracking-wide"
            >
              {st("nav.location", storefrontLang)}
            </Link>
            <Link
              href="#contact"
              className="text-foreground hover:text-primary transition-colors font-medium tracking-wide"
            >
              {st("nav.contact", storefrontLang)}
            </Link>
            <div className="flex items-center gap-2 text-accent">
              <MapPin className="w-5 h-5" />
              <span className="text-sm font-medium">Ingolstadt</span>
            </div>
          </nav>

          {/* Right side: Lang + Cart + Halal */}
          <div className="hidden lg:flex items-center gap-4">
            <button
              onClick={toggleLang}
              className="p-2 text-foreground hover:text-primary transition-colors"
              title={storefrontLang === "de" ? "العربية" : "Deutsch"}
            >
              <Language className="w-5 h-5" />
            </button>
            {pathname === "/speisekarte" && (
              <button
                onClick={() => setCartOpen(true)}
                className="relative p-2 text-foreground hover:text-primary transition-colors"
              >
                <ShoppingBag className="w-6 h-6" />
                {mounted && itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </button>
            )}
            <img
              src="/graphics/halal logo.svg"
              alt="100% Halal"
              className="h-12 w-auto"
            />
          </div>

          {/* Mobile: Cart + Lang + Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={toggleLang}
              className="p-2 text-foreground hover:text-primary transition-colors"
              title={storefrontLang === "de" ? "العربية" : "Deutsch"}
            >
              <Language className="w-5 h-5" />
            </button>
            {pathname === "/speisekarte" && (
              <button
                onClick={() => setCartOpen(true)}
                className="relative p-2 text-foreground hover:text-primary transition-colors"
              >
                <ShoppingBag className="w-6 h-6" />
                {mounted && itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </button>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-foreground hover:text-primary transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <Xmark className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {isOpen && (
          <nav className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-4">
              <Link
                href={speisekarteHref}
                onClick={handleSpeisekarteClick}
                className="text-foreground hover:text-primary transition-colors font-medium tracking-wide py-2"
              >
                {st("nav.menu", storefrontLang)}
              </Link>
              <Link
                href="#location"
                className="text-foreground hover:text-primary transition-colors font-medium tracking-wide py-2"
                onClick={() => setIsOpen(false)}
              >
                {st("nav.location", storefrontLang)}
              </Link>
              <Link
                href="#contact"
                className="text-foreground hover:text-primary transition-colors font-medium tracking-wide py-2"
                onClick={() => setIsOpen(false)}
              >
                {st("nav.contact", storefrontLang)}
              </Link>
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="flex items-center gap-2 text-accent">
                  <MapPin className="w-5 h-5" />
                  <span className="text-sm font-medium">Ingolstadt</span>
                </div>
                <img
                  src="/graphics/halal logo.svg"
                  alt="100% Halal"
                  className="h-10 w-auto"
                />
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}