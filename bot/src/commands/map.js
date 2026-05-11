const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

const API_URL = process.env.API_URL || 'http://localhost:3001';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('map')
    .setDescription('Display Tarkov map with spawns and extracts')
    .addStringOption(option =>
      option.setName('name')
        .setDescription('Map name (e.g., woods, customs, interchange)')
        .setRequired(true)
    ),
  async execute(interaction) {
    await interaction.deferReply();

    try {
      const mapName = interaction.options.getString('name');
      const response = await axios.get(`${API_URL}/api/maps/search`, {
        params: { name: mapName }
      });

      if (!response.data) {
        return interaction.editReply({
          embeds: [{
            color: 0xFF0000,
            title: '❌ Map Not Found',
            description: `No map data found for "${mapName}"`
          }]
        });
      }

      const map = response.data;

      const embed = new EmbedBuilder()
        .setColor(0x4CAF50)
        .setTitle(`📍 ${map.name}`)
        .setDescription(map.description || 'No description available')
        .setImage(map.imageUrl || null)
        .addFields(
          { name: '⏱️ Raid Duration', value: `${map.raidDuration} minutes`, inline: true },
          { name: '👥 Max Players', value: map.maxPlayers?.toString() || 'N/A', inline: true },
          { name: '📊 Difficulty', value: map.difficulty || 'N/A', inline: true }
        )
        .setFooter({ text: 'Tarkov Bot • Data from Tarkov Wiki' })
        .setTimestamp();

      if (map.extracts && map.extracts.length > 0) {
        const extractList = map.extracts.slice(0, 5).map(e => `• ${e}`).join('\n');
        embed.addFields({ name: '🚪 Extracts', value: extractList });
      }

      if (map.lootSpawns && map.lootSpawns.length > 0) {
        const lootList = map.lootSpawns.slice(0, 5).map(l => `• ${l}`).join('\n');
        embed.addFields({ name: '💎 Key Loot Spawns', value: lootList });
      }

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error('Map command error:', error);
      await interaction.editReply({
        embeds: [{
          color: 0xFF0000,
          title: '❌ Error',
          description: 'Failed to fetch map data. Please try again later.'
        }]
      });
    }
  }
};
