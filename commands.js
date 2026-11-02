//////////////////////////////////////
//// COMMANDS Handle Prompts Sent ////
//////////////////////////////////////
import { sendMessage } from './prompt commands/sendMessage.js';

export function commands(channel, res, orderId, notifType, info) {
    var message;
    var color = "#5865F2";
    var title;
    var buttons;
    const commands = {
        "newOrder" : () => {
            message = `Customer Name: ${info.body.customerName}
Dispatch Time: ${info.body.dispatchTime}
Peak Hour Surcharge: ${info.body.isPeak ? "Yes (+10)" : "No"}
Location: ${info.body.location}
Store: ${info.body.store}
Order: ${info.body.order}
Special Request: ${info.body.specialReq}
Mode of Payment: ${info.body.mop}`;
            title = info.subject;
            buttons = [
                // Id, Label, Style, Disabled
                [`${orderId}_new_accept`,"Accept","Success",false],
                [`${orderId}_new_reject`,"Reject","Secondary",true]
            ];
            sendMessage(channel, res, title, message, color, buttons);/**/
        },
        "update_dispatched" : () => {},
        "update_boughtOrDone" : () => {},
        "orderPrice" : () => {},
        "surcharge" : () => {},
        "update_arrived" : () => {},
        "update_delivered" : () => {},
        "remarks" : () => {},
    };
    return(commands[notifType]);
}