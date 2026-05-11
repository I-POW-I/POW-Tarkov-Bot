const axios = require('axios');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE,
  { auth: { persistSession: false } }
);

const TARKOV_WIKI_API = 'https://tarkov-data.github.io/api/latest/maps.json';

async function syncMaps() {
  try {
    console.log('📥 Fetching maps from Tarkov Wiki API...');
    
    const response = await axios.get(TARKOV_WIKI_API, { timeout: 10000 });
    const maps = response.data;

    if (!Array.isArray(maps)) {
      throw new Error('Invalid maps data format');
    }

    console.log(`📊 Found ${maps.length} maps. Starting import...`);

    // Process maps
    const processedMaps = maps.map(map => ({
      name: map.name || 'Unknown',
      description: map.description || null,
      image_url: map.imageUrl || map.image || null,
      raid_duration: map.raidDuration || 45,
      max_players: map.maxPlayers || 6,
      difficulty: map.difficulty || 'Medium',
      extracts: map.extracts || [],
      loot_spawns: map.lootSpawns || []
    }));

    const { error } = await supabase
      .from('maps')
      .upsert(processedMaps, { onConflict: 'name' });

    if (error) throw error;

    console.log(`✅ ${processedMaps.length} maps synced!`);
    return true;
  } catch (error) {
    console.error('❌ Maps sync error:', error.message);
    return false;
  }
}

module.exports = { syncMaps };
