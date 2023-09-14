const queryVega = require('./queryVega')
const googleService = require('../google/updateTeamPlanerSheet')

const PropertiesReader = require('properties-reader')
const properties = PropertiesReader('../env.properties')
const gCloudProject = properties.get("GCLOUD_PROJECT")
const gAppCredentials = properties.get("GOOGLE_APPLICATION_CREDENTIALS")


async function findDirectReports(){
    console.log(`Code started... give it a few seconds to create magic...!`)
   
    const managers =  `${properties.get("MANAGERS_LIST")}`.replace(" ", "").split(",")
    let consolidatedDataForPush = {}

    
    // findCalendarEventsForUsers(["sthottamkara"]); return
   
    for (let i = 0; i < managers.length; i++){
        let currentManager = managers[i].replace(" ", "")
    
    
        let query = {
            "query": "query DirectReports($employeeId: ID!) { employee(id: $employeeId) {directReports {displayName id emailAddress isActive}}}",
                "variables":{"employeeId":"" + currentManager},
                "operationName":"DirectReports"
            }
    
        // console.log(`query: ${JSON.stringify(query)}`)
        
        queryVega.callVega(query).then(function(response){
            
                       
                if(response.message == "success"){
                    try{
                        let data =  response.data
                        let directReportsJson = data.data.employee.directReports
                        // console.log("directReportsJson: ", directReportsJson)
                        let usersToQuery = []
                        for (let k = 0; k < directReportsJson.length; k++){
                            let currentPoint = directReportsJson[k]
                                                    
                            if(currentPoint.isActive == true){                            
                                usersToQuery.push(currentPoint.id)
                            }  
                            
                        }
    
                        // console.log(`usersToQuery: ${usersToQuery}`)
                         findCalendarEventsForUsers(usersToQuery, currentManager)
    
                    }catch(error){
                        console.error(`error finding direct reports for ${currentManager}: ${error}`)
                    }
  

            }else{
                console.error("could not fetch manager reportees, used query: ", JSON.stringify(query))
            }
                        
        })

    }
    
}

async function findCalendarEventsForUsers(usersToQuery, currentManager){
                  // console.log("usersToQuery, ", usersToQuery)

                  //test for single user
                  // usersToQuery = ["adeo"]
                let prepData = {}
                let vvv = []

                let startDate = `${properties.get("QUERY_START_DATE")}`.trim()
                let endDate = `${properties.get("QUERY_END_DATE")}`.trim()

                console.log(`Manager: ${currentManager}, startDate: ${startDate}, endDate ${endDate}, usersToQuery: ${usersToQuery}`)
                

                    
                   // console.log(`emp: ${usersToQuery[empCounter]}`)
                    let calendarQuery = {"query":"query CalendarEvents($startDatetimeGte: Date, $startDatetimeLte: Date, $employeeIdIn: [String!]) { calendarEvents( startDatetimeGte: $startDatetimeGte,  startDatetimeLte: $startDatetimeLte,  employeeIdIn: $employeeIdIn) { items { id type {id name } createdBy creationDate confirmedBy  description startDatetime endDatetime  employee{id displayName emailAddress}  } } }",
                    "variables":{
                        "employeeIdIn":usersToQuery,
                        "startDatetimeGte":`${startDate}`,
                        "startDatetimeLte": `${endDate}`
                        },
                    "operationName":"CalendarEvents"
                    }
                   // console.log("calendarQuery, ", JSON.stringify(calendarQuery))
            
                
                await queryVega.callVega(calendarQuery).then(function(calendarQueryResponse){
                    
                    let itemsArray = []
                    if(calendarQueryResponse.message == "success"){
                        try{

                        }catch(Exception){
                            console.error(`error finding direct reports for ${currentManager}: ${error.message}`)
                        }
  
                        itemsArray = calendarQueryResponse.data.data.calendarEvents.items
    
                        for(let m =0; m < itemsArray.length; m++){
                            let item = itemsArray[m]
                            let itemEmployee = item.employee
                            let mail = itemEmployee.emailAddress
                            let displayName = itemEmployee.displayName
    
                            let eventBlob = {}
                            let employeeUserName = itemEmployee.id
                            eventBlob.employeeEmail = mail
                            eventBlob.displayName = displayName
                            eventBlob.eventCreationDate = item.creationDate
                            eventBlob.eventStartDate = item.startDatetime
                            eventBlob.eventEndDate = item.endDatetime
                            eventBlob.eventType  = item.type
                            // console.log(`eventBlob: ${eventBlob}`)
                            
                            
                            /*
                            if(vvv.includes(employeeUserName)){
                                // console.log(`mail ${mail} already added`)
                                
                            }else{
                                vvv.push(employeeUserName)
                            }
                            */


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


             googleService.main(prepData)
            // console.log("prepData: ", JSON.stringify(prepData))  
            
            /*
            for(let dn = 0; dn < vvv.length; dn ++){
                console.log("", vvv[dn])            
            }*/
      

}


function vegaMain(){

    findDirectReports()
    

    
}

vegaMain()

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