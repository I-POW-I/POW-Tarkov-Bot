# Tarkov Bot API

Express.js API server that serves data to the Discord bot and dashboard.

## Setup

1. Install dependencies: `npm install`
2. Add environment variables to `.env`
3. Run migrations: `npm run migrate`
4. Start server: `npm start`

## API Endpoints

- `GET /api/items/search` - Search items
- `GET /api/quests/search` - Search quests
- `GET /api/maps/search` - Search maps
- `GET /api/prices/search` - Search prices
- `GET /api/updates/latest` - Get latest updates
- `POST /api/admin/sync` - Trigger data sync (admin only)
- `GET /api/health` - Health check

## Environment Variables

```
SUPABASE_URL=
SUPABASE_KEY=
SUPABASE_SERVICE_ROLE=
API_PORT=3001
NODE_ENV=production
ADMIN_KEY=
```
