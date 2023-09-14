const { google } = require('googleapis');
const sheets = google.sheets('v4');

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];


async function getAuthToken() {
  const auth = new google.auth.GoogleAuth({
    scopes: SCOPES
  });
  const authToken = await auth.getClient();
  return authToken;
}

async function getSpreadSheet({spreadsheetId, auth}) {
  const res = await sheets.spreadsheets.get({
    spreadsheetId,
    auth,
  });
  return res;
}

async function getSpreadSheetValues({spreadsheetId, auth, sheetName}) {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    auth,
    range: sheetName
  });
  return res;
}

async function getSpreadSheetRows({spreadsheetId, auth, sheetName}) {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    auth,
    range: sheetName
  });
  const rows = res.data.values;
  if (!rows || rows.length === 0) {
    console.log('No data found.');
    return;
  }
  rows.forEach((row) => {
    // Print columns A and E, which correspond to indices 0 and 4.
    console.log(`${row[7]}, ${row[8]}`);
  });
  return res;
}



async function updateValues({spreadsheetId, auth, sheetName}) {


  let values = [
    [
      "Anupam",
      "Sandip"
    ]
    // Additional rows ...
  ];

  const resource = {
    values
  };

  const range = 'Sheet2';
  const valueInputOption =  "RAW";

  try {
    const result = await sheets.spreadsheets.values.update({
      auth: auth,
      spreadsheetId,
      range,
      valueInputOption,
      resource,
    });
    console.log('%d cells updated.', result.data.updatedCells);
    return result;
  } catch (err) {
    // TODO (Developer) - Handle exception
    throw err;
  }
}


module.exports = {
  getAuthToken,
  getSpreadSheet,
  getSpreadSheetValues,
  getSpreadSheetRows,
  updateValues
}

// npm install @googleapis/docs