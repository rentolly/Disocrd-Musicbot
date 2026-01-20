import 'dotenv/config';
import { useQueue } from 'discord-player';
import { Events } from 'discord.js';
import { ErrorEmbed } from '../../modules/embeds.js';

export const data = {
    name: Events.InteractionCreate,
};

export async function execute(interaction) {
    if (
        !interaction.isChatInputCommand() &&
        !interaction.isButton() &&
        !interaction.isContextMenuCommand() &&
        !interaction.isStringSelectMenu()
    )
        return;

    const commandName = interaction.isMessageComponent()
        ? interaction.customId
        : interaction.commandName;

    if (commandName.includes('Btn')) return;

    const command = interaction.isMessageComponent()
        ? interaction.client.components.get(commandName)
        : interaction.client.commands.get(commandName);

    if (!command) {
        console.error(`\`${commandName}\` was not found.`);
        return interaction.reply({
            embeds: [ErrorEmbed('無效的指令')],
            ephemeral: true,
        });
    }

    if (
        command.data.category.includes('dev') &&
        !process.env.DEV_IDS.split(',').includes(interaction.user.id)
    ) {
        return interaction.reply({
            embeds: [ErrorEmbed('只有開發者可以使用此功能')],
            ephemeral: true,
        });
    }

    const queue = useQueue(interaction.guildId);

    if (command.data.validateVC) {
        const selfChannel = interaction.guild.members.me?.voice?.channel;
        const memberChannel = interaction.member.voice?.channel;

        if (!memberChannel)
            return interaction.reply({
                embeds: [ErrorEmbed('請先進入語音頻道')],
                ephemeral: true,
            });

        if (selfChannel && selfChannel.id !== memberChannel.id) {
            return interaction.reply({
                embeds: [ErrorEmbed('我們必須要在同一個語音頻道')],
                ephemeral: true,
            });
        }
    }

    if (command.data.queueOnly && !queue?.isPlaying()) {
        return interaction.reply({
            embeds: [ErrorEmbed('清單目前沒有音樂')],
            ephemeral: true,
        });
    }

    try {
        if (command.data.category.includes('music')) {
            await command.execute(interaction, queue);
        } else {
            await command.execute(interaction);
        }
    } catch (err) {
        console.error(err);
    }
}
