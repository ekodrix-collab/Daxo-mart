-- Migration: Add product highlights, short_description, and included_items columns to products table
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)

ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS short_description TEXT,
ADD COLUMN IF NOT EXISTS highlights JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS included_items JSONB DEFAULT '[]'::jsonb;

COMMENT ON COLUMN public.products.short_description IS 'Short overview of product';
COMMENT ON COLUMN public.products.highlights IS 'List of product highlight features (JSON array)';
COMMENT ON COLUMN public.products.included_items IS 'List of items included in box (JSON array)';
