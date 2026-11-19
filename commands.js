//////////////////////////////////////
//// COMMANDS Handle Prompts Sent ////
//////////////////////////////////////
import { sendMessage } from './prompt commands/sendMessage.js';

export function commands(channel, res, orderId, notifType, info) {
    var message;
    var color = "#5865F2";
    var title;
    var buttons;
    const channelId = channel.id;
    
    console.log(`order ID commands: ${orderId}`);
    const commands = {
        "newOrder" : () => {
            console.log(`channel: ${channel}`);
            message = info.body;
            title = info.subject;
            buttons = [
                // Id, Label, Style, Disabled
                [`${orderId}_new_accept_${channelId}`,"Accept","Success",false],
                [`${orderId}_new_reject_${channelId}`,"Reject","Secondary",true],
            ];
            sendMessage(channel, res, title, message, color, buttons);/**/
        },
        "update_dispatched" : () => {
            console.log(`channel: ${channel}`);
            message = "Press the button below once you have left to pick-up the order:\n\n" + info.body;
            title = "Order Update: Dispatch";
            buttons = [
                // Id, Label, Style, Disabled
                [`${orderId}_dispatch_dispatched_${channelId}`,"Carrier Dispatched","Success",false],
                [`${orderId}_dispatch_confirm_${channelId}`,"Confirm","Secondary",true],
                [`${orderId}_dispatch_undo_${channelId}`,"Undo","Secondary",true],
                [`${orderId}_dispatch_surcharge_${channelId}`,"Surcharge","Secondary",false],
            ];
            sendMessage(channel, res, title, message, color, buttons);
        },
        "update_boughtOrDone" : () => {
            console.log(`channel: ${channel}`);
            message = "Press the button below once you have bought the order or accomplished the errand.";
            title = "Order Update: Errand Accomplished";
            buttons = [
                // Id, Label, Style, Disabled
                [`${orderId}_bought/done_done_${channelId}`,"Errand Done","Success",false],
                [`${orderId}_bought/done_confirm_${channelId}`,"Confirm","Secondary",true],
                [`${orderId}_bought/done_undo_${channelId}`,"Undo","Secondary",true],
                [`${orderId}_bought/done_surcharge_${channelId}`,"Surcharge","Secondary",false]
            ];
            sendMessage(channel, res, title, message, color, buttons);
        },
        "update_arrived" : () => {
            // Send Price Breakdown
            channel.send(`Here is the order's Price Breakdown:\n${info.body.priceBreakdown}`);

            // Send Arrived at Delivery Location Prompt
            message = `Press the button below once you have arrived at the delivery address: ${info.body.deliveryLoc}.`;
            title = "Order Update: Arrived at Delivery Location";
            buttons = [
                // Id, Label, Style, Disabled
                [`${orderId}_arrived_arrived_${channelId}`,"Arrived","Primary",false],
                [`${orderId}_arrived_confirm_${channelId}`,"Confirm","Secondary",true],
                [`${orderId}_arrived_undo_${channelId}`,"Undo","Secondary",true],
                [`${orderId}_arrived_surcharge_${channelId}`,"Surcharge","Secondary",false]
            ];
            sendMessage(channel, res, title, message, color, buttons);
            console.log(`THREADID: ${channelId}`);
        },
        "surcharge" : () => {
            console.log(`channel: ${channel}`);
            console.log('Surcharge prompted');

            message = "Please click the Surcharge button to apply any applicable surcharges.";
            title = "Applicable Surcharges";
            buttons = [
                [`${orderId}_surcharge_surcharge_${channelId}`,"Surcharge","Secondary",false],
                [`${orderId}_surcharge_confirm_${channelId}`,"Confirm","Secondary",false],
            ];

            sendMessage(channel, res, title, message, color, buttons);
        },
        "update_delivered" : () => {
            // Send Arrived at Delivery Location Prompt
            message = `Press the button below once you have handed over the order.`;
            title = "Order Update: Order Delivered";
            buttons = [
                // Id, Label, Style, Disabled
                [`${orderId}_delivered_delivered_${channelId}`,"Delivered","Primary",false],
                [`${orderId}_delivered_confirm_${channelId}`,"Confirm","Secondary",true],
                [`${orderId}_delivered_undo_${channelId}`,"Undo","Secondary",true],
            ];
            sendMessage(channel, res, title, message, color, buttons);
        },
        "remarks" : () => {
            console.log(`channel: ${channel}`);
            console.log('Remarks prompted');

            message = "Please click the Remarks button to input any comments or remarks from you, the carrier, or from the customer.";
            title = "Customer and Carrier Remarks";
            buttons = [
                [`${orderId}_remarks_remarks_${channelId}`,"Remarks","Secondary",false],
            ];

            sendMessage(channel, res, title, message, color, buttons);
        },
    };
    return(commands[notifType]);
}