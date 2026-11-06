import {
  ModalBuilder, 
  TextInputBuilder, 
  TextInputStyle,
  LabelBuilder,  
} from 'discord.js';

export async function editPostLogPrompt(interaction, orderId, carName, delivLoc, cusName, timeDis, timeBought, timeDel, cusRemarks, carRemarks) {
  try {
    const modal = new ModalBuilder()
        .setCustomId(`${orderId}_postLogModal`)
        .setTitle("Post Delivery Log");

    const editCarrierName = makeLabel('carrierName', 
                                        'Edit your name here...', 
                                        'Edit Your Name: ', 
                                        `Current Name: ${carName}`
                                    );
    const editDelivLoc = makeLabel('deliveryLocation', 
                                'Edit the delivery location here...', 
                                'Edit the Delivery Location: ', 
                                `Current Delivery Location: ${delivLoc}`
                            );
    const editCustomerName = makeLabel('customerName', 
                                'Edit the customer name here...', 
                                'Edit the Customer Name: ', 
                                `Current Customer Name: ${cusName}`
                            );
    const editTimeDispatched = makeLabel('timeDispatched', 
                                'Edit your time dispatched here...', 
                                'Edit Your Time Dispatched: ', 
                                `Current Time Dispatched: ${timeDis}`
                            );
    const editTimeBought = makeLabel('timeBought', 
                                'Edit your time bought here...', 
                                'Edit Your Time Bought: ', 
                                `Current Time Bought: ${timeBought}`
                            );
    const editTimeDelivered = makeLabel('timeDelivered', 
                                'Edit your time delivered here...', 
                                'Edit Your Time Delivered: ', 
                                `Current Time Delivered: ${timeDel}`
                            );
    const editCustomerRemarks = makeLabel('cusRemarks', 
                                'Edit customer remarks from carrier here...', 
                                'Edit Customer Remarks from Carrier: ', 
                                `Current Customer Remarks From Carrier: ${cusRemarks}`
                            );
    const editCarrierRemarks = makeLabel('carRemarks', 
                                'Edit carrier remarks from customer here...', 
                                'Edit Carrier Remarks from Customer: ', 
                                `Current Carrier Remarks from Customer: ${carRemarks}`
                            );
    
    modal.addLabelComponents(editCarrierName, editDelivLoc, editCustomerName, editTimeDispatched, editTimeBought, editTimeDelivered, editCustomerRemarks, editCarrierRemarks);

    await interaction.showModal(modal);
  } catch (err) {
    console.error("text input error:", err);
  }editCarrierNameInput
}

async function makeLabel(textInputCustomId, textInputPlaceholder, label, labelDesc){
    const textInput = new TextInputBuilder()
        .setCustomId(textInputCustomId)
        .setStyle(TextInputStyle.Short) 
        .setPlaceholder(textInputPlaceholder)
        .setRequired(false);

    const label = new LabelBuilder()
        .setLabel(label)
        .setDescription(labelDesc)
        .setTextInputComponent(textInput);
    
    return label;
}