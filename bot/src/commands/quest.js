const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

const API_URL = process.env.API_URL || 'http://localhost:3001';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('quest')
    .setDescription('Get Tarkov quest information')
    .addStringOption(option =>
      option.setName('name')
        .setDescription('Quest name to search')
        .setRequired(true)
    ),
  async execute(interaction) {
    await interaction.deferReply();

    try {
      const questName = interaction.options.getString('name');
      const response = await axios.get(`${API_URL}/api/quests/search`, {
        params: { name: questName }
      });

      if (!response.data || response.data.length === 0) {
        return interaction.editReply({
          embeds: [{
            color: 0xFF0000,
            title: '❌ Quest Not Found',
            description: `No quests found matching "${questName}"`
          }]
        });
      }

      const quest = response.data[0];

      const embed = new EmbedBuilder()
        .setColor(0x1976D2)
        .setTitle(quest.name)
        .setDescription(quest.description || 'No description available')
        .addFields(
          { name: '👤 Giver', value: quest.giver || 'Unknown', inline: true },
          { name: '⭐ Level', value: quest.level?.toString() || 'N/A', inline: true },
          { name: '📍 Location', value: quest.location || 'Various', inline: true },
          { name: '📋 Objectives', value: quest.objectives?.join('\n') || 'N/A' }
        )
        .setFooter({ text: 'Tarkov Bot • Data from Tarkov Wiki' })
        .setTimestamp();

      if (quest.rewards) {
        embed.addFields({
          name: '🎁 Rewards',
          value: `Experience: ${quest.rewards.xp || 0}\nItems: ${quest.rewards.items?.join(', ') || 'None'}`
        });
      }

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error('Quest command error:', error);
      await interaction.editReply({
        embeds: [{
          color: 0xFF0000,
          title: '❌ Error',
          description: 'Failed to fetch quest data. Please try again later.'
        }]
      });
    }
  }
};
