const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

const API_URL = process.env.API_URL || 'http://localhost:3001';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('prices')
    .setDescription('Check Tarkov item prices on flea market and traders')
    .addStringOption(option =>
      option.setName('item')
        .setDescription('Item name')
        .setRequired(true)
    ),
  async execute(interaction) {
    await interaction.deferReply();

    try {
      const itemName = interaction.options.getString('item');
      const response = await axios.get(`${API_URL}/api/prices/search`, {
        params: { item: itemName }
      });

      if (!response.data) {
        return interaction.editReply({
          embeds: [{
            color: 0xFF0000,
            title: '❌ Prices Not Found',
            description: `No price data found for "${itemName}"`
          }]
        });
      }

      const priceData = response.data;

      const embed = new EmbedBuilder()
        .setColor(0xFF9800)
        .setTitle(`💰 ${priceData.itemName}`)
        .addFields(
          {
            name: '📊 Flea Market',
            value: `Average: ${priceData.fleaAvg?.toLocaleString()} ₽\nLowest: ${priceData.fleaMin?.toLocaleString()} ₽\nHighest: ${priceData.fleaMax?.toLocaleString()} ₽`,
            inline: true
          },
          {
            name: '🏪 Traders',
            value: priceData.traderPrices?.map(t => `${t.traderName}: ${t.price?.toLocaleString()} ₽`).join('\n') || 'N/A',
            inline: true
          }
        )
        .setFooter({ text: `Last updated: ${new Date(priceData.lastUpdated).toLocaleString()}` })
        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error('Prices command error:', error);
      await interaction.editReply({
        embeds: [{
          color: 0xFF0000,
          title: '❌ Error',
          description: 'Failed to fetch price data. Please try again later.'
        }]
      });
    }
  }
};
