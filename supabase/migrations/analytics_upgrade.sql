-- ==============================================================================
-- Migration: Analytics Upgrade
-- 1. Add source tracking to profiles table
-- 2. Create page_views table for course & blog traffic analytics
-- ==============================================================================

-- 1. Profiles source tracking
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS source text DEFAULT 'direct';

-- Create index on source for faster analytics grouping
CREATE INDEX IF NOT EXISTS idx_profiles_source ON profiles(source);

-- 2. Page Views table
CREATE TABLE IF NOT EXISTS page_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  path text NOT NULL,
  page_type text NOT NULL CHECK (page_type IN ('course', 'blog', 'other')),
  slug text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to allow clean re-runs
DROP POLICY IF EXISTS "Public can insert page_views" ON page_views;
DROP POLICY IF EXISTS "Admins can view page_views" ON page_views;

-- RLS Policy: Anyone (including unauthenticated visitors) can record a page view
CREATE POLICY "Public can insert page_views" 
  ON page_views 
  FOR INSERT 
  WITH CHECK (true);

-- RLS Policy: Only admins can query page_views
CREATE POLICY "Admins can view page_views" 
  ON page_views 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
        AND profiles.role = 'admin'
    )
  );

-- Indexes for fast aggregation over time and by content slug
CREATE INDEX IF NOT EXISTS idx_page_views_created_at ON page_views(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_page_views_type_slug ON page_views(page_type, slug);
