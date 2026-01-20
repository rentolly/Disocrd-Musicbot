import {
    ChannelType,
    PermissionsBitField,
    SlashCommandBuilder,
} from 'discord.js';
import { ErrorEmbed, SuccessEmbed } from '../../../modules/embeds.js';

export const data = {
    command: new SlashCommandBuilder()
        .setName('notice')
        .setNameLocalization('zh-TW', '通知')
        .setDescription('設定獲取通知的頻道')
        .addStringOption((options) =>
            options
                .setName('類別')
                .setDescription('通知類別')
                .setRequired(true)
                .addChoices({
                    name: '地震',
                    value: 'quake',
                }),
        )
        .addChannelOption((options) =>
            options
                .setName('頻道')
                .setDescription('設定通知頻道')
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildText),
        ),
    category: 'notice',
};

export async function execute(interaction) {
    if (!process.env.OPEN_WEATHER_DATA) {
        return await interaction.reply({
            embeds: [ErrorEmbed(`機器人未啟用地震通知功能`)],
            ephemeral: true,
        });
    }
    if (
        !interaction.member.permissions.has(
            PermissionsBitField.Flags.ManageRoles,
        )
    ) {
        return await interaction.reply({
            embeds: [ErrorEmbed(`你必須要有管理權限才能使用此功能`)],
            ephemeral: true,
        });
    }

    await interaction.deferReply();

    const noticeType = interaction.options.getString('類別');

    const channel = interaction.options.getChannel('頻道');

    const db = interaction.client.db;

    if (noticeType === 'quake') {
        await db.set(`quake_notice.${interaction.guildId}`, `${channel.id}`);
    }

    return await interaction.editReply({
        embeds: [SuccessEmbed(`地震通知頻道已設定為 <#${channel.id}>`)],
    });
}
