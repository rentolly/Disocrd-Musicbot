import { SlashCommandBuilder } from 'discord.js';
import { ErrorEmbed, SuccessEmbed } from '../../../modules/embeds.js';
import { formatTime, parseTimeToSeconds } from '../../../modules/utils.js';

export const data = {
    command: new SlashCommandBuilder()
        .setName('seek')
        .setNameLocalization('zh-TW', '快轉')
        .setDescription('快轉到指定時間（格式：mm:ss 或秒）')
        .addStringOption((option) =>
            option
                .setName('time')
                .setDescription('時間（如 1:30 或 90）')
                .setRequired(true),
        ),
    category: ['dev', 'music'],
    validateVC: true,
    queueOnly: true,
};

export async function execute(interaction, queue) {
    const timeInput = interaction.options.getString('time', true);

    // 轉換成秒數
    const seconds = parseTimeToSeconds(timeInput);
    const duration = queue.currentTrack?.durationMS ?? 0;

    if (isNaN(seconds) || seconds < 0 || seconds * 1000 > duration) {
        return interaction.reply({
            ephemeral: true,
            embeds: [ErrorEmbed('⏱️ 請輸入正確的時間範圍')],
        });
    }
    console.log(queue.currentTrack.raw?.isSeekable);
    try {
        await queue.node.seek(seconds);
        return interaction.reply({
            embeds: [SuccessEmbed(`⏩ 已快轉至 ${formatTime(seconds)}`)],
        });
    } catch (err) {
        console.error(err);
        return interaction.reply({
            ephemeral: true,
            embeds: [ErrorEmbed('⚠️ 快轉失敗，來源可能不支援')],
        });
    }
}
