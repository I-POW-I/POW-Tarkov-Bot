require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.API_PORT || 3001;

// CORS - allow Vercel frontend and local development
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:3000',
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins.length > 0 ? allowedOrigins : true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Admin-Key'],
}));
app.use(express.json());

// Supabase Client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Item routes
app.get('/api/items/search', async (req, res) => {
  try {
    const { name } = req.query;
    
    if (!name) {
      return res.status(400).json({ error: 'Name parameter required' });
    }

    const { data, error } = await supabase
      .from('items')
      .select('*')
      .ilike('name', `%${name}%`)
      .limit(5);

    if (error) throw error;

    res.json(data || []);
  } catch (error) {
    console.error('Item search error:', error);
    res.status(500).json({ error: 'Failed to search items' });
  }
});

// Quest routes
app.get('/api/quests/search', async (req, res) => {
  try {
    const { name } = req.query;
    
    if (!name) {
      return res.status(400).json({ error: 'Name parameter required' });
    }

    const { data, error } = await supabase
      .from('quests')
      .select('*')
      .ilike('name', `%${name}%`)
      .limit(5);

    if (error) throw error;

    res.json(data || []);
  } catch (error) {
    console.error('Quest search error:', error);
    res.status(500).json({ error: 'Failed to search quests' });
  }
});

// Map routes
app.get('/api/maps/search', async (req, res) => {
  try {
    const { name } = req.query;
    
    if (!name) {
      return res.status(400).json({ error: 'Name parameter required' });
    }

    const { data, error } = await supabase
      .from('maps')
      .select('*')
      .ilike('name', `%${name}%`)
      .limit(5);

    if (error) throw error;

    res.json(data?.[0] || null);
  } catch (error) {
    console.error('Map search error:', error);
    res.status(500).json({ error: 'Failed to search maps' });
  }
});

// Price routes
app.get('/api/prices/search', async (req, res) => {
  try {
    const { item } = req.query;
    
    if (!item) {
      return res.status(400).json({ error: 'Item parameter required' });
    }

    const { data, error } = await supabase
      .from('prices')
      .select('*')
      .ilike('item_name', `%${item}%`)
      .order('last_updated', { ascending: false })
      .limit(1);

    if (error) throw error;

    res.json(data?.[0] || null);
  } catch (error) {
    console.error('Price search error:', error);
    res.status(500).json({ error: 'Failed to search prices' });
  }
});

// Updates routes
app.get('/api/updates/latest', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('updates')
      .select('*')
      .order('date', { ascending: false })
      .limit(10);

    if (error) throw error;

    res.json(data || []);
  } catch (error) {
    console.error('Updates fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch updates' });
  }
});

// Admin: Sync data
app.post('/api/admin/sync', async (req, res) => {
  try {
    const adminKey = req.headers['x-admin-key'];

    if (adminKey !== process.env.ADMIN_KEY) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Trigger data collection script
    console.log('Data sync triggered');
    res.json({ status: 'Sync started' });
  } catch (error) {
    console.error('Admin sync error:', error);
    res.status(500).json({ error: 'Failed to trigger sync' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 API Server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
});

process.on('SIGINT', () => {
  console.log('\n🔴 API server shutting down...');
  process.exit(0);
});
