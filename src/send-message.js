require('dotenv').config();
const { Client, IntentsBitField, EmbedBuilder, ActionRow, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js'); 

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds, 
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ],
});

const roles = [
    {
        id: '1261000398697660426',
        label: '♀️ Female',
    },
    {
        id: '1261000433330294804',
        label: '♂️ Male',
    },
    {
        id: '1261000465441624225',
        label: 'Valorant',
    },
    {
        id: '1261000717016105174',
        label: 'Minecraft',
    },

    {
        id:'1261000619641278465',
        label:'Fortnite',
    },
   

]
client.on('ready', async (c) => {
    try {
        const channel = await client.channels.cache.get('1261002109604724778');
        if (!channel) return;

        const row = new ActionRowBuilder();
        roles.forEach((role) => {
            row.components.push(
                new ButtonBuilder().setCustomId(role.id).setLabel(role.label).setStyle
                (ButtonStyle.Primary)
            )
        });

       await channel.send({
            content: '# Claim or remove a role',
            components: [row]
        });
        process.exit();

    } catch (error) {
        console.log(error);
    }
})


client.login(process.env.TOKEN); 