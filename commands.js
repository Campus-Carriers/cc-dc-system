//////////////////////////////////////
//// COMMANDS Handle Prompts Sent ////
//////////////////////////////////////
import { sendMessage } from './prompt commands/sendMessage.js';

export function commands(channel, res, orderId, notifType, info) {
    var message;
    var color = "#39adfb";
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
            title = "Order Update: Dispatch";
            message = "Press the button below once you have left to pick-up the order:\n----------------------------------\n\n" + info.body;
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
            title = "Order Update: Oroder Bought/Errand Accomplished";
            message = "Press the button below once you have bought the order or accomplished the errand.";
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
            // Send Arrived at Delivery Location Prompt
            title = "Order Update: Arrived at Delivery Location";
            message = `Press the button below once you have arrived at the delivery address: **${info.body.deliveryLoc}**.`;
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

            title = "Applicable Surcharges";
            message = "Please click the Surcharge button to input the applicable surcharges. Click Confirm once they have been finalized (cannot be edited anymore after).";
            buttons = [
                [`${orderId}_surcharge_surcharge_${channelId}`,"Surcharge","Secondary",false],
                [`${orderId}_surcharge_confirm_${channelId}`,"Confirm","Secondary",false],
            ];

            sendMessage(channel, res, title, message, color, buttons);
        },
        "update_delivered" : () => {
            // Send Price Breakdown
            channel.send(`Here is the order's Price Breakdown:\n${info.body.priceBreakdown}`);

            // Send Arrived at Delivery Location Prompt
            title = "Order Update: Order Delivered";
            message = `Press the button below once you have handed over the order.`;
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

            title = "[REQUIRED] Customer and Carrier Remarks";
            message = "Please click the Remarks button to input any comments or remarks from you, the carrier, and/or from the customer. If there none, put \"none\".";
            buttons = [
                [`${orderId}_remarks_remarks_${channelId}`,"Remarks","Secondary",false],
            ];

            sendMessage(channel, res, title, message, color, buttons);
        },
        "post_delivery_log" : () => {
            console.log(`channel: ${channel}`);
            console.log('post delivery information prompted');
            
            // message should be sent from apps script
            message = `----------------------------------------------
 🛒 ${info.body.cusName}, ${info.body.deliveryLoc}:
**Date: 10/28/2026 
Carrier Name: ${info.body.carName}**
> Time Carrier Dispatched: ${info.body.timeDis}
> Time Bought Order: ${info.body.timeBought}
> Time Arrived at Location: ${info.body.timeArri}
> Time Delivered to Customer: ${info.body.timeDel}
> Customer Remarks from Carrier: ${info.body.cusRemarks}
> Carrier Remarks from Customer: ${info.body.carRemarks}
Pricing (Total - CC:Carrier): ${info.body.priceBreakdown}
 ----------------------------------------------`;
            title = "Post Delivery Log";
            buttons = [
                [`${orderId}_postLog_editInfo_${channelId}`,"Edit Info","Secondary",false],
                [`${orderId}_postLog_editRemarks_${channelId}`,"Edit Remarks","Secondary",false],
                [`${orderId}_postLog_confirm_${channelId}`,"Confirm","Secondary",false],
                [`${orderId}_postLog_sure_${channelId}`,"I'm Sure","Secondary",true],
                [`${orderId}_postLog_undo_${channelId}`,"Undo","Secondary",true]
            ];

            sendMessage(channel, res, title, message, color, buttons);
        },
    };
    return(commands[notifType]);
}