import 'dotenv/config';
import { Client, GatewayIntentBits, Collection } from 'discord.js';
import { Player } from 'discord-player';
import { loadEvents } from './handlers/events.js';
import { QuickDB } from 'quick.db';
import { DefaultExtractors } from '@discord-player/extractor';

class ExtendedClient extends Client {
    messageCommands = new Collection();
    commands = new Collection();
    components = new Collection();
    db = new QuickDB();

    constructor(options) {
        super(options);
    }
}

const client = new ExtendedClient({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent,
    ],
});

const player = new Player(client, {
    ytdlOptions: {
        quality: 'highestaudio',
        highWaterMark: 1 << 25,
    },
});

await player.extractors.loadMulti(DefaultExtractors);

player.events.on('playerError', (queue, error) => {
    console.log('Player Error:', error);
});

player.events.on('error', (queue, error) => {
    console.log('General Error:', error);
});

await loadEvents(client);

await client.login(process.env.BOT_TOKEN);
