import {
  ModalBuilder, 
  TextInputBuilder, 
  TextInputStyle,
  LabelBuilder,  
} from 'discord.js';

export async function remarksPrompt(interaction, orderId) {
  try {
    const modal = new ModalBuilder()
        .setCustomId(`${orderId}_remarksModal`)
        .setTitle("Customer and Carrier Remarks");
    
    const customerTextInput = new TextInputBuilder()
        .setCustomId('customerRemarks')
        .setStyle(TextInputStyle.Short) 
        .setPlaceholder('Enter customer remarks from carrier here...')
        .setRequired(true);

    const customerLabel = new LabelBuilder()
        .setLabel(`Enter Customer Remarks: `)
        .setDescription(`Carrier to Customer; (if none, put 'none')`)
        .setTextInputComponent(customerTextInput);

    const carrierTextInput = new TextInputBuilder()
        .setCustomId('carrierRemarks')
        .setStyle(TextInputStyle.Short) 
        .setPlaceholder('Enter carrier remarks from the customer here...')
        .setRequired(true);

    const carrierLabel = new LabelBuilder()
        .setLabel(`Enter Carrier Remarks: `)
        .setDescription(`Customer to Carrier; (if none, put 'none')`)
        .setTextInputComponent(carrierTextInput);
    
    modal.addLabelComponents(customerLabel, carrierLabel);

    await interaction.showModal(modal);
  } catch (err) {
    console.error("text input error:", err);
  }
}