const axios = require('axios');
const authenticateVega = require('./getVegaToken')
const PropertiesReader = require('properties-reader');
const properties = PropertiesReader('../env.properties');


/** we will use this function to make any queries to Vega. Idea is to make a generic function that will take the query and send the response
 * This will avoid redundancy
 */

async function callVega(query) {
let token = authenticateVega.getToken()


let url = `${properties.get("VEGA_URL")}`
let ret = {}

let config =    { 
  headers: {
      'Content-Type': 'application/json',
      'Authorization': token.replace(/\r?\n|\r/g, '')
}
};
  // Make the POST request
  let axiosResponse = await axios.post(url, query, config).then((response) => {
    // console.log('Response data:', response.data);
    return {
        "data": response.data,
        "code": 200,
        "message": "success"
      }
    
  })
  .catch((error) => {
    console.log('Code:', error.message);
    console.log('Status:', error.code);
    return {
        "data": {},
        "code": error.code,
        "message": error.message
      }

    // console.error('Error:', error);
  });

  // console.log('axiosResponse: ' +  JSON.stringify(axiosResponse));
 
  return axiosResponse

}

/*

// uncomment this section to test
const postData = {
    "query":"query CustomQuery($id: ID!){employee(id: $id){displayName location}}",
    "variables":{"id":"vkgan"},"operationName":"CustomQuery"
};



callVega(postData).then(function(response){
    console.log('Response data:' +  JSON.stringify(response.data));
    console.log('Response code:' +  JSON.stringify(response.code));
    console.log('Response status:' +  JSON.stringify(response.message));

})
*/



module.exports = { callVega }

