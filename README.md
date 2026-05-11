# Tarkov Discord Bot - Complete System

A comprehensive Discord bot system for Escape from Tarkov featuring:
- Item Database Lookup
- Quest Helper
- Map Database
- Patch Notes & Updates
- Price Tracker (Flea & Trader)
- Raid Timer

## 🏗️ Architecture

```
tarkov-bot/
├── bot/              # Discord.js bot
├── api/              # Express.js backend API
├── dashboard/        # React web interface
├── data-collection/  # Tarkov data scraper
├── database/         # Database schemas & migrations
└── docs/            # Documentation
```

## 🚀 Tech Stack

- **Bot**: Node.js + Discord.js
- **API**: Express.js + Supabase (PostgreSQL)
- **Dashboard**: React + Tailwind CSS
- **Hosting**: Railway (Bot + API) + Vercel (Dashboard)

## 🔧 Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account (free)
- Discord Bot Token
- Railway account
- Vercel account

### Installation

1. Clone repository
2. Install dependencies for each service:
   ```bash
   cd bot && npm install
   cd ../api && npm install
   cd ../dashboard && npm install
   cd ../data-collection && npm install
   ```

3. Copy `.env.example` to `.env` and fill in values
4. Run database migrations
5. Start data collection script
6. Deploy services

## 📚 Documentation

See individual README files in each directory for detailed setup.

## 📦 Services

- **Discord Bot**: Port 3000 (Railway)
- **API**: Port 3001 (Railway)
- **Dashboard**: Vercel (auto-deployed)

## 🔐 Security

- All secrets stored in `.env`
- Database queries parameterized
- Rate limiting enabled
- Input validation on all endpoints
