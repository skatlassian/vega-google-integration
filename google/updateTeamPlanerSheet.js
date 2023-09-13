const { google } = require('googleapis');
const sheets = google.sheets('v4');

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const {
    getAuthToken
  } = require('./googleSheetsService.js');
const { exec } = require("child_process");
const execSync = require("child_process").execSync;



var PropertiesReader = require('properties-reader');
var properties = PropertiesReader('../env.properties');

const spreadsheetId = properties.get("GOOGLE_SHEET_ID")
const sheetName = properties.get("GOOGLE_SHEET_NAME")
const updateSheetName = properties.get("GOOGLE_SHEET_UPDATE_NAME")

const gCloudProject = properties.get("GCLOUD_PROJECT")
const gAppCredentials = properties.get("GOOGLE_APPLICATION_CREDENTIALS")


function setEnvVariables(){
    process.env['GCLOUD_PROJECT'] = gCloudProject;
    process.env['GOOGLE_APPLICATION_CREDENTIALS'] = gAppCredentials;
  
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


  async function testGetSpreadSheetRows() {
    try {
      const auth = await getAuthToken();
      const response = await getSpreadSheetRows({
        spreadsheetId,
        sheetName,
        auth
      })
      // console.log('output for getSpreadSheetRows', JSON.stringify(response.data, null, 2));
    } catch(error) {
      console.log(error.message, error.stack);
    }
  }

  function main() {
    setEnvVariables();
    testGetSpreadSheetRows();

 }
 
 main()