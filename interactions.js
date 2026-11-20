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
    console.log(`interaction message: ${message}`);
    console.log(`notifType: ${notifType}, buttonId: ${buttonId}`);
    
    const interactions = {
        "new" : {
            "accept" : async () => {
                console.log("new 1");
                // Send Interaction Notif
                console.log(`Carrier ${carrier} is on the way`);
                await interaction.editReply(`Errand ✅ Accepted by ${carrier}`);

                console.log("new 2");
                // Disable Button/s
                // TODO: make limiter
                await message.edit({
                components: newButtons(message, [0,1]),
                });

                console.log("new 3");
                // Create Private Thread with Carrier and EBs
                const orderThread = await interaction.channel.threads.create({
                                    name: `Order ${orderId} - ${carrier.username}`,
                                    type: ChannelType.PrivateThread,                                    });
                await orderThread.send({
                    content: `Thank you ${carrier} for accepting the order! Fetching your customer order information...
                    
                    _added <@&${'1567700287152717924'}>s to the thread._`,
                });//var userMessage =

                console.log("new 4");
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
                console.log(`dispatch confirm`);

                // Disable Button/s
                await message.edit({
                    components: newButtons(message, [0,1,2,3]),
                });

                // Send Interaction Notif
                await interaction.editReply({
                    content: `Carrier Dispatch ✅ Confirmed by ${interaction.user}`
                });

                console.log(`order ID: ${orderId}`);
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
                    components: newButtons(message, [1,2]),
                });

                // Send Interaction Notif
                await interaction.editReply({
                content: `Carrier Dispatch ❌ Undone by ${interaction.user}`
                });
            },
            "surcharge" : async () => {
                console.log("showing surcharge prompt");
                console.log(`Order ID: ${orderId}`);

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
            "surcharge" : async () => {
                console.log("showing surcharge prompt");
                console.log(`Order ID: ${orderId}`);

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
                console.log(`arrived`);

                // Disable Bought/Done Button
                await message.edit({
                    components: newButtons(message, [0]),
                });
            },
            "confirm" : async () => {
                console.log(`confirm`);

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
                console.log(`undo`);
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
                console.log("showing surcharge prompt");
                
                // Show Surcharge Modal
                await surchargePrompt(interaction, 'Select Applicable Surcharge:', orderId, notifType);
            },
        },
        "surcharge" : {
            "surcharge" : async () => {
                console.log("showing surcharge prompt");

                // Show Surcharge Modal
                surchargePrompt(interaction, 'Select Applicable Surcharge:', orderId);
            },
            "confirm" : async () => { 
                // Send Interaction Notif
                await interaction.editReply({
                    content: `✅ Surcharges have been finalized, Carrier ${interaction.user}.`
                });
                console.log(`surcharge`);

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
            console.log('in surcharge modal');
            var selectedSurcharges = interaction.fields.getCheckboxGroup('surchargeCheckboxes');
            var surchargeContent = `${selectedSurcharges.join(', ')}`;
            var surchargeMessage = "Surcharges applied: " +
            `${selectedSurcharges.includes('extraWeight') ? 'Extra Weight, ' : ''}`  +
            `${selectedSurcharges.includes('extremeHeat') ? 'Heavy Heat, ' : ''}`  +
            `${selectedSurcharges.includes('rainyWeather') ? 'Heavy Rain, ' : ''}`  +
            `${selectedSurcharges.includes('extremeHeat') ? 'Extreme Heat, ' : ''}`  +
            `${selectedSurcharges.includes('peakHours') ? 'Peak Hours, ' : ''}`  +
            `${selectedSurcharges.includes('examWeek') ? 'Exam Week' : ''}`;//surchargeContent
            console.log(surchargeMessage);

            await interaction.editReply({
                content: surchargeMessage
            });
            console.log('after edit reply');

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
                console.log(`delivered`);

                // Disable Bought/Done Button
                await message.edit({
                    components: newButtons(message, [0]),
                });
            },
            "confirm" : async () => {
                console.log(`confirm`);

                // Disable Button/s
                await message.edit({
                    components: newButtons(message, [0,1,2]),
                });
                
                // Image Prompt
                await imagePrompt(orderId, interaction, notifType, "Order Delivery");
            },
            "imagePromptModal" : async () => {
                const imageProof = interaction.fields.getUploadedFiles('imageInput').first();

                console.log(`THREADID: ${threadId}`);
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
                console.log(`undo`);
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
                console.log("showing surcharge prompt");
                console.log(`Order ID: ${orderId}`);

                // Show Surcharge Modal
                await surchargePrompt(interaction, 'Select Applicable Surcharge:', orderId, notifType);
            },
        },
        "remarks" : {
            "remarks" : async () => {
                console.log("showing remarks prompt");

                // Show Surcharge Modal
                await remarksPrompt(interaction, orderId);

                // Disable button
                await message.edit({
                    components: newButtons(message, [0]),
                });
            }
        },
        "remarksModal" : async () => {
            console.log('in remarks modal');
            var customerRemarks = interaction.fields.getTextInputValue('customerRemarks');
            var carrierRemarks = interaction.fields.getTextInputValue('carrierRemarks');
            var remarksContent = `**Carrier to Customer Remarks:**   ${customerRemarks}
            
**Customer to Carrier Remarks:**   ${carrierRemarks}`;
            console.log(remarksContent);

            await interaction.editReply({
                content: remarksContent
            });
            console.log('after edit reply of remarksContent');

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
                console.log("showing post log information prompt");
                console.log(`Order ID: ${orderId}`);
                
                // Show edit post log prompt
                await editPostLogInfo(interaction, orderId);

                await message.edit({
                    components: newButtons(message, [0,1,2,3,4]),
                });
            },
            "editRemarks" : async () => {
                console.log("showing post log remarks prompt");
                console.log(`Order ID: ${orderId}`);
                
                // Show edit post log prompt
                await editPostLogRemarks(interaction, orderId);

                await message.edit({
                    components: newButtons(message, [0,1,2,3,4]),
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
                    content: `Post Delivery Log ✅ Confirmed by ${interaction.user}.  Are you sure all information is correct? (Click "I'm Sure" button if sure)`
                });

            },
            "sure" : async () => {
                console.log(`done sure`);
                console.log(message);
                console.log(message.embeds[0]);
                // Disable Button/s
                await message.edit({
                    components: newButtons(message, [0,1,2,3,4]),
                });

                // Send Interaction Notif
                await interaction.editReply({
                    content: `Thank you ${interaction.user} for your wonderful service!`
                });

                const adminChannelId = process.env.ADMIN_POSTDELIVLOG || "1571843725498515477";//"1571843725498515477" // do in main
                const adminChannel = await client.channels.fetch(adminChannelId);
                adminChannel.send({
                    content: `Post Delivery Log for order ${orderId} by carrier ${interaction.user}`,
                    embeds: [message.embeds[0]] || 'error',
                });
            },
            "undo" : async () => { 
                console.log(`undo post log`);
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
            console.log('in info post log modal');
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

            console.log(`Inputted Delivery Location: ${delivLoc}`);
            console.log(`Inputted Time Dispatched: ${timeDis}`);
            console.log(`Inputted Time Bought: ${timeBought}`);
            console.log(`Inputted Time Arrived: ${timeArri}`);
            console.log(`Inputted Time Delivered: ${timeDel}`);

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
            console.log('in remarks post log modal');
            console.log(notifType);

            interaction.editReply({
                content: "Updating and fetching your new Post Delivery Log..."
            });

            const getVal = (id) => interaction.fields.getTextInputValue(id) || "none";

            const cusRemarks = getVal('cusRemarks');
            const carRemarks = getVal('carRemarks');

            console.log(`Inputted Customer Remarks: ${cusRemarks}`);
            console.log(`Inputted Carrier Remarks: ${carRemarks}`);
            
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
        : interactions[notifType]?.[buttonId] ??
          (buttonId === "surchargeModal" ? interactions.surchargeModal : undefined);

    if (typeof handler !== "function") {
        throw new Error(`No interaction handler for ${notifType}/${buttonId}`);
    }

    return handler;
}