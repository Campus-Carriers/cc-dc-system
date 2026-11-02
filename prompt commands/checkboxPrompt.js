import {
  ModalBuilder,
  CheckboxGroupOptionBuilder,
  LabelBuilder,  
} from 'discord.js';

export async function checkboxPrompt(interaction, message, choicesArr) {
  try {
    const modal = new ModalBuilder()
        .setCustomId('surchargeModal')
        .setTitle('Surcharge Options');

    const label = new LabelBuilder()
        .setLabel(message)
        .setCheckboxGroupComponent((checkboxes) => checkboxes
            .setCustomId('surchargeCheckboxes')
            .addOptions(
                choicesArr.map((choice) => new CheckboxGroupOptionBuilder()
                    .setLabel(choice.label)
                    .setValue(choice.value)
                    .setDescription(choice.description || '')
                )
            ));
    
    modal.addLabelComponents(label);

    await interaction.showModal(modal);
  } catch (err) {
    console.error("text input error:", err);
  }
}