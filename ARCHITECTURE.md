# 🏗️ System Architecture

Complete overview of the Tarkov Bot system.

## Components

### 1. Discord Bot (`/bot`)
- **Technology**: Discord.js (Node.js)
- **Purpose**: Handles user commands, embeds, interactions
- **Commands**:
  - `/item` - Search items with prices & crafting
  - `/quest` - Get quest objectives & rewards
  - `/map` - Display map data & spawns
  - `/prices` - Check flea & trader prices
  - `/updates` - Latest patch notes
  - `/raidtimer` - Countdown timer
- **Deployment**: Railway
- **Port**: 3000 (internal)

### 2. Express API (`/api`)
- **Technology**: Express.js (Node.js)
- **Purpose**: REST API for bot & dashboard
- **Endpoints**:
  - `GET /api/items/search` - Search items
  - `GET /api/quests/search` - Search quests
  - `GET /api/maps/search` - Search maps
  - `GET /api/prices/search` - Search prices
  - `GET /api/updates/latest` - Patch notes
  - `POST /api/admin/sync` - Trigger data sync
  - `GET /api/health` - Health check
- **Deployment**: Railway
- **Port**: 3001

### 3. React Dashboard (`/dashboard`)
- **Technology**: React.js + Tailwind CSS
- **Purpose**: Web interface for management
- **Features**:
  - 📊 Dashboard with statistics
  - ⚙️ Settings management
  - 💰 Price tracking
  - 📈 Analytics & usage graphs
- **Deployment**: Vercel
- **URL**: `https://your-project.vercel.app`

### 4. Data Collection (`/data-collection`)
- **Technology**: Node.js + Axios
- **Purpose**: Automated data scraping & updates
- **Tasks**:
  - Items: Daily sync from Tarkov Wiki API
  - Quests: Daily sync
  - Maps: Daily sync
  - Prices: Every 6 hours
- **Deployment**: Can run on Railway or local machine

### 5. Database (`Supabase`)
- **Technology**: PostgreSQL
- **Purpose**: Central data storage
- **Tables**:
  - `items` - ~1,200 items
  - `quests` - ~240 quests
  - `maps` - 8 maps
  - `prices` - Dynamic pricing data
  - `updates` - Patch notes archive
- **Deployment**: Supabase Cloud (free tier)

---

## Data Flow

```
Discord User Command
    ↓
Bot receives `/item gunpowder`
    ↓
Bot calls API: GET /api/items/search?name=gunpowder
    ↓
API queries Supabase Database
    ↓
Database returns item data
    ↓
API returns JSON response
    ↓
Bot creates Discord Embed with data
    ↓
Embed displayed to user
```

---

## Update Flow

```
Data Collection Service (Daily/Every 6 hours)
    ↓
Fetches from Tarkov Wiki API
    ↓
Processes & validates data
    ↓
Upserts to Supabase Database
    ↓
Data available to Bot & Dashboard
```

---

## Deployment Architecture

```
┌─────────────────────────────────────────────────┐
│                  Discord Servers                │
└────────────────┬────────────────────────────────┘
                 │
        ┌────────▼────────┐
        │  Tarkov Bot     │
        │   (Railway)     │
        │   Port 3000     │
        └────────┬────────┘
                 │
        ┌────────▼────────┐
        │ Express API     │
        │   (Railway)     │
        │   Port 3001     │
        └────────┬────────┘
                 │
     ┌───────────┼───────────┐
     │           │           │
┌────▼──┐  ┌─────▼──┐  ┌────▼────┐
│ React │  │Supabase│  │  Data   │
│ Dash  │  │   DB   │  │Collection
│(Vercel)  │(Cloud) │  │(Railway)
└───────┘  └────────┘  └─────────┘
```

---

## Security

### Authentication
- Bot token stored in environment variables
- Service role key never exposed to frontend
- API keys validated on each request

### Database
- All queries parameterized (SQL injection prevention)
- Data encrypted in transit (HTTPS/TLS)
- Backup enabled on Supabase

### Rate Limiting
- API endpoints rate-limited
- Discord bot respects API limits
- DDoS protection via Vercel/Railway

---

## Scalability

### Current Capacity
- Supabase free tier: 500MB (easily handles current data)
- Railway: 512MB RAM (comfortable for bot + API)
- Vercel: Unlimited serverless functions

### Growth Path
1. Upgrade Supabase to next tier ($15/mo)
2. Upgrade Railway to paid tier ($5/mo)
3. Add caching layer (Redis) if needed
4. Shard database if >1GB data

---

## Monitoring

### What to Monitor
- **Bot Uptime**: Railway dashboard
- **API Health**: `/api/health` endpoint
- **Database Performance**: Supabase analytics
- **User Commands**: Dashboard analytics page

### Error Logging
- Bot errors logged to console
- API errors logged with timestamps
- Failed data syncs logged

### Alerting (Setup in Railway)
- Email on service crash
- Slack notification on errors
- Custom webhooks available

---

## Backup & Recovery

### Database Backups
- Supabase auto-backups daily (free tier)
- Manual backup before major changes

### Code Backups
- GitHub repository (version control)
- All secrets in environment variables (not in git)

### Recovery Procedure
1. Restore database from backup
2. Redeploy services from GitHub
3. Verify all services healthy
4. Run data sync to catch up

---

## Cost Breakdown

| Service | Free Tier | Cost |
|---------|-----------|------|
| Supabase | 500MB DB, free tier | $0-15/mo to scale |
| Railway | Limited runtime | $5/mo for bot + API |
| Vercel | Unlimited | $0 (free tier perfect) |
| Discord | Bot | $0 (free) |
| **Total** | Full system | **$0-20/mo** |

---

## Performance Metrics

### Expected Response Times
- Item search: ~50-100ms
- Price lookup: ~50-80ms
- Map data: ~100-150ms
- Quiz: ~80-120ms

### Throughput
- Can handle 1,000+ requests/hour
- Suitable for communities up to 10,000 members

---

## Future Enhancements

1. **Cache Layer**: Redis for frequently accessed data
2. **WebSockets**: Real-time price updates
3. **Mobile App**: React Native dashboard
4. **Advanced Analytics**: Usage patterns & insights
5. **Custom Alerts**: Price drop notifications
6. **OAuth Login**: User account system
7. **Multi-language**: Support multiple languages
8. **API Rate Tiers**: Pro user features

---

## Troubleshooting Guide

### Bot not responding
1. Check Railway logs
2. Verify Discord token is correct
3. Check bot permissions in server
4. Restart bot service

### API returning 500 errors
1. Check Supabase connection
2. Verify database schema exists
3. Check API logs in Railway
4. Restart API service

### Dashboard not loading
1. Check Vercel logs
2. Verify REACT_APP_API_URL is correct
3. Check browser console for errors
4. Verify API is responding to /api/health

### Data not syncing
1. Check data-collection logs
2. Verify Supabase service role key
3. Check internet connectivity
4. Review API documentation

---

## Support Resources

- [Discord.js Documentation](https://discord.js.org/)
- [Supabase Docs](https://supabase.com/docs)
- [Express.js Guide](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [Railway Docs](https://docs.railway.app/)
- [Vercel Docs](https://vercel.com/docs/)

---

For questions or issues, see DEPLOYMENT_GUIDE.md or QUICK_START.md
