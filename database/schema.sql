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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Prices Table
CREATE TABLE IF NOT EXISTS prices (
  id BIGSERIAL PRIMARY KEY,
  item_name VARCHAR(255) NOT NULL,
  flea_avg INTEGER,
  flea_min INTEGER,
  flea_max INTEGER,
  trader_prices JSONB,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Updates Table
CREATE TABLE IF NOT EXISTS updates (
  id BIGSERIAL PRIMARY KEY,
  version VARCHAR(50) NOT NULL,
  description TEXT,
  date TIMESTAMP WITH TIME ZONE,
  type VARCHAR(50),
  changes TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for faster searches
CREATE INDEX IF NOT EXISTS idx_items_name ON items USING GIN (name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_quests_name ON quests USING GIN (name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_maps_name ON maps USING GIN (name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_prices_item ON prices(item_name);
CREATE INDEX IF NOT EXISTS idx_updates_date ON updates(date DESC);

-- Enable trigram extension for ILIKE searches
CREATE EXTENSION IF NOT EXISTS pg_trgm;
