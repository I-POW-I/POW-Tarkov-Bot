/**
 * Stats Command
 *
 * Show bot and user statistics
 */

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stats')
    .setDescription('View bot and server statistics')
    .addSubcommand(subcommand =>
      subcommand
        .setName('bot')
        .setDescription('View bot statistics')
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('server')
        .setDescription('View this server\'s usage statistics')
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('me')
        .setDescription('View your personal statistics')
    ),

  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();

    switch (subcommand) {
      case 'bot':
        await handleBotStats(interaction);
        break;
      case 'server':
        await handleServerStats(interaction);
        break;
      case 'me':
        await handleUserStats(interaction);
        break;
      default:
        await interaction.reply({ content: 'Unknown subcommand', ephemeral: true });
    }
  },
};

async function handleBotStats(interaction) {
  await interaction.deferReply();

  try {
    const supabase = interaction.client.supabase;

    // Get data counts
    const [items, tasks, maps, traders, bosses] = await Promise.all([
      supabase.from('items_cache').select('id', { count: 'exact', head: true }),
      supabase.from('tasks_cache').select('id', { count: 'exact', head: true }),
      supabase.from('maps_cache').select('id', { count: 'exact', head: true }),
      supabase.from('traders_cache').select('id', { count: 'exact', head: true }),
      supabase.from('bosses_cache').select('id', { count: 'exact', head: true }),
    ]);

    // Get command usage stats
    const { data: commandStats } = await supabase
      .from('command_logs')
      .select('command_name')
      .order('created_at', { ascending: false })
      .limit(1000);

    const commandCounts = {};
    (commandStats || []).forEach(log => {
      commandCounts[log.command_name] = (commandCounts[log.command_name] || 0) + 1;
    });

    const topCommands = Object.entries(commandCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    const embed = new EmbedBuilder()
      .setTitle('📊 POW Tarkov Bot Statistics')
      .setColor(0xcda755)
      .addFields(
        {
          name: '📚 Database',
          value: [
            `**${items.count?.toLocaleString() || 0}** items`,
            `**${tasks.count?.toLocaleString() || 0}** tasks`,
            `**${maps.count?.toLocaleString() || 0}** maps`,
            `**${traders.count?.toLocaleString() || 0}** traders`,
            `**${bosses.count?.toLocaleString() || 0}** bosses`,
          ].join('\n'),
          inline: true,
        },
        {
          name: '🤖 Bot Info',
          value: [
            `**${interaction.client.guilds.cache.size}** servers`,
            `**${interaction.client.users.cache.size}** users cached`,
            `Uptime: ${formatUptime(process.uptime())}`,
          ].join('\n'),
          inline: true,
        },
      );

    if (topCommands.length > 0) {
      embed.addFields({
        name: '📈 Top Commands',
        value: topCommands.map(([cmd, count]) => `/${cmd}: **${count}** uses`).join('\n'),
        inline: false,
      });
    }

    embed
      .setFooter({ text: 'Data synced from Tarkov.dev API' })
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });
  } catch (error) {
    console.error('Error fetching bot stats:', error);
    await interaction.editReply({ content: 'Failed to fetch statistics.' });
  }
}

async function handleServerStats(interaction) {
  await interaction.deferReply();

  const guild = interaction.guild;

  const embed = new EmbedBuilder()
    .setTitle(`📊 ${guild.name} Statistics`)
    .setColor(0xcda755)
    .setThumbnail(guild.iconURL({ dynamic: true, size: 128 }))
    .addFields(
      { name: 'Members', value: `${guild.memberCount}`, inline: true },
      { name: 'Channels', value: `${guild.channels.cache.size}`, inline: true },
      { name: 'Roles', value: `${guild.roles.cache.size}`, inline: true },
    )
    .setFooter({ text: `Server ID: ${guild.id}` })
    .setTimestamp();

  await interaction.editReply({ embeds: [embed] });
}

async function handleUserStats(interaction) {
  await interaction.deferReply({ ephemeral: true });

  try {
    const supabase = interaction.client.supabase;
    const discordId = interaction.user.id;

    // Check if user is registered
    const { data: user } = await supabase
      .from('users')
      .select('id, discord_username, display_name, created_at')
      .eq('discord_id', discordId)
      .single();

    if (!user) {
      const embed = new EmbedBuilder()
        .setTitle('❌ Not Registered')
        .setDescription('You need to register first to track your progress.\n\nUse `/register` to get started.')
        .setColor(0xef4444);

      await interaction.editReply({ embeds: [embed] });
      return;
    }

    // Get user progress
    const { data: stats } = await supabase.rpc('get_user_stats', { p_user_id: user.id });

    // Get command usage
    const { data: commands } = await supabase
      .from('command_logs')
      .select('command_name')
      .eq('discord_user_id', discordId)
      .order('created_at', { ascending: false })
      .limit(100);

    const commandCounts = {};
    (commands || []).forEach(log => {
      commandCounts[log.command_name] = (commandCounts[log.command_name] || 0) + 1;
    });

    const embed = new EmbedBuilder()
      .setTitle(`📊 Your Statistics`)
      .setColor(0xcda755)
      .addFields(
        {
          name: '📋 Task Progress',
          value: [
            `Completed: **${stats?.completed_tasks || 0}**`,
            `Kappa Progress: **${stats?.kappa_progress || 0}%**`,
          ].join('\n'),
          inline: true,
        },
        {
          name: '🛒 Shopping List',
          value: [
            `Items Needed: **${stats?.shopping_list_items || 0}**`,
            `FIR Items: **${stats?.fir_items_needed || 0}**`,
          ].join('\n'),
          inline: true,
        },
      );

    if (Object.keys(commandCounts).length > 0) {
      const topCommands = Object.entries(commandCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

      embed.addFields({
        name: '📊 Your Top Commands',
        value: topCommands.map(([cmd, count]) => `/${cmd}: **${count}** uses`).join('\n'),
        inline: false,
      });
    }

    embed
      .setFooter({ text: `Member since ${new Date(user.created_at).toLocaleDateString()}` })
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    await interaction.editReply({ content: 'Failed to fetch your statistics.' });
  }
}

function formatUptime(seconds) {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);

  return parts.join(' ') || '< 1m';
}
