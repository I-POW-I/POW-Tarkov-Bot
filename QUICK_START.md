# 🎯 Quick Start Guide

Get the Tarkov Bot running in 15 minutes!

## Prerequisites (5 minutes)

1. **Discord Bot Token**
   - Go to https://discord.com/developers/applications
   - Create new application named `POW Tarkov Bot`
   - Add bot user
   - Copy token

2. **Supabase Account**
   - Go to https://supabase.com
   - Create new project (name: `tarkov-bot`)
   - Get URL and keys from Settings → API

3. **Railway Account**
   - Go to https://railway.app
   - Sign up with GitHub

4. **Vercel Account**
   - Go to https://vercel.com
   - Sign up with GitHub

## Installation (10 minutes)

### Step 1: Configure Environment

Create `.env` file in root directory:

```env
DISCORD_TOKEN=paste_your_token_here
CLIENT_ID=paste_your_client_id_here
GUILD_ID=paste_your_server_id_here
SUPABASE_URL=paste_your_url_here
SUPABASE_KEY=paste_your_key_here
SUPABASE_SERVICE_ROLE=paste_your_service_role_here
API_URL=http://localhost:3001
NODE_ENV=production
```

### Step 2: Setup Supabase Database

1. Go to Supabase dashboard
2. SQL Editor → New Query
3. Copy entire contents of `database/schema.sql`
4. Paste and run

### Step 3: Deploy Services

**Option A: Quick Deploy (Recommended)**
```bash
cd "d:\Discord Bot Stuff\Tarky BOT"
npm install
npm start
```

**Option B: Deploy to Railway/Vercel**

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed instructions.

## Verify Installation

✅ Check bot is online in Discord
✅ Try commands: `/item`, `/quest`, `/prices`
✅ Dashboard loads at deployed URL

## Next Steps

- Read [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for production setup
- Customize bot responses
- Add more features
- Invite bot to your server

🚀 Done! Your Tarkov Bot is ready!
