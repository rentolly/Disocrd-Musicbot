import 'dotenv/config';
import { Collection, REST, Routes } from 'discord.js';
import { loadCommands } from '../handlers/commands.js';

const envVariables = ['BOT_TOKEN', 'BOT_ID', 'DEV_GUILD'];

for (const variable of envVariables) {
    if (!process.env[variable])
        throw new Error(`[ENV] ${variable} is missing.`);
}

const client = { commands: new Collection() };
await loadCommands(client);

const { devCommands, otherCommands } = client.commands.reduce(
    (acc, { data }) => {
        const { command, category } = data;

        if (category.includes('dev')) {
            acc.devCommands.push(command.toJSON());
        } else {
            acc.otherCommands.push(command.toJSON());
        }

        return acc;
    },
    { devCommands: [], otherCommands: [] },
);

const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);

const registerCommand = async () => {
    try {
        const devData = await rest.put(
            Routes.applicationGuildCommands(
                process.env.BOT_ID,
                process.env.DEV_GUILD,
            ),
            { body: devCommands },
        );
        console.log(`Registered ${devData.length} dev commands.`);

        const otherData = await rest.put(
            Routes.applicationCommands(process.env.BOT_ID),
            {
                body: otherCommands,
            },
        );
        console.log(`Registered ${otherData.length} other commands.`);
    } catch (error) {
        console.error('Error register commands:', error);
    }
};
registerCommand();
