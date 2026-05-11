const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('raidtimer')
    .setDescription('Start a raid countdown timer')
    .addIntegerOption(option =>
      option.setName('minutes')
        .setDescription('Raid duration in minutes')
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(60)
    ),
  async execute(interaction) {
    const minutes = interaction.options.getInteger('minutes');
    const endTime = Date.now() + minutes * 60000;

    const embed = new EmbedBuilder()
      .setColor(0xF44336)
      .setTitle('⏱️ Raid Timer Started')
      .setDescription(`Raid ends in ${minutes} minute(s)`)
      .addFields(
        { name: '⏰ End Time', value: `<t:${Math.floor(endTime / 1000)}:t>`, inline: true },
        { name: '📊 Duration', value: `${minutes} minute(s)`, inline: true }
      )
      .setFooter({ text: 'Get out before the timer expires!' })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });

    // Send warning at 5 minutes
    if (minutes > 5) {
      setTimeout(() => {
        if (interaction.channel) {
          const warningEmbed = new EmbedBuilder()
            .setColor(0xFF9800)
            .setTitle('⚠️ 5 Minute Warning')
            .setDescription('Get to an extract!')
            .setTimestamp();
          interaction.channel.send({ embeds: [warningEmbed] });
        }
      }, (minutes - 5) * 60000);
    }
  }
};
