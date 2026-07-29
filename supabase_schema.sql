-- ========================================================
-- DAXO-MART SUPABASE DATABASE SCHEMA & INITIAL SEED DATA
-- Run this complete script in your Supabase SQL Editor
-- ========================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL UNIQUE,
    slug VARCHAR(255) NOT NULL UNIQUE,
    image_url TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    sale_price NUMERIC(10, 2),
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    category_name VARCHAR(100),
    images TEXT[] DEFAULT '{}',
    stock INTEGER NOT NULL DEFAULT 0,
    is_featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    rating NUMERIC(3, 2) DEFAULT 4.5,
    reviews_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. BANNERS TABLE
CREATE TABLE IF NOT EXISTS public.banners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    subtitle TEXT,
    button_text VARCHAR(100) DEFAULT 'Shop Now',
    button_link VARCHAR(255) DEFAULT '/products',
    image_url TEXT NOT NULL,
    badge_text VARCHAR(100),
    discount_text VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. COUPONS TABLE
CREATE TABLE IF NOT EXISTS public.coupons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) NOT NULL UNIQUE,
    discount_percent INTEGER NOT NULL DEFAULT 0,
    min_spend NUMERIC(10, 2) DEFAULT 0.00,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. CUSTOMERS TABLE
CREATE TABLE IF NOT EXISTS public.customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. ADDRESSES TABLE
CREATE TABLE IF NOT EXISTS public.addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE NOT NULL,
    full_address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    pincode VARCHAR(20) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. ORDER SEQUENCE FOR UNIQUE DXM NUMBERS
CREATE SEQUENCE IF NOT EXISTS order_number_seq START WITH 100001;

-- 9. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number VARCHAR(50) NOT NULL UNIQUE DEFAULT ('DXM-' || nextval('order_number_seq')::text),
    customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
    shipping_address_id UUID REFERENCES public.addresses(id) ON DELETE SET NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255),
    customer_phone VARCHAR(50) NOT NULL,
    shipping_address TEXT NOT NULL,
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(50),
    total NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    subtotal NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    discount_amount NUMERIC(10, 2) DEFAULT 0.00,
    shipping_fee NUMERIC(10, 2) DEFAULT 0.00,
    notes TEXT,
    payment_method VARCHAR(50) DEFAULT 'WhatsApp / COD',
    status VARCHAR(50) NOT NULL DEFAULT 'New', -- New, Contacted, Confirmed, Processing, Packed, Shipped, Delivered, Cancelled
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 10. ORDER ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
    product_id VARCHAR(255),
    product_name VARCHAR(255) NOT NULL,
    product_image TEXT,
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price NUMERIC(10, 2) NOT NULL,
    subtotal NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 11. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Read policies
CREATE POLICY "Public Read Categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Public Read Products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Public Read Banners" ON public.banners FOR SELECT USING (true);
CREATE POLICY "Public Read Coupons" ON public.coupons FOR SELECT USING (true);

-- Full access for service key or public API access for demo store (allows admin CRUD & order creation)
CREATE POLICY "Allow All Categories" ON public.categories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow All Products" ON public.products FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow All Banners" ON public.banners FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow All Coupons" ON public.coupons FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow All Customers" ON public.customers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow All Addresses" ON public.addresses FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow All Orders" ON public.orders FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow All Order Items" ON public.order_items FOR ALL USING (true) WITH CHECK (true);

-- Enable Supabase Realtime for orders table
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;

-- 12. INITIAL SEED DATA
INSERT INTO public.categories (name, slug, image_url) VALUES
('Electronics', 'electronics', 'https://images.unsplash.com/photo-1498049860654-af1a5c566876?w=500&auto=format&fit=crop'),
('Fashion', 'fashion', 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=500&auto=format&fit=crop'),
('Home & Kitchen', 'home-kitchen', 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=500&auto=format&fit=crop'),
('Beauty & Personal Care', 'beauty', 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&auto=format&fit=crop')
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.banners (title, subtitle, button_text, button_link, image_url, badge_text, discount_text, sort_order) VALUES
('Summer Tech Sale', 'Upgrade your workstation with up to 40% discount on modern tech accessories.', 'Shop Deals', '/products', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&auto=format&fit=crop', 'MEGA SALE', '40% OFF', 1),
('Trendy Wardrobe Collection', 'Discover modern fashion tailored for comfort and elegance.', 'Explore Collection', '/products', 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&auto=format&fit=crop', 'NEW ARRIVALS', '30% OFF', 2);

INSERT INTO public.coupons (code, discount_percent, min_spend) VALUES
('WELCOME10', 10, 50.00),
('SUPER20', 20, 100.00),
('DAXO50', 50, 200.00)
ON CONFLICT (code) DO NOTHING;
