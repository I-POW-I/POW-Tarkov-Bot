# Database Schema

This directory contains the Supabase PostgreSQL schema and migrations.

## Setup

1. Go to Supabase dashboard
2. Open SQL Editor
3. Copy contents of `schema.sql`
4. Run the SQL

This creates all tables with proper indexing for fast searches.

## Tables

- **items** - Tarkov items with prices and crafting info
- **quests** - Quest information
- **maps** - Map data with spawns and extracts
- **prices** - Item prices from flea & traders
- **updates** - Patch notes and updates
