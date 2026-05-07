"use client"

import { useState, useEffect, useCallback } from "react"
import { Xmark, MapPin, Phone, User, Truck, ShoppingBag, CheckCircle, Gps, EditPencil, ChatBubble } from "iconoir-react"
import { useCartStore } from "@/lib/store/cart"
import { useDashboardStore } from "@/lib/store/dashboard"
import { st } from "@/lib/i18n/storefront"

type OrderType = "pickup" | "delivery"
type Step = "type" | "details" | "summary" | "success"

export function CheckoutModal() {
    const { items, getTotalPrice, clearCart, setCartOpen } = useCartStore()
    const addOrder = useDashboardStore((s) => s.addOrder)
    const managedBranches = useDashboardStore((s) => s.managedBranches)
    const lang = useDashboardStore((s) => s.storefrontLang)
    const [isOpen, setIsOpen] = useState(false)
    const [step, setStep] = useState<Step>("type")
    const [orderType, setOrderType] = useState<OrderType>("pickup")
    const [selectedBranch, setSelectedBranch] = useState("")
    const [customerName, setCustomerName] = useState("")
    const [customerPhone, setCustomerPhone] = useState("")
    const [customerAddress, setCustomerAddress] = useState("")
    const [customerNotes, setCustomerNotes] = useState("")
    const [paymentMethod, setPaymentMethod] = useState<"cash" | "online">("cash")
    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number; accuracy?: number } | null>(null)
    const [isLocating, setIsLocating] = useState(false)
    const [locationError, setLocationError] = useState("")
    const [isEditingAddress, setIsEditingAddress] = useState(false)

    useEffect(() => {
        const handler = () => {
            setIsOpen(true)
            setStep("type")
        }
        window.addEventListener("open-checkout", handler)
        return () => window.removeEventListener("open-checkout", handler)
    }, [])

    useEffect(() => {
        if (!selectedBranch) {
            const activeBranches = managedBranches.filter((b) => b.isActive)
            if (activeBranches.length > 0) {
                setSelectedBranch(activeBranches[0].id)
            }
        }
    }, [managedBranches, selectedBranch])

    // Get user's GPS location with high accuracy
    const getUserLocation = useCallback(() => {
        if (!navigator.geolocation) {
            setLocationError(st("checkout.gpsNotSupported", lang))
            return
        }
        setIsLocating(true)
        setLocationError("")

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude: lat, longitude: lng, accuracy } = position.coords
                setUserLocation({ lat, lng, accuracy })
                setIsLocating(false)

                // Reverse geocode using Nominatim (free, no API key)
                try {
                    const acceptLang = lang === "ar" ? "ar,de" : "de"
                    const res = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1&zoom=18&accept-language=${acceptLang}`,
                        { headers: { "User-Agent": "TheFoodieWagon/1.0" } }
                    )
                    const data = await res.json()
                    if (data.display_name) {
                        setCustomerAddress(data.display_name)
                        setIsEditingAddress(false)
                    }
                } catch {
                    setCustomerAddress(`${lat.toFixed(6)}, ${lng.toFixed(6)}`)
                    setIsEditingAddress(false)
                }
            },
            (error) => {
                setIsLocating(false)
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        setLocationError(st("checkout.gpsDenied", lang))
                        break
                    case error.POSITION_UNAVAILABLE:
                        setLocationError(st("checkout.gpsUnavailable", lang))
                        break
                    case error.TIMEOUT:
                        setLocationError(st("checkout.gpsTimeout", lang))
                        break
                    default:
                        setLocationError(st("checkout.gpsError", lang))
                }
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
        )
    }, [lang])

    if (!isOpen) return null

    const totalPrice = getTotalPrice()
    const activeBranches = managedBranches.filter((b) => b.isActive)
    const branch = activeBranches.find((b) => b.id === selectedBranch)

    const handleClose = () => {
        setIsOpen(false)
        setStep("type")
    }

    const handleConfirm = () => {
        const orderItems = items.map((ci) => ({
            menuItemId: ci.item.id,
            name: ci.item.name,
            price: ci.selectedSize?.priceNumber ?? ci.item.priceNumber,
            quantity: ci.quantity,
            size: ci.selectedSize?.label,
        }))

        const selectedBranchData = activeBranches.find((b) => b.id === selectedBranch)
        const fullAddress = orderType === "delivery"
            ? userLocation
                ? `${customerAddress}\n📍 ${userLocation.lat.toFixed(6)}, ${userLocation.lng.toFixed(6)}`
                : customerAddress
            : undefined

        addOrder({
            customerName,
            customerPhone,
            customerAddress: fullAddress,
            items: orderItems,
            total: getTotalPrice(),
            status: "new",
            type: orderType,
            branchId: selectedBranch,
            branchName: selectedBranchData?.name ?? "Hauptstandort",
            paymentMethod: paymentMethod === "cash" ? "cash" : "online",
            paymentStatus: "pending",
            notes: customerNotes,
        })

        setStep("success")
        clearCart()
        setCartOpen(false)
    }

    const dirAttr = lang === "ar" ? "rtl" : "ltr"

    return (
        <>
            <div className="fixed inset-0 bg-black/70 z-[60]" onClick={handleClose} />
            <div className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-lg z-[60] bg-card border border-border rounded-2xl overflow-hidden flex flex-col max-h-[90vh]" dir={dirAttr}>
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-border">
                    <h2 className="text-xl font-black text-foreground">
                        {step === "type" && st("checkout.typeTitle", lang)}
                        {step === "details" && st("checkout.name", lang)}
                        {step === "summary" && st("checkout.summaryTitle", lang)}
                        {step === "success" && st("checkout.confirm", lang)}
                    </h2>
                    <button onClick={handleClose} className="p-2 hover:bg-muted rounded-lg">
                        <Xmark className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                    {/* Step 1: Order Type */}
                    {step === "type" && (
                        <div className="space-y-4">
                            <p className="text-foreground font-bold mb-4">
                                {st("checkout.howToOrder", lang)}
                            </p>
                            <button
                                onClick={() => {
                                    setOrderType("pickup")
                                    setStep("details")
                                }}
                                className={`w-full p-4 rounded-xl border-2 text-start transition-all ${orderType === "pickup"
                                    ? "border-primary bg-primary/10"
                                    : "border-border hover:border-primary/50"
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <ShoppingBag className="w-6 h-6 text-primary flex-shrink-0" />
                                    <div>
                                        <p className="font-bold text-foreground">{st("checkout.pickup", lang)}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {st("checkout.pickupSelf", lang)}
                                        </p>
                                    </div>
                                </div>
                            </button>
                            <button
                                onClick={() => {
                                    setOrderType("delivery")
                                    setStep("details")
                                }}
                                className={`w-full p-4 rounded-xl border-2 text-start transition-all ${orderType === "delivery"
                                    ? "border-primary bg-primary/10"
                                    : "border-border hover:border-primary/50"
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <Truck className="w-6 h-6 text-primary flex-shrink-0" />
                                    <div>
                                        <p className="font-bold text-foreground">{st("checkout.delivery", lang)}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {st("checkout.deliveryToYou", lang)}
                                        </p>
                                    </div>
                                </div>
                            </button>

                            {/* Branch Selector */}
                            {activeBranches.length > 1 && (
                                <div className="mt-4 space-y-2">
                                    <p className="text-sm font-bold text-foreground">
                                        {st("checkout.selectBranch", lang)}:
                                    </p>
                                    {activeBranches.map((b) => (
                                        <button
                                            key={b.id}
                                            onClick={() => setSelectedBranch(b.id)}
                                            className={`w-full p-3 rounded-xl border text-start text-sm transition-all ${selectedBranch === b.id
                                                ? "border-primary bg-primary/10"
                                                : "border-border hover:border-primary/50"
                                                }`}
                                        >
                                            <p className="font-bold text-foreground">{b.name}</p>
                                            <p className="text-muted-foreground">
                                                {b.address} • {b.hours}
                                            </p>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Step 2: Customer Details */}
                    {step === "details" && (
                        <div className="space-y-4">
                            {/* Branch Selector */}
                            <div className="space-y-2">
                                <p className="text-sm font-bold text-foreground flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-primary" />
                                    {st("checkout.selectBranch", lang)}
                                </p>
                                <div className="space-y-1.5">
                                    {activeBranches.map((b) => (
                                        <button
                                            key={b.id}
                                            onClick={() => setSelectedBranch(b.id)}
                                            className={`w-full p-2.5 rounded-lg border text-start text-sm transition-all ${selectedBranch === b.id
                                                ? "border-primary bg-primary/10"
                                                : "border-border hover:border-primary/50"
                                                }`}
                                        >
                                            <p className="font-bold text-foreground text-xs">{b.name}</p>
                                            <p className="text-muted-foreground text-xs">
                                                {b.address} • {b.hours}
                                            </p>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="relative">
                                    <User className={`absolute ${lang === "ar" ? "right-3" : "left-3"} top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground`} />
                                    <input
                                        type="text"
                                        placeholder={st("checkout.yourName", lang)}
                                        value={customerName}
                                        onChange={(e) => setCustomerName(e.target.value)}
                                        className={`w-full ${lang === "ar" ? "pr-10 pl-4" : "pl-10 pr-4"} py-3 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none`}
                                    />
                                </div>
                                <div className="relative">
                                    <Phone className={`absolute ${lang === "ar" ? "right-3" : "left-3"} top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground`} />
                                    <input
                                        type="tel"
                                        placeholder={st("checkout.yourPhone", lang)}
                                        value={customerPhone}
                                        onChange={(e) => setCustomerPhone(e.target.value)}
                                        className={`w-full ${lang === "ar" ? "pr-10 pl-4" : "pl-10 pr-4"} py-3 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none`}
                                    />
                                </div>
                                {orderType === "delivery" && (
                                    <div className="space-y-3">
                                        {/* GPS Location Button */}
                                        {!customerAddress && !isLocating && (
                                            <button
                                                onClick={getUserLocation}
                                                className="w-full p-4 rounded-xl border-2 border-dashed border-primary/50 bg-primary/5 text-start hover:bg-primary/10 transition-all"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                                                        <Gps className="w-5 h-5 text-primary" />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-foreground text-sm">{st("checkout.gpsAuto", lang)}</p>
                                                        <p className="text-xs text-muted-foreground">{st("checkout.gpsHint", lang)}</p>
                                                    </div>
                                                </div>
                                            </button>
                                        )}

                                        {/* Loading state */}
                                        {isLocating && (
                                            <div className="w-full p-4 rounded-xl border border-primary/30 bg-primary/5 flex items-center gap-3">
                                                <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                                <span className="text-sm text-foreground font-medium">{st("checkout.locating", lang)}</span>
                                            </div>
                                        )}

                                        {/* Error */}
                                        {locationError && (
                                            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                                                {locationError}
                                            </div>
                                        )}

                                        {/* Map preview with accuracy info */}
                                        {userLocation && !isEditingAddress && (
                                            <div className="space-y-2">
                                                <div className="rounded-xl overflow-hidden border border-border">
                                                    <iframe
                                                        title="Standort"
                                                        width="100%"
                                                        height="180"
                                                        style={{ border: 0 }}
                                                        loading="lazy"
                                                        src={`https://www.openstreetmap.org/export/embed.html?bbox=${userLocation.lng - 0.002}%2C${userLocation.lat - 0.0015}%2C${userLocation.lng + 0.002}%2C${userLocation.lat + 0.0015}&layer=mapnik&marker=${userLocation.lat}%2C${userLocation.lng}`}
                                                    />
                                                </div>
                                                {userLocation.accuracy !== undefined && (
                                                    <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
                                                        <span>📍 {userLocation.lat.toFixed(6)}, {userLocation.lng.toFixed(6)}</span>
                                                        <span>{st("checkout.gpsAccuracy", lang)}: ±{Math.round(userLocation.accuracy)} m</span>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Address field */}
                                        {customerAddress && (
                                            <div className="relative">
                                                <MapPin className={`absolute ${lang === "ar" ? "right-3" : "left-3"} top-3 w-5 h-5 text-primary`} />
                                                {isEditingAddress ? (
                                                    <textarea
                                                        placeholder={st("checkout.deliveryAddress", lang)}
                                                        value={customerAddress}
                                                        onChange={(e) => setCustomerAddress(e.target.value)}
                                                        rows={3}
                                                        autoFocus
                                                        className={`w-full ${lang === "ar" ? "pr-10 pl-10" : "pl-10 pr-10"} py-3 bg-background border border-primary rounded-xl text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none resize-none text-sm`}
                                                    />
                                                ) : (
                                                    <div
                                                        className={`w-full ${lang === "ar" ? "pr-10 pl-10" : "pl-10 pr-10"} py-3 bg-background border border-border rounded-xl text-foreground text-sm cursor-pointer hover:border-primary/50`}
                                                        onClick={() => setIsEditingAddress(true)}
                                                    >
                                                        <p className="leading-relaxed">{customerAddress}</p>
                                                    </div>
                                                )}
                                                <button
                                                    onClick={() => setIsEditingAddress(!isEditingAddress)}
                                                    className={`absolute ${lang === "ar" ? "left-3" : "right-3"} top-3 p-1 text-muted-foreground hover:text-primary transition-colors`}
                                                    title={isEditingAddress ? st("checkout.doneEditing", lang) : st("checkout.editAddress", lang)}
                                                >
                                                    <EditPencil className="w-4 h-4" />
                                                </button>
                                            </div>
                                        )}

                                        {/* Re-detect location button */}
                                        {customerAddress && (
                                            <button
                                                onClick={getUserLocation}
                                                className="text-xs text-primary hover:underline flex items-center gap-1"
                                            >
                                                <Gps className="w-3 h-3" />
                                                {st("checkout.gpsRedo", lang)}
                                            </button>
                                        )}

                                        {/* Manual input fallback */}
                                        {!customerAddress && !isLocating && (
                                            <div className="text-center">
                                                <button
                                                    onClick={() => {
                                                        setCustomerAddress(" ")
                                                        setIsEditingAddress(true)
                                                    }}
                                                    className="text-xs text-muted-foreground hover:text-primary transition-colors"
                                                >
                                                    {st("checkout.manualAddress", lang)}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Notes field — works for both pickup & delivery */}
                                <div className="relative">
                                    <ChatBubble className={`absolute ${lang === "ar" ? "right-3" : "left-3"} top-3 w-5 h-5 text-muted-foreground`} />
                                    <textarea
                                        placeholder={st("checkout.notesHint", lang)}
                                        value={customerNotes}
                                        onChange={(e) => setCustomerNotes(e.target.value)}
                                        rows={2}
                                        maxLength={500}
                                        className={`w-full ${lang === "ar" ? "pr-10 pl-4" : "pl-10 pr-4"} py-3 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none resize-none text-sm`}
                                    />
                                    <p className={`text-xs text-muted-foreground mt-1 ${lang === "ar" ? "text-right" : "text-left"}`}>
                                        {st("checkout.notesLabel", lang)}
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={() => setStep("type")}
                                    className="px-6 py-3 bg-muted text-foreground font-bold rounded-xl"
                                >
                                    {st("checkout.back", lang)}
                                </button>
                                <button
                                    onClick={() => setStep("summary")}
                                    disabled={!customerName || !customerPhone || (orderType === "delivery" && !customerAddress.trim())}
                                    className="flex-1 py-3 bg-primary text-primary-foreground font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {st("checkout.continue", lang)}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Summary */}
                    {step === "summary" && (
                        <div className="space-y-4">
                            <div className="p-3 bg-background rounded-xl space-y-2">
                                <p className="text-sm font-bold text-foreground">
                                    {orderType === "pickup" ? st("checkout.pickup", lang) : st("checkout.delivery", lang)}
                                    {branch && ` — ${branch.name}`}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {customerName} • {customerPhone}
                                </p>
                                {orderType === "delivery" && customerAddress && (
                                    <p className="text-sm text-muted-foreground whitespace-pre-line">
                                        {customerAddress}
                                    </p>
                                )}
                                {customerNotes && (
                                    <p className="text-sm text-muted-foreground border-t border-border/50 pt-2 mt-2">
                                        💬 {customerNotes}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                {items.map((ci) => {
                                    const price =
                                        ci.selectedSize?.priceNumber ?? ci.item.priceNumber
                                    const label = ci.selectedSize
                                        ? `${ci.item.name} (${ci.selectedSize.label})`
                                        : ci.item.name
                                    return (
                                        <div
                                            key={`${ci.item.id}-${ci.selectedSize?.label ?? "default"}`}
                                            className="flex justify-between text-sm"
                                        >
                                            <span className="text-foreground">
                                                {ci.quantity}x {label}
                                            </span>
                                            <span className="text-primary font-bold">
                                                {(price * ci.quantity)
                                                    .toFixed(2)
                                                    .replace(".", ",")}
                                                €
                                            </span>
                                        </div>
                                    )
                                })}
                                <div className="border-t border-border pt-2 flex justify-between">
                                    <span className="font-black text-foreground">{st("cart.total", lang)}:</span>
                                    <span className="font-black text-xl text-primary">
                                        {totalPrice.toFixed(2).replace(".", ",")}€
                                    </span>
                                </div>
                            </div>

                            {/* Payment Method */}
                            <div className="space-y-2">
                                <p className="text-sm font-bold text-foreground">{st("checkout.paymentMethod", lang)}</p>
                                <button
                                    onClick={() => setPaymentMethod("cash")}
                                    className={`w-full p-3 rounded-xl border text-start text-sm transition-all ${paymentMethod === "cash"
                                        ? "border-primary bg-primary/10"
                                        : "border-border hover:border-primary/50"
                                        }`}
                                >
                                    💶 {st("checkout.payment.cash", lang)}
                                </button>
                                <button
                                    onClick={() => setPaymentMethod("online")}
                                    className={`w-full p-3 rounded-xl border text-start text-sm transition-all ${paymentMethod === "online"
                                        ? "border-primary bg-primary/10"
                                        : "border-border hover:border-primary/50"
                                        }`}
                                >
                                    💳 {st("checkout.payment.online", lang)} {st("checkout.payment.onlineSoon", lang)}
                                </button>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={() => setStep("details")}
                                    className="px-6 py-3 bg-muted text-foreground font-bold rounded-xl"
                                >
                                    {st("checkout.back", lang)}
                                </button>
                                <button
                                    onClick={handleConfirm}
                                    className="flex-1 py-3 bg-primary text-primary-foreground font-black rounded-xl text-lg"
                                >
                                    {st("checkout.submit", lang)} ✓
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Success */}
                    {step === "success" && (
                        <div className="text-center py-8 space-y-4">
                            <CheckCircle className="w-20 h-20 text-green-500 mx-auto" />
                            <h3 className="text-2xl font-black text-foreground">
                                {st("checkout.successTitle", lang)}
                            </h3>
                            <p className="text-muted-foreground text-lg">
                                {st("checkout.successDesc", lang)}
                            </p>
                            <p className="text-muted-foreground">
                                {st("checkout.successContact", lang)}
                            </p>
                            <button
                                onClick={handleClose}
                                className="mt-6 px-8 py-3 bg-primary text-primary-foreground font-bold rounded-xl"
                            >
                                {st("speisekarte.backToMenu", lang)}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}
