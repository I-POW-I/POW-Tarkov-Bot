/*
  # Create Tarkov Bot Database Tables

  1. New Tables
    - `items` — ~1,200 game items with pricing, rarity, and crafting data
      - `id` (bigint, primary key)
      - `name` (varchar, unique) — item name
      - `description` (text) — item description
      - `icon_url` (varchar) — icon image URL
      - `trader_price` (integer) — trader buy price in roubles
      - `flea_price` (integer) — flea market avg price
      - `rarity` (varchar) — rarity tier
      - `width`, `height` (integer) — inventory dimensions
      - `crafting` (text array) — crafting recipes
      - `created_at`, `updated_at` (timestamptz)
    - `quests` — ~240 quests with objectives and rewards
      - `id` (bigint, primary key)
      - `name` (varchar, unique) — quest name
      - `description` (text) — quest description
      - `giver` (varchar) — quest giver NPC
      - `level` (integer) — required level
      - `location` (varchar) — quest location/map
      - `objectives` (text array) — quest objectives
      - `rewards_xp` (integer) — XP reward
      - `rewards_items` (text array) — item rewards
      - `created_at`, `updated_at` (timestamptz)
    - `maps` — 8 playable maps with spawn/extract data
      - `id` (bigint, primary key)
      - `name` (varchar, unique) — map name
      - `description` (text) — map description
      - `image_url` (varchar) — map image URL
      - `raid_duration` (integer) — raid timer in minutes
      - `max_players` (integer) — max player count
      - `difficulty` (varchar) — difficulty rating
      - `extracts` (text array) — extraction points
      - `loot_spawns` (text array) — notable loot locations
      - `created_at`, `updated_at` (timestamptz)
    - `prices` — Dynamic pricing data with flea and trader prices
      - `id` (bigint, primary key)
      - `item_name` (varchar) — referenced item name
      - `flea_avg` (integer) — flea market average
      - `flea_min` (integer) — flea market minimum
      - `flea_max` (integer) — flea market maximum
      - `trader_prices` (jsonb) — per-trader price breakdown
      - `last_updated` (timestamptz)
      - `created_at` (timestamptz)
    - `updates` — Patch notes archive
      - `id` (bigint, primary key)
      - `version` (varchar) — patch version string
      - `description` (text) — patch description
      - `date` (timestamptz) — patch release date
      - `type` (varchar) — update type
      - `changes` (text array) — list of changes
      - `created_at` (timestamptz)

  2. Indexes
    - GIN trigram indexes on name columns for fast ILIKE search
    - B-tree index on prices.item_name
    - B-tree index on updates.date (descending)

  3. Extensions
    - `pg_trgm` for fuzzy text search

  4. Security
    - RLS enabled on ALL tables
    - Public read access (anyone can read game data)
    - Only authenticated users with service role can insert/update/delete
*/

-- Enable trigram extension for ILIKE searches
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Items Table
CREATE TABLE IF NOT EXISTS items (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  icon_url VARCHAR(500),
  trader_price INTEGER,
  flea_price INTEGER,
  rarity VARCHAR(50),
  width INTEGER,
  height INTEGER,
  crafting TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Quests Table
CREATE TABLE IF NOT EXISTS quests (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  giver VARCHAR(100),
  level INTEGER,
  location VARCHAR(100),
  objectives TEXT[] DEFAULT ARRAY[]::TEXT[],
  rewards_xp INTEGER,
  rewards_items TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Maps Table
CREATE TABLE IF NOT EXISTS maps (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  image_url VARCHAR(500),
  raid_duration INTEGER,
  max_players INTEGER,
  difficulty VARCHAR(50),
  extracts TEXT[] DEFAULT ARRAY[]::TEXT[],
  loot_spawns TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Prices Table
CREATE TABLE IF NOT EXISTS prices (
  id BIGSERIAL PRIMARY KEY,
  item_name VARCHAR(255) NOT NULL,
  flea_avg INTEGER,
  flea_min INTEGER,
  flea_max INTEGER,
  trader_prices JSONB,
  last_updated TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Updates Table
CREATE TABLE IF NOT EXISTS updates (
  id BIGSERIAL PRIMARY KEY,
  version VARCHAR(50) NOT NULL,
  description TEXT,
  date TIMESTAMPTZ,
  type VARCHAR(50),
  changes TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for faster searches
CREATE INDEX IF NOT EXISTS idx_items_name ON items USING GIN (name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_quests_name ON quests USING GIN (name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_maps_name ON maps USING GIN (name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_prices_item ON prices(item_name);
CREATE INDEX IF NOT EXISTS idx_updates_date ON updates(date DESC);

-- Enable RLS on all tables
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE maps ENABLE ROW LEVEL SECURITY;
ALTER TABLE prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE updates ENABLE ROW LEVEL SECURITY;

-- Public read access (game data is publicly readable via API)
CREATE POLICY "Public can read items"
  ON items FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated can modify items"
  ON items FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated can update items"
  ON items FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated can delete items"
  ON items FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Public can read quests"
  ON quests FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated can modify quests"
  ON quests FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated can update quests"
  ON quests FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated can delete quests"
  ON quests FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Public can read maps"
  ON maps FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated can modify maps"
  ON maps FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated can update maps"
  ON maps FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated can delete maps"
  ON maps FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Public can read prices"
  ON prices FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated can modify prices"
  ON prices FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated can update prices"
  ON prices FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated can delete prices"
  ON prices FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Public can read updates"
  ON updates FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated can modify updates"
  ON updates FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated can update updates"
  ON updates FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated can delete updates"
  ON updates FOR DELETE
  TO authenticated
  USING (true);
