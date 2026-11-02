/////////////////////////////////////////////////////
//// INTERACTIONS Handle Button/Etc Interactions ////
/////////////////////////////////////////////////////
import { newButtons } from './prompt commands/newButtons.js';
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
    const carrier = interaction.user;
    var timeOut;
    var payload;
    
    const interactions = {
        "assignment" : {},
        "dispatch" : {
            "dispatched" : async () => {
                // Send Interaction Notif
                await interaction.editReply({ 
                    content: `Errand ✅ Accepted by ${interaction.user}` 
                });
                
                console.log("pre clear");
                // Clear timeOut
                if (timeOut) {
                    clearTimeout(timeOut);
                    console.log("time cleared");
                }

                // Disable Dispatched Button
                await message.edit({
                    components: newButtons(message, [0]),
                });

                // Wait 15 seconds before disabling undo
                timeOut = await setTimeout(15000);
                message.edit({
                    components: newButtons(message, [0,1]),
                });

                // Edit Dispatch and Raw Sheets
                payload = {
                    action: notifType,
                    orderId: orderId,
                    data: [
                        {
                            timestamp: timeNow,
                            carrieer: carrier,
                            info: {},
                        }
                    ]
                };
                toSheets(payload);
            },
            "undo" : async () => {
                console.log(`undo`);
                // Disable Button/s
                await message.edit({
                components: newButtons(message, [1]),
                });

                // Send Interaction Notif
                await interaction.editReply({
                content: `Carrier Dispatch ❌ Undone by ${interaction.user}`
                });
            },
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