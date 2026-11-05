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
    const commands = {
        "newOrder" : () => {
            console.log(`channel: ${channel}`);
            message = info.body;
            title = info.subject;
            buttons = [
                // Id, Label, Style, Disabled
                [`${orderId}_new_accept_${channelId}`,"Accept","Success",false],
                [`${orderId}_new_reject_${channelId}`,"Reject","Secondary",true]
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
                [`${orderId}_dispatch_undo_${channelId}`,"Undo","Secondary",true]
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
                [`${orderId}_bought/done_undo_${channelId}`,"Undo","Secondary",true]
            ];
            sendMessage(channel, res, title, message, color, buttons);
        },
        "surcharge" : () => {},
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
            ];
            sendMessage(channel, res, title, message, color, buttons);
            console.log(`THREADID: ${channelId}`);
        },
        "update_delivered" : () => {
            // Send Arrived at Delivery Location Prompt
            message = `Press the button below once you have handed over the order.`;
            title = "Order Update: Order Delivered";
            buttons = [
                // Id, Label, Style, Disabled
                [`${orderId}_delivered_delivered_${channelId}`,"Arrived","Primary",false],
                [`${orderId}_delivered_confirm_${channelId}`,"Confirm","Secondary",true],
                [`${orderId}_delivered_undo_${channelId}`,"Undo","Secondary",true],
            ];
            sendMessage(channel, res, title, message, color, buttons);
        },
        "remarks" : () => {},
    };
    return(commands[notifType]);
}