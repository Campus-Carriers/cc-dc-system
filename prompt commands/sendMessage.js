///////////////////////////////////////
////   Send MESSAGE With BUTTONS   ////
///////////////////////////////////////
import {
  ActionRowBuilder,
  ButtonBuilder,
  EmbedBuilder,
  ButtonStyle, 
} from 'discord.js';

export async function sendMessage(channel, res, title, message, finColor, buttons) {
    // Build Message
    const embed = new EmbedBuilder()
      .setDescription(message || "Default text:")
      .setColor(finColor ||"#5865F2") 
      .setTimestamp()
      .setTitle(title ||"Default Title");

    // Build Buttons
    const components = [];
    if (buttons && Array.isArray(buttons) && buttons.length > 0) {
      const row = new ActionRowBuilder();

      buttons.forEach(function(button, index) {
        const discordButton = new ButtonBuilder()
        .setCustomId(button[0]) 
        .setLabel(button[1]) 
        .setStyle(
          button[2] || ButtonStyle.Primary
        )
        .setDisabled(button[3]);

        row.addComponents(discordButton);
      });

      components.push(row);
    }

    // Send Message
    const sentMessage = await channel.send({
      embeds: [embed],
      components,
    });

    // Logs
    console.log(
      `Message sent successfully: ${sentMessage.id}`
    );

    return res.json({
      success: true,
      messageId: sentMessage.id,
      channelId: channel.id,
    });
}