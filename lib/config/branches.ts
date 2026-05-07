export interface Branch {
    id: string
    name: string
    address: string
    hours: string
    coordinates: { lat: number; lng: number }
    phone?: string
}

export const branches: Branch[] = [
    {
        id: "westpark",
        name: "Hauptstandort — Westpark",
        address: "Am Westpark 7, 85049 Ingolstadt",
        hours: "Sa 11–20 Uhr",
        coordinates: { lat: 48.7630, lng: 11.4250 },
        phone: "+49 176 22245627",
    },
    {
        id: "neustadt",
        name: "Standort — Neustadt",
        address: "Neustadtstraße 15, 85049 Ingolstadt",
        hours: "So–Fr 12–21 Uhr",
        coordinates: { lat: 48.7680, lng: 11.4280 },
        phone: "+49 176 22245627",
    },
    {
        id: "bahnhof",
        name: "Standort — Bahnhof",
        address: "Bahnhofstraße 30, 85049 Ingolstadt",
        hours: "Mo–Sa 11–20 Uhr",
        coordinates: { lat: 48.7550, lng: 11.4350 },
        phone: "+49 176 22245627",
    },
]
