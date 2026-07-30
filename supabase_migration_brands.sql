-- ========================================================
-- DAXO-MART SUPABASE DATABASE MIGRATION FOR BRANDS TABLE
-- Run this SQL in your Supabase SQL Editor to update brands table
-- ========================================================

-- 1. CREATE BRANDS TABLE IF NOT EXISTS
CREATE TABLE IF NOT EXISTS public.brands (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL UNIQUE,
    slug VARCHAR(255),
    logo_url TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;

-- 3. RLS POLICIES FOR PUBLIC READ AND ALL WRITE (DROP IF EXISTS TO AVOID RE-RUN ERRORS)
DROP POLICY IF EXISTS "Public Read Brands" ON public.brands;
DROP POLICY IF EXISTS "Allow All Brands Operations" ON public.brands;

CREATE POLICY "Public Read Brands" ON public.brands FOR SELECT USING (true);
CREATE POLICY "Allow All Brands Operations" ON public.brands FOR ALL USING (true) WITH CHECK (true);

-- 4. UPDATE SEED DATA WITH RELIABLE HIGH-QUALITY LOGO URLS (CDN)
INSERT INTO public.brands (name, logo_url, is_active, sort_order) VALUES
('MERCEDES-BENZ', 'https://cdn.simpleicons.org/mercedes', true, 1),
('LAMBORGHINI', 'https://cdn.simpleicons.org/lamborghini', true, 2),
('BUGATTI', 'https://cdn.simpleicons.org/bugatti', true, 3),
('TOYOTA', 'https://cdn.simpleicons.org/toyota', true, 4),
('ROLLS-ROYCE', 'https://cdn.simpleicons.org/rollsroyce', true, 5),
('PORSCHE', 'https://cdn.simpleicons.org/porsche', true, 6),
('BMW', 'https://cdn.simpleicons.org/bmw', true, 7),
('AUDI', 'https://cdn.simpleicons.org/audi', true, 8),
('FERRARI', 'https://cdn.simpleicons.org/ferrari', true, 9),
('MCLAREN', 'https://cdn.simpleicons.org/mclaren', true, 10)
ON CONFLICT (name) DO UPDATE SET logo_url = EXCLUDED.logo_url;
