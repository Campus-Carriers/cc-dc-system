/////////////////////////////////////////////////////
//// INTERACTIONS Handle Button/Etc Interactions ////
/////////////////////////////////////////////////////
import { newButtons } from './prompt commands/newButtons.js';
import { pricePrompt } from './prompt commands/pricePrompt.js';
import { imagePrompt } from './prompt commands/imagePrompt.js';
import { editPostLogInfo, editPostLogRemarks } from './prompt commands/editPostLogPrompt.js';
import { surchargePrompt } from './prompt commands/surchargePrompt.js';
import { remarksPrompt } from './prompt commands/remarksPrompt.js';
import { toSheets } from './toSheets.js';
import { time } from 'node:console';
import { setTimeout } from 'node:timers/promises';
import { ChannelType } from 'discord.js';

export function interactions(notifType, buttonId, orderId, interaction, threadId, client) {
    // Get the Message Interacted With
    const message = interaction.message;
    // Get the Channel to Send the Prompts to (should specify thread also eventually)
    const channel = interaction.channel;
    // Get Timestamp of Interaction
    var timeNow = Math.floor(Date.now() / 1000); // Current Timestamp in Seconds
    // Get Carrier
    const carrier = interaction.user;
    var payload;
    
    const interactions = {
        "new" : {
            "accept" : async () => {
                // Send Interaction Notif
                console.log(`Carrier ${carrier} is on the way`);
                await interaction.editReply(`Errand ✅ Accepted by ${carrier}`);

                // Disable Button/s
                // TODO: make limiter
                await message.edit({
                components: newButtons(message, [0,1]),
                });

                // Create Private Thread with Carrier and EBs
                const orderThread = await interaction.channel.threads.create({
                                    name: `Order ${orderId} - ${carrier.username}`,
                                    type: ChannelType.PrivateThread,
                });
                await orderThread.send({
                    content: `Thank you ${carrier} for accepting the order! Fetching your customer order information...
                    
_added <@&${'1567700287152717924'}>s to the thread._`,
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

                await interaction.editReply({
                    content: `${carrier}, you have rejected the order`,
                    ephemeral: true,
                });
            },
        },
        "dispatch" : {
            "dispatched" : async () => {
                // Send Interaction Notif
                await interaction.editReply({ 
                    content: `❔ Please Confirm Dispatch, Carrier ${interaction.user}` 
                });

                // Disable Dispatched Button
                await message.edit({
                    components: newButtons(message, [0]),
                });
            },
            "confirm" : async () => {
                // Disable Button/s
                await message.edit({
                    components: newButtons(message, [0,1,2,3]),
                });

                // Send Interaction Notif
                await interaction.editReply({
                    content: `Carrier Dispatch ✅ Confirmed by ${interaction.user}`
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
                // Disable Button/s
                await message.edit({
                    components: newButtons(message, [1,2]),
                });

                // Send Interaction Notif
                await interaction.editReply({
                content: `Carrier Dispatch ❌ Undone by ${interaction.user}`
                });
            },
            "surcharge" : async () => {
                console.log("Showing Surcharge Prompt");

                // Show Surcharge Modal
                await surchargePrompt(interaction, 'Select Applicable Surcharge:', orderId, notifType);
            },
        },
        "bought/done" : {
            "done" : async () => {
                // Send Interaction Notif
                await interaction.editReply({
                    content: `❔ Please Confirm Errand Accomplishment, Carrier ${interaction.user}`
                });

                // Disable Bought/Done Button
                await message.edit({
                components: newButtons(message, [0]),
                });
            },
            "confirm" : async () => {
                // Disable Button/s
                await message.edit({
                    components: newButtons(message, [0,1,2,3]),
                });

                // Image & Price Prompt
                await pricePrompt(orderId, interaction, notifType, threadId, message);
            },
            "orderPriceModal" : async () => {
                const imageProof = interaction.fields.getUploadedFiles('imageInput').first();
                const submittedPrice = interaction.fields.getTextInputValue('orderPriceInput');

                // Send Info to Apps Script (Image Proof, Errand Price), Trigger Errand Done
                payload = {
                    action: notifType,
                    orderId: orderId,
                    data: {
                        timestamp: timeNow,
                        carrier: carrier.username,
                        threadId: threadId,
                        info: {
                            imageProof: imageProof.url,
                            price: submittedPrice,
                        },
                    }
                };
                await toSheets(payload);
                
                // Send Interaction Notif
                await interaction.editReply(`Errand Accomplishment ✅ Confirmed with: 
Image Proof ${imageProof.name} and 
Order Price ${submittedPrice}PHP`);
            },
            "undo" : async () => {
                // Disable Button/s
                await message.edit({
                    components: newButtons(message, [1,2]),
                });

                // Send Interaction Notif
                await interaction.editReply({
                    content: `Errand Accomplishment ❌ Undone by ${interaction.user}`
                });
            },
            "surcharge" : async () => {
                console.log("Showing Surcharge Prompt");

                // Show Surcharge Modal
                await surchargePrompt(interaction, 'Select Applicable Surcharge:', orderId, notifType);
            },
        },
        "arrived" : {
            "arrived" : async () => {
                // Send Interaction Notif
                await interaction.editReply({
                    content: `❔ Please Confirm Arrival, Carrier ${interaction.user}`
                });

                // Disable Bought/Done Button
                await message.edit({
                    components: newButtons(message, [0]),
                });
            },
            "confirm" : async () => {
                // Disable Button/s
                await message.edit({
                    components: newButtons(message, [0,1,2,3]),
                });
                
                // Image Prompt
                await imagePrompt(orderId, interaction, notifType, " Delivery Location Arrival");
            },
            "imagePromptModal" : async () => {
                const imageProof = interaction.fields.getUploadedFiles('imageInput').first();

                // Send Info to Apps Script (Image Proof,), Trigger Order Delivery
                payload = {
                    action: notifType,
                    orderId: orderId,
                    data: {
                        timestamp: timeNow,
                        carrier: carrier.username,
                        threadId: threadId,
                        info: {
                            imageProof: imageProof.url,
                        },
                    }
                };
                await toSheets(payload);
                
                // Send Interaction Notif
                await interaction.editReply(`Arrival ✅ Confirmed with: Image Proof ${imageProof.name}.`);
            },
            "undo" : async () => {
                // Disable Button/s
                await message.edit({
                components: newButtons(message, [1,2]),
                });

                // Send Interaction Notif
                await interaction.editReply({
                content: `Arrival ❌ Undone by ${interaction.user}`
                });
            },
            "surcharge" : async () => {
                console.log("Showing Surcharge Prompt");
                
                // Show Surcharge Modal
                await surchargePrompt(interaction, 'Select Applicable Surcharge:', orderId, notifType);
            },
        },
        "surcharge" : {
            "surcharge" : async () => {
                console.log("Showing Surcharge Prompt");

                // Show Surcharge Modal
                surchargePrompt(interaction, 'Select Applicable Surcharge:', orderId);
            },
            "confirm" : async () => { 
                // Send Interaction Notif
                await interaction.editReply({
                    content: `✅ Surcharges have been finalized, Carrier ${interaction.user}.`
                });

                // Disable Surcharge Button
                await message.edit({
                    components: newButtons(message, [0,1]),
                });

                // Trigger Next Prompt
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
        },
        "surchargeModal" : async () => {
            console.log('In Surcharge Modal');
            var selectedSurcharges = interaction.fields.getCheckboxGroup('surchargeCheckboxes');
            var surchargeContent = `${selectedSurcharges.join(', ')}`;
            var surchargeMessage = "Surcharges applied: " +
            `${selectedSurcharges.includes('extraWeight') ? 'Extra Weight, ' : ''}`  +
            `${selectedSurcharges.includes('extremeHeat') ? 'Heavy Heat, ' : ''}`  +
            `${selectedSurcharges.includes('rainyWeather') ? 'Heavy Rain, ' : ''}`  +
            `${selectedSurcharges.includes('extremeHeat') ? 'Extreme Heat, ' : ''}`  +
            `${selectedSurcharges.includes('peakHours') ? 'Peak Hours, ' : ''}`  +
            `${selectedSurcharges.includes('examWeek') ? 'Exam Week' : ''}`;

            try {
                await interaction.editReply({
                    content: surchargeMessage
                });
            } catch (e) { console.log(`error: ${e}`); }

            payload = {
                    action: notifType,
                    orderId: orderId,
                    data: {
                        timestamp: timeNow,
                        carrier: carrier.username,
                        threadId: threadId,
                        info: {
                            surchargeInfo: surchargeContent || 'error',
                        },
                    }
            };
            toSheets(payload);
        },
        "delivered" : {
            "delivered" : async () => {
                // Send Interaction Notif
                await interaction.editReply({
                    content: `❔ Please Confirm Delivery, Carrier ${interaction.user}`
                });

                // Disable Bought/Done Button
                await message.edit({
                    components: newButtons(message, [0]),
                });
            },
            "confirm" : async () => {
                // Disable Button/s
                await message.edit({
                    components: newButtons(message, [0,1,2]),
                });
                
                // Image Prompt
                await imagePrompt(orderId, interaction, notifType, "Order Delivery");
            },
            "imagePromptModal" : async () => {
                const imageProof = interaction.fields.getUploadedFiles('imageInput').first();

                // Send Info to Apps Script (Image Proof), Trigger Customer Remarks
                payload = {
                    action: notifType,
                    orderId: orderId,
                    data: {
                        timestamp: timeNow,
                        carrier: carrier.username,
                        threadId: threadId,
                        info: {
                            imageProof: imageProof.url,
                        },
                    }
                };
                await toSheets(payload);
                
                // Send Interaction Notif
                await interaction.editReply(`Delivery ✅ Confirmed with: Image Proof ${imageProof.name}.`);
            },
            "undo" : async () => {
                // Disable Button/s
                await message.edit({
                components: newButtons(message, [1,2]),
                });

                // Send Interaction Notif
                await interaction.editReply({
                content: `Delivery ❌ Undone by ${interaction.user}`
                });
            },
            "surcharge" : async () => {
                console.log("Showing Surcharge Prompt");

                // Show Surcharge Modal
                await surchargePrompt(interaction, 'Select Applicable Surcharge:', orderId, notifType);
            },
        },
        "remarks" : {
            "remarks" : async () => {
                console.log("Showing Remarks Prompt");

                // Show Surcharge Modal
                await remarksPrompt(interaction, orderId);

                // Disable button
                await message.edit({
                    components: newButtons(message, [0]),
                });
            }
        },
        "remarksModal" : async () => {
            console.log('In Remarks Modal');
            var customerRemarks = interaction.fields.getTextInputValue('customerRemarks');
            var carrierRemarks = interaction.fields.getTextInputValue('carrierRemarks');
            var remarksContent = `**Carrier to Customer Remarks:**   ${customerRemarks}
            
**Customer to Carrier Remarks:**   ${carrierRemarks}`;

            await interaction.editReply({
                content: remarksContent
            });

            payload = {
                    action: notifType,
                    orderId: orderId,
                    data: {
                        timestamp: timeNow,
                        carrier: carrier.username,
                        threadId: threadId,
                        info: {
                            customerRemarks: customerRemarks || 'error',
                            carrierRemarks: carrierRemarks || 'error',
                        },
                    }
            };
            toSheets(payload);
        },
        "postLog" : {
            "editInfo" : async () => {
                console.log("Showing Post-Log Information Prompt");
                
                // Show edit post log prompt
                await editPostLogInfo(interaction, orderId);

                await message.edit({
                    components: newButtons(message, [0,1,2,3,4]),
                });
            },
            "editRemarks" : async () => {
                console.log("Showing Post-Log Remarks Prompt");
                
                // Show edit post log prompt
                await editPostLogRemarks(interaction, orderId);

                await message.edit({
                    components: newButtons(message, [0,1,2,3,4]),
                });
            },
            "confirm" : async () => {
                // Disable Button/s
                await message.edit({
                    components: newButtons(message, [0,1,2]),
                });

                // Send Interaction Notif
                await interaction.editReply({
                    content: `Post Delivery Log ✅ Confirmed by ${interaction.user}.  Are you sure all information is correct? (Click "I'm Sure" button if sure)`
                });

            },
            "sure" : async () => {
                // Disable Button/s
                await message.edit({
                    components: newButtons(message, [0,1,2,3,4]),
                });

                // Send Interaction Notif
                await interaction.editReply({
                    content: `Thank you ${interaction.user} for your wonderful service!`
                });

                // Send Notif to Clear Thread Info in Sheets
                payload = {
                        action: 'serviceEnd',
                        orderId: orderId,
                        data: {
                            timestamp: timeNow,
                            carrier: carrier.username,
                            threadId: threadId,
                            info: {},
                        }
                };
                toSheets(payload);

                const adminChannelId = process.env.ADMIN_POSTDELIVLOG || "1571843725498515477";//"1571843725498515477" // do in main
                const adminChannel = await client.channels.fetch(adminChannelId);
                adminChannel.send({
                    content: `Post Delivery Log for order ${orderId} by carrier ${interaction.user.username}`,
                    embeds: [message.embeds[0]] || 'error',
                });
            },
            "undo" : async () => {
                // Disable Button/s
                await message.edit({
                components: newButtons(message, [3,4]),
                });

                // Send Interaction Notif
                await interaction.editReply({
                content: `Post Delivery Log Finalization ❌ Undone by ${interaction.user}`
                });
            },
        },
        "postLogInfoModal" : async () => {
            console.log('In Info Post-Log Modal');
            console.log(notifType);

            interaction.editReply({
                content: "Updating and fetching your new Post Delivery Log..."
            });

            const getVal = (id) => interaction.fields.getTextInputValue(id) || "none";

            const delivLoc = getVal('deliveryLocation');
            const timeDis = getVal('timeDispatched');
            const timeBought = getVal('timeBought');
            const timeArri = getVal('timeArrived');
            const timeDel = getVal('timeDelivered');

            console.log(`Inputted Delivery Location`);
            console.log(`Inputted Time Dispatched`);
            console.log(`Inputted Time Bought`);
            console.log(`Inputted Time Arrived`);
            console.log(`Inputted Time Delivered`);

            // Send Info to Apps Script, Trigger Errand Done
                payload = {
                    action: notifType,
                    orderId: orderId,
                    data: {
                        timestamp: timeNow,
                        carrier: carrier.username,
                        threadId: threadId,
                        info: {
                            delivLoc: delivLoc || 'error',
                            timeDispatched: timeDis || 'error',
                            timeBought: timeBought || 'error',
                            timeArrived: timeArri || 'error',
                            timeDelivered: timeDel || 'error',
                        },
                    }
                };
                toSheets(payload);
        },
        "postLogRemarksModal" : async () => {
            console.log('In Remarks Post-Log Modal');

            interaction.editReply({
                content: "Updating and fetching your new Post Delivery Log..."
            });

            const getVal = (id) => interaction.fields.getTextInputValue(id) || "none";

            const cusRemarks = getVal('cusRemarks');
            const carRemarks = getVal('carRemarks');

            console.log(`Inputted Customer Remarks`);
            console.log(`Inputted Carrier Remarks`);
            
            // Send Info to Apps Script, Trigger Errand Done
                payload = {
                    action: notifType,
                    orderId: orderId,
                    data: {
                        timestamp: timeNow,
                        carrier: carrier.username,
                        threadId: threadId,
                        info: {
                            customerRemarks: cusRemarks || 'error',
                            carrierRemarks: carRemarks || 'error',
                        },
                    }
                };
                toSheets(payload); 
        },
    };

    const handler = buttonId === "none"
        ? interactions[notifType]
        : interactions[notifType][buttonId];//??          (buttonId === "surchargeModal" ? interactions.surchargeModal : undefined);

    if (typeof handler !== "function") {
        throw new Error(`No interaction handler for ${notifType}/${buttonId}`);
    }

    return handler;
}