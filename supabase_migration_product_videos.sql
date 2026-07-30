-- ================================================================
-- MIGRATION: ADD PRODUCT SHOWCASE VIDEO & STORAGE BUCKET POLICIES
-- Date: 2026-07-29
-- Description: Adds video_url to products table & sets up product-videos storage bucket
-- ================================================================

-- 1. ADD VIDEO_URL COLUMN TO PRODUCTS TABLE
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS video_url TEXT DEFAULT NULL;

COMMENT ON COLUMN public.products.video_url IS 'Public URL of product showcase reel video stored in Supabase storage';

-- 2. CREATE PUBLIC STORAGE BUCKET FOR VIDEOS
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-videos',
  'product-videos',
  TRUE,
  52428800, -- 50 MB limit per video
  ARRAY['video/mp4', 'video/webm', 'video/quicktime', 'video/x-matroska']
)
ON CONFLICT (id) DO UPDATE SET
  public = TRUE,
  file_size_limit = 52428800,
  allowed_mime_types = ARRAY['video/mp4', 'video/webm', 'video/quicktime', 'video/x-matroska'];

-- 3. STORAGE POLICIES (PUBLIC READ & ADMIN WRITE)

-- Public Read access for storefront visitors
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Public Read Access for Product Videos'
  ) THEN
    CREATE POLICY "Public Read Access for Product Videos" 
    ON storage.objects FOR SELECT 
    USING (bucket_id = 'product-videos');
  END IF;
END $$;

-- Allow Uploads
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Allow Uploads to Product Videos'
  ) THEN
    CREATE POLICY "Allow Uploads to Product Videos" 
    ON storage.objects FOR INSERT 
    WITH CHECK (bucket_id = 'product-videos');
  END IF;
END $$;

-- Allow Updates
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Allow Updates to Product Videos'
  ) THEN
    CREATE POLICY "Allow Updates to Product Videos" 
    ON storage.objects FOR UPDATE 
    USING (bucket_id = 'product-videos');
  END IF;
END $$;

-- Allow Deletions
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Allow Deletions from Product Videos'
  ) THEN
    CREATE POLICY "Allow Deletions from Product Videos" 
    ON storage.objects FOR DELETE 
    USING (bucket_id = 'product-videos');
  END IF;
END $$;
