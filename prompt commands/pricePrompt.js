import {
  ModalBuilder, 
  TextInputBuilder, 
  TextInputStyle,
  LabelBuilder,  
} from 'discord.js';

export async function pricePrompt(orderId, interaction, notifType, threadId) {
  // Modal
  const modal = new ModalBuilder()
      .setCustomId(`${orderId}_${notifType}_orderPriceModal_${threadId}`)
      .setTitle('Errand Accomplishment');
  
  // Image Input  
  const fileUpload = new FileUploadBuilder()
      .setCustomId('imageInput')
      .setMinValues(1)
      .setMaxValues(1)
      .setRequired(true);

  const imageLabel = new LabelBuilder()
      .setLabel('Send Image Proof of Order Update')
      .setFileUploadComponent(fileUpload);
  
  modal.addLabelComponents(imageLabel);
  
  const textInput = new TextInputBuilder()
      .setCustomId('orderPriceInput')
      .setStyle(TextInputStyle.Short)
      .setMinLength(1)
      .setMaxLength(7)
      .setPlaceholder('00.00')
      .setRequired(true);

  const textLabel = new LabelBuilder()
      .setLabel('Enter Order/Errand Price: ')
      .setTextInputComponent(textInput);
  
  modal.addLabelComponents(textLabel);

  await interaction.showModal(modal);
}