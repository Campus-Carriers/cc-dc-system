/////////////////////////////////////
////     SEND INFO TO SHEETS     ////
/////////////////////////////////////
// Ensure you are using Node.js v18 or higher
const url = 'https://script.google.com/macros/s/AKfycbxhl8Vs1USHZJG-L13fNAVOQr_iJ2l9zOtb8qNrd9DH3cA47anDBbEi33I73l5Do7X5/exec';

export async function toSheets(payload) {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      // Google Apps Script uses redirects (302) when executing web apps.
      // Node's native fetch handles this automatically by default.
      redirect: 'follow' 
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.text(); // or response.json() if your script returns JSON
    console.log('Response from Apps Script:', result);
  } catch (error) {
    console.error('Error sending data:', error);
  }
}
