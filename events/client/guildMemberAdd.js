import { createCanvas, loadImage } from '@napi-rs/canvas';
import { AttachmentBuilder, Events } from 'discord.js';
import path from 'path';

export const data = {
    name: Events.GuildMemberAdd,
};

export async function execute(member) {
    const guildDB = await member.client.db.get(member.guild.id);

    if (!guildDB || !guildDB?.welcomeChannel) return;

    const channel = await member.guild.channels.cache.get(
        guildDB.welcomeChannel,
    );

    if (!channel) return;

    const canvas = createCanvas(700, 300);
    const ctx = canvas.getContext('2d');
    const bg = await loadImage(
        path.join(import.meta.dirname, '../../assets/images/bg.png'),
    );
    let x = 0;
    let y = 0;
    ctx.drawImage(bg, x, y);

    x = 35;
    y = 35;
    const radius = 15;
    const width = 630;
    const height = 230;
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.fillStyle = 'rgba(92, 92, 92, 0.75)';
    ctx.fill();
    const pfp = await loadImage(
        member.user.displayAvatarURL({
            extension: 'png',
        }),
    );
    x = canvas.width / 2 - pfp.width / 2;
    y = 50;

    ctx.save();
    ctx.beginPath();
    ctx.arc(canvas.width / 2, 114, 67, 0, Math.PI * 2, false);
    ctx.clip();
    ctx.fillStyle = 'rgba(225, 225, 225, 1)';
    ctx.fillRect(canvas.width / 2 - pfp.width / 2 - 3, 47, 134, 134);
    ctx.restore();

    ctx.save();
    ctx.beginPath();
    ctx.arc(canvas.width / 2, 114, 64, 0, Math.PI * 2, false);
    ctx.clip();
    ctx.drawImage(pfp, x, y);
    ctx.restore();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 30px Microsoft JhengHei';
    let text = `歡迎 ${member.user.username}`;
    x = canvas.width / 2 - ctx.measureText(text).width / 2;
    ctx.fillText(text, x, 80 + pfp.height);

    ctx.font = 'bold 25px Microsoft JhengHei';
    text = `成員編號 #${member.guild.memberCount}`;
    x = canvas.width / 2 - ctx.measureText(text).width / 2;
    ctx.fillText(text, x, 120 + pfp.height);

    const attachment = new AttachmentBuilder(canvas.toBuffer());

    await channel.send({ files: [attachment] });
}
