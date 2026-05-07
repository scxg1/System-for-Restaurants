-- =====================================================================
-- The Foodie Wagon — Supabase Schema
-- Run this entire file in Supabase SQL Editor (one-time setup)
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. TABLES
-- ---------------------------------------------------------------------

-- Categories
CREATE TABLE IF NOT EXISTS public.categories (
    id           TEXT PRIMARY KEY,
    name         TEXT NOT NULL,
    label_ar     TEXT NOT NULL,
    is_visible   BOOLEAN NOT NULL DEFAULT TRUE,
    sort_order   INTEGER NOT NULL DEFAULT 0,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Products
CREATE TABLE IF NOT EXISTS public.products (
    id              TEXT PRIMARY KEY,
    category_id     TEXT REFERENCES public.categories(id) ON DELETE CASCADE,
    name            TEXT NOT NULL,
    description     TEXT NOT NULL DEFAULT '',
    price           TEXT NOT NULL,
    price_number    NUMERIC(10,2) NOT NULL,
    spice_level     INTEGER NOT NULL DEFAULT 0,
    image           TEXT,
    halal           BOOLEAN NOT NULL DEFAULT FALSE,
    vegetarian      BOOLEAN NOT NULL DEFAULT FALSE,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    sizes           JSONB,
    sort_order      INTEGER NOT NULL DEFAULT 0,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS products_category_id_idx ON public.products(category_id);

-- Branches
CREATE TABLE IF NOT EXISTS public.branches (
    id              TEXT PRIMARY KEY,
    name            TEXT NOT NULL,
    address         TEXT NOT NULL,
    phone           TEXT NOT NULL DEFAULT '',
    hours           TEXT NOT NULL DEFAULT '',
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    opening_hours   JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Orders
CREATE TABLE IF NOT EXISTS public.orders (
    id                TEXT PRIMARY KEY,
    order_number      TEXT NOT NULL UNIQUE,
    customer_name     TEXT NOT NULL,
    customer_phone    TEXT NOT NULL,
    customer_address  TEXT,
    items             JSONB NOT NULL DEFAULT '[]'::jsonb,
    total             NUMERIC(10,2) NOT NULL DEFAULT 0,
    status            TEXT NOT NULL DEFAULT 'new',
    type              TEXT NOT NULL,
    payment_method    TEXT NOT NULL,
    payment_status    TEXT NOT NULL DEFAULT 'pending',
    branch_id         TEXT,
    branch_name       TEXT NOT NULL,
    notes             TEXT,
    timeline          JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS orders_created_at_idx ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS orders_status_idx ON public.orders(status);

-- Settings (single row)
CREATE TABLE IF NOT EXISTS public.settings (
    id          INTEGER PRIMARY KEY DEFAULT 1,
    data        JSONB NOT NULL,
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT settings_singleton CHECK (id = 1)
);

-- ---------------------------------------------------------------------
-- 2. ROW LEVEL SECURITY (RLS)
-- ---------------------------------------------------------------------

ALTER TABLE public.products    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.branches    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings    ENABLE ROW LEVEL SECURITY;

-- Public can READ products, categories, branches, settings (storefront)
DROP POLICY IF EXISTS "public_read_products" ON public.products;
CREATE POLICY "public_read_products" ON public.products FOR SELECT USING (true);

DROP POLICY IF EXISTS "public_read_categories" ON public.categories;
CREATE POLICY "public_read_categories" ON public.categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "public_read_branches" ON public.branches;
CREATE POLICY "public_read_branches" ON public.branches FOR SELECT USING (true);

DROP POLICY IF EXISTS "public_read_settings" ON public.settings;
CREATE POLICY "public_read_settings" ON public.settings FOR SELECT USING (true);

-- Public can INSERT orders (customers placing orders)
DROP POLICY IF EXISTS "public_create_orders" ON public.orders;
CREATE POLICY "public_create_orders" ON public.orders FOR INSERT WITH CHECK (true);

-- Authenticated users (admin) can do everything
DROP POLICY IF EXISTS "admin_manage_products" ON public.products;
CREATE POLICY "admin_manage_products" ON public.products FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "admin_manage_categories" ON public.categories;
CREATE POLICY "admin_manage_categories" ON public.categories FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "admin_manage_branches" ON public.branches;
CREATE POLICY "admin_manage_branches" ON public.branches FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "admin_manage_settings" ON public.settings;
CREATE POLICY "admin_manage_settings" ON public.settings FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "admin_read_orders" ON public.orders;
CREATE POLICY "admin_read_orders" ON public.orders FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "admin_update_orders" ON public.orders;
CREATE POLICY "admin_update_orders" ON public.orders FOR UPDATE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "admin_delete_orders" ON public.orders;
CREATE POLICY "admin_delete_orders" ON public.orders FOR DELETE USING (auth.role() = 'authenticated');

-- ---------------------------------------------------------------------
-- 3. REALTIME PUBLICATION
-- ---------------------------------------------------------------------

DO $$
BEGIN
    EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.orders';
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$
BEGIN
    EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.products';
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$
BEGIN
    EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.categories';
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$
BEGIN
    EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.branches';
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$
BEGIN
    EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.settings';
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ---------------------------------------------------------------------
-- 4. SEED DATA — Categories
-- ---------------------------------------------------------------------

INSERT INTO public.categories (id, name, label_ar, is_visible, sort_order) VALUES
    ('beef',          'Beef Burger',         'برجر لحم',                  TRUE, 1),
    ('chicken',       'Chicken Burger',      'برجر دجاج',                 TRUE, 2),
    ('veggie',        'Veggie',              'نباتي',                     TRUE, 3),
    ('appetizers',    'Appetizers & Sides',  'مقبلات وأطباق جانبية',     TRUE, 4),
    ('fried-chicken', 'Fried Chicken',       'دجاج مقلي',                TRUE, 5),
    ('dips',          'Saucen & Dips',       'صلصات وتغميسات',           TRUE, 6),
    ('drinks',        'Getränke',            'مشروبات',                   TRUE, 7)
ON CONFLICT (id) DO NOTHING;

-- ---------------------------------------------------------------------
-- 5. SEED DATA — Branches
-- ---------------------------------------------------------------------

INSERT INTO public.branches (id, name, address, phone, hours, is_active, opening_hours) VALUES
    ('westpark',
     'Hauptstandort — Westpark',
     'Am Westpark 7, 85049 Ingolstadt',
     '+49 176 22245627',
     'Sa 11–20 Uhr',
     TRUE,
     '{"Monday":{"isOpen":false,"open":"11:00","close":"22:00"},"Tuesday":{"isOpen":false,"open":"11:00","close":"22:00"},"Wednesday":{"isOpen":true,"open":"11:00","close":"22:00"},"Thursday":{"isOpen":true,"open":"11:00","close":"22:00"},"Friday":{"isOpen":true,"open":"11:00","close":"22:00"},"Saturday":{"isOpen":true,"open":"11:00","close":"22:00"},"Sunday":{"isOpen":true,"open":"12:00","close":"21:00"}}'::jsonb
    )
ON CONFLICT (id) DO NOTHING;

-- ---------------------------------------------------------------------
-- 6. SEED DATA — Products
-- ---------------------------------------------------------------------

-- BEEF
INSERT INTO public.products (id, category_id, name, description, price, price_number, spice_level, image, halal, vegetarian, is_active, sort_order) VALUES
    ('cheesy-buffalo',     'beef', 'Cheesy Buffalo',     'Brioche Bun, Hausgemachte Beef Patty 140g, Käse, Burger Sauce, Gurke, Zwiebel, Tomaten, Salat',                                  '10,50€', 10.50, 3, '/burgers/beef/Cheesy-Buffalo_10,50euros.webp',          TRUE, FALSE, TRUE, 1),
    ('angry-bull',         'beef', 'Angry Bull',         'Brioche Bun, Hausgemachte Beef Patty 140g, Käse, Chili Cheese Sauce, Jalapeno, Gurke, Zwiebel, Salat',                            '12,00€', 12.00, 3, '/burgers/beef/Angry-Bull_12euros.webp',                 TRUE, FALSE, TRUE, 2),
    ('smokie-beefy-bbq',   'beef', 'Smokie Beefy BBQ',   'Brioche Bun, Hausgemachte Beef Patty 140g, Käse, Burger Sauce, Gurke, Onion Rings, Geröstete Zwiebel, BBQ Sauce, Tomaten, Salat', '13,00€', 13.00, 3, '/burgers/beef/Smookie-Beefy-BBQ_13euros.webp',          TRUE, FALSE, TRUE, 3),
    ('blazing-nacho-beef', 'beef', 'Blazing Nacho Beef', 'Brioche Bun, Hausgemachte Beef Patty 140g, Käse, Burger Sauce, Gurke, Jalapeno, Nachos, Sriracha Sauce, Tomaten, Salat',          '13,00€', 13.00, 3, '/burgers/beef/Blazing-Nacho-Beef_13euros.webp',         TRUE, FALSE, TRUE, 4),
    ('cheese-burger',      'beef', 'Cheese Burger',      'Brioche Bun, Hausgemachte Beef Patty 140g, Käse, Burger Sauce, Gurke, Zwiebel, Tomaten, Salat',                                  '7,00€',   7.00, 1, '/burgers/beef/Cheese-Burger_7euros.webp',               TRUE, FALSE, TRUE, 5)
ON CONFLICT (id) DO NOTHING;

-- CHICKEN
INSERT INTO public.products (id, category_id, name, description, price, price_number, spice_level, image, halal, vegetarian, is_active, sort_order) VALUES
    ('crunchy-chicken',     'chicken', 'Crunchy Chicken',     'Brioche Bun, Chicken Strips, Käse, Burger Sauce, Salat',                                                              '8,50€',  8.50, 2, '/burgers/chicken/Chrunchy-Chicken_8,50euros.webp', TRUE, FALSE, TRUE, 1),
    ('loaded-crunchy',      'chicken', 'Loaded Crunchy',      'Brioche Bun, Chicken Strips, Käse, Burger Sauce, Tomaten, Zwiebel, Gurke, Salat',                                     '9,00€',  9.00, 2, '/burgers/chicken/Loaded-Chrunchy_9euros.webp',     TRUE, FALSE, TRUE, 2),
    ('crispy-ringer',       'chicken', 'Crispy Ringer',       'Brioche Bun, Chicken Strips, Käse, Burger Sauce, Onion Rings, Zwiebel, Tomaten, Salat',                                '10,00€', 10.00, 2, '/burgers/chicken/Crispy-Ringer_10euros.webp',      TRUE, FALSE, TRUE, 3),
    ('mexican-cracker',     'chicken', 'Mexican Cracker',     'Brioche Bun, Chicken Strips, Käse, Burger Sauce, Jalapeno, Gurke, Nachos, Sriracha Sauce, Zwiebel, Salat',             '11,00€', 11.00, 2, '/burgers/chicken/Mexican-Cracker_11euros.webp',    TRUE, FALSE, TRUE, 4),
    ('flip-chicken-burger', 'chicken', 'Flip Chicken Burger', 'Brioche Bun, Chicken Strips, Käse, Burger Sauce, Salat',                                                              '6,00€',  6.00, 1, '/burgers/chicken/Flip-Chicken-Burger_6euros.webp', TRUE, FALSE, TRUE, 5),
    ('foodie-bomber',       'chicken', 'Foodie Bomber',       'Brioche Bun, Chicken Strips, Käse, Chili Cheese Nuggets, Chili Cheese Sauce, Zwiebel, Jalapeno, Salat',                '13,00€', 13.00, 2, '/burgers/chicken/Foodie-Bomber-13euros.webp',      TRUE, FALSE, TRUE, 6)
ON CONFLICT (id) DO NOTHING;

-- VEGGIE
INSERT INTO public.products (id, category_id, name, description, price, price_number, spice_level, image, halal, vegetarian, is_active, sort_order) VALUES
    ('plant-power', 'veggie', 'Plant Power', 'Brioche Bun, Falafel, Käse, Burger Sauce, Gurke, Salat, Zwiebel, Tomaten',                                  '9,00€',  9.00, 0, NULL, TRUE, TRUE, TRUE, 1),
    ('veggie-bbq',  'veggie', 'Veggie BBQ',  'Brioche Bun, Falafel, Käse, Burger Sauce, Gurke, Onion Rings, Geröstete Zwiebel, BBQ Sauce, Tomaten, Salat', '11,00€', 11.00, 0, NULL, TRUE, TRUE, TRUE, 2)
ON CONFLICT (id) DO NOTHING;

-- APPETIZERS (with sizes)
INSERT INTO public.products (id, category_id, name, description, price, price_number, spice_level, image, halal, vegetarian, is_active, sizes, sort_order) VALUES
    ('chili-cheese-nuggets', 'appetizers', 'Chili Cheese Nuggets', 'Knusprige Chili Cheese Nuggets', '5,00€', 5.00, 0, '/Appetizers/Chilli-Cheese-Nuggets.webp', TRUE,  FALSE, TRUE,
        '[{"label":"6 Stk","price":"5,00€","priceNumber":5},{"label":"10 Stk","price":"7,50€","priceNumber":7.5},{"label":"16 Stk","price":"11,00€","priceNumber":11}]'::jsonb, 1),
    ('mozzarella-sticks',    'appetizers', 'Mozzarella Sticks',    'Knusprige Mozzarella Sticks',    '5,00€', 5.00, 0, '/Appetizers/Mozarella-Sticks.webp',       FALSE, TRUE,  TRUE,
        '[{"label":"4 Stk","price":"5,00€","priceNumber":5},{"label":"8 Stk","price":"9,00€","priceNumber":9},{"label":"14 Stk","price":"14,00€","priceNumber":14}]'::jsonb, 2),
    ('onion-rings',          'appetizers', 'Onion Rings',          'Knusprige Onion Rings',          '4,00€', 4.00, 0, '/Appetizers/Onion-Rings.webp',            FALSE, TRUE,  TRUE,
        '[{"label":"6 Stk","price":"4,00€","priceNumber":4},{"label":"12 Stk","price":"7,00€","priceNumber":7},{"label":"24 Stk","price":"12,00€","priceNumber":12}]'::jsonb, 3),
    ('pommes',               'appetizers', 'Pommes Portion',       'Knusprige Pommes frites',        '3,50€', 3.50, 0, '/Appetizers/Pommes_3,5euros.webp',        TRUE,  TRUE,  TRUE, NULL, 4)
ON CONFLICT (id) DO NOTHING;

-- FRIED CHICKEN (with sizes)
INSERT INTO public.products (id, category_id, name, description, price, price_number, spice_level, image, halal, vegetarian, is_active, sizes, sort_order) VALUES
    ('chicken-wings',  'fried-chicken', 'Chicken Wings',  'Knusprige Hähnchenflügel',  '7,50€', 7.50, 0, '/Fried-Chicken/Chicken-Wings.webp',   TRUE, FALSE, TRUE,
        '[{"label":"6 Stk","price":"7,50€","priceNumber":7.5},{"label":"10 Stk","price":"11,00€","priceNumber":11},{"label":"20 Stk","price":"20,00€","priceNumber":20}]'::jsonb, 1),
    ('chicken-strips', 'fried-chicken', 'Chicken Strips', 'Knusprige Hähnchenstreifen', '6,00€', 6.00, 0, '/Fried-Chicken/Chicken-Stripes.webp', TRUE, FALSE, TRUE,
        '[{"label":"3 Stk","price":"6,00€","priceNumber":6},{"label":"6 Stk","price":"11,50€","priceNumber":11.5},{"label":"9 Stk","price":"16,00€","priceNumber":16}]'::jsonb, 2)
ON CONFLICT (id) DO NOTHING;

-- DIPS
INSERT INTO public.products (id, category_id, name, description, price, price_number, spice_level, halal, vegetarian, is_active, sort_order) VALUES
    ('dip-mayo',         'dips', 'Mayo',                'Klassische Mayonnaise',  '0,50€', 0.50, 0, FALSE, FALSE, TRUE, 1),
    ('dip-ketchup',      'dips', 'Ketchup',             'Klassischer Ketchup',    '0,50€', 0.50, 0, FALSE, FALSE, TRUE, 2),
    ('dip-garlic',       'dips', 'Garlic Flip',         'Knoblauch Sauce',        '1,00€', 1.00, 0, FALSE, FALSE, TRUE, 3),
    ('dip-bbq',          'dips', 'Blazing BBQ',         'BBQ Sauce',              '1,00€', 1.00, 0, FALSE, FALSE, TRUE, 4),
    ('dip-curry',        'dips', 'Super Curry',         'Curry Sauce',            '1,00€', 1.00, 0, FALSE, FALSE, TRUE, 5),
    ('dip-dragons',      'dips', 'Dragon''s Flame',     'Extra scharfe Sauce',    '1,00€', 1.00, 3, FALSE, FALSE, TRUE, 6),
    ('dip-smokie',       'dips', 'Smokie Volcano',      'Rauchige Sauce',         '1,00€', 1.00, 0, FALSE, FALSE, TRUE, 7),
    ('dip-sweet-chili',  'dips', 'Sweet Chili Magic',   'Süß-scharfe Sauce',      '1,00€', 1.00, 1, FALSE, FALSE, TRUE, 8),
    ('dip-chili-cheese', 'dips', 'Tangy Chili Cheese',  'Chili Cheese Sauce',     '1,00€', 1.00, 0, FALSE, FALSE, TRUE, 9),
    ('dip-burger-sauce', 'dips', 'Foodie Burger Sauce', 'Unser Hausgemacht Sauce','1,00€', 1.00, 0, FALSE, FALSE, TRUE, 10)
ON CONFLICT (id) DO NOTHING;

-- DRINKS
INSERT INTO public.products (id, category_id, name, description, price, price_number, spice_level, image, halal, vegetarian, is_active, sort_order) VALUES
    ('drink-cola',      'drinks', 'Coca Cola',      '330ml Dose', '2,50€', 2.50, 0, '/graphics/cold drinks sprite cola fanta.svg', FALSE, FALSE, TRUE, 1),
    ('drink-cola-zero', 'drinks', 'Coca Cola Zero', '330ml Dose', '2,50€', 2.50, 0, '/graphics/cold drinks sprite cola fanta.svg', FALSE, FALSE, TRUE, 2),
    ('drink-fanta',     'drinks', 'Fanta',          '330ml Dose', '2,50€', 2.50, 0, '/graphics/cold drinks sprite cola fanta.svg', FALSE, FALSE, TRUE, 3),
    ('drink-sprite',    'drinks', 'Sprite',         '330ml Dose', '2,50€', 2.50, 0, '/graphics/cold drinks sprite cola fanta.svg', FALSE, FALSE, TRUE, 4),
    ('drink-capri',     'drinks', 'Capri Sonne',    '200ml',      '1,50€', 1.50, 0, '/graphics/caprisun.svg',                       FALSE, FALSE, TRUE, 5),
    ('drink-wasser',    'drinks', 'Wasser',         '500ml',      '2,00€', 2.00, 0, '/graphics/water.svg',                          FALSE, FALSE, TRUE, 6),
    ('drink-mezzo',     'drinks', 'Mezzo Mix',      '330ml Dose', '2,50€', 2.50, 0, '/graphics/cold drinks sprite cola fanta.svg', FALSE, FALSE, TRUE, 7),
    ('drink-redbull',   'drinks', 'Red Bull',       '250ml Dose', '3,50€', 3.50, 0, '/graphics/redbull.svg',                        FALSE, FALSE, TRUE, 8)
ON CONFLICT (id) DO NOTHING;

-- ---------------------------------------------------------------------
-- 7. SEED DATA — Settings (single row)
-- ---------------------------------------------------------------------

INSERT INTO public.settings (id, data) VALUES (1,
'{
    "name": "The Foodie Wagon",
    "description": "Best Street Food in Ingolstadt",
    "address": "Saturn/Mediamarkt, Am Westpark 7, Ingolstadt",
    "menuDealTitleDe": "MENÜ DEAL",
    "menuDealTitleAr": "عرض الوجبة",
    "menuDealDescDe": "Burger + Pommes + Getränk = nur €4,50",
    "menuDealDescAr": "برجر + بطاطس + مشروب = فقط €4.50",
    "phone": "+49 176 22245627",
    "email": "info@foodiewagon.de",
    "website": "https://foodiewagon.de",
    "instagram": "https://instagram.com/foodiewagon",
    "whatsapp": "+4917622245627",
    "openingHours": [
        {"day":"Montag","isOpen":false,"open":"11:00","close":"22:00"},
        {"day":"Dienstag","isOpen":false,"open":"11:00","close":"22:00"},
        {"day":"Mittwoch","isOpen":true,"open":"11:00","close":"22:00"},
        {"day":"Donnerstag","isOpen":true,"open":"11:00","close":"22:00"},
        {"day":"Freitag","isOpen":true,"open":"11:00","close":"22:00"},
        {"day":"Samstag","isOpen":true,"open":"11:00","close":"22:00"},
        {"day":"Sonntag","isOpen":true,"open":"12:00","close":"21:00"}
    ],
    "deliveryEnabled": true,
    "deliveryMinOrder": 15,
    "deliveryFee": 3,
    "deliveryTime": "30-45 min",
    "paymentCash": true,
    "paymentOnline": false,
    "paymentCard": false,
    "stripeKey": "",
    "notificationSound": true,
    "notificationBrowser": false,
    "notificationWhatsApp": "+4917622245627"
}'::jsonb)
ON CONFLICT (id) DO NOTHING;
