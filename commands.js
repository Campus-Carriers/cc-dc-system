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
            message = info.body;
            title = info.subject;
            buttons = [
                // Id, Label, Style, Disabled
                [`${orderId}_new_accept`,"Accept","Success",false],
                [`${orderId}_new_reject`,"Reject","Secondary",true]
            ];
            sendMessage(channel, res, title, message, color, buttons);/**/
        },
        "update_dispatched" : () => { 
    console.log("notifType"); },
        "update_boughtOrDone" : () => {},
        "orderPrice" : () => {},
        "surcharge" : () => {},
        "update_arrived" : () => {},
        "update_delivered" : () => {},
        "remarks" : () => {},
    };
    return(commands[notifType]);
}