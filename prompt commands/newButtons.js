///////////////////////////////////////
////     CHANGE ACTIVE BUTTONS     ////
///////////////////////////////////////
import {
  ActionRowBuilder,
  ButtonBuilder,
} from 'discord.js';

export function newButtons(message, disable) {
  const acceptedRows = message.components.map((row) => {
    const newRow = new ActionRowBuilder();

    row.components.forEach((component, index) => {
        const button = ButtonBuilder.from(component);
        disable.indexOf(index) !== -1 ? button.setDisabled(true) : button.setDisabled(false);
        console.log("disabled buttons: " + disable);
        newRow.addComponents(button);
    });
        
    return newRow;
  });

  return acceptedRows;
}