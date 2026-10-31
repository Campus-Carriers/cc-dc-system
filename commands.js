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
        "assignment" : () => {},
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