const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Bans members')
        .addUserOption(option => option.setName('user').setDescription('The member you want to ban').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('The reason you want to ban').setRequired(false)),
    async execute(interaction, client) {
        const user = interaction.options.getUser('user');
        const member = interaction.guild.members.cache.get(user.id);
        const reason = interaction.options.getString('reason') || 'No reason provided';

        // Check if the member executing the command has ban permissions
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
            return await interaction.reply({
                content: "You do not have permission to ban members.",
                ephemeral: true
            });
        }

        // Prevent banning oneself
        if (interaction.member.id === user.id) {
            return await interaction.reply({
                content: 'You cannot ban yourself.',
                ephemeral: true
            });
        }

        // Embed to notify the user being banned
        const dmEmbed = new EmbedBuilder()
            .setColor('Blue')
            .setDescription(`:white_check_mark: You have been banned from **${interaction.guild.name}** | ${reason}`);

        // Embed to notify the server about the ban
        const embed = new EmbedBuilder()
            .setColor('Blue')
            .setDescription(`:white_check_mark: ${user.tag} has been banned | ${reason}`);

        try {
            // Send a DM to the user being banned
            await user.send({ embeds: [dmEmbed] }).catch(err => console.log("Could not send DM to the user.", err));

            // Ban the user from the guild
            await interaction.guild.members.ban(user.id, { reason });

            // Respond to the interaction with the ban confirmation
            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error("Error banning the member:", error);
            return interaction.reply({ content: "I can't ban this member.", ephemeral: true });
        }
    }
};
