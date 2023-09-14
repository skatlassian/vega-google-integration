const {
    getAuthToken,
    getSpreadSheet,
    getSpreadSheetValues,
    getSpreadSheetRows,
    updateValues
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



const GCloudProjectCommand = "export GCLOUD_PROJECT=" + gCloudProject;
const GApplicationCredentialsCommand = "export GOOGLE_APPLICATION_CREDENTIALS=" + gAppCredentials;
  
//  const spreadsheetId = '1rF87sKjHMW8wH-2VR-ORl6diPSlK6a3wjJt4ZbvhcRI';
// const sheetName = 'Sheet1';



  
  async function testGetSpreadSheet() {
    try {
      const auth = await getAuthToken();
      const response = await getSpreadSheet({
        spreadsheetId,
        auth
      })
      console.log('output for getSpreadSheet', JSON.stringify(response.data, null, 2));
    } catch(error) {
      console.log(error.message, error.stack);
    }
  }
  
  async function testGetSpreadSheetValues() {
    try {
      const auth = await getAuthToken();
      const response = await getSpreadSheetValues({
        spreadsheetId,
        sheetName,
        auth
      })
     // console.log('output for getSpreadSheetValues', JSON.stringify(response.data, null, 2));
    } catch(error) {
      console.log(error.message, error.stack);
    }
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

  async function testUpdateValues() {
    try {
      const auth = await getAuthToken();
      const response = await updateValues({
        spreadsheetId,
        updateSheetName,
        auth
      })
      // console.log('output for getSpreadSheetRows', JSON.stringify(response.data, null, 2));
    } catch(error) {
      console.log(error.message, error.stack);
    }
  }

  function setEnvVariables(){
      process.env['GCLOUD_PROJECT'] = gCloudProject;
      process.env['GOOGLE_APPLICATION_CREDENTIALS'] = gAppCredentials;
    
  }

  function setEnvVariable(command){
    exec(command, (error, stdout, stderr) => {
       if (error) {
           console.log(`error: ${error.message}`);
           return;
       }
       if (stderr) {
           console.log(`stderr: ${stderr}`);
           return;
       }
       console.log(`command: ${command}, ${stdout}`);      
       
   })
 
 }

  
  function main() {
     setEnvVariables();

     // testGetSpreadSheet();
     // testGetSpreadSheetValues();
     // testGetSpreadSheetRows();
     testUpdateValues();
  }
  
  main()