import {
  ModalBuilder, 
  TextInputBuilder, 
  TextInputStyle,
  LabelBuilder,  
} from 'discord.js';

export async function editPostLogInfo(interaction, orderId, delivLoc, timeDis, timeBought, timeArri, timeDel) {
  try {
    const modal = new ModalBuilder()
        .setCustomId(`${orderId}_postLogInfoModal`)
        .setTitle("Post Delivery Log Information");

    const editDelivLoc = makeLabel('deliveryLocation', 
                                'Edit the delivery location here (leave blank if no change)...', 
                                'Edit the Delivery Location: ', 
                                `Current Delivery Location: ${delivLoc}`
                            );
    const editTimeDispatched = makeLabel('timeDispatched', 
                                'Format: "MM/DD/YYYY hh:mm AM/PM" (leave blank if no change)...', 
                                'Edit Your Time Dispatched: ', 
                                `Current Time Dispatched: ${timeDis}`
                            );
    const editTimeBought = makeLabel('timeBought', 
                                'Format: "MM/DD/YYYY hh:mm AM/PM" (leave blank if no change)...', 
                                'Edit Your Time Bought: ', 
                                `Current Time Bought: ${timeBought}`
                            );
    const editTimeArrived = makeLabel('timeArrived', 
                                'Format: "MM/DD/YYYY hh:mm AM/PM" (leave blank if no change)...', 
                                'Edit Your Time Arrived: ', 
                                `Current Time Arrived: ${timeArri}`
                            );
    const editTimeDelivered = makeLabel('timeDelivered', 
                                'Format: "MM/DD/YYYY hh:mm AM/PM" (leave blank if no change)...', 
                                'Edit Your Time Delivered: ', 
                                `Current Time Delivered: ${timeDel}`
                            );
    
    modal.addLabelComponents(editDelivLoc, editTimeDispatched, editTimeBought, editTimeArrived, editTimeDelivered);

    await interaction.showModal(modal);
  } catch (err) {
    console.error("text input error:", err);
  }
}

export async function editPostLogRemarks(interaction, orderId, cusRemarks, carRemarks) {
  try {
    const modal = new ModalBuilder()
        .setCustomId(`${orderId}_postLogRemarksModal`)
        .setTitle("Post Delivery Log Remarks");

    
    const editCustomerRemarks = makeLabel('cusRemarks', 
                                'Edit customer remarks from carrier here (leave blank if no change)...', 
                                'Edit Customer Remarks from Carrier: ', 
                                `Current Customer Remarks From Carrier: ${cusRemarks}`
                            );
    const editCarrierRemarks = makeLabel('carRemarks', 
                                'Edit carrier remarks from customer here (leave blank if no change)...', 
                                'Edit Carrier Remarks from Customer: ', 
                                `Current Carrier Remarks from Customer: ${carRemarks}`
                            );
    
    modal.addLabelComponents(editCustomerRemarks, editCarrierRemarks);

    await interaction.showModal(modal);
  } catch (err) {
    console.error("text input error:", err);
  }
}


function makeLabel(textInputCustomId, textInputPlaceholder, label, labelDesc){
    const textInput = new TextInputBuilder()
        .setCustomId(textInputCustomId)
        .setStyle(TextInputStyle.Short) 
        .setPlaceholder(textInputPlaceholder)
        .setRequired(false);

    label = new LabelBuilder()
        .setLabel(label || 'Missing label')
        .setDescription(labelDesc || 'No current information')
        .setTextInputComponent(textInput);
    
    return label;
}