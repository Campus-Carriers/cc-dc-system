//////////////////////////////////////
////    Send INPUT TEXT PROMPT    ////
//////////////////////////////////////
import {
  ModalBuilder, 
  TextInputBuilder, 
  TextInputStyle,
  LabelBuilder,  
} from 'discord.js';

export async function textPrompt(interaction, message) {
  try {
    // Build Modal
    const modal = new ModalBuilder()
        .setCustomId('orderPriceModal')
        .setTitle('Order Price');
     // Build Text Input Space
    const textInput = new TextInputBuilder()
        .setCustomId('orderPriceInput')
        .setStyle(TextInputStyle.Short) 
        .setPlaceholder('00.00')
        .setRequired(true);

    // Build Modal Label
    const label = new LabelBuilder()
        .setLabel(message)
        .setTextInputComponent(textInput);

    modal.addLabelComponents(label);

    // Show Modal
    await interaction.showModal(modal);
  } catch (err) {
    console.error("text input error:", err);
  }
}