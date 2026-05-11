const axios = require('axios');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE,
  { auth: { persistSession: false } }
);

const TARKOV_WIKI_API = 'https://tarkov-data.github.io/api/latest/quests.json';

async function syncQuests() {
  try {
    console.log('📥 Fetching quests from Tarkov Wiki API...');
    
    const response = await axios.get(TARKOV_WIKI_API, { timeout: 10000 });
    const quests = response.data;

    if (!Array.isArray(quests)) {
      throw new Error('Invalid quests data format');
    }

    console.log(`📊 Found ${quests.length} quests. Starting import...`);

    // Process quests
    const processedQuests = quests.map(quest => ({
      name: quest.name || 'Unknown',
      description: quest.description || null,
      giver: quest.giver || 'Unknown',
      level: quest.level || 1,
      location: quest.location || 'Various',
      objectives: quest.objectives || [],
      rewards_xp: quest.rewardsXp || 0,
      rewards_items: quest.rewardsItems || []
    }));

    const { error } = await supabase
      .from('quests')
      .upsert(processedQuests, { onConflict: 'name' });

    if (error) throw error;

    console.log(`✅ ${processedQuests.length} quests synced!`);
    return true;
  } catch (error) {
    console.error('❌ Quests sync error:', error.message);
    return false;
  }
}

module.exports = { syncQuests };
