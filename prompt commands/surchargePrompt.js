import {
  ModalBuilder,
  CheckboxGroupOptionBuilder,
  LabelBuilder,  
} from 'discord.js';

export async function surchargePrompt(interaction, message, orderId) {
    console.log('executing surcharge prompt');
    console.log(`Order ID: ${orderId}`);
    // surcharge values
    var surchargeValues = [
                    { label: 'Peak Hours', value: 'peakHours', description: '11AM to 2PM and 5PM to 7PM' },
                    { label: 'Rainy Weather', value: 'rainyWeather', description: '' },
                    { label: 'Extreme Heat', value: 'extremeHeat', description: '36°C and above' },
                    { label: 'Extra Weight', value: 'extraWeight', description: '5kg+' },
                    { label: 'Exam Week', value: 'examWeek', description: '' },
                ];
    
    // build modal
    const modal = new ModalBuilder()
        .setCustomId(`${orderId}_surchargeModal`)
        .setTitle('Surcharge Options');

    // build modal contents
    const label = new LabelBuilder()
        .setLabel(message)
        .setCheckboxGroupComponent((checkboxes) => checkboxes
            .setCustomId('surchargeCheckboxes')
            .addOptions(
                surchargeValues.map((choice) => new CheckboxGroupOptionBuilder()
                    .setLabel(choice.label)
                    .setValue(choice.value)
                    .setDescription(choice.description || '')
                )
            ));
    
    // add modal contents to modal
    modal.addLabelComponents(label);

  try {
    await interaction.showModal(modal);
  } catch (err) {
    console.error("modal show error:", err);
  }
}