/////////////////////////////////////////////////////
//// INTERACTIONS Handle Button/Etc Interactions ////
/////////////////////////////////////////////////////
import { newButtons } from './prompt commands/newButtons.js';
import { pricePrompt } from './prompt commands/pricePrompt.js';
import { imagePrompt } from './prompt commands/imagePrompt.js';
import { editPostLogInfo, editPostLogRemarks } from './prompt commands/editPostLogPrompt.js';
import { toSheets } from './toSheets.js';
import { setTimeout } from 'node:timers/promises';
import { time } from 'node:console';
import { ChannelType } from 'discord.js';

export function interactions(notifType, buttonId, orderId, interaction, threadId) {
    // Get the Message Interacted With
    const message = interaction.message;
    // Get the Channel to Send the Prompts to (should specify thread also eventually)
    const channel = interaction.channel;
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

                // Image & Price Prompt
                await pricePrompt(orderId, interaction, notifType, threadId);
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
                await interaction.editReply(`Errand Accomplishment ✅ Confirmed with: Image Proof ${imageProof.name} and Order Price ${submittedPrice}PHP submitted by ${interaction.user}.`);
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
        "surcharge " : () => {},
        "arrived" : {
            "arrived" : async () => {
                // Send Interaction Notif
                await interaction.editReply({
                    content: `Please Confirm [?] Arrival, Carrier ${interaction.user}`
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
                    components: newButtons(message, [0,1,2]),
                });
                
                // Image Prompt
                await imagePrompt(orderId, interaction, notifType, " Delivery Location Arrival");
            },
            "imagePromptModal" : async () => {
                const imageProof = interaction.fields.getUploadedFiles('imageInput').first();

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
        },
        "delivered" : {
            "delivered" : async () => {},
            "confirm" : async () => {},
            "undo" : async () => {},
        },
        "remarks" : () => {},
        "postLog" : {
            "editInfo" : async () => {
                console.log("showing post log information prompt");
                console.log(`Order ID: ${orderId}`);
                
                // Show edit post log prompt
                editPostLogInfo(interaction, orderId);

                await message.edit({
                    components: newButtons(message, [0,3]),
                });
            },
            "editRemarks" : async () => {
                console.log("showing post log remarks prompt");
                console.log(`Order ID: ${orderId}`);
                
                // Show edit post log prompt
                editPostLogRemarks(interaction, orderId);

                await message.edit({
                    components: newButtons(message, [1,3]),
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
                    content: `Post Delivery Log ✅ Confirmed by ${interaction.user}`
                });

                // edit this to send to admin
            },
            "undo" : async () => { // how will this unsend msg from confirm?? or confirm and done na
                console.log(`undo`);
                // Disable Button/s
                await message.edit({
                components: newButtons(message, [2,3]),
                });

                // Send Interaction Notif
                await interaction.editReply({
                content: `Post Delivery Log ❌ Undone by ${interaction.user}`
                });
            },
        },
        "postLogInfoModal" : async () => {
            console.log('in post log modal');
            var carName = interaction.fields.getTextInputValue('carName');
            var cusName = interaction.fields.getTextInputValue('cusName');
            var timeDis = interaction.fields.getTextInputValue('timeDis');
            var timeBought = interaction.fields.getTextInputValue('timeBought');
            var timeDel = interaction.fields.getTextInputValue('timeDel');
            var carFee = interaction.fields.getTextInputValue('carFee');

            // check if needed when apps script is made
            var newMessage = `**Post Delivery Log Information**
    Carrier Name: ${carName}
    Customer Name: ${cusName}
    Time Carrier Dispatched: ${timeDis}
    Time Bought Order: ${timeBought}
    Time Delivered to Customer: ${timeDel}

    Total Carrier fee: ${carFee}`;
            // Send Info to Apps Script, Trigger Errand Done
                payload = {
                    action: notifType,
                    orderId: orderId,
                    data: {
                        timestamp: timeNow,
                        carrier: carrier.username,
                        threadId: threadId,
                        info: {
                            carrierName: carName || 'error',
                            customerName: cusName  || 'error',
                            timeDispatched: timeDis || 'error',
                            timeBought: timeBought || 'error',
                            timeDelivered: timeDel || 'error',
                            carrierFee: carFee || 'error',
                        },
                    }
                };
                toSheets(payload); // this should trigger the sendAutomatedNotif() again
        },
        "postLogRemarksModal" : async () => {
            console.log('in post log modal');
            var cusRemarks = interaction.fields.getTextInputValue('cusRemarks');
            var carRemarks = interaction.fields.getTextInputValue('carRemarks');

            // check if needed when apps script is made
            var newMessage = `**Post Delivery Log Remarks**
    Customer Remarks from Carrier: ${cusRemarks}
    Carrier Remarks from Customer: ${carRemarks}`;
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
                toSheets(payload); // this should trigger the sendAutomatedNotif() again
        },
    };

    try {
        if (buttonId !== "none") {
            console.log("not none");
            return(interactions[notifType][buttonId]);
        }
        else { console.log("none"); return(interactions[notifType]); }
    } catch (error) {
        console.log(`Interaction Error: ${error}`)
    }
}