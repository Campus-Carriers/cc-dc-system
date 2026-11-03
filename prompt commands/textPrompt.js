import {
  ModalBuilder, 
  TextInputBuilder, 
  TextInputStyle,
  LabelBuilder,  
} from 'discord.js';

export async function textPrompt(interaction, message) {
  try {
    const modal = new ModalBuilder()
        .setCustomId('orderPriceModal')
        .setTitle('Order Price');
    
    const textInput = new TextInputBuilder()
        .setCustomId('orderPriceInput')
        .setStyle(TextInputStyle.Short) 
        .setPlaceholder('00.00')
        .setRequired(true);

    const label = new LabelBuilder()
        .setLabel(message)
        .setTextInputComponent(textInput);
    
    modal.addLabelComponents(label);

    await interaction.showModal(modal);
  } catch (err) {
    console.error("text input error:", err);
  }
}