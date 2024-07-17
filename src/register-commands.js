require('dotenv').config();
const { REST, Routes, ApplicationCommandOptionType } = require('discord.js');

const commands = [
    {
        name: 'embed',
        description: 'sends an embed',
    },
    {
        name: 'add',
        description: 'adds two numbers brrr',
        options: [
            {
                name: 'first-number',
                description: 'the first number',
                type: ApplicationCommandOptionType.Number,
                choices: [
                    {
                        name: 'one',
                        value: 1,
                    },
                    {
                        name: 'two',
                        value: 2,
                    },
                    {
                        name: 'three',
                        value: 3,
                    },
                ],
                required: true,
            },
            {
                name: 'second-number',
                description: 'the second number',
                type: ApplicationCommandOptionType.Number,
                required: true,
            },
        ],
    },
];


const rest = new REST({ version: '10'}).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log('Registering slash commands...');

        await rest.put(
            Routes.applicationGuildCommands(
                process.env.CLIENT_ID,
                process.env.GUILD_ID
                ),
            { body: commands }
        );

        console.log('Slash commands were registered');

    } catch (error) {
        console.log(`An error has been occured: ${error}`);
    }
})();