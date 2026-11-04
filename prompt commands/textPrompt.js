import {
  ModalBuilder, 
  TextInputBuilder, 
  TextInputStyle,
  LabelBuilder,  
} from 'discord.js';

export async function textPrompt(interaction, message, orderId, threadId) {
  const modal = new ModalBuilder()
      .setCustomId(`${orderId}_orderPriceModal_${threadId}`)
      .setTitle('Order Price');
  
  const textInput = new TextInputBuilder()
      .setCustomId('orderPriceInput')
      .setStyle(TextInputStyle.Short)
      .setMinLength(1)
      .setMaxLength(7)
      .setPlaceholder('00.00')
      .setRequired(true);

  const label = new LabelBuilder()
      .setLabel(message)
      .setTextInputComponent(textInput);
  
  modal.addLabelComponents(label);

  await interaction.showModal(modal);
}