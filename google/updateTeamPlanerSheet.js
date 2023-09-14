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



  async function updateValues({spreadsheetId, auth, sheetName}) {
  
    let values = [
      [
        "Test new",
        "test new2"
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
    modalData(rows)


  }

  function main() {
    setEnvVariables();
    testGetSpreadSheetRows();
    // testUpdateValues();

 }

 function modalData(rows){
    let dateRowIndex = `${properties.get("QUERY_DATE_ROW_INDEX")}`.trim()
        let dateHeaderRow = rows[dateRowIndex]
        // console.log(`Engineer: ${currentRow[6]}, Manager: ${currentRow[2]}, ${currentRow[3]}`);
        // console.log(`Header row: ${dateHeaderRow}`)
        

        getEmployeeIndexes(rows, dateRowIndex)
        return
        let dateHeaderObject = getHeaderIndexes(dateHeaderRow)



        let startIndex = dateHeaderObject["startIndex"]
        let endIndex = dateHeaderObject["endIndex"]
        console.log(`startIndex: ${startIndex}`)
        console.log(`endIndex: ${endIndex}`)
        
        console.log ("Columns: " + JSON.stringify(dateHeaderObject))

 

 }

 function getEmployeeIndexes(rows, dateRowIndex){
    console.log(`total size: ${rows.length}`)
    for (let i = dateRowIndex + 1; i < rows.length; i++){
        
    }


 }

 function getHeaderIndexes(currentRow){
    let indexObject = {}
    let startIndex = 0
    let endIndex = 0
    let startDate = `${properties.get("QUERY_START_DATE")}`.trim()
    let endDate = `${properties.get("QUERY_END_DATE")}`.trim()
    let hardStop = `${properties.get("QUERY_STOP_LIMIT")}`.trim()

    console.log(`currentRow.length: ${currentRow.length}`)
    for(let i = 0; i < currentRow.length; i++){
        let currentCellValue = currentRow[i]            
        
        try{
            let headerDateFormatted = new Date(currentCellValue).toISOString().slice(0, 10);
            // console.log (`headerDateFormatted ${headerDateFormatted}  ${startIndex} ${endIndex}`)
            indexObject[headerDateFormatted] = i
            if(headerDateFormatted == startDate){
                startIndex = i
                indexObject.startIndex = startIndex
            }
            if(headerDateFormatted == endDate){
                endIndex = i
                indexObject.endIndex = endIndex
            }
            if(startIndex != 0 && endIndex != 0){
                return indexObject
            }
            if(headerDateFormatted == hardStop){
                return indexObject
            }

        }catch(Exception){
            console.error(`error on ${i}, value ${currentCellValue}`)
                   
        }
        
    }
    return {}

 }
 
 main()

 