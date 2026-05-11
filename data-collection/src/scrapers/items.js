const axios = require('axios');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE,
  { auth: { persistSession: false } }
);

const TARKOV_WIKI_API = 'https://tarkov-data.github.io/api/latest/items.json';

async function syncItems() {
  try {
    console.log('📥 Fetching items from Tarkov Wiki API...');
    
    const response = await axios.get(TARKOV_WIKI_API, { timeout: 10000 });
    const items = response.data;

    if (!Array.isArray(items)) {
      throw new Error('Invalid items data format');
    }

    console.log(`📊 Found ${items.length} items. Starting import...`);

    // Process items in batches
    const batchSize = 50;
    for (let i = 0; i < items.length; i += batchSize) {
      const batch = items.slice(i, i + batchSize).map(item => ({
        name: item.name || 'Unknown',
        description: item.description || null,
        icon_url: item.iconUrl || item.icon || null,
        trader_price: item.traderPrice || null,
        flea_price: item.fleaPrice || null,
        rarity: item.rarity || null,
        width: item.width || 1,
        height: item.height || 1,
        crafting: item.crafting || []
      }));

      const { error } = await supabase
        .from('items')
        .upsert(batch, { onConflict: 'name' });

      if (error) throw error;

      console.log(`✓ Processed ${Math.min(i + batchSize, items.length)}/${items.length} items`);
    }

    console.log('✅ Items sync completed!');
    return true;
  } catch (error) {
    console.error('❌ Items sync error:', error.message);
    return false;
  }
}

module.exports = { syncItems };
