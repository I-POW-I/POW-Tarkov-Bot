/**
 * Help Command
 *
 * Shows available commands and usage information
 */

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Show available commands and usage information')
    .addStringOption(option =>
      option.setName('command')
        .setDescription('Get help for a specific command')
        .setRequired(false)
    ),

  async execute(interaction) {
    const specificCommand = interaction.options.getString('command');

    if (specificCommand) {
      // Show help for specific command
      const commandHelp = getCommandHelp(specificCommand.toLowerCase());
      await interaction.reply({ embeds: [commandHelp], ephemeral: true });
    } else {
      // Show all commands
      const helpEmbed = getAllCommandsHelp();
      await interaction.reply({ embeds: [helpEmbed], ephemeral: true });
    }
  },
};

function getAllCommandsHelp() {
  return new EmbedBuilder()
    .setTitle('📖 POW Tarkov Bot - Command Reference')
    .setDescription('Your Escape from Tarkov companion. Use these commands to quickly look up game information.')
    .setColor(0xcda755)
    .addFields(
      {
        name: '🔍 Item & Price Commands',
        value: [
          '`/item <name>` - Look up an item with prices and usage',
          '`/price <item>` - Quick price check for an item',
          '`/prices` - View current market overview',
          '`/trending` - See trending items (price movers)',
        ].join('\n'),
        inline: false,
      },
      {
        name: '📋 Task Commands',
        value: [
          '`/task <name>` - Detailed task info with objectives',
          '`/tasks` - List all tasks with filters',
          '`/needed` - Items needed for your pending tasks',
          '`/progress` - View your quest progress',
          '`/complete <task>` - Mark a task as complete',
        ].join('\n'),
        inline: false,
      },
      {
        name: '🗺️ Map & Location Commands',
        value: [
          '`/map <name>` - Map details with extracts and bosses',
          '`/raidtimer` - Raid countdown timer',
        ].join('\n'),
        inline: false,
      },
      {
        name: '👤 Trader Commands',
        value: [
          '`/trader <name>` - Trader info with barters and loyalty',
          '`/barters` - Search barter trades',
        ].join('\n'),
        inline: false,
      },
      {
        name: '🏭 Hideout Commands',
        value: [
          '`/hideout <station>` - Hideout station details',
          '`/craft <item>` - Crafting recipes for an item',
        ].join('\n'),
        inline: false,
      },
      {
        name: '💀 Boss Commands',
        value: [
          '`/boss <name>` - Boss information and spawn chances',
          '`/bosses` - List all bosses',
        ].join('\n'),
        inline: false,
      },
      {
        name: '⚙️ User Commands',
        value: [
          '`/register` - Register your Discord account',
          '`/updates` - View recent game updates',
        ].join('\n'),
        inline: false,
      },
    )
    .setFooter({ text: 'Use /help <command> for detailed usage' })
    .setTimestamp();
}

function getCommandHelp(commandName) {
  const commands = {
    item: {
      title: 'Item Command',
      usage: '/item <name>',
      description: 'Look up detailed information about an item including trader prices, flea market price, and where it\'s used.',
      examples: ['/item LEDX', '/item GPU', '/item red rebel'],
    },
    price: {
      title: 'Price Command',
      usage: '/price <item>',
      description: 'Quick price check for an item. Shows flea market price and trader offers.',
      examples: ['/price Bitcoin', '/price Thicc Item Case'],
    },
    task: {
      title: 'Task Command',
      usage: '/task <name>',
      description: 'Get detailed task information including objectives, rewards, and prerequisites.',
      examples: ['/task Chemical Part 1', '/task Collector', '/task Kappa'],
    },
    map: {
      title: 'Map Command',
      usage: '/map <name>',
      description: 'View map information including extracts, spawn points, and boss spawns.',
      examples: ['/map Customs', '/map Shoreline', '/map Reserve'],
    },
    boss: {
      title: 'Boss Command',
      usage: '/boss <name>',
      description: 'Get boss information including spawn locations, followers, and loot.',
      examples: ['/boss Killa', '/boss Glukhar', '/boss Tagilla'],
    },
    trader: {
      title: 'Trader Command',
      usage: '/trader <name>',
      description: 'View trader information including loyalty levels, barters, and reset times.',
      examples: ['/trader Mechanic', '/trader Ragman', '/trader Jaeger'],
    },
    hideout: {
      title: 'Hideout Command',
      usage: '/hideout <station>',
      description: 'Get hideout station information with upgrade requirements.',
      examples: ['/hideout Workbench', '/hideout Intelligence Center'],
    },
    craft: {
      title: 'Craft Command',
      usage: '/craft <item>',
      description: 'Find crafting recipes that produce or use the specified item.',
      examples: ['/craft GPU', '/craft Magazine Case'],
    },
    needed: {
      title: 'Needed Command',
      usage: '/needed',
      description: 'Shows all items you need for your pending tasks. Requires registration.',
      notes: 'You must be registered with /register to use this command.',
    },
    progress: {
      title: 'Progress Command',
      usage: '/progress',
      description: 'View your overall quest progress and statistics.',
      notes: 'You must be registered with /register to use this command.',
    },
  };

  const cmd = commands[commandName];

  if (!cmd) {
    return new EmbedBuilder()
      .setTitle('❓ Command Not Found')
      .setDescription(`No help available for "${commandName}". Use /help to see all commands.`)
      .setColor(0xef4444);
  }

  const embed = new EmbedBuilder()
    .setTitle(`📘 ${cmd.title}`)
    .setDescription(cmd.description)
    .setColor(0xcda755)
    .addFields(
      { name: 'Usage', value: `\`${cmd.usage}\``, inline: false },
    );

  if (cmd.examples) {
    embed.addFields({ name: 'Examples', value: cmd.examples.map(e => `\`${e}\``).join('\n'), inline: false });
  }

  if (cmd.notes) {
    embed.addFields({ name: 'Note', value: cmd.notes, inline: false });
  }

  return embed;
}
