const {
  Client,
  Interaction,
  ApplicationCommandOptionType,
  AttachmentBuilder,
} = require('discord.js');
const { RankCardBuilder, Font } = require('canvacord');
const calculateLevelXp = require('../../utils/calculateLevelXp');
const Level = require('../../models/Level');
Font.loadDefault();

module.exports = {
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */
  callback: async (client, interaction) => {
    if (!interaction.inGuild()) {
      interaction.reply('You can only run this command inside a server.');
      return;
    }

    await interaction.deferReply();

    const mentionedUserId = interaction.options.get('target-user')?.value;
    const targetUserId = mentionedUserId || interaction.member.id;
    const targetUserObj = await interaction.guild.members.fetch(targetUserId);

    const fetchedLevel = await Level.findOne({
      userId: targetUserId,
      guildId: interaction.guild.id,
    });

    if (!fetchedLevel) {
      interaction.editReply(
        mentionedUserId
          ? `${targetUserObj.user.tag} doesn't have any levels yet. Try again when they chat a little more.`
          : "You don't have any levels yet. Chat a little more and try again."
      );
      return;
    }

    let allLevels = await Level.find({ guildId: interaction.guild.id }).select(
      '-_id userId level xp'
    );

    console.log('Fetched levels:', allLevels.length);

    allLevels.sort((a, b) => {
      if (a.level === b.level) {
        return b.xp - a.xp;
      } else {
        return b.level - a.level;
      }
    });

    let currentRank = allLevels.findIndex((lvl) => lvl.userId === targetUserId) + 1;

    const rank = new RankCardBuilder()
      .setBackground("https://i.pinimg.com/originals/cc/b6/53/ccb65300812bccea07c5dcfdbc41900e.jpg")
      .setAvatar(targetUserObj.user.displayAvatarURL({ size: 512 }))
      .setRank(currentRank)
      .setOverlay(1)
      .setStyles({
        progressbar: {
           thumb: {
             style: {
               backgroundColor: "#FF0000"
             }
           }
         },
        })
      .setLevel(fetchedLevel.level)
      .setCurrentXP(fetchedLevel.xp)
      .setRequiredXP(calculateLevelXp(fetchedLevel.level))
      .setUsername(targetUserObj.user.username)
      .setDisplayName(targetUserObj.user.displayName);
  
    const data = await rank.build();
    const attachment = new AttachmentBuilder(data);
    interaction.editReply({ files: [attachment] });

    // Ensuring function exit after reply
    return;
  },

  name: 'level',
  description: "Shows your/someone's level.",
  options: [
    {
      name: 'target-user',
      description: 'The user whose level you want to see.',
      type: ApplicationCommandOptionType.Mentionable,
    },
  ],
};
