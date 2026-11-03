/////////////////////////////////////
////     SEND INFO TO SHEETS     ////
/////////////////////////////////////
// Ensure you are using Node.js v18 or higher
const normUrl = 'https://script.google.com/macros/s/AKfycbxO3Cyzv4y89phtRd31V_S0RpqJ_vIuRp0X1PV3-BTPl83yh5qrNTKQ_9pAISSW3qxRxQ/exec';
const uaapUrl = 'https://script.google.com/macros/s/AKfycby7zXD-XAFDrT9B73tQrguRiJJ8zs4MvVe8wgpdysneD0FXnPDorSA5xYlPd7dmcPqP/exec';

export async function toSheets(payload) {
  console.log(payload.orderId);
  const orderId = payload.orderId;
  var url;

  if (orderId.includes('uaap')) { url = uaapUrl; }
  else { url = normUrl; }

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
