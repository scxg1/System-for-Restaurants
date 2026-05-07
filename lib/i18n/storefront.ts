export type StorefrontLang = "de" | "ar"

const translations: Record<string, Record<StorefrontLang, string>> = {
    // === Header ===
    "nav.menu": { de: "Speisekarte", ar: "القائمة" },
    "nav.location": { de: "Standort", ar: "الموقع" },
    "nav.contact": { de: "Kontakt", ar: "اتصل بنا" },

    // === Hero ===
    "hero.description": {
        de: "Premium Halal Burger, knuspriges Fried Chicken und authentische Currywurst – direkt vom Foodtruck zu dir.",
        ar: "برجر حلال فاخر، دجاج مقرمش، وكاري فوست أصيل – مباشرة من عربة الطعام إليك."
    },
    "hero.viewMenu": { de: "SPEISEKARTE ANSEHEN", ar: "عرض القائمة" },
    "hero.everySaturday": { de: "Jeden Samstag", ar: "كل سبت" },
    "hero.location": { de: "Am Westpark 7, Ingolstadt", ar: "Am Westpark 7, إنغولشتات" },
    "hero.hours": { de: "11:00 - 20:00 Uhr", ar: "11:00 - 20:00" },
    "hero.stat.burgers": { de: "BURGER", ar: "برجر" },
    "hero.stat.dips": { de: "DIPS", ar: "صلصات" },
    "hero.stat.halal": { de: "HALAL", ar: "حلال" },

    // === Footer ===
    "footer.quickLinks": { de: "QUICK LINKS", ar: "روابط سريعة" },
    "footer.contact": { de: "KONTAKT", ar: "تواصل معنا" },
    "footer.rights": { de: "Alle Rechte vorbehalten.", ar: "جميع الحقوق محفوظة." },
    "footer.impressum": { de: "Impressum", ar: "بيان النشر" },
    "footer.datenschutz": { de: "Datenschutz", ar: "سياسة الخصوصية" },
    "footer.agb": { de: "AGB", ar: "الشروط والأحكام" },
    "footer.mobileExperience": { de: "Mobile Food Truck Experience", ar: "تجربة عربة طعام متنقلة" },

    // === Contact Section ===
    "contact.title": { de: "KONTAKT", ar: "اتصل بنا" },
    "contact.subtitle": {
        de: "Haben Sie Fragen oder möchten Sie uns für ein Event buchen? Kontaktieren Sie uns!",
        ar: "هل لديك أسئلة أو تريد حجزنا لمناسبة؟ تواصل معنا!"
    },
    "contact.phone": { de: "Telefon", ar: "الهاتف" },
    "contact.phoneHint": { de: "Rufen Sie uns direkt an", ar: "اتصل بنا مباشرة" },
    "contact.email": { de: "E-Mail", ar: "البريد الإلكتروني" },
    "contact.emailHint": { de: "Schreiben Sie uns eine E-Mail", ar: "أرسل لنا بريداً إلكترونياً" },
    "contact.instagram": { de: "Instagram", ar: "انستغرام" },
    "contact.instagramHint": { de: "Folgen Sie uns auf Instagram", ar: "تابعنا على انستغرام" },
    "contact.visitUs": { de: "Besuchen Sie uns", ar: "زورنا" },
    "contact.visitHint": { de: "Ansprechpartner", ar: "للتواصل" },

    // === Location Section ===
    "location.title": { de: "STANDORT", ar: "الموقع" },
    "location.subtitle": {
        de: "Finden Sie uns jeden Samstag am Saturn/Mediamarkt in Ingolstadt",
        ar: "تجدنا كل سبت عند Saturn/Mediamarkt في إنغولشتات"
    },
    "location.address": { de: "Adresse", ar: "العنوان" },
    "location.openingHours": { de: "Öffnungszeiten", ar: "ساعات العمل" },
    "location.days.sat": { de: "Samstag", ar: "السبت" },
    "location.directions": { de: "Wegbeschreibung", ar: "الاتجاهات" },
    "location.directionsHint": {
        de: "Direkt am Saturn/MediaMarkt Parkplatz im Westpark Center",
        ar: "مباشرة عند موقف Saturn/MediaMarkt في Westpark Center"
    },
    "location.getDirections": { de: "Route planen →", ar: "← احصل على الاتجاهات" },
    "location.nextTo": { de: "Neben", ar: "بجوار" },
    "location.mainLocation": { de: "Hauptstandort", ar: "الموقع الرئيسي" },
    "location.everySat": { de: "Jeden Samstag!", ar: "كل سبت!" },
    "location.visitWeekly": { de: "Besuchen Sie uns wöchentlich für frische Burger und mehr", ar: "زورنا أسبوعياً للبرجر الطازج والمزيد" },
    "location.openingHoursDetail": { de: "Samstag: 11:00 - 20:00 Uhr", ar: "السبت: 11:00 - 20:00" },
    "location.eventsTitle": { de: "Partys, Veranstaltungen & Festivals", ar: "حفلات، مناسبات ومهرجانات" },
    "location.eventsDesc": {
        de: "Wir cateren auch für Ihre privaten Events! Kontaktieren Sie uns für individuelle Angebote.",
        ar: "نقدم خدمة التموين لمناسباتك الخاصة! تواصل معنا لعروض مخصصة."
    },

    // === Menu Section ===
    "menu.title": { de: "SPEISEKARTE", ar: "القائمة" },
    "menu.subtitle": {
        de: "Entdecken Sie unser Angebot – 100% Halal, 100% Geschmack!",
        ar: "اكتشف قائمتنا – 100% حلال، 100% طعم!"
    },
    "menu.ourBurgers": { de: "UNSERE BURGER", ar: "برجراتنا" },
    "menu.ourBurgersDesc": {
        de: "Hausgemachte Beef Patties, knuspriges Fried Chicken & frische Zutaten",
        ar: "بتي لحم طازج، دجاج مقرمش ومكونات طازجة"
    },
    "menu.deal": { de: "MENÜ DEAL", ar: "عرض الوجبة" },
    "menu.dealDesc": {
        de: "Burger + Pommes + Getränk = nur €4,50",
        ar: "برجر + بطاطس + مشروب = فقط €4.50"
    },
    "menu.viewAll": { de: "Alle Speisen ansehen →", ar: "← عرض جميع الأطعمة" },
    "menu.appetizers": { de: "APPETIZERS & SIDES", ar: "مقبلات وأطباق جانبية" },
    "menu.friedChicken": { de: "FRIED CHICKEN", ar: "دجاج مقلي" },
    "menu.sauces": { de: "SAUCEN & DIPS", ar: "صلصات وتغميسات" },

    // === Product Card ===
    "product.addToCart": { de: "In den Warenkorb", ar: "أضف للسلة" },
    "product.soldOut": { de: "Ausverkauft", ar: "نفذ" },
    "product.selectSize": { de: "Größe wählen", ar: "اختر الحجم" },
    "product.halal": { de: "Halal", ar: "حلال" },
    "product.added": { de: "Hinzugefügt!", ar: "تمت الإضافة!" },
    "product.add": { de: "Hinzufügen", ar: "إضافة" },

    // === Cart ===
    "cart.title": { de: "Warenkorb", ar: "السلة" },
    "cart.empty": { de: "Ihr Warenkorb ist leer", ar: "سلتك فارغة" },
    "cart.emptyHint": { de: "Fügen Sie Artikel aus der Speisekarte hinzu", ar: "أضف عناصر من القائمة" },
    "cart.total": { de: "Gesamt", ar: "المجموع" },
    "cart.checkout": { de: "Zur Kasse", ar: "الدفع" },
    "cart.removeItem": { de: "Entfernen", ar: "حذف" },
    "cart.items": { de: "Artikel", ar: "عنصر" },

    // === Checkout ===
    "checkout.title": { de: "Bestellung aufgeben", ar: "تقديم الطلب" },
    "checkout.name": { de: "Name", ar: "الاسم" },
    "checkout.phone": { de: "Telefon", ar: "الهاتف" },
    "checkout.email": { de: "E-Mail (optional)", ar: "البريد الإلكتروني (اختياري)" },
    "checkout.address": { de: "Lieferadresse", ar: "عنوان التوصيل" },
    "checkout.addressHint": { de: "Straße, Hausnummer, PLZ", ar: "الشارع، رقم المنزل، الرمز البريدي" },
    "checkout.pickup": { de: "Abholung", ar: "استلام" },
    "checkout.delivery": { de: "Lieferung", ar: "توصيل" },
    "checkout.payment.cash": { de: "Bar bei Abholung", ar: "نقداً عند الاستلام" },
    "checkout.payment.online": { de: "Online bezahlen", ar: "الدفع الإلكتروني" },
    "checkout.notes": { de: "Anmerkungen", ar: "ملاحظات" },
    "checkout.notesPlaceholder": { de: "Besondere Wünsche oder Allergien...", ar: "طلبات خاصة أو حساسيات..." },
    "checkout.orderTotal": { de: "Bestellsumme", ar: "إجمالي الطلب" },
    "checkout.submit": { de: "Bestellung absenden", ar: "إرسال الطلب" },
    "checkout.cancel": { de: "Abbrechen", ar: "إلغاء" },
    "checkout.success": { de: "Bestellung erfolgreich aufgegeben!", ar: "تم تقديم الطلب بنجاح!" },
    "checkout.minOrder": { de: "Mindestbestellwert", ar: "الحد الأدنى للطلب" },
    "checkout.typeTitle": { de: "Bestelltyp wählen", ar: "اختر نوع الطلب" },
    "checkout.howToOrder": { de: "Wie möchten Sie bestellen?", ar: "كيف تريد الطلب؟" },
    "checkout.pickupSelf": { de: "Selbst abholen", ar: "استلم بنفسك" },
    "checkout.deliveryToYou": { de: "Wir liefern zu Ihnen", ar: "نوصلك لعنوانك" },
    "checkout.summaryTitle": { de: "Bestellübersicht", ar: "ملخص الطلب" },
    "checkout.successTitle": { de: "Vielen Dank! 🎉", ar: "شكراً لك! 🎉" },
    "checkout.successDesc": { de: "Ihre Bestellung wurde aufgenommen!", ar: "تم استلام طلبك!" },
    "checkout.successContact": { de: "Wir melden uns kurz bei Ihnen.", ar: "سنتواصل معك قريباً." },
    "checkout.close": { de: "Schließen", ar: "إغلاق" },
    "checkout.back": { de: "Zurück", ar: "رجوع" },
    "checkout.continue": { de: "Weiter", ar: "متابعة" },
    "checkout.confirm": { de: "Bestellung bestätigen", ar: "تأكيد الطلب" },
    "checkout.paymentMethod": { de: "Zahlungsmethode:", ar: "طريقة الدفع:" },
    "checkout.selectBranch": { de: "Standort wählen", ar: "اختر الموقع" },
    "checkout.yourName": { de: "Ihr Name", ar: "اسمك" },
    "checkout.yourPhone": { de: "Telefonnummer", ar: "رقم الهاتف" },
    "checkout.deliveryAddress": { de: "Lieferadresse", ar: "عنوان التوصيل" },

    // === Speisekarte Page ===
    "speisekarte.title": { de: "SPEISEKARTE", ar: "القائمة" },
    "speisekarte.subtitle": {
        de: "Entdecken Sie unser Angebot – 100% Halal, 100% Geschmack!",
        ar: "اكتشف قائمتنا – 100% حلال، 100% طعم!"
    },
    "speisekarte.backToMenu": { de: "Zurück zur Speisekarte", ar: "العودة للقائمة" },
    "speisekarte.back": { de: "Zurück", ar: "رجوع" },
    "speisekarte.search": { de: "Suchen...", ar: "بحث..." },
    "speisekarte.all": { de: "Alle", ar: "الكل" },
    "speisekarte.vegetarian": { de: "Vegetarisch", ar: "نباتي" },
    "speisekarte.spicy": { de: "Scharf", ar: "حار" },
    "speisekarte.noResults": { de: "Keine Ergebnisse gefunden", ar: "لا توجد نتائج" },
    "speisekarte.tryAgain": { de: "Versuchen Sie einen anderen Suchbegriff", ar: "جرب كلمة بحث أخرى" },

    // === Cart Panel ===
    "cartPanel.quantity": { de: "Menge", ar: "الكمية" },
    "cartPanel.remove": { de: "Entfernen", ar: "حذف" },

    // === Legal ===
    "legal.impressum": { de: "Impressum", ar: "بيان النشر" },
    "legal.datenschutz": { de: "Datenschutzerklärung", ar: "سياسة الخصوصية" },
    "legal.agb": { de: "Allgemeine Geschäftsbedingungen", ar: "الشروط والأحكام العامة" },
}

export function st(key: string, lang: StorefrontLang): string {
    return translations[key]?.[lang] ?? key
}