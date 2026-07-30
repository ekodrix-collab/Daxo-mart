-- Run this SQL in your Supabase SQL Editor (Dashboard → SQL Editor → New Query)
-- This adds the missing columns for color variants and size options

-- Add colors column (JSONB array for color variant data)
ALTER TABLE products ADD COLUMN IF NOT EXISTS colors jsonb DEFAULT '[]'::jsonb;

-- Add sizes column (JSONB array for size variant data with prices)
ALTER TABLE products ADD COLUMN IF NOT EXISTS sizes jsonb DEFAULT '[]'::jsonb;

-- Add hover_image column (text for hover image URL)
ALTER TABLE products ADD COLUMN IF NOT EXISTS hover_image text DEFAULT NULL;

-- Add video_url column (text for video URL)
ALTER TABLE products ADD COLUMN IF NOT EXISTS video_url text DEFAULT NULL;

-- Add cost_price column (numeric for dealer cost)
ALTER TABLE products ADD COLUMN IF NOT EXISTS cost_price numeric DEFAULT 0;

-- Add scale column (text for product scale like 1:18, 1:24)
ALTER TABLE products ADD COLUMN IF NOT EXISTS scale text DEFAULT '1:24';

-- Add specs column (JSONB array for custom specification key-value pairs)
ALTER TABLE products ADD COLUMN IF NOT EXISTS specs jsonb DEFAULT '[]'::jsonb;

-- Add SKU, Brand, Material
ALTER TABLE products ADD COLUMN IF NOT EXISTS sku text DEFAULT NULL;
ALTER TABLE products ADD COLUMN IF NOT EXISTS brand text DEFAULT NULL;
ALTER TABLE products ADD COLUMN IF NOT EXISTS material text DEFAULT NULL;

-- Add SEO metadata fields
ALTER TABLE products ADD COLUMN IF NOT EXISTS meta_title text DEFAULT NULL;
ALTER TABLE products ADD COLUMN IF NOT EXISTS meta_description text DEFAULT NULL;
ALTER TABLE products ADD COLUMN IF NOT EXISTS meta_keywords text DEFAULT NULL;
ALTER TABLE products ADD COLUMN IF NOT EXISTS og_image text DEFAULT NULL;

-- Verify columns were added
SELECT column_name, data_type FROM information_schema.columns 
WHERE table_name = 'products' 
AND column_name IN ('colors', 'sizes', 'hover_image', 'video_url', 'cost_price', 'scale', 'specs', 'sku', 'brand', 'material', 'meta_title', 'meta_description', 'meta_keywords', 'og_image')
ORDER BY column_name;
