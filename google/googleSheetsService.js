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


async function updateBatchValues({spreadsheetId, auth, sheetName}){

  /*
  var data = [
    { 
      range: "Sheet1!A1",   // Update single cell
      values: [
    ["A1"]
      ]
    },
    {
      range: "Sheet1!B1:B3", // Update a column
      values: [
    ["B1"],["B2"],["B3"]
      ]
    },
    {
      range: "Sheet1!C1:E1", // Update a row
      values: [
    ["C1","D1","E1"]
      ]
    },
    {
      range: "Sheet1!F1:H2", // Update a 2d range
      values: [
    ["F1", "F2"],
    ["H1", "H2"]
      ]
    }];
    */




var data = [{"range":"Planner Sheet!JO93:JV93","values":[["ESC","ESC","ESC","ESC","ESC","ESC","ESC","ESC","ESC","ESC","ESC","ESC"]]},{"range":"Planner Sheet!IU93:JV93","values":[[]]},{"range":"Planner Sheet!IX93:JV93","values":[[]]}]




    const result = await sheets.spreadsheets.values.batchUpdate({
      spreadsheetId: spreadsheetId,
      auth: auth,
      resource: { data: data, valueInputOption: "USER_ENTERED" }
       
    });
    
    console.log('%d cells updated.', result.data.updatedCells);


}

module.exports = {
  getAuthToken,
  getSpreadSheet,
  getSpreadSheetValues,
  getSpreadSheetRows,
  updateValues,
  updateBatchValues
}

// npm install @googleapis/docs