module.exports = {
  name: 'ready',
  once: true,
  execute(client) {
    console.log(`✅ Bot logged in as ${client.user.tag}`);
    console.log(`🤖 Bot is ready to serve ${client.guilds.cache.size} guilds`);
    
    client.user.setActivity('Escape from Tarkov', { type: 'PLAYING' });
  }
};
