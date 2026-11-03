import { EmbedBuilder } from 'discord.js';

export async function imagePrompt(user, channel, picType) {
    //--Message
    const embed = new EmbedBuilder()
      .setDescription(`Please send a${picType} picture to proced:`)
      .setColor("#5865F2")
      .setTimestamp()
      .setTitle(`REQUIRED: ${picType} Picture`);

    // Send Message
    const sentMessage = await channel.send({
      embeds: [embed],
    });

    console.log(
      `Message sent successfully: ${sentMessage.id}`
    );

    // Check for an image reply
    const filter = (m) => m.author.id === user && m.attachments.size > 0;

    try {
        const collected = await channel.awaitMessages({
            filter,
            max: 1,
            time: 180000, // 180 seconds = 3 mins timeout
        });
    
        // Check if we actually collected a message
        if (collected.size === 0) {
            return await channel.send('It has been 3 minutes. Please send an image.');
        }
        
        const nextMessage = collected.first();
        const attachment = nextMessage.attachments.first();
        
        await channel.send(`Carrier ${user} sent ${attachment.name}.`);

        return attachment;
    } catch (err) {
        await channel.send('An unexpected error occurred while waiting for your file.', err);

        return null;
    }
}