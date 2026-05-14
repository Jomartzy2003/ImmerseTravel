-- =====================================================
-- IMMERSIVE TRAVEL APPLICATION - DATABASE SCHEMA
-- PostgreSQL/Supabase Schema with Row Level Security
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- PROFILES TABLE
-- Linked to Supabase Auth via UUID
-- =====================================================
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- =====================================================
-- DESTINATIONS TABLE
-- Core content library for travel experiences
-- =====================================================
CREATE TABLE destinations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  bg_layer_url TEXT NOT NULL,
  fg_layer_url TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT,
  country TEXT,
  category TEXT, -- e.g., 'mountains', 'beaches', 'cities', 'wilderness'
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE destinations ENABLE ROW LEVEL SECURITY;

-- Destinations policies (public read)
CREATE POLICY "Destinations are viewable by everyone"
  ON destinations FOR SELECT
  USING (true);

-- Only authenticated users can create destinations (admin functionality)
CREATE POLICY "Authenticated users can insert destinations"
  ON destinations FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update destinations"
  ON destinations FOR UPDATE
  USING (auth.role() = 'authenticated');

-- =====================================================
-- USER_SAVES TABLE
-- Junction table for bookmarked adventures
-- =====================================================
CREATE TABLE user_saves (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  destination_id UUID REFERENCES destinations(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(user_id, destination_id)
);

-- Enable Row Level Security
ALTER TABLE user_saves ENABLE ROW LEVEL SECURITY;

-- User saves policies (users can only see/modify their own saves)
CREATE POLICY "Users can view their own saves"
  ON user_saves FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own saves"
  ON user_saves FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own saves"
  ON user_saves FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================
CREATE INDEX idx_user_saves_user_id ON user_saves(user_id);
CREATE INDEX idx_user_saves_destination_id ON user_saves(destination_id);
CREATE INDEX idx_destinations_category ON destinations(category);
CREATE INDEX idx_destinations_featured ON destinations(featured);

-- =====================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_destinations_updated_at
  BEFORE UPDATE ON destinations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- SEED DATA (Sample Destinations)
-- =====================================================
INSERT INTO destinations (title, bg_layer_url, fg_layer_url, description, location, country, category, featured) VALUES
(
  'Misty Peaks of Patagonia',
  'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1920&q=80',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80',
  'Where the earth touches the sky, and silence speaks louder than words. Experience the raw, untamed beauty of Torres del Paine.',
  'Torres del Paine',
  'Chile',
  'mountains',
  true
),
(
  'Azure Dreams of Santorini',
  'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=1920&q=80',
  'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1920&q=80',
  'Whitewashed villages cascade down volcanic cliffs into the endless Aegean blue. A symphony of light, architecture, and Mediterranean soul.',
  'Santorini',
  'Greece',
  'beaches',
  true
),
(
  'Neon Pulse of Tokyo',
  'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1920&q=80',
  'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=1920&q=80',
  'Ancient temples meet cyberpunk streets. Lose yourself in the electric heartbeat of a city that never sleeps, where tradition and future collide.',
  'Tokyo',
  'Japan',
  'cities',
  true
),
(
  'Emerald Whispers of Iceland',
  'https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=1920&q=80',
  'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1920&q=80',
  'Glaciers, geysers, and the dancing aurora. A land forged by fire and ice, where nature performs its most spectacular show.',
  'Reykjavik',
  'Iceland',
  'wilderness',
  false
);

-- =====================================================
-- HELPFUL QUERIES FOR DEVELOPMENT
-- =====================================================

-- Get all destinations with save count
-- SELECT 
--   d.*,
--   COUNT(us.id) as save_count
-- FROM destinations d
-- LEFT JOIN user_saves us ON d.id = us.destination_id
-- GROUP BY d.id;

-- Get user's saved destinations
-- SELECT d.*
-- FROM destinations d
-- INNER JOIN user_saves us ON d.id = us.destination_id
-- WHERE us.user_id = 'user-uuid-here';
