# Data Collection Service

Automated scripts to collect and update Tarkov data in the database.

## Setup

1. Install dependencies: `npm install`
2. Add environment variables to `.env`
3. Run: `npm start`

## Scripts

- `npm run sync-items` - Sync all items
- `npm run sync-quests` - Sync all quests
- `npm run sync-maps` - Sync all maps
- `npm run sync-prices` - Sync prices
- `npm run sync-all` - Run all syncs (runs automatically on schedule)

## Automated Updates

- Items: Updated daily at 2 AM
- Quests: Updated daily at 3 AM
- Maps: Updated daily at 4 AM
- Prices: Updated every 6 hours

## Data Sources

- Tarkov Wiki API (tarkov-data.github.io)
- Official game data repositories
- Community data sources

## Environment Variables

```
SUPABASE_URL=
SUPABASE_KEY=
SUPABASE_SERVICE_ROLE=
NODE_ENV=production
