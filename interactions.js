/////////////////////////////////////////////////////
//// INTERACTIONS Handle Button/Etc Interactions ////
/////////////////////////////////////////////////////
import { newButtons } from './commands/newButtons.js';
import { textPrompt } from './commands/textPrompt.js';
import { imagePrompt } from './commands/imagePrompt.js';
import { toSheets } from './toSheets.js';
import { setTimeout } from 'node:timers/promises';
import { time } from 'node:console';

export function interactions(notifType, buttonId, orderId, interaction) {
    // Get the Message Interacted With
    const message = interaction.message;
    // Get the Channel to Send the Prompts to (should specify thread also eventually)
    const channel = interaction.channelId;
    // Get Timestamp of Interaction
    var timeNow = Math.floor(Date.now() / 1000); // Current Timestamp in Seconds
    // Get Carrier
    const carrier = carrier;
    var timeOut;
    var payload;
    
    const interactions = {
        "new" : {
            "accept" : async () => {
                // Send Interaction Notif
                console.log(`Carrier ${carrier} is on the way`);
                await interaction.editReply("You have accepted the order");

                // Disable Button/s
                // TODO: make limiter
                await message.edit({
                components: newButtons(message, [0,1]),
                });

                await interaction.followUp({
                    content: `✅ Accepted by ${carrier}`
                });

                // Create Private Thread with Carrier and EBs
                const orderThread = await interaction.channel.threads.create({
                                    name: `Order ${orderId} - ${carrier.username}`,
                                    type: ChannelType.PrivateThread,
                                    });
                var userMessage = await orderThread.send({
                    content: `Thank you ${carrier} for accepting the order! Fetching your customer order information...`,
                });

                // Send Timestamp to Apps Script, Trigger Dispatch
                payload = {
                    action: notifType,
                    data: {
                        orderId: orderId,
                        timestamp: timeNow,
                        carrier: carrier,
                    }
                };
                toSheets(payload);
            },
            "reject" : async () => {
                console.log(`❌ Rejected by ${carrier.username}`);
                
                // TODO: make limiter

                await interaction.editReply("You have rejected the order");
            },
        },
        "dispatch" : {
            "dispatched" : async () => {},
            "undo" : async () => {},
        },
        "bought/done" : {
            "done" : async () => {},
            "confirm" : async () => {},
            "undo" : async () => {},
        },
        "orderPrice" : async () => {},
        "surcharge" : () => {},
        "arrived" : {
            "arrived" : async () => {},
            "confirm" : async () => {},
            "undo" : async () => {},
        },
        "delivered" : {
            "delivered" : async () => {},
            "confirm" : async () => {},
            "undo" : async () => {},
        },
        "remarks" : () => {},
    };

    if (buttonId !== "none") {
        console.log("not none");
        return(interactions[notifType][buttonId]);
    }
    else { console.log("none"); return(interactions[notifType]); }
}

function milToDateTime(ms) {
    const timestamp = new Date(ms);
    const conv = timestamp.toISOString();

    return {
        year: conv[0,3],
        month: conv[5,6],
        day: conv[8,9],
        hour: conv[11,12],
        minute: conv[14,15],
    };
}