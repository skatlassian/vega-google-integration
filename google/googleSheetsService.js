const { google } = require('googleapis');
const sheets = google.sheets('v4');

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

var PropertiesReader = require('properties-reader');
var properties = PropertiesReader('../env.properties');

const spreadsheetId = properties.get("GOOGLE_SHEET_ID")
const sheetName = properties.get("GOOGLE_SHEET_NAME")
const updateSheetName = properties.get("GOOGLE_SHEET_UPDATE_NAME")

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




async function getSpreadSheetModal() {
  const auth = await getAuthToken();
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

  // console.log(`currentRow.length: ${currentRow.length} startDate: ${startDate}, endDate: ${endDate}`)
  //currentRow.length
  for(let i = 7; i <= currentRow.length; i++){
      let currentCellValue = currentRow[i]            
      
      try{
          let headerDateFormatted = new Date(currentCellValue) + 1
          let newDate = new Date(headerDateFormatted)
          let dateToSet = newDate.toISOString().slice(0, 10);
          
          // i for column index, d for day of week
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
  // console.log(`total size: ${rows.length}, dateRowIndex: ${Number(dateRowIndex) + 1}`)
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




function columnIndexToLetter(columnIndex) {
  let columnName = '';
  let dividend = columnIndex;
  let modulo;

  while (dividend > 0) {
    modulo = (dividend - 1) % 26;
    columnName = String.fromCharCode(65 + modulo).toString() + columnName;
    dividend = parseInt((dividend - modulo) / 26);
  }

  return columnName;
};


async function getSpreadSheetRows2({spreadsheetId, auth, sheetName}) {

  let modal = await getSpreadSheetModal()
  console.log(`modal: ${JSON.stringify(modal["headerIndex"])}`)
  let headerMin = modal["headerIndex"]["startIndex"]
  let headerMax = modal["headerIndex"]["endIndex"]

 
  // console.log(`modal: ${JSON.stringify(modal["employeeIndex"])}`)
  let empModal = modal["employeeIndex"]

  let rowMax = Math.max.apply(null,Object.keys(empModal).map(function(x){ return empModal[x] }));
  let rowMin = Math.min.apply(null,Object.keys(empModal).map(function(x){ return empModal[x] }));

  let rangeN = columnIndexToRange(sheetName, headerMin, headerMax, rowMin, rowMax)

  console.log(`max: ${rowMax}, min: ${rowMin} range: ${rangeN}`)

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    auth,
    range: rangeN
  });
  const rows = res.data.values;
  if (!rows || rows.length === 0) {
    console.log('No data found.');
    return {};
  }

  let cRow = rowMin
  let cCol = headerMin
  
  console.log(`${cRow}:${cCol}==> ${rows.length}   ${(headerMax - headerMin)}`)

  let currentSheetValueObject = {}
  for(let k = 0; k < rows.length; k++){
    let row = rows[k]
    cCol = headerMin
    for(let i =0; i < (headerMax - headerMin); i++){
      if(row[i] != undefined && row[i] != "" ){
        // console.log(`${cRow}:${cCol}==># ${row[i]}`)
        let key = `${cRow}#${cCol}`
        currentSheetValueObject[key] = row[i]
      }
      cCol++;
    }
    cRow++;

  }
  console.log(`currentSheetValueObject: ${JSON.stringify(currentSheetValueObject)}`)
  return currentSheetValueObject;
}

function columnIndexToRange(sheetTitle, columnIndex1, columnIndex2, row1, row2) {
  const columnName1 = columnIndexToLetter(columnIndex1);
  const columnName2 = columnIndexToLetter(columnIndex2);

  console.log(`${columnIndex1}: ${columnName1}    ${columnIndex2}: ${columnName2}`)
  console.log(`====>> ${sheetTitle}!${columnName1}${row1}:${columnName2}${row2}`)

  
  return `${sheetTitle}!${columnName1}${row1}:${columnName2}${row2}`;
};




module.exports = {
  getAuthToken,
  getSpreadSheet,
  getSpreadSheetValues,
  getSpreadSheetRows,
  updateValues,
  updateBatchValues,
  getSpreadSheetRows2
}

// npm install @googleapis/docs