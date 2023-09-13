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
                    findCalendarEventsForUsers(usersToQuery)
  

            }else{
                console.error("could not fetch manager reportees, used query: ", query)
            }
                        
        })

    }
    
}

function findCalendarEventsForUsers(usersToQuery){
                  // console.log("usersToQuery, ", usersToQuery)
                  let calendarQuery = {
                    "query": "query CalendarEvents($employeeIdIn: [String!]) { calendarEvents(  employeeIdIn: $employeeIdIn) { items { id type {id name } createdBy creationDate confirmedBy  description startDatetime endDatetime  employee{id division emailAddress}  } } }",
                    "variables":{"employeeIdIn": usersToQuery},
                    "operationName":"CalendarEvents"
                }
           // console.log("calendarQuery, ", JSON.stringify(calendarQuery))
        
            
            queryVega.callVega(calendarQuery).then(function(calendarQueryResponse){
                let itemsArray = []
                if(calendarQueryResponse.message == "success"){
                    itemsArray = calendarQueryResponse.data.data.calendarEvents.items

                    for(let m =0; m < itemsArray.length; m++){
                        let item = itemsArray[m]
                        let itemEmployee = item.employee

                        console.log("itemEmployee: ", itemEmployee)
                    }


                    // console.log('Response data array:' +  JSON.stringify(itemsArray[0].employee.emailAddress))

                }else{
                    console.error("could not fetch calendar records, used query: ", calendarQuery)
                }

            })


}

function prepareDataForGSheetPush(){
    // function to model the data for gsheet push from findCalendarEventsForUsers function 
}

findDirectReports()
module.exports = { findDirectReports }
module.exports = { findCalendarEventsForUsers }