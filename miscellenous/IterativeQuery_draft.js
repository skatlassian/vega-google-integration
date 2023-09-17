const queryVega = require('./queryVega')

const PropertiesReader = require('properties-reader')
const properties = PropertiesReader('../env.properties')


function findDirectReports(){
   
    const managers =  `${properties.get("MANAGERS_LIST")}`.replace(" ", "").split(",")

    console.log("manager", managers)
    for (let i = 0; i < managers.length; i++){
        let currentManager = managers[i]
    
        let query = {
            "query": "query DirectReports($employeeId: ID!) { employee(id: $employeeId) {directReports {displayName id emailAddress isActive}}}",
                "variables":{"employeeId":"" + currentManager},
                "operationName":"DirectReports"
            }
    
        queryVega.callVega(query).then(function(response){
            
                       
                if(response.message == "success"){
                    let data =  response.data
                    let directReportsJson = data.data.employee.directReports
                    //console.log("directReportsJson: ", directReportsJson)
                    let usersToQuery = []
                    for (let k = 0; k < directReportsJson.length; k++){
                        let currentPoint = directReportsJson[k]
                        
                        
                        if(currentPoint.isActive == true){                            
                            usersToQuery.push(currentPoint.id)
                        }  
                        
                    }

                    console.log(`usersToQuery: ${usersToQuery}`)
                    findCalendarEventsForUsers(usersToQuery)
  

            }else{
                console.error("could not fetch manager reportees, used query: ", JSON.stringify(query))
            }
                        
        })

    }
    
}

async function findCalendarEventsForUsers(usersToQuery){
                  // console.log("usersToQuery, ", usersToQuery)

                  //test for single user
                  // usersToQuery = ["adeo"]
                let prepData = {}

                let startDate = `${properties.get("QUERY_START_DATE")}`.trim()
                let endDate = `${properties.get("QUERY_END_DATE")}`.trim()

                console.log(`startDate: ${startDate}`)
                console.log(`endDate: ${endDate}`)
                

                for(let empCounter = 0; empCounter < usersToQuery.length; empCounter++){
                    
                   // console.log(`emp: ${usersToQuery[empCounter]}`)
                    let calendarQuery = {
                        "query": "query CalendarEvents($startDatetimeGte: Date, $endDatetimeGte: Date, $employeeId: String) { calendarEvents(  startDatetimeGte: $startDatetimeGte,  endDatetimeGte: $endDatetimeGte, employeeId: $employeeId) { items { id type {id name } createdBy creationDate confirmedBy  description startDatetime endDatetime  employee{id division emailAddress}  } } }",
                            "variables":{
                                "employeeId":`${usersToQuery[empCounter]}`,
                                "startDatetimeGte":`${startDate}`,
                                "endDatetimeGte": `${endDate}`
                                },
                            "operationName":"CalendarEvents"
                        }
                //  console.log("calendarQuery, ", JSON.stringify(calendarQuery))
            
                
                await queryVega.callVega(calendarQuery).then(function(calendarQueryResponse){
                    
                    let itemsArray = []
                    if(calendarQueryResponse.message == "success"){
                        itemsArray = calendarQueryResponse.data.data.calendarEvents.items
    
                        for(let m =0; m < itemsArray.length; m++){
                            let item = itemsArray[m]
                            let itemEmployee = item.employee
    
                            let eventBlob = {}
                            let employeeUserName = itemEmployee.id
                            eventBlob.employeeEmail = itemEmployee.emailAddress
                            eventBlob.eventCreationDate = item.creationDate
                            eventBlob.eventStartDate = item.startDatetime
                            eventBlob.eventEndDate = item.endDatetime
                            eventBlob.eventType  = item.type
                            // console.log(`eventBlob: ${eventBlob}`)
    
                            let currentHold = []
                            if(prepData[employeeUserName] != undefined){
                                currentHold = prepData[employeeUserName]
                                // console.log(`employeeUserName: ${employeeUserName}, value: ${JSON.stringify(prepData.employeeUserName)}`)
                            }
                            currentHold.push(eventBlob)
                            prepData[employeeUserName] = currentHold
    
    
                        }
    
    
                        // console.log('Response data array:' +  JSON.stringify(itemsArray[0].employee.emailAddress))
    
                    }else{
                        console.error("could not fetch calendar records, used query: ", JSON.stringify(calendarQuery))
                    }
                                      
    
                })
                
            }
            
            console.log("prepData: ", JSON.stringify(prepData))            

          

}

function prepareDataForGSheetPush(){
    // function to model the data for gsheet push from findCalendarEventsForUsers function 
}

findDirectReports()
module.exports = { findDirectReports }
module.exports = { findCalendarEventsForUsers }


/*
 Sample Modal For creating the data

 Object {
    employee: {
        name,
        email,
        manager,
        [
            {
                leaveType,
                createdBy,
                creationDate,
                startDatetime,
                endDatetime,

            }
        ]       
        
        
    }


 }
 */