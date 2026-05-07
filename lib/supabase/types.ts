// Supabase Database Types

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
    public: {
        Tables: {
            categories: {
                Row: {
                    id: string
                    name: string
                    label_ar: string
                    is_visible: boolean
                    sort_order: number
                    created_at: string
                }
                Insert: {
                    id: string
                    name: string
                    label_ar: string
                    is_visible?: boolean
                    sort_order?: number
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    label_ar?: string
                    is_visible?: boolean
                    sort_order?: number
                    created_at?: string
                }
                Relationships: []
            }
            products: {
                Row: {
                    id: string
                    category_id: string | null
                    name: string
                    description: string
                    price: string
                    price_number: number
                    spice_level: number
                    image: string | null
                    halal: boolean
                    vegetarian: boolean
                    is_active: boolean
                    sizes: Json | null
                    sort_order: number
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id: string
                    category_id?: string | null
                    name: string
                    description?: string
                    price: string
                    price_number: number
                    spice_level?: number
                    image?: string | null
                    halal?: boolean
                    vegetarian?: boolean
                    is_active?: boolean
                    sizes?: Json | null
                    sort_order?: number
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    category_id?: string | null
                    name?: string
                    description?: string
                    price?: string
                    price_number?: number
                    spice_level?: number
                    image?: string | null
                    halal?: boolean
                    vegetarian?: boolean
                    is_active?: boolean
                    sizes?: Json | null
                    sort_order?: number
                    created_at?: string
                    updated_at?: string
                }
                Relationships: []
            }
            branches: {
                Row: {
                    id: string
                    name: string
                    address: string
                    phone: string
                    hours: string
                    is_active: boolean
                    opening_hours: Json
                    created_at: string
                }
                Insert: {
                    id: string
                    name: string
                    address: string
                    phone?: string
                    hours?: string
                    is_active?: boolean
                    opening_hours?: Json
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    address?: string
                    phone?: string
                    hours?: string
                    is_active?: boolean
                    opening_hours?: Json
                    created_at?: string
                }
                Relationships: []
            }
            orders: {
                Row: {
                    id: string
                    order_number: string
                    customer_name: string
                    customer_phone: string
                    customer_address: string | null
                    items: Json
                    total: number
                    status: string
                    type: string
                    payment_method: string
                    payment_status: string
                    branch_id: string | null
                    branch_name: string
                    notes: string | null
                    timeline: Json
                    created_at: string
                }
                Insert: {
                    id: string
                    order_number: string
                    customer_name: string
                    customer_phone: string
                    customer_address?: string | null
                    items: Json
                    total: number
                    status?: string
                    type: string
                    payment_method: string
                    payment_status?: string
                    branch_id?: string | null
                    branch_name: string
                    notes?: string | null
                    timeline?: Json
                    created_at?: string
                }
                Update: {
                    id?: string
                    order_number?: string
                    customer_name?: string
                    customer_phone?: string
                    customer_address?: string | null
                    items?: Json
                    total?: number
                    status?: string
                    type?: string
                    payment_method?: string
                    payment_status?: string
                    branch_id?: string | null
                    branch_name?: string
                    notes?: string | null
                    timeline?: Json
                    created_at?: string
                }
                Relationships: []
            }
            settings: {
                Row: {
                    id: number
                    data: Json
                    updated_at: string
                }
                Insert: {
                    id?: number
                    data: Json
                    updated_at?: string
                }
                Update: {
                    id?: number
                    data?: Json
                    updated_at?: string
                }
                Relationships: []
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}
