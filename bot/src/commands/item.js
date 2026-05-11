const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

const API_URL = process.env.API_URL || 'http://localhost:3001';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('item')
    .setDescription('Search for a Tarkov item')
    .addStringOption(option =>
      option.setName('name')
        .setDescription('Item name to search')
        .setRequired(true)
    ),
  async execute(interaction) {
    await interaction.deferReply();

    try {
      const itemName = interaction.options.getString('name');
      const response = await axios.get(`${API_URL}/api/items/search`, {
        params: { name: itemName }
      });

      if (!response.data || response.data.length === 0) {
        return interaction.editReply({
          embeds: [{
            color: 0xFF0000,
            title: '❌ Item Not Found',
            description: `No items found matching "${itemName}"`
          }]
        });
      }

      const item = response.data[0];

      const embed = new EmbedBuilder()
        .setColor(0x2E7D32)
        .setTitle(item.name)
        .setDescription(item.description || 'No description available')
        .setThumbnail(item.iconUrl || null)
        .addFields(
          { name: '💰 Trader Price', value: `${item.traderPrice?.toLocaleString()} ₽` || 'N/A', inline: true },
          { name: '📊 Flea Price', value: `${item.fleaPrice?.toLocaleString()} ₽` || 'N/A', inline: true },
          { name: '🎯 Rarity', value: item.rarity || 'N/A', inline: true },
          { name: '📦 Size', value: `${item.width}x${item.height}` || 'N/A', inline: true }
        )
        .setFooter({ text: 'Tarkov Bot • Data from Tarkov Wiki' })
        .setTimestamp();

      if (item.crafting && item.crafting.length > 0) {
        const craftingInfo = item.crafting.map(c => `• ${c}`).join('\n');
        embed.addFields({ name: '🔨 Crafting', value: craftingInfo || 'N/A' });
      }

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error('Item command error:', error);
      await interaction.editReply({
        embeds: [{
          color: 0xFF0000,
          title: '❌ Error',
          description: 'Failed to fetch item data. Please try again later.'
        }]
      });
    }
  }
};
