const queryVega = require('../vega/queryVega')

const postData = {
    "query": "query CalendarEvents($employeeIdIn: [String!]) { calendarEvents(  employeeIdIn: $employeeIdIn) { items { id type {id name } createdBy creationDate confirmedBy  description startDatetime endDatetime  employee{id division emailAddress}  } } }",
        "variables":{"employeeIdIn":["adeo","vkgan"]},
        "operationName":"CalendarEvents"
    }



queryVega.callVega(postData).then(function(response){
    console.log('Response data:' +  JSON.stringify(response.data));
    console.log('Response code:' +  JSON.stringify(response.code));
    console.log('Response status:' +  JSON.stringify(response.message));

})
