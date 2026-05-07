// Shared menu data for the entire application

export interface MenuItem {
    id: string
    name: string
    price: string
    priceNumber: number
    description: string
    spiceLevel?: number
    image?: string
    halal?: boolean
    vegetarian?: boolean
    sizes?: { label: string; price: string; priceNumber: number }[]
}

export interface MenuCategoryData {
    id: string
    label: string
    labelDe: string
    icon?: string
    items: MenuItem[]
}

export const categories = [
    { id: "beef", label: "Beef Burger", labelDe: "Beef Burger", labelAr: "برجر لحم" },
    { id: "chicken", label: "Chicken Burger", labelDe: "Chicken Burger", labelAr: "برجر دجاج" },
    { id: "veggie", label: "Veggie", labelDe: "Veggie", labelAr: "نباتي" },
    { id: "appetizers", label: "Appetizers & Sides", labelDe: "Appetizers & Sides", labelAr: "مقبلات وأطباق جانبية" },
    { id: "fried-chicken", label: "Fried Chicken", labelDe: "Fried Chicken", labelAr: "دجاج مقلي" },
    { id: "dips", label: "Saucen & Dips", labelDe: "Saucen & Dips", labelAr: "صلصات وتغميسات" },
    { id: "drinks", label: "Getränke", labelDe: "Getränke", labelAr: "مشروبات" },
]

export const menuItems: Record<string, MenuItem[]> = {
    beef: [
        {
            id: "cheesy-buffalo",
            name: "Cheesy Buffalo",
            price: "10,50€",
            priceNumber: 10.5,
            description: "Brioche Bun, Hausgemachte Beef Patty 140g, Käse, Burger Sauce, Gurke, Zwiebel, Tomaten, Salat",
            spiceLevel: 3,
            halal: true,
            image: "/burgers/beef/Cheesy-Buffalo_10,50euros.webp",
        },
        {
            id: "angry-bull",
            name: "Angry Bull",
            price: "12,00€",
            priceNumber: 12,
            description: "Brioche Bun, Hausgemachte Beef Patty 140g, Käse, Chili Cheese Sauce, Jalapeno, Gurke, Zwiebel, Salat",
            spiceLevel: 3,
            halal: true,
            image: "/burgers/beef/Angry-Bull_12euros.webp",
        },
        {
            id: "smokie-beefy-bbq",
            name: "Smokie Beefy BBQ",
            price: "13,00€",
            priceNumber: 13,
            description: "Brioche Bun, Hausgemachte Beef Patty 140g, Käse, Burger Sauce, Gurke, Onion Rings, Geröstete Zwiebel, BBQ Sauce, Tomaten, Salat",
            spiceLevel: 3,
            halal: true,
            image: "/burgers/beef/Smookie-Beefy-BBQ_13euros.webp",
        },
        {
            id: "blazing-nacho-beef",
            name: "Blazing Nacho Beef",
            price: "13,00€",
            priceNumber: 13,
            description: "Brioche Bun, Hausgemachte Beef Patty 140g, Käse, Burger Sauce, Gurke, Jalapeno, Nachos, Sriracha Sauce, Tomaten, Salat",
            spiceLevel: 3,
            halal: true,
            image: "/burgers/beef/Blazing-Nacho-Beef_13euros.webp",
        },
        {
            id: "cheese-burger",
            name: "Cheese Burger",
            price: "7,00€",
            priceNumber: 7,
            description: "Brioche Bun, Hausgemachte Beef Patty 140g, Käse, Burger Sauce, Gurke, Zwiebel, Tomaten, Salat",
            spiceLevel: 1,
            halal: true,
            image: "/burgers/beef/Cheese-Burger_7euros.webp",
        },
    ],
    chicken: [
        {
            id: "crunchy-chicken",
            name: "Crunchy Chicken",
            price: "8,50€",
            priceNumber: 8.5,
            description: "Brioche Bun, Chicken Strips, Käse, Burger Sauce, Salat",
            spiceLevel: 2,
            halal: true,
            image: "/burgers/chicken/Chrunchy-Chicken_8,50euros.webp",
        },
        {
            id: "loaded-crunchy",
            name: "Loaded Crunchy",
            price: "9,00€",
            priceNumber: 9,
            description: "Brioche Bun, Chicken Strips, Käse, Burger Sauce, Tomaten, Zwiebel, Gurke, Salat",
            spiceLevel: 2,
            halal: true,
            image: "/burgers/chicken/Loaded-Chrunchy_9euros.webp",
        },
        {
            id: "crispy-ringer",
            name: "Crispy Ringer",
            price: "10,00€",
            priceNumber: 10,
            description: "Brioche Bun, Chicken Strips, Käse, Burger Sauce, Onion Rings, Zwiebel, Tomaten, Salat",
            spiceLevel: 2,
            halal: true,
            image: "/burgers/chicken/Crispy-Ringer_10euros.webp",
        },
        {
            id: "mexican-cracker",
            name: "Mexican Cracker",
            price: "11,00€",
            priceNumber: 11,
            description: "Brioche Bun, Chicken Strips, Käse, Burger Sauce, Jalapeno, Gurke, Nachos, Sriracha Sauce, Zwiebel, Salat",
            spiceLevel: 2,
            halal: true,
            image: "/burgers/chicken/Mexican-Cracker_11euros.webp",
        },
        {
            id: "flip-chicken-burger",
            name: "Flip Chicken Burger",
            price: "6,00€",
            priceNumber: 6,
            description: "Brioche Bun, Chicken Strips, Käse, Burger Sauce, Salat",
            spiceLevel: 1,
            halal: true,
            image: "/burgers/chicken/Flip-Chicken-Burger_6euros.webp",
        },
        {
            id: "foodie-bomber",
            name: "Foodie Bomber",
            price: "13,00€",
            priceNumber: 13,
            description: "Brioche Bun, Chicken Strips, Käse, Chili Cheese Nuggets, Chili Cheese Sauce, Zwiebel, Jalapeno, Salat",
            spiceLevel: 2,
            halal: true,
            image: "/burgers/chicken/Foodie-Bomber-13euros.webp",
        },
    ],
    veggie: [
        {
            id: "plant-power",
            name: "Plant Power",
            price: "9,00€",
            priceNumber: 9,
            description: "Brioche Bun, Falafel, Käse, Burger Sauce, Gurke, Salat, Zwiebel, Tomaten",
            spiceLevel: 0,
            vegetarian: true,
            halal: true,
        },
        {
            id: "veggie-bbq",
            name: "Veggie BBQ",
            price: "11,00€",
            priceNumber: 11,
            description: "Brioche Bun, Falafel, Käse, Burger Sauce, Gurke, Onion Rings, Geröstete Zwiebel, BBQ Sauce, Tomaten, Salat",
            spiceLevel: 0,
            vegetarian: true,
            halal: true,
        },
    ],
    appetizers: [
        {
            id: "chili-cheese-nuggets",
            name: "Chili Cheese Nuggets",
            price: "5,00€",
            priceNumber: 5,
            description: "Knusprige Chili Cheese Nuggets",
            halal: true,
            image: "/Appetizers/Chilli-Cheese-Nuggets.webp",
            sizes: [
                { label: "6 Stk", price: "5,00€", priceNumber: 5 },
                { label: "10 Stk", price: "7,50€", priceNumber: 7.5 },
                { label: "16 Stk", price: "11,00€", priceNumber: 11 },
            ],
        },
        {
            id: "mozzarella-sticks",
            name: "Mozzarella Sticks",
            price: "5,00€",
            priceNumber: 5,
            description: "Knusprige Mozzarella Sticks",
            vegetarian: true,
            image: "/Appetizers/Mozarella-Sticks.webp",
            sizes: [
                { label: "4 Stk", price: "5,00€", priceNumber: 5 },
                { label: "8 Stk", price: "9,00€", priceNumber: 9 },
                { label: "14 Stk", price: "14,00€", priceNumber: 14 },
            ],
        },
        {
            id: "onion-rings",
            name: "Onion Rings",
            price: "4,00€",
            priceNumber: 4,
            description: "Knusprige Onion Rings",
            vegetarian: true,
            image: "/Appetizers/Onion-Rings.webp",
            sizes: [
                { label: "6 Stk", price: "4,00€", priceNumber: 4 },
                { label: "12 Stk", price: "7,00€", priceNumber: 7 },
                { label: "24 Stk", price: "12,00€", priceNumber: 12 },
            ],
        },
        {
            id: "pommes",
            name: "Pommes Portion",
            price: "3,50€",
            priceNumber: 3.5,
            description: "Knusprige Pommes frites",
            vegetarian: true,
            halal: true,
            image: "/Appetizers/Pommes_3,5euros.webp",
        },
    ],
    "fried-chicken": [
        {
            id: "chicken-wings",
            name: "Chicken Wings",
            price: "7,50€",
            priceNumber: 7.5,
            description: "Knusprige Hähnchenflügel",
            halal: true,
            image: "/Fried-Chicken/Chicken-Wings.webp",
            sizes: [
                { label: "6 Stk", price: "7,50€", priceNumber: 7.5 },
                { label: "10 Stk", price: "11,00€", priceNumber: 11 },
                { label: "20 Stk", price: "20,00€", priceNumber: 20 },
            ],
        },
        {
            id: "chicken-strips",
            name: "Chicken Strips",
            price: "6,00€",
            priceNumber: 6,
            description: "Knusprige Hähnchenstreifen",
            halal: true,
            image: "/Fried-Chicken/Chicken-Stripes.webp",
            sizes: [
                { label: "3 Stk", price: "6,00€", priceNumber: 6 },
                { label: "6 Stk", price: "11,50€", priceNumber: 11.5 },
                { label: "9 Stk", price: "16,00€", priceNumber: 16 },
            ],
        },
    ],
    dips: [
        { id: "dip-mayo", name: "Mayo", price: "0,50€", priceNumber: 0.5, description: "Klassische Mayonnaise" },
        { id: "dip-ketchup", name: "Ketchup", price: "0,50€", priceNumber: 0.5, description: "Klassischer Ketchup" },
        { id: "dip-garlic", name: "Garlic Flip", price: "1,00€", priceNumber: 1, description: "Knoblauch Sauce" },
        { id: "dip-bbq", name: "Blazing BBQ", price: "1,00€", priceNumber: 1, description: "BBQ Sauce" },
        { id: "dip-curry", name: "Super Curry", price: "1,00€", priceNumber: 1, description: "Curry Sauce" },
        { id: "dip-dragons", name: "Dragon's Flame", price: "1,00€", priceNumber: 1, description: "Extra scharfe Sauce", spiceLevel: 3 },
        { id: "dip-smokie", name: "Smokie Volcano", price: "1,00€", priceNumber: 1, description: "Rauchige Sauce" },
        { id: "dip-sweet-chili", name: "Sweet Chili Magic", price: "1,00€", priceNumber: 1, description: "Süß-scharfe Sauce", spiceLevel: 1 },
        { id: "dip-chili-cheese", name: "Tangy Chili Cheese", price: "1,00€", priceNumber: 1, description: "Chili Cheese Sauce" },
        { id: "dip-burger-sauce", name: "Foodie Burger Sauce", price: "1,00€", priceNumber: 1, description: "Unser Hausgemacht Sauce" },
    ],
    drinks: [
        { id: "drink-cola", name: "Coca Cola", price: "2,50€", priceNumber: 2.5, description: "330ml Dose", image: "/graphics/cold drinks sprite cola fanta.svg" },
        { id: "drink-cola-zero", name: "Coca Cola Zero", price: "2,50€", priceNumber: 2.5, description: "330ml Dose", image: "/graphics/cold drinks sprite cola fanta.svg" },
        { id: "drink-fanta", name: "Fanta", price: "2,50€", priceNumber: 2.5, description: "330ml Dose", image: "/graphics/cold drinks sprite cola fanta.svg" },
        { id: "drink-sprite", name: "Sprite", price: "2,50€", priceNumber: 2.5, description: "330ml Dose", image: "/graphics/cold drinks sprite cola fanta.svg" },
        { id: "drink-capri", name: "Capri Sonne", price: "1,50€", priceNumber: 1.5, description: "200ml", image: "/graphics/caprisun.svg" },
        { id: "drink-wasser", name: "Wasser", price: "2,00€", priceNumber: 2, description: "500ml", image: "/graphics/water.svg" },
        { id: "drink-mezzo", name: "Mezzo Mix", price: "2,50€", priceNumber: 2.5, description: "330ml Dose", image: "/graphics/cold drinks sprite cola fanta.svg" },
        { id: "drink-redbull", name: "Red Bull", price: "3,50€", priceNumber: 3.5, description: "250ml Dose", image: "/graphics/redbull.svg" },
    ],
}

// Homepage limit per category
export const HOMEPAGE_ITEMS_LIMIT = 4