/////////////////////////////////////////////////////
//// INTERACTIONS Handle Button/Etc Interactions ////
/////////////////////////////////////////////////////
import { newButtons } from './prompt commands/newButtons.js';
import { imagePrompt } from './prompt commands/imagePrompt.js';
import { toSheets } from './toSheets.js';
import { setTimeout } from 'node:timers/promises';
import { time } from 'node:console';
import { ChannelType } from 'discord.js';

export function interactions(notifType, buttonId, orderId, interaction, threadId) {
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
                    content: `Errand ✅ Accepted by ${carrier}`
                });

                // Create Private Thread with Carrier and EBs
                const orderThread = await interaction.channel.threads.create({
                                    name: `Order ${orderId} - ${carrier.username}`,
                                    type: ChannelType.PrivateThread,
                                    });
                await orderThread.send({
                    content: `Thank you ${carrier} for accepting the order! Fetching your customer order information...`,
                });//var userMessage =

                // Send Info to Apps Script, Trigger Dispatch
                payload = {
                    action: notifType,
                    orderId: orderId,
                    data: {
                        timestamp: timeNow,
                        carrier: carrier.username,
                        threadId: orderThread.id,
                        info: {},
                    }
                };
                await toSheets(payload);
            },
            "reject" : async () => {
                console.log(`❌ Rejected by ${carrier.username}`);
                
                // TODO: make limiter

                await interaction.editReply("You have rejected the order");
            },/**/
        },
        "dispatch" : {
            "dispatched" : async () => {
                // Send Interaction Notif
                await interaction.editReply({ 
                    content: `Carrier ${interaction.user} Dispatched ✅ for ${orderId} ` 
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

                // Send Info to Apps Script, Trigger Errand Done
                payload = {
                    action: notifType,
                    orderId: orderId,
                    data: {
                        timestamp: timeNow,
                        carrier: carrier.username,
                        threadId: threadId,
                        info: {},
                    }
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
            "done" : async () => {
                // Send Interaction Notif
                await interaction.editReply({
                    content: `Please Confirm [?] Errand Accomplishment, Carrier ${interaction.user}`
                });
                console.log(`done`);

                // Disable Bought/Done Button
                await message.edit({
                components: newButtons(message, [0]),
                });
            },
            "confirm" : async () => {
                console.log(`done confirm`);
                // Disable Button/s
                await message.edit({
                    components: newButtons(message, [0,1,2]),
                });

                // Send Interaction Notif
                await interaction.editReply({
                    content: `Errand Accomplishment ✅ Confirmed by ${interaction.user}`
                });
                
                // Image Prompt
                let imageProof = imagePrompt(interaction.user, threadId, "n Errand Accomplishment");

                // Send Info to Apps Script, Trigger Errand Done
                payload = {
                    action: notifType,
                    orderId: orderId,
                    data: {
                        timestamp: timeNow,
                        carrier: carrier.username,
                        threadId: threadId,
                        info: {
                            imageProof: imageProof.url || 'error',
                        },
                    }
                };
                toSheets(payload);
            },
            "undo" : async () => {
                console.log(`undo`);
                // Disable Button/s
                await message.edit({
                components: newButtons(message, [1,2]),
                });

                // Send Interaction Notif
                await interaction.editReply({
                content: `Errand Accomplishment ❌ Undone by ${interaction.user}`
                });
            },
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