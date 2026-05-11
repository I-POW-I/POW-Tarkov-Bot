# 🚀 Complete Deployment Guide

This guide will walk you through deploying the entire Tarkov Bot system.

## Prerequisites

- Discord Bot Token (from Discord Developer Portal)
- Supabase Account (free)
- Railway Account (free tier)
- Vercel Account (free)
- GitHub Account (for version control)

---

## Step 1: Supabase Database Setup

### 1.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Create new organization (if needed)
4. Create new project:
   - Name: `tarkov-bot`
   - Password: Generate strong password
   - Region: Choose closest to you
5. Wait 2-3 minutes for project to initialize

### 1.2 Get Connection Details

1. In Supabase dashboard, go to **Settings → API**
2. Copy and save:
   - `Project URL` → `SUPABASE_URL`
   - `anon public` key → `SUPABASE_KEY`
   - `service_role` (click eye icon) → `SUPABASE_SERVICE_ROLE`

### 1.3 Create Database Schema

1. In Supabase, go to **SQL Editor**
2. Click **"New Query"**
3. Copy entire contents of [database/schema.sql](../database/schema.sql)
4. Paste into SQL editor
5. Click **"Run"**
6. Wait for completion (should see green checkmark)

✅ Database ready!

---

## Step 2: Discord Bot Setup

### 2.1 Create Discord Application

1. Go to [discord.com/developers/applications](https://discord.com/developers/applications)
2. Click **"New Application"**
3. Name it: `Tarkov Bot`
4. Accept terms and click **"Create"**

### 2.2 Create Bot User

1. In application settings, go to **"Bot"** tab
2. Click **"Add Bot"**
3. Under **TOKEN**, click **"Copy"** → Save as `DISCORD_TOKEN`

### 2.3 Configure Bot Intents

1. Scroll down to **"Privileged Gateway Intents"**
2. Enable:
   - `Message Content Intent` ✓
   - `Server Members Intent` ✓ (optional but recommended)
3. Click **"Save Changes"**

### 2.4 Get Bot IDs

1. In **"General Information"**, copy:
   - `Application ID` → `CLIENT_ID`
2. Create a test Discord server (if needed)
3. Get server ID → `GUILD_ID`

✅ Discord app ready!

---

## Step 3: Create Environment Files

### 3.1 Root `.env` File

Create `.env` in project root (d:\Discord Bot Stuff\Tarky BOT\.env):

```env
# Discord Bot
DISCORD_TOKEN=your_bot_token_here
CLIENT_ID=your_client_id_here
GUILD_ID=your_guild_id_here

# Database - Supabase
SUPABASE_URL=your_supabase_url_here
SUPABASE_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE=your_supabase_service_role_here

# API
API_PORT=3001
API_URL=http://localhost:3001
NODE_ENV=production

# Dashboard
REACT_APP_API_URL=http://localhost:3001
REACT_APP_BOT_INVITE=your_bot_invite_link_here

# Data Collection
DATA_UPDATE_INTERVAL=3600000
```

### 3.2 Fill in Your Values

Replace all `your_*_here` with actual values from Steps 1-2.

---

## Step 4: Local Testing (Optional)

### 4.1 Install Dependencies

```bash
cd "d:\Discord Bot Stuff\Tarky BOT"
npm install

# Or install each component
cd bot && npm install
cd ../api && npm install
cd ../data-collection && npm install
cd ../dashboard && npm install
```

### 4.2 Test Bot Locally

```bash
cd "d:\Discord Bot Stuff\Tarky BOT\bot"
npm start
```

Should see:
```
✅ Bot logged in as Tarkov Bot#1234
🤖 Bot is ready to serve 1 guilds
```

### 4.3 Test API Locally

In new terminal:
```bash
cd "d:\Discord Bot Stuff\Tarky BOT\api"
npm start
```

Should see:
```
🚀 API Server running on port 3001
📍 Health check: http://localhost:3001/api/health
```

Test with browser: `http://localhost:3001/api/health`

### 4.4 Test Data Collection Locally

In new terminal:
```bash
cd "d:\Discord Bot Stuff\Tarky BOT\data-collection"
npm start
```

Should see data syncing...

---

## Step 5: Deploy to Railway

### 5.1 Create Railway Account

1. Go to [railway.app](https://railway.app)
2. Sign up (use GitHub)
3. Authorize GitHub access

### 5.2 Deploy Discord Bot

1. In Railway dashboard, click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Authorize and select your `Tarky BOT` repository
4. Railway detects `bot/package.json`
5. Configure environment variables:
   - Click **"Variable Reference"**
   - Add all variables from Step 3
6. Click **"Deploy"**

Wait ~5 minutes for deployment...

✅ Bot deployed!

### 5.3 Deploy API Server

1. In same Railway project, click **"New Service"**
2. Select **"GitHub repo"** again
3. Select your repository
4. Railway should detect `api/package.json`
5. Add environment variables
6. Click **"Deploy"**

Wait ~5 minutes...

✅ API deployed!

### 5.4 Get Deployed URLs

1. In Railway, each service shows a URL
2. For API service, copy the URL → `API_URL`
3. Update `.env` and re-deploy both services with new URLs

---

## Step 6: Deploy to Vercel

### 6.1 Create Vercel Account

1. Go to [vercel.com](https://vercel.com)
2. Sign up (use GitHub)
3. Authorize GitHub

### 6.2 Deploy Dashboard

1. In Vercel dashboard, click **"Add New..."** → **"Project"**
2. Import your GitHub repository
3. Configure project:
   - Framework: **React**
   - Root Directory: **dashboard**
4. Add environment variables:
   - `REACT_APP_API_URL` = Your Railway API URL
5. Click **"Deploy"**

Wait ~3 minutes...

✅ Dashboard live!

Your dashboard will be at: `https://your-project.vercel.app`

---

## Step 7: Invite Bot to Discord Server

1. In Discord Developer Portal, go to **OAuth2 → URL Generator**
2. Select scopes: `bot`
3. Select permissions:
   - Send Messages ✓
   - Embed Links ✓
   - Attach Files ✓
4. Copy generated URL
5. Open in browser and select your server
6. Click **"Authorize"**

✅ Bot in your server!

---

## Step 8: Deploy Commands

```bash
cd bot
npm run deploy-commands
```

You should see:
```
✅ Successfully deployed 6 commands!
```

---

## Step 9: Test Everything

In Discord server, try:
```
/item gunpowder
/quest myshoney
/map customs
/prices dogtag
/updates
/raidtimer 45
```

✅ All working!

---

## Deployment Checklist

- [ ] Supabase project created & database schema installed
- [ ] Discord bot created with token
- [ ] Environment variables configured
- [ ] Bot deployed to Railway
- [ ] API deployed to Railway
- [ ] Dashboard deployed to Vercel
- [ ] Bot invited to Discord server
- [ ] Commands deployed
- [ ] All commands tested in Discord
- [ ] Data collection running

---

## Troubleshooting

### Bot not responding
- Check Discord token in Railway
- Check bot has message permissions
- Restart bot service in Railway

### API errors
- Check Supabase connection string
- Check API_URL environment variable
- View Railway logs for errors

### Dashboard won't load
- Check REACT_APP_API_URL in Vercel
- Check browser console for errors
- Verify Railway API is running

### Data not syncing
- Check data-collection logs in Railway
- Verify Supabase connection
- Check internet connectivity

---

## Next Steps

1. **Monitor Analytics**: Check dashboard regularly
2. **Update Content**: Data collection runs automatically
3. **Add Features**: Extend with more commands
4. **Invite Users**: Share bot with community

---

## Support

For issues:
1. Check individual service logs in Railway
2. Check Vercel deployment logs
3. Review error messages carefully
4. See README files in each directory

🎉 You're all set!
