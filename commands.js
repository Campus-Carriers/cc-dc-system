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
                [`${orderId}_dispatch_undo_${channelId}`,"Undo","Secondary",true],
                [`${orderId}_dispatch_surcharge_${channelId}`,"Surcharge","Warn",false]
            ];
            sendMessage(channel, res, title, message, color, buttons);
        },
        "update_boughtOrDone" : () => {
            console.log(`channel: ${channel}`);
            message = "Errand done:";
            title = "Order Update: Errand Accomplished";
            buttons = [
                // Id, Label, Style, Disabled
                [`${orderId}_bought/done_done_${channelId}`,"Errand Done","Success",false],
                [`${orderId}_bought/done_confirm_${channelId}`,"Confirm","Secondary",true],
                [`${orderId}_bought/done_undo_${channelId}`,"Undo","Secondary",true],
                [`${orderId}_bought/done_surcharge_${channelId}`,"Surcharge","Warn",false]
            ];
            sendMessage(channel, res, title, message, color, buttons);
        },
        "orderPrice" : () => {},
        "surcharge" : () => {
            console.log(`channel: ${channel}`);
            console.log('Surcharge prompted');

            message = "Surcharge noted";
            title = "Surcharge Update";
            buttons = [
                [`${orderId}_surcharge_confirm_${channelId}`,"Confirm","Secondary",true],
                [`${orderId}_surcharge_surcharge_${channelId}`,"Surcharge","Warn",false]
            ];

            sendMessage(channel, res, title, message, color, buttons);
        },
        "update_arrived" : () => {},
        "update_delivered" : () => {},
        "remarks" : () => {},
    };
    return(commands[notifType]);
}