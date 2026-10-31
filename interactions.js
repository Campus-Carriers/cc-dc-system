/////////////////////////////////////////////////////
//// INTERACTIONS Handle Button/Etc Interactions ////
/////////////////////////////////////////////////////
import { newButtons } from './commands/newButtons.js';
import { textPrompt } from './commands/textPrompt.js';
import { imagePrompt } from './commands/imagePrompt.js';
import { toSheets } from './toSheets.js';
import { setTimeout } from 'node:timers/promises';
import { time } from 'node:console';

export function interactions(notifType, buttonId, orderId, interaction) {
    // Get the Message Interacted With
    const message = interaction.message;
    // Get the Channel to Send the Prompts to (should specify thread also eventually)
    const channel = interaction.channelId;
    var timeOut;
    var payload;
    
    const interactions = {
        "assignment" : () => {},
        "dispatch" : {
            "dispatched" : async () => {},
            "undo" : async () => {},
        },
        "bought/done" : {
            "done" : async () => {},
            "confirm" : async () => {},
            "undo" : async () => {},
        },
        "orderPrice" : async () => {},
        "surcharge" : () => {},
        "arrived" : {
            "arrived" : async () => {},
            "confirm" : async () => {},
            "undo" : async () => {},
        },
        "delivered" : {
            "delivered" : async () => {},
            "confirm" : async () => {},
            "undo" : async () => {},
        },
        "remarks" : () => {},
    };

    if (buttonId !== "none") {
        console.log("not none");
        return(interactions[notifType][buttonId]);
    }
    else { console.log("none"); return(interactions[notifType]); }
}

function milToDateTime(ms) {
    const timestamp = new Date(ms);
    const conv = timestamp.toISOString();

    return {
        year: conv[0,3],
        month: conv[5,6],
        day: conv[8,9],
        hour: conv[11,12],
        minute: conv[14,15],
    };
}