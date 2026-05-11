const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

const API_URL = process.env.API_URL || 'http://localhost:3001';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('updates')
    .setDescription('Get latest Tarkov patch notes and updates'),
  async execute(interaction) {
    await interaction.deferReply();

    try {
      const response = await axios.get(`${API_URL}/api/updates/latest`);

      if (!response.data || response.data.length === 0) {
        return interaction.editReply({
          embeds: [{
            color: 0xFF0000,
            title: '❌ No Updates Found',
            description: 'No recent patch notes available'
          }]
        });
      }

      const updates = response.data.slice(0, 3);

      const embeds = updates.map((update, idx) => {
        const embed = new EmbedBuilder()
          .setColor(0x2196F3)
          .setTitle(`📝 Patch ${update.version}`)
          .setDescription(update.description || 'No description available')
          .addFields(
            { name: '📅 Date', value: new Date(update.date).toLocaleDateString(), inline: true },
            { name: '🔗 Type', value: update.type || 'Update', inline: true }
          )
          .setFooter({ text: `Update ${idx + 1} of ${updates.length}` });

        if (update.changes && update.changes.length > 0) {
          const changesList = update.changes.slice(0, 5).map(c => `• ${c}`).join('\n');
          embed.addFields({ name: '📋 Changes', value: changesList });
        }

        return embed;
      });

      await interaction.editReply({ embeds });
    } catch (error) {
      console.error('Updates command error:', error);
      await interaction.editReply({
        embeds: [{
          color: 0xFF0000,
          title: '❌ Error',
          description: 'Failed to fetch update data. Please try again later.'
        }]
      });
    }
  }
};
