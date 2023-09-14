
const { google } = require('googleapis');
const sheets = google.sheets('v4');
const queryVega = require('../vega/queryVega')

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
    let modal = modalData(rows)
    return modal
    // 


  }



 async function modalData(rows){

        // console.log(`Engineer: ${currentRow[6]}, Manager: ${currentRow[2]}, ${currentRow[3]}`);
        // console.log(`Header row: ${dateHeaderRow}`)
        if(rows == undefined){
            const res = await sheets.spreadsheets.values.get({
                spreadsheetId,
                auth,
                range: sheetName
              });
              rows = res.data.values;
        }
        
        let dateRowIndex = `${properties.get("QUERY_DATE_ROW_INDEX")}`.trim()
        let employeeRowIndexObject = getEmployeeIndexes(rows, dateRowIndex)
        // console.log ("employeeRowIndexObject: " + JSON.stringify(employeeRowIndexObject))

        let dateHeaderObject = getHeaderIndexes(rows, dateRowIndex)

      
        // console.log ("Columns: " + JSON.stringify(dateHeaderObject))

        return {
            "headerIndex": dateHeaderObject,
            "employeeIndex": employeeRowIndexObject
        }


 }


 function getHeaderIndexes(rows, dateRowIndex){
    
    let currentRow = rows[dateRowIndex]
    let dayOfWeekRow = rows[dateRowIndex - 1]

    let indexObject = {}
    let startIndex = 0
    let endIndex = 0
    let startDate = `${properties.get("QUERY_START_DATE")}`.trim()
    let endDate = `${properties.get("QUERY_END_DATE")}`.trim()
    let hardStop = `${properties.get("QUERY_STOP_LIMIT")}`.trim()

    console.log(`currentRow.length: ${currentRow.length} startDate: ${startDate}, endDate: ${endDate}`)
    //currentRow.length
    for(let i = 0; i <= currentRow.length; i++){
        let currentCellValue = currentRow[i]            
        
        try{
            let headerDateFormatted = new Date(currentCellValue) + 1
            let newDate = new Date(headerDateFormatted)
            let dateToSet = newDate.toISOString().slice(0, 10);
            
            // i for column index, d for day of week
            
            // console.log (`dayOfWeekRow ${dayOfWeekRow[i]}  `)
            // console.log (`headerDateFormatted ${JSON.stringify(headerDateFormatted)}`)

            if(Date.parse(startDate) > Date.parse(dateToSet)){
                continue
            }
            
            indexObject[dateToSet] = {"i": i, "d": dayOfWeekRow[i - 1]}

            if(dateToSet == startDate){
                startIndex = i
                indexObject.startIndex = startIndex
            }
            if(dateToSet == endDate){
                endIndex = i
                indexObject.endIndex = endIndex
            }
            if(startIndex != 0 && endIndex != 0){
                return indexObject
            }
            if(dateToSet == hardStop){
                return indexObject
            }

        }catch(Exception){
            console.error(`error on ${i}, value ${currentCellValue}`)
                   
        }
        
    }
    return {}

 }
 
 function getEmployeeIndexes(rows, dateRowIndex){
    console.log(`total size: ${rows.length}, dateRowIndex: ${Number(dateRowIndex) + 1}`)
    let employeeRowIndexObject = {}
    for (let i = Number(dateRowIndex) + 1; i < rows.length; i++){
        try{
            let employee = rows[i][5]
            employeeRowIndexObject[employee] = i + 1
            // console.log(`row: ${employee}`) 
        }catch(Exception){
            console.error(`error: ${error.message}`) 
        }
             
    }
    return employeeRowIndexObject


 }




  async function testGetSpreadSheetRows() {
    try {
      const auth = await getAuthToken();
      const response = await getSpreadSheetRows({
        spreadsheetId,
        sheetName,
        auth
      })

      return response
      // console.log('output for getSpreadSheetRows', JSON.stringify(response.data, null, 2));
    } catch(error) {
      console.log(error.message, error.stack);
    }
  }

  async function testUpdateValues(range, value) {
    try {
      const auth = await getAuthToken();
      const response = await updateValues({
        range,
        value,
        spreadsheetId,
        updateSheetName,
        auth
      })
      // console.log('output for getSpreadSheetRows', JSON.stringify(response.data, null, 2));
    } catch(error) {
      console.log(error.message, error.stack);
    }
  }

  async function updateValues({range, value, spreadsheetId, auth, sheetName}) {
  

    let values = [
      value
      // Additional rows ...
    ];
  

  
    // const range = 'Sheet2!C4:D5';
   
    const valueInputOption =  "RAW";
    const resource = {
        values
      };
  
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


  



  function columnIndexToRange(sheetTitle, columnIndex1, columnIndex2, row) {
    const columnName1 = columnIndexToLetter(columnIndex1);
    const columnName2 = columnIndexToLetter(columnIndex2);


    return `${sheetTitle}!${columnName1}${row}:${columnName2}${row}`;
  };
  
  function columnIndexToLetter(columnIndex) {
    let columnName = '';
    let dividend = columnIndex + 1;
    let modulo;
  
    while (dividend > 0) {
      modulo = (dividend - 1) % 26;
      columnName = String.fromCharCode(65 + modulo).toString() + columnName;
      dividend = parseInt((dividend - modulo) / 26);
    }
  
  
    return columnName;
  };


async function factorVegaDate(prepData){

if(prepData != undefined){
    // console.log(`from prep: ${JSON.stringify(prepData)}`)
    let indices = {}
    indices = await testGetSpreadSheetRows()


    let keys = Object.keys(prepData)

    let headerIndex = indices["headerIndex"]
    console.log(`headerIndex: ${JSON.stringify(headerIndex)}`)
    for(let k in keys){
        let employee = keys[k]
        let sheetIndex = indices["employeeIndex"][employee]

        // console.log(`headerIndex: ${JSON.stringify(headerIndex)}`)
        let employeeEvents = prepData[employee]
        for(let m = 0; m < employeeEvents.length; m++){
            try{
                let blob = employeeEvents[m]
            
                //console.log(`Blobs: ${JSON.stringify(blob)}`)
                let eventStartDate = blob.eventStartDate.slice(0, 10);
                let eventEndDate = blob.eventEndDate.slice(0, 10);
                let eventType = blob.eventType.id
    
                let startEventIndex = headerIndex[eventStartDate]["i"]
                let endEventIndex = headerIndex[eventEndDate]["i"]
    
                let range = columnIndexToRange(sheetName, startEventIndex, endEventIndex, sheetIndex)

                const date1 = new Date(eventStartDate);
                const date2 = new Date(eventEndDate);
                const diffTime = Math.abs(date2 - date1);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
                let valueArray = []
                for(let c = 0; c < diffDays; c++){
                    valueArray.push(eventType)

                }
                
                testUpdateValues(range, valueArray)
                console.log(`employee: ${employee} eventStartDate:${eventStartDate} eventEndDate: ${eventEndDate} eventType: ${eventType} range: ${range}`)

    
            }catch(error){
                console.error(error)
            }

            // 

            // console.log(`header: ${eventStartDate}  ${JSON.stringify(headerIndex[eventStartDate]["i"])}`)

            // 

           // console.log(`employee: ${employee}, eventType: ${eventType}, eventStartDate: ${eventStartDate}, eventEndDate: ${eventEndDate}`)

            // console.log(`sheet start: ${sheetIndex[eventStartDate]}, end ${sheetIndex[eventEndDate]}`)

                
        }

        // console.log(`employee: ${employee}, sheetIndex: ${JSON.stringify(sheetIndex)}`)
        // console.log(`...${JSON.stringify(prepData[employee])}`)
    }

    // console.log(`indices: ${JSON.stringify(indices)}`)
    // console.log(`keys: ${JSON.stringify(keys)}`)
}



}
async function main(prepData) {
    setEnvVariables(); 

     factorVegaDate(prepData) 
    // testGetSpreadSheetRows();


   // testUpdateValues();

    

 }


 main()

 module.exports = { main }

 
 