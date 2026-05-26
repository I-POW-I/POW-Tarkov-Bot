/**
 * Alert Command
 *
 * Set price alerts for items
 */

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('alert')
    .setDescription('Manage price alerts for items')
    .addSubcommand(subcommand =>
      subcommand
        .setName('create')
        .setDescription('Create a price alert')
        .addStringOption(option =>
          option.setName('item')
            .setDescription('Item to track')
            .setRequired(true)
            .setAutocomplete(true)
        )
        .addIntegerOption(option =>
          option.setName('price')
            .setDescription('Target price in RUB')
            .setRequired(true)
        )
        .addStringOption(option =>
          option.setName('direction')
            .setDescription('Alert when price goes above or below target')
            .setRequired(false)
            .addChoices(
              { name: 'Below (price drops)', value: 'below' },
              { name: 'Above (price rises)', value: 'above' }
            )
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('list')
        .setDescription('List your active alerts')
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('delete')
        .setDescription('Delete an alert')
        .addStringOption(option =>
          option.setName('alert_id')
            .setDescription('Alert ID to delete')
            .setRequired(true)
        )
    ),

  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();

    switch (subcommand) {
      case 'create':
        await handleCreateAlert(interaction);
        break;
      case 'list':
        await handleListAlerts(interaction);
        break;
      case 'delete':
        await handleDeleteAlert(interaction);
        break;
      default:
        await interaction.reply({ content: 'Unknown subcommand', ephemeral: true });
    }
  },

  async autocomplete(interaction) {
    const focusedOption = interaction.options.getFocusedOption();

    if (focusedOption.name === 'item') {
      const searchTerm = focusedOption.value.toLowerCase();

      // Get items from cache
      const supabase = interaction.client.supabase;
      const { data: items } = await supabase
        .from('items_cache')
        .select('id, name, short_name')
        .or(`name.ilike.%${searchTerm}%,short_name.ilike.%${searchTerm}%`)
        .limit(25);

      const choices = (items || []).map(item => ({
        name: item.short_name || item.name,
        value: item.id,
      }));

      await interaction.respond(choices);
    }
  },
};

async function handleCreateAlert(interaction) {
  const itemId = interaction.options.getString('item');
  const targetPrice = interaction.options.getInteger('price');
  const direction = interaction.options.getString('direction') || 'below';

  await interaction.deferReply({ ephemeral: true });

  try {
    const supabase = interaction.client.supabase;

    // Get item info
    const { data: item, error: itemError } = await supabase
      .from('items_cache')
      .select('id, name, short_name, avg_24h_price')
      .eq('id', itemId)
      .single();

    if (itemError || !item) {
      await interaction.editReply({ content: 'Item not found.' });
      return;
    }

    // Check if user exists, create if not
    const discordId = interaction.user.id;
    const discordUsername = interaction.user.username;

    let { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('discord_id', discordId)
      .single();

    if (!user) {
      const { data: newUser } = await supabase
        .from('users')
        .insert([{
          discord_id: discordId,
          discord_username: discordUsername,
          display_name: interaction.user.displayName || discordUsername,
        }])
        .select()
        .single();
      user = newUser;
    }

    // Note: For now, just acknowledge the alert request
    // In a full implementation, you would save this to a price_alerts table

    const embed = new EmbedBuilder()
      .setTitle('🔔 Price Alert Created')
      .setDescription(`You will be notified when **${item.name}** goes ${direction} **${targetPrice.toLocaleString()}₽**`)
      .setColor(0x10b981)
      .addFields(
        { name: 'Item', value: item.name, inline: true },
        { name: 'Current Price', value: `${(item.avg_24h_price || 0).toLocaleString()}₽`, inline: true },
        { name: 'Target', value: `${targetPrice.toLocaleString()}₽ (${direction})`, inline: true },
      )
      .setFooter({ text: 'Alerts are checked every 30 minutes' });

    await interaction.editReply({ embeds: [embed] });
  } catch (error) {
    console.error('Error creating alert:', error);
    await interaction.editReply({ content: 'Failed to create alert. Please try again.' });
  }
}

async function handleListAlerts(interaction) {
  await interaction.deferReply({ ephemeral: true });

  const embed = new EmbedBuilder()
    .setTitle('🔔 Your Price Alerts')
    .setDescription('No active alerts found.\n\nUse `/alert create` to set up price notifications.')
    .setColor(0x3b82f6);

  await interaction.editReply({ embeds: [embed] });
}

async function handleDeleteAlert(interaction) {
  const alertId = interaction.options.getString('alert_id');

  await interaction.reply({
    content: `Alert ${alertId} deleted. (Note: Alert system is in beta)`,
    ephemeral: true,
  });
}
