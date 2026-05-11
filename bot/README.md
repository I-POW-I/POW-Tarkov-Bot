# Tarkov Discord Bot

Discord bot for Escape from Tarkov with item lookup, quest helper, maps, and more.

## Setup

1. Create Discord Application: https://discord.com/developers/applications
2. Create Bot User and copy token to `.env`
3. Enable required intents in Discord Developer Portal
4. Install dependencies: `npm install`
5. Deploy commands: `npm run deploy-commands`
6. Start bot: `npm start`

## Commands

- `/item <name>` - Search for items
- `/quest <name>` - Get quest information
- `/map <name>` - Display map with spawns
- `/prices <item>` - Check flea & trader prices
- `/updates` - Latest patch notes
- `/raidtimer <minutes>` - Start raid countdown

## Environment Variables

```
DISCORD_TOKEN=
CLIENT_ID=
GUILD_ID=
SUPABASE_URL=
SUPABASE_KEY=
API_URL=http://localhost:3001
NODE_ENV=production
```
