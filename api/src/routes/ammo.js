/**
 * Ammo API Routes
 *
 * Endpoints for ammo charts, ballistics, and comparisons
 */

const express = require('express');
const router = express.Router();

// Get all ammo items with ballistics data
router.get('/', async (req, res) => {
  const supabase = req.app.locals.supabase;

  try {
    const { calibre, search, page = 1, limit = 100 } = req.query;
    const offset = (page - 1) * limit;

    let query = supabase
      .from('items_cache')
      .select('id, name, short_name, icon_url, image_url, base_price, avg_24h_price, types, width, height, weight, description', { count: 'exact' })
      .contains('types', ['ammo'])
      .order('name')
      .range(offset, offset + limit - 1);

    if (search) {
      query = query.ilike('name', `%${search}%`);
    }

    // Filter by calibre if provided
    if (calibre) {
      query = query.ilike('name', `${calibre}%`);
    }

    const { data, error, count } = await query;

    if (error) throw error;

    // Group by calibre
    const grouped = {};
    data.forEach(ammo => {
      const calibre = extractCalibre(ammo.name);
      if (!grouped[calibre]) {
        grouped[calibre] = [];
      }
      grouped[calibre].push(ammo);
    });

    res.json({
      ammo: data,
      grouped,
      total: count,
      page: parseInt(page),
      limit: parseInt(limit),
    });
  } catch (error) {
    console.error('Ammo fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch ammo data' });
  }
});

// Get ammo details by ID
router.get('/:id', async (req, res) => {
  const supabase = req.app.locals.supabase;

  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('items_cache')
      .select('*')
      .eq('id', id)
      .contains('types', ['ammo'])
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Ammo not found' });
      }
      throw error;
    }

    // Get related items (same calibre)
    const calibre = extractCalibre(data.name);
    const { data: related } = await supabase
      .from('items_cache')
      .select('id, name, short_name, icon_url, base_price, avg_24h_price')
      .ilike('name', `${calibre}%`)
      .neq('id', id)
      .contains('types', ['ammo'])
      .limit(10);

    // Get weapons that use this ammo
    const { data: weapons } = await supabase
      .from('items_cache')
      .select('id, name, short_name, icon_url')
      .or(`description.ilike.%${calibre}%`)
      .contains('types', ['gun'])
      .limit(10);

    res.json({
      ammo: data,
      calibre,
      related_ammo: related || [],
      compatible_weapons: weapons || [],
    });
  } catch (error) {
    console.error('Ammo detail fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch ammo details' });
  }
});

// Get ammo calibre list
router.get('/calibres/list', async (req, res) => {
  const supabase = req.app.locals.supabase;

  try {
    const { data, error } = await supabase
      .from('items_cache')
      .select('name')
      .contains('types', ['ammo'])
      .order('name');

    if (error) throw error;

    // Extract unique calibres
    const calibres = new Set();
    data.forEach(item => {
      const calibre = extractCalibre(item.name);
      if (calibre) {
        calibres.add(calibre);
      }
    });

    res.json({
      calibres: Array.from(calibres).sort(),
    });
  } catch (error) {
    console.error('Calibre list fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch calibre list' });
  }
});

// Compare multiple ammo types
router.post('/compare', async (req, res) => {
  const supabase = req.app.locals.supabase;

  try {
    const { ammo_ids } = req.body;

    if (!ammo_ids || !Array.isArray(ammo_ids) || ammo_ids.length === 0) {
      return res.status(400).json({ error: 'ammo_ids array required' });
    }

    const { data, error } = await supabase
      .from('items_cache')
      .select('id, name, short_name, icon_url, base_price, avg_24h_price, description, weight')
      .in('id', ammo_ids)
      .contains('types', ['ammo']);

    if (error) throw error;

    res.json({
      ammo: data,
      comparison: generateComparison(data),
    });
  } catch (error) {
    console.error('Ammo comparison error:', error);
    res.status(500).json({ error: 'Failed to compare ammo' });
  }
});

// Helper function to extract calibre from ammo name
function extractCalibre(name) {
  if (!name) return null;

  // Common calibre patterns
  const patterns = [
    /^(\d+\.?\d*x\d+mm)/i,  // 5.56x45mm, 7.62x39mm, etc.
    /^(\d+mm)/i,            // 40mm, 9mm, etc.
    /^(\d+\/\d+)/i,          // 12/70, 20/70 (shotgun)
    /^(12 gauge)/i,         // 12 gauge
  ];

  for (const pattern of patterns) {
    const match = name.match(pattern);
    if (match) {
      return match[1];
    }
  }

  // Default - return first "word" before space
  return name.split(' ')[0];
}

// Generate comparison data for ammo chart
function generateComparison(ammoList) {
  if (!ammoList || ammoList.length === 0) return null;

  const comparison = {
    cheapest: null,
    mostExpensive: null,
    priceRange: 0,
  };

  const sorted = [...ammoList].sort((a, b) =>
    (a.avg_24h_price || a.base_price || 0) - (b.avg_24h_price || b.base_price || 0)
  );

  comparison.cheapest = sorted[0];
  comparison.mostExpensive = sorted[sorted.length - 1];
  comparison.priceRange = (comparison.mostExpensive?.avg_24h_price || 0) - (comparison.cheapest?.avg_24h_price || 0);

  return comparison;
}

module.exports = router;
