//////////////////////////////////////
//// COMMANDS Handle Prompts Sent ////
//////////////////////////////////////
import { sendMessage } from './sendMessage.js';

export function commands(channel, res, orderId, notifType) {
    var message;
    var color = "#5865F2";
    var title;
    var buttons;
    const commands = {
        "newOrder" : () => {
            var message = "new order";
            var finColor = color;
            var title = "New Order";
            var buttons = [
                // Id, Label, Style, Disabled
                ["new_accept","Accept","Success",false],
                ["new_reject","Reject","Secondary",true]
            ];
            sendMessage(channel, res, title, message, finColor, buttons);
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