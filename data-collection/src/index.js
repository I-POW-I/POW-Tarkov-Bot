require('dotenv').config();
const cron = require('node-cron');
const { syncItems } = require('./scrapers/items');
const { syncQuests } = require('./scrapers/quests');
const { syncMaps } = require('./scrapers/maps');
const { syncPrices } = require('./scrapers/prices');

console.log('🚀 Tarkov Data Collection Service Started');

// Initial sync on startup
async function initialSync() {
  console.log('\n📅 Running initial data sync...\n');
  try {
    await syncItems();
    await syncQuests();
    await syncMaps();
    await syncPrices();
    console.log('\n✅ Initial sync completed!\n');
  } catch (error) {
    console.error('❌ Initial sync failed:', error);
  }
}

// Schedule automatic updates
function scheduleUpdates() {
  // Items: 2 AM daily
  cron.schedule('0 2 * * *', async () => {
    console.log('📦 [CRON] Syncing items...');
    try {
      await syncItems();
      console.log('✅ Items synced');
    } catch (error) {
      console.error('❌ Items sync failed:', error);
    }
  });

  // Quests: 3 AM daily
  cron.schedule('0 3 * * *', async () => {
    console.log('🎯 [CRON] Syncing quests...');
    try {
      await syncQuests();
      console.log('✅ Quests synced');
    } catch (error) {
      console.error('❌ Quests sync failed:', error);
    }
  });

  // Maps: 4 AM daily
  cron.schedule('0 4 * * *', async () => {
    console.log('🗺️ [CRON] Syncing maps...');
    try {
      await syncMaps();
      console.log('✅ Maps synced');
    } catch (error) {
      console.error('❌ Maps sync failed:', error);
    }
  });

  // Prices: Every 6 hours
  cron.schedule('0 */6 * * *', async () => {
    console.log('💰 [CRON] Syncing prices...');
    try {
      await syncPrices();
      console.log('✅ Prices synced');
    } catch (error) {
      console.error('❌ Prices sync failed:', error);
    }
  });

  console.log('\n⏰ Scheduled updates configured');
}

// Start service
initialSync().then(() => {
  scheduleUpdates();
});

process.on('SIGINT', () => {
  console.log('\n🔴 Data collection service shutting down...');
  process.exit(0);
});
