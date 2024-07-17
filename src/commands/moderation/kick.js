const { Client, Interaction, ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');
const { description } = require('../misc/ping');

module.exports = {
    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */


    callback: async (client, interaction) => {
        const targetUserId = interaction.options.get('target-user').value;
        const reason = interaction.options.get('reason')?.value || "No reason provided";

        await interaction.deferReply();

        const targetUser = await interaction.guild.members.fetch(targetUserId);

        if(!targetUser) {
            await interaction.editReply("Bro left, or already banned lmao");
            return;
        }

        if (targetUser.id === interaction.guild.ownerId) {
            interaction.editReply(' nuh uh, not kick daddy panos');
            return;
        }

        const targetUserRolePosition = targetUser.roles.highest.position; //highest role of target user
        const requestUserRolePosition = interaction.member.roles.highest.position; //highest role of user running commnd
        const botRolePosition = interaction.guild.members.me.roles.highest.position; //highest role of the bot
        
        if (targetUserRolePosition >= requestUserRolePosition) {
            await interaction.editReply('You cant beacause they are the same or just better :yawning_face: ');
            return;
        }

        if (targetUserRolePosition >= botRolePosition) {
            await interaction.editReply('I cant bc they have the same or higher role than me')
            return;
        }

        //ban the target
        try {

            await targetUser.kick(reason);
            await interaction.editReply(` ${targetUser} was kicked LOL\nReason : ${reason}`)
        } catch (error) {
            console.log(`There was an error : ${error}`);
        }
    },

    name: 'kick',
    description: 'Kicks a member ',
    //devOnly: Boolean,
    //testOnly: Boolean,
    options: [
        {
            name: 'target-user',
            description: 'the user you want to kick',
            required: true,
            type: ApplicationCommandOptionType.Mentionable,
        },
        {
            name: 'reason',
            description: 'the reason for kickin',
            type: ApplicationCommandOptionType.String,
        },
    ],
    
    permissionsRequired: [PermissionFlagsBits.KickMembers],
    botPermissions: [PermissionFlagsBits.KickMembers],

  
};